"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const memberFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional()
    .nullable()
    .or(z.literal("")),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  status: z.string().min(1, {
    message: "Please select a status.",
  }),
  location: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

interface EditMemberFormProps {
  member: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function EditMemberForm({
  member,
  onSave,
  onCancel,
}: EditMemberFormProps) {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      whatsapp: member.whatsapp || "",
      bio: member.bio || "",
      status: member.status || "Active",
      location: member.location || "",
      occupation: member.occupation || "",
    },
  });

  const onSubmit = async (values: MemberFormValues) => {
    const formattedData = {
      ...values,
    };
    await onSave(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest">
                  Name *
                </FormLabel>
                <FormControl>
                  <Input placeholder="Member Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest">
                  Status
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest">
                  Phone
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest">
                  WhatsApp
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="WhatsApp Identifier"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
             control={form.control}
             name="location"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="text-xs font-bold uppercase tracking-widest">
                   Location
                 </FormLabel>
                 <FormControl>
                   <Input
                     placeholder="Chapter or Location"
                     {...field}
                     value={field.value || ""}
                   />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <FormField
             control={form.control}
             name="occupation"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="text-xs font-bold uppercase tracking-widest">
                   Occupation
                 </FormLabel>
                 <FormControl>
                   <Input
                     placeholder="Job title or profession"
                     {...field}
                     value={field.value || ""}
                   />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest">
                Designation / Bio
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Member Role or Short Bio"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" className="cursor-pointer bg-primary">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
