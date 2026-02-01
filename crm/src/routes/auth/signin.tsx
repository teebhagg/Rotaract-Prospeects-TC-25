import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { signIn } from "../../lib/auth-client";

export const Route = createFileRoute("/auth/signin")({
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      try {
        const { error } = await signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: "/",
        });

        if (error) {
          toast.error(error.message || "Login failed");
        } else {
          toast.success("Signed in successfully");
          navigate({ to: "/" });
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your CRM dashboard.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}>
          <CardContent className="space-y-4">
            <form.Field
              name="email"
              validators={{
                onChange: z.email("Invalid email address").min(1, "Email is required"),
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                    placeholder="m@example.com"
                  />
                  {field.state.meta.errors ? (
                    <em className="text-xs text-red-500">
                      {field.state.meta.errors.join("\n")}
                    </em>
                  ) : null}
                </div>
              )}
            />
            <form.Field
              name="password"
              validators={{
                onChange: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    placeholder="********"
                  />
                  {field.state.meta.errors ? (
                    <em className="text-xs text-red-500">
                      {field.state.meta.errors.join("\n")}
                    </em>
                  ) : null}
                </div>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-5">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              )}
            />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
