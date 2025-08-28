import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import { axiosClient } from "@/config/axiosConfig";
import AdmitUsersPage from "./AdmitToOrg";

interface Member {
    id: string;
    email: string;
    name: string;
    roleInOrg: "OWNER" | "EDITOR" | "VIEWER";
}

const ManageMembersPage = () => {
    const { toast } = useToast();
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const [members, setMembers] = useState<Member[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

    const handleRoleChange = async(memberId: string, newRole: Member["roleInOrg"]) => {
       try {
         await axiosClient.post('/api/org/update-role',
             { userId: memberId, orgId: user.organization, role: newRole });
         setMembers(prev =>
             prev.map(member =>
                 member.id === memberId ? { ...member, roleInOrg: newRole } : member
             )
         );
         toast({
             title: "Role Updated",
             description: "Member role has been successfully updated.",
         });
       } catch (error) {
         console.error('Error updating role:', error);
         toast({
             title: "Error",
             description: "An error occurred while updating the role.",
             variant: "destructive",
         });
       }
    };

    const fetchMembers = async () => {
        try {
            const response = await axiosClient.get(`/api/org/members/${user.organization}`);
            console.log('response', response.data);
            setMembers(response.data.users);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }

    useEffect(() => {
        fetchMembers();

    }, [])

    useEffect(() => {
        if(isLoading) return
        if(!user) navigate("/login");
        if(user && user.roleInOrg !== "OWNER") navigate("/dashboard");
    }, [isLoading, user]);


    useEffect(() => {
        if (members && members.length === 0) return
        const filtered = members.filter(member =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMembers(filtered);
    }, [members, searchQuery]);

    const handleDeleteMember = async (memberId: string) => {
        try {
            await axiosClient.post('/api/org/remove',
                { userId: memberId, orgId: user.organization });
            setMembers(prev => prev.filter(member => member.id !== memberId));
            toast({
                title: "Member Removed",
                description: "Member has been successfully removed from the organization.",
                variant: "destructive",
            });
        } catch (error) {
            console.error('Error deleting member:', error);
            toast({
                title: "Error",
                description: "An error occurred while removing the member.",
                variant: "destructive",
            })
        }
    };








    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-8 py-8">
                <div className="mb-8">
                <AdmitUsersPage/>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">Manage Members</h1>
                    </div>
                    <p className="text-muted-foreground">
                        View and manage organization members, their roles, and permissions.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Organization Members</CardTitle>
                        <CardDescription>
                            {members.length} member{members.length !== 1 ? 's' : ''} in your organization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search members by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{member.name}</div>
                                                <div className="text-sm text-muted-foreground">{member.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={member.roleInOrg}
                                                onValueChange={(value: Member["roleInOrg"]) =>
                                                    handleRoleChange(member.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent >
                                                    <SelectItem value="OWNER">Owner</SelectItem>
                                                    <SelectItem value="EDITOR">Editor</SelectItem>
                                                    <SelectItem value="VIEWER">Viewer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to remove {member.name} from the organization?
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteMember(member.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Remove
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ManageMembersPage;