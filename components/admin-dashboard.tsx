"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import { Users, Edit, UserPlus, Ban, CheckCircle, FileText, MessageSquare, Settings, Shield } from "lucide-react"
import {
  getAllMembers,
  createMember,
  updateMemberStatus,
  updateMemberRole,
  updateMemberAdminStatus,
  updateMemberPermissions,
  type Member,
  type CustomPermissions,
} from "@/lib/auth"

interface AdminDashboardProps {
  currentUser: Member
}

export function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "standard" as Member["role"],
    tier: "standard" as Member["tier"],
    isAdmin: false,
  })

  useEffect(() => {
    setMembers(getAllMembers())
  }, [])

  const handleCreateUser = () => {
    const memberData: Omit<Member, "id"> = {
      ...newUser,
      joinDate: new Date().toISOString().split("T")[0],
      acceptedCodeOfConduct: false,
      status: "active",
    }

    const createdMember = createMember(memberData)
    setMembers(getAllMembers())
    setIsCreateUserOpen(false)
    setNewUser({
      username: "",
      password: "",
      name: "",
      email: "",
      role: "standard",
      tier: "standard",
      isAdmin: false,
    })
  }

  const handleUpdateMemberStatus = (memberId: string, status: "active" | "suspended" | "inactive") => {
    updateMemberStatus(memberId, status)
    setMembers(getAllMembers())
  }

  const handleUpdateMemberRole = (memberId: string, role: Member["role"], tier: Member["tier"]) => {
    updateMemberRole(memberId, role, tier)
    setMembers(getAllMembers())
  }

  const handleUpdateAdminStatus = (memberId: string, isAdmin: boolean) => {
    updateMemberAdminStatus(memberId, isAdmin)
    setMembers(getAllMembers())
  }

  const handleUpdatePermissions = (memberId: string, permissions: Partial<CustomPermissions>) => {
    updateMemberPermissions(memberId, permissions)
    setMembers(getAllMembers())
    setIsEditPermissionsOpen(false)
    setEditingMember(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ceo":
        return "bg-purple-600"
      case "executive":
        return "bg-blue-600"
      case "manager":
        return "bg-green-600"
      case "standard":
        return "bg-orange-600"
      case "honorary":
        return "bg-gray-600"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "suspended":
        return "bg-red-600"
      case "inactive":
        return "bg-gray-600"
      default:
        return "bg-gray-500"
    }
  }

  const PermissionsEditor = ({ member }: { member: Member }) => {
    const [permissions, setPermissions] = useState<CustomPermissions>(
      member.customPermissions || {
        canManageMeetings: false,
        canManageUsers: false,
        canManagePages: false,
        canManageChat: false,
        canViewAnalytics: false,
        canModerateContent: false,
        canAccessFinancials: false,
        canManageSettings: false,
      },
    )

    const permissionLabels = {
      canManageMeetings: "Manage Meetings",
      canManageUsers: "Manage Users",
      canManagePages: "Manage Pages",
      canManageChat: "Manage Chat",
      canViewAnalytics: "View Analytics",
      canModerateContent: "Moderate Content",
      canAccessFinancials: "Access Financials",
      canManageSettings: "Manage Settings",
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(permissionLabels).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`${member.id}-${key}`}
                checked={permissions[key as keyof CustomPermissions]}
                onCheckedChange={(checked) =>
                  setPermissions((prev) => ({
                    ...prev,
                    [key]: checked as boolean,
                  }))
                }
                disabled={member.isAdmin} // Admins have all permissions
              />
              <Label htmlFor={`${member.id}-${key}`} className="text-sm">
                {label}
              </Label>
            </div>
          ))}
        </div>
        {member.isAdmin && (
          <p className="text-sm text-gray-500 italic">Administrators have all permissions by default.</p>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsEditPermissionsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleUpdatePermissions(member.id, permissions)}>Save Permissions</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new member to Project Arcadia.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="john_doe"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="john@projectarcadia.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Secure password"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: Member["role"]) =>
                      setNewUser((prev) => ({ ...prev, role: value, tier: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="honorary">Honorary</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="ceo">CEO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="isAdmin"
                    checked={newUser.isAdmin}
                    onCheckedChange={(checked) => setNewUser((prev) => ({ ...prev, isAdmin: !!checked }))}
                  />
                  <Label htmlFor="isAdmin">Admin privileges</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="pages">Page Management</TabsTrigger>
          <TabsTrigger value="chat">Chat Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Member Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{member.name}</h4>
                          <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                          <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                          {member.isAdmin && <Badge className="bg-yellow-600">Admin</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">
                          @{member.username} • {member.email}
                        </p>
                        <p className="text-xs text-gray-500">Joined: {member.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Member: {member.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Role & Tier</Label>
                              <Select
                                defaultValue={member.role}
                                onValueChange={(value: Member["role"]) =>
                                  handleUpdateMemberRole(member.id, value, value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="honorary">Honorary</SelectItem>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="executive">Executive</SelectItem>
                                  <SelectItem value="ceo">CEO</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`admin-${member.id}`}
                                checked={member.isAdmin || false}
                                onCheckedChange={(checked) => handleUpdateAdminStatus(member.id, !!checked)}
                              />
                              <Label htmlFor={`admin-${member.id}`}>Admin privileges</Label>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isEditPermissionsOpen && editingMember?.id === member.id}
                        onOpenChange={(open) => {
                          setIsEditPermissionsOpen(open)
                          if (open) setEditingMember(member)
                          else setEditingMember(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Shield className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Custom Permissions: {member.name}</DialogTitle>
                            <DialogDescription>
                              Configure specific permissions for this member. Admin users have all permissions by
                              default.
                            </DialogDescription>
                          </DialogHeader>
                          <PermissionsEditor member={member} />
                        </DialogContent>
                      </Dialog>

                      {member.status === "active" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Ban className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Suspend Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to suspend {member.name}? They will not be able to access the
                                portal.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleUpdateMemberStatus(member.id, "suspended")}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Suspend
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleUpdateMemberStatus(member.id, "active")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Custom Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Page management coming soon...</p>
                <p className="text-sm text-gray-400">Create and manage custom pages with access controls.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chat management coming soon...</p>
                <p className="text-sm text-gray-400">Create and manage chat channels and group conversations.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Demo Account Display</h4>
                    <p className="text-sm text-gray-600">Show demo accounts on login page</p>
                  </div>
                  <Checkbox defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">New Member Auto-Approval</h4>
                    <p className="text-sm text-gray-600">Automatically approve new member registrations</p>
                  </div>
                  <Checkbox defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Meeting Auto-Invites</h4>
                    <p className="text-sm text-gray-600">Automatically invite all members to general meetings</p>
                  </div>
                  <Checkbox defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Session Timeout</h4>
                    <p className="text-sm text-gray-600">Automatic logout after 8 hours of inactivity</p>
                  </div>
                  <Checkbox defaultChecked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
