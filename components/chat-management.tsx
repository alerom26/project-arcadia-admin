"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Edit, Trash2, MessageSquare, Users, Megaphone, Hash, Settings } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getAllMembers, type Member } from "@/lib/auth"

interface ChatChannel {
  id: string
  name: string
  description: string
  type: "general" | "announcement" | "group"
  created_by: string
  is_active: boolean
  created_at: string
  member_count?: number
}

interface ChannelMember {
  id: string
  channel_id: string
  member_id: string
  joined_at: string
}

interface ChatManagementProps {
  currentUser: Member
}

export function ChatManagement({ currentUser }: ChatManagementProps) {
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<ChatChannel | null>(null)
  const [managingMembers, setManagingMembers] = useState<ChatChannel | null>(null)
  const [channelMembers, setChannelMembers] = useState<ChannelMember[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "group" as "general" | "announcement" | "group",
    selectedMembers: [] as string[],
  })

  useEffect(() => {
    loadChannels()
    setMembers(getAllMembers())
  }, [])

  const loadChannels = async () => {
    try {
      const { data: channelsData, error: channelsError } = await supabase
        .from("chat_channels")
        .select("*")
        .order("created_at", { ascending: false })

      if (channelsError) throw channelsError

      // Get member counts for each channel
      const channelsWithCounts = await Promise.all(
        (channelsData || []).map(async (channel) => {
          const { count } = await supabase
            .from("chat_channel_members")
            .select("*", { count: "exact", head: true })
            .eq("channel_id", channel.id)

          return {
            ...channel,
            member_count: count || 0,
          }
        }),
      )

      setChannels(channelsWithCounts)
    } catch (error) {
      console.error("Error loading channels:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadChannelMembers = async (channelId: string) => {
    try {
      const { data, error } = await supabase.from("chat_channel_members").select("*").eq("channel_id", channelId)

      if (error) throw error
      setChannelMembers(data || [])
    } catch (error) {
      console.error("Error loading channel members:", error)
    }
  }

  const handleCreateChannel = async () => {
    try {
      const { data: newChannel, error: channelError } = await supabase
        .from("chat_channels")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            type: formData.type,
            created_by: currentUser.username,
          },
        ])
        .select()
        .single()

      if (channelError) throw channelError

      // Add selected members to the channel
      if (formData.selectedMembers.length > 0) {
        const memberInserts = formData.selectedMembers.map((memberId) => ({
          channel_id: newChannel.id,
          member_id: memberId,
        }))

        const { error: membersError } = await supabase.from("chat_channel_members").insert(memberInserts)

        if (membersError) throw membersError
      }

      await loadChannels()
      setIsCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating channel:", error)
    }
  }

  const handleUpdateChannel = async () => {
    if (!editingChannel) return

    try {
      const { error } = await supabase
        .from("chat_channels")
        .update({
          name: formData.name,
          description: formData.description,
          type: formData.type,
        })
        .eq("id", editingChannel.id)

      if (error) throw error

      await loadChannels()
      setEditingChannel(null)
      resetForm()
    } catch (error) {
      console.error("Error updating channel:", error)
    }
  }

  const handleDeleteChannel = async (channelId: string) => {
    try {
      const { error } = await supabase.from("chat_channels").delete().eq("id", channelId)

      if (error) throw error
      await loadChannels()
    } catch (error) {
      console.error("Error deleting channel:", error)
    }
  }

  const handleToggleChannelStatus = async (channelId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("chat_channels").update({ is_active: !isActive }).eq("id", channelId)

      if (error) throw error
      await loadChannels()
    } catch (error) {
      console.error("Error toggling channel status:", error)
    }
  }

  const handleAddMemberToChannel = async (channelId: string, memberId: string) => {
    try {
      const { error } = await supabase.from("chat_channel_members").insert([
        {
          channel_id: channelId,
          member_id: memberId,
        },
      ])

      if (error) throw error
      await loadChannelMembers(channelId)
      await loadChannels()
    } catch (error) {
      console.error("Error adding member to channel:", error)
    }
  }

  const handleRemoveMemberFromChannel = async (channelId: string, memberId: string) => {
    try {
      const { error } = await supabase
        .from("chat_channel_members")
        .delete()
        .eq("channel_id", channelId)
        .eq("member_id", memberId)

      if (error) throw error
      await loadChannelMembers(channelId)
      await loadChannels()
    } catch (error) {
      console.error("Error removing member from channel:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "group",
      selectedMembers: [],
    })
  }

  const openEditDialog = (channel: ChatChannel) => {
    setEditingChannel(channel)
    setFormData({
      name: channel.name,
      description: channel.description,
      type: channel.type,
      selectedMembers: [],
    })
  }

  const openMembersDialog = (channel: ChatChannel) => {
    setManagingMembers(channel)
    loadChannelMembers(channel.id)
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="h-5 w-5" />
      case "general":
        return <Hash className="h-5 w-5" />
      case "group":
        return <Users className="h-5 w-5" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-orange-600"
      case "general":
        return "bg-blue-600"
      case "group":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading channels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Chat Management</h3>
        <Dialog
          open={isCreateOpen || !!editingChannel}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false)
              setEditingChannel(null)
              resetForm()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingChannel ? "Edit Channel" : "Create New Channel"}</DialogTitle>
              <DialogDescription>
                {editingChannel ? "Update the channel settings." : "Create a new chat channel for your team."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Channel Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="general-discussion"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What is this channel for?"
                  rows={3}
                />
              </div>

              <div>
                <Label>Channel Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General - All members auto-join</SelectItem>
                    <SelectItem value="announcement">Announcement - Admin only posting</SelectItem>
                    <SelectItem value="group">Group - Invite specific members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "group" && !editingChannel && (
                <div>
                  <Label>Initial Members</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded p-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={formData.selectedMembers.includes(member.username)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({
                                ...prev,
                                selectedMembers: [...prev.selectedMembers, member.username],
                              }))
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                selectedMembers: prev.selectedMembers.filter((m) => m !== member.username),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`member-${member.id}`} className="text-sm">
                          {member.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false)
                    setEditingChannel(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingChannel ? handleUpdateChannel : handleCreateChannel}>
                  {editingChannel ? "Update Channel" : "Create Channel"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {channels.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No chat channels yet</p>
                <p className="text-sm text-gray-400">Create your first channel to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          channels.map((channel) => (
            <Card key={channel.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {getChannelIcon(channel.type)}
                      <span>{channel.name}</span>
                      <Badge className={getTypeColor(channel.type)}>{channel.type}</Badge>
                      {!channel.is_active && <Badge variant="secondary">Inactive</Badge>}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                    <p className="text-xs text-gray-500">
                      Created by {channel.created_by} • {channel.member_count} members
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(channel)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openMembersDialog(channel)}>
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleChannelStatus(channel.id, channel.is_active)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Channel</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{channel.name}"? All messages will be permanently lost.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteChannel(channel.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Members Management Dialog */}
      <Dialog
        open={!!managingMembers}
        onOpenChange={(open) => {
          if (!open) setManagingMembers(null)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Members: {managingMembers?.name}</DialogTitle>
            <DialogDescription>Add or remove members from this channel.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Current Members ({channelMembers.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                {channelMembers.map((channelMember) => {
                  const member = members.find((m) => m.username === channelMember.member_id)
                  return (
                    <div key={channelMember.id} className="flex items-center justify-between">
                      <span className="text-sm">{member?.name || channelMember.member_id}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMemberFromChannel(managingMembers!.id, channelMember.member_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Add Members</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                {members
                  .filter((member) => !channelMembers.some((cm) => cm.member_id === member.username))
                  .map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <span className="text-sm">{member.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddMemberToChannel(managingMembers!.id, member.username)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
