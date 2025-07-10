
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {  Plus, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import axios from "axios";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  organizationName: z.string().min(1, "Organization name is required"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

const AdmitUsersPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "",
      organizationName: "",
    },
  });

  

  const onSubmit = async (values: InviteFormValues) => {
    console.log(values);
    try {
      const response = await axios.post("http://localhost:3000/api/org/admit", {
        email: values.email,
        role: values.role
      }, {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          withCredentials: true
      })
      
            
      toast({
        title: "User Admitted",
        description: `User with email ${values.email} is added to your organization as ${values.role} `,
      });
      
      form.reset({
        email: "",
        role: "",
        organizationName: values.organizationName, // Keep org name
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };





  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admit Users</h1>
              <p className="text-muted-foreground">Add team members to your organization</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send Invitations</CardTitle>
              <CardDescription>
                Invite users by email and assign them roles in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form  className="space-y-6">
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="user@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                    className="w-full md:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {form.formState.isSubmitting ? "Adding..." : "Add User to Organization"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

         
        </div>
      </div>
    </div>
  );
};

export default AdmitUsersPage;
