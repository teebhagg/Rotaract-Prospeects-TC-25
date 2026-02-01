import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Briefcase,
  Calendar,
  ExternalLink,
  History,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Separator } from "../../components/ui/separator";
import { getMemberById, updateMember } from "../../services/crm";
import { EditMemberForm } from "./components/edit-member-form";

export const Route = createFileRoute("/members/$memberId")({
  component: MemberDetails,
});

function MemberDetails() {
  const { memberId } = Route.useParams();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: member,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["member", memberId],
    queryFn: () => getMemberById({ data: { id: memberId } }),
    retry: 1,
  });

  const handleSave = async (data: any) => {
    try {
      await updateMember({ data: { id: memberId, data } });
      toast.success("Member profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["member", memberId] });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update member profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Retrieving Profile Data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    toast.error("Failed to load member details");
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Member not found or failed to load.
          </p>
          <Button variant="outline" asChild>
            <Link to="/members">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Members
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const makeCall = () => {
    if (member.phone) window.open(`tel:${member.phone}`, "_blank");
  };

  const openWhatsApp = () => {
    if (member.whatsapp) {
      const cleanPhone = member.whatsapp.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  const sendEmail = () => {
    if (member.email) window.open(`mailto:${member.email}`, "_blank");
  };

  const eventsAttended = member.attendance?.length || 0;
  const meetingsAttended =
    new Set(member.attendance?.map((a) => a.meetingId)).size || 0;

  return (
    <div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-2 hover:bg-slate-100 dark:hover:bg-zinc-800">
          <Link to="/members">
            <ArrowLeft className="h-4 w-4 mr-2 text-primary" />
            <span className="font-bold text-xs uppercase tracking-wider">
              Directory
            </span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="font-bold text-xs uppercase tracking-wider h-8 cursor-pointer">
              Edit Profile
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-xs uppercase tracking-wider h-8">
                Workflows ⋯
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Member Operations</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setIsEditing(true)}
                className="cursor-pointer">
                Edit Information
              </DropdownMenuItem>
              <DropdownMenuItem>Verify Identity</DropdownMenuItem>
              <DropdownMenuItem>Transfer Registry</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 font-medium">
                Archive Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Primary Profile Header */}
      {!isEditing && <Card className="border shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
        <div className="bg-slate-50/50 dark:bg-zinc-900/50 border-b px-8 py-8 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl font-extrabold text-primary shadow-sm group-hover:scale-105 transition-transform duration-300">
              {member.name[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                {member.name}
              </h1>
              <Badge
                variant="outline"
                className="w-fit mx-auto md:mx-0 bg-white shadow-sm border-slate-200 text-emerald-700 font-bold tracking-widest text-[10px] py-0.5">
                {member.status || "ACTIVE"}
              </Badge>
            </div>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-medium">
               <span className="flex items-center gap-1.5 italic">
                 <ShieldCheck className="h-4 w-4 text-primary" />{" "}
                 {member.bio || "Staff Member"}
               </span>
               {member.occupation && (
                 <>
                   <span className="h-1 w-1 rounded-full bg-slate-300 hidden md:block" />
                   <span className="flex items-center gap-1.5">
                     <Briefcase className="h-4 w-4 opacity-70" />{" "}
                     {member.occupation}
                   </span>
                 </>
               )}
               <span className="h-1 w-1 rounded-full bg-slate-300 hidden md:block" />
               <span className="flex items-center gap-1.5">
                 <MapPin className="h-4 w-4 opacity-70" />{" "}
                 {member.location || "Central Chapter"}
               </span>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={makeCall}
              className="h-10 w-10 rounded-full shadow-sm hover:translate-y-[-2px] transition-all"
              title="Call Member">
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={openWhatsApp}
              className="h-10 w-10 rounded-full shadow-sm hover:translate-y-[-2px] transition-all text-emerald-600"
              title="WhatsApp Message">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={sendEmail}
              className="h-10 w-10 rounded-full shadow-sm hover:translate-y-[-2px] transition-all"
              title="Send Email">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x border-b">
          <div className="p-6 text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
              Impact Score
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
              842
            </p>
          </div>
          <div className="p-6 text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
              Consistency
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
              92%
            </p>
          </div>
          <div className="p-6 text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
              Joined
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {member.createdAt
                ? new Date(member.createdAt).getFullYear()
                : "2024"}
            </p>
          </div>
        </div>
      </Card>}

      <div className="grid grid-cols-1 gap-6">
        {isEditing ? (
          <Card className="border shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
            <CardHeader className="bg-slate-50/30 dark:bg-zinc-900/10 border-b py-4 px-8">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Edit Profile
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-8">
              <EditMemberForm
                member={member}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Identity & Contact Details */}
            <Card className="border shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
              <CardHeader className="bg-slate-50/30 dark:bg-zinc-900/10 border-b py-4 px-8">
                <CardTitle className="text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Identity & Secure
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 py-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      E-Mail Address
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {member.email || "Not Provided"}
                      </span>
                      {member.email && (
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-30 cursor-pointer" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Direct Contact
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {member.phone || "Not Provided"}
                      </span>
                      {member.phone && (
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-30 cursor-pointer" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      WhatsApp Identifier
                    </p>
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold tracking-tight">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span className="text-sm">
                        {member.whatsapp || member.phone || "Not Linked"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Registry ID
                    </p>
                    <code className="text-[11px] font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-muted-foreground">
                      {member.id.substring(0, 12)}...
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participation History */}
            <Card className="border shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
              <CardHeader className="bg-slate-50/30 dark:bg-zinc-900/10 border-b py-4 px-8">
                <CardTitle className="text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Engagement
                  Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/20">
                    <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center transform -rotate-3 shadow-sm">
                      <History className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Recent Sessions
                      </p>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-200">
                        {meetingsAttended}{" "}
                        <span className="text-[10px] font-bold text-muted-foreground">
                          Meetings
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/20">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center transform rotate-3 shadow-sm">
                      <Briefcase className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Led Initiatives
                      </p>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-200">
                        0{" "}
                        <span className="text-[10px] font-bold text-muted-foreground">
                          Projects
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-slate-50 dark:bg-zinc-900 rounded-xl p-6 border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 border-2 border-slate-100 dark:border-zinc-700 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-muted-foreground opacity-40" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Attendance Logs
                    </p>
                    <p className="text-[11px] text-muted-foreground italic mt-1 px-4">
                      No detailed meeting records are currently synchronized for
                      this member.
                    </p>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="font-bold text-[10px] uppercase text-primary">
                    View Full Ledger →
                  </Button>
                </div>
              </CardContent>
              <div className="bg-slate-50/30 dark:bg-zinc-900/10 py-3 px-8 border-t font-bold text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 text-right">
                Profile Integrity Verified 100%
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
