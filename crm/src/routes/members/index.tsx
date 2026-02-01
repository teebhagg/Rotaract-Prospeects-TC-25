import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createMember, getMembers } from "../../services/crm";
import { DataTable } from "./components/data-table";
import { MemberFormDialog } from "./components/member-form-dialog";
import { ImportExportButtons } from "./components/import-export-buttons";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/members/")({
  component: Members,
});

function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers()
      .then(setMembers)
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load members");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddMember = async (memberData: any) => {
    try {
      await createMember({ data: memberData });
      toast.success("Member added successfully");
      getMembers().then(setMembers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add member");
    }
  };

  const handleDeleteMember = async (id: string | number) => {
    // For now, just log - implement delete logic if needed
    console.log("Delete member:", id);
    toast.info("Delete functionality not implemented yet");
  };

  const handleEditMember = (member: any) => {
    // For now, just log - implement edit logic if needed
    console.log("Edit member:", member);
    toast.info("Edit functionality not implemented yet");
  };



  const displayMembers =
    !loading && members.length === 0
      ? [
          {
            id: "1",
            name: "Alice Smith",
            email: "alice@rotaract.org",
            phone: "+1 234 567 890",
            status: "Active",
            bio: "President",
            occupation: "Software Engineer",
            joined: "2023-10-12",
          },
          {
            id: "2",
            name: "Mark Kan",
            email: "mark@rotaract.org",
            phone: "+1 987 654 321",
            status: "Active",
            bio: "Secretary",
            occupation: "Marketing Manager",
            joined: "2023-11-05",
          },
          {
            id: "3",
            name: "Lucy Wang",
            email: "lucy@rotaract.org",
            phone: "+1 555 123 456",
            status: "Inactive",
            bio: "Member",
            occupation: "Student",
            joined: "2024-01-20",
          },
          {
            id: "4",
            name: "John Doe",
            email: "john@rotaract.org",
            phone: "+1 444 789 012",
            status: "Active",
            bio: "Treasurer",
            occupation: "Financial Analyst",
            joined: "2023-09-15",
          },
        ]
      : members;

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Member Registry
            </h2>
            <p className="text-muted-foreground italic text-sm">
              Manage your organization's directory and member profiles.
            </p>
          </div>
        </div>
        <Card className="border shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
          <CardContent className="p-0">
            <div className="h-32 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary"></div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Loading Members...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Member Registry
          </h2>
          <p className="text-muted-foreground italic text-sm">
            Manage your organization's directory and member profiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ImportExportButtons onMembersImported={() => getMembers().then(setMembers)} />

          <MemberFormDialog onAddMember={handleAddMember} />
        </div>
      </div>

      {/* <Card className="border shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
        <CardContent className="p-6"> */}
      <DataTable
        members={displayMembers}
        onDeleteMember={handleDeleteMember}
        onEditMember={handleEditMember}
        onAddMember={handleAddMember}
      />
      {/* </CardContent>
      </Card> */}
    </div>
  );
}
