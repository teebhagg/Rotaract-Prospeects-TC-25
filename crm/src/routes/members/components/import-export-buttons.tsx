"use client";

import { useState } from "react";
import { Download, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { exportMembersCSV, exportMembersPDF, importMembersCSV } from "../../../services/crm";

interface ImportExportButtonsProps {
  onMembersImported?: () => void;
}

export function ImportExportButtons({ onMembersImported }: ImportExportButtonsProps) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportCSV = async () => {
    try {
      const result = await exportMembersCSV();
      const csvContent = [
        result.headers.join(","),
        ...result.rows.map((row: string[]) =>
          row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `members_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Members exported to CSV successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export members to CSV");
    }
  };

  const handleExportPDF = async () => {
    try {
      const members = await exportMembersPDF();
      // For PDF export, we'll create a simple HTML table and use browser print
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Members Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Rotaract Members Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Occupation</th>
                <th>Location</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              ${members.map((member: any) => `
                <tr>
                  <td>${member.name}</td>
                  <td>${member.email || '-'}</td>
                  <td>${member.phone || '-'}</td>
                  <td>${member.status || 'Active'}</td>
                  <td>${member.occupation || '-'}</td>
                  <td>${member.location || '-'}</td>
                  <td>${member.joinedDate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `members_report_${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Members report exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export members report");
    }
  };

  const handleImportCSV = async (file: File) => {
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error("CSV file must contain at least a header row and one data row");
      }

      const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
      const expectedHeaders = ["Name", "Email", "Phone", "WhatsApp", "Status", "Bio", "Occupation", "Location", "Skills"];

      // Parse CSV rows
      const members = [];
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length >= 1) {
          const member = {
            name: values[0] || "",
            email: values[1] || null,
            phone: values[2] || null,
            whatsapp: values[3] || null,
            status: values[4] || "Active",
            bio: values[5] || null,
            occupation: values[6] || null,
            location: values[7] || null,
            skills: values[8] || null,
          };
          if (member.name.trim()) {
            members.push(member);
          }
        }
      }

      if (members.length === 0) {
        throw new Error("No valid member data found in CSV");
      }

      const results = await importMembersCSV({ data: members });

      const successCount = results.filter((r: any) => r.success).length;
      const errorCount = results.filter((r: any) => !r.success).length;

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} members`);
        onMembersImported?.();
      }

      if (errorCount > 0) {
        toast.warning(`${errorCount} members failed to import`);
      }

      setImportDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to import CSV");
    } finally {
      setIsImporting(false);
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.replace(/^"|"$/g, "").replace(/""/g, '"'));
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.replace(/^"|"$/g, "").replace(/""/g, '"'));
    return result;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <Download className="mr-2 h-4 w-4 text-primary" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            Export as PDF Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4 text-primary" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Members from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with member data. The file should have the following columns:
              Name, Email, Phone, WhatsApp, Status, Bio, Occupation, Location, Skills
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImportCSV(file);
                  }
                }}
                disabled={isImporting}
              />
            </div>
            {isImporting && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2">Importing members...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}