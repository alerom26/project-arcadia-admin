"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic" // Import dynamic for client-side rendering of ReactQuill
import "react-quill/dist/quill.snow.css" // Import Quill styles
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getAllMembers, type Member } from "@/lib/auth"

// Dynamically import ReactQuill to ensure it's only rendered on the client side
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

interface CustomPage {
  id: string
  title: string
  slug: string
  content: string
  created_by: string
  access_type: "all" | "tier_specific" | "custom"
  allowed_tiers: string[]
  allowed_members: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

interface PageManagementProps {
  currentUser: Member
}

export function PageManagement({ currentUser }: PageManagementProps) {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    access_type: "all" as "all" | "tier_specific" | "custom",
    allowed_tiers: [] as string[],
    allowed_members: [] as string[],
    is_published: true,
  })

  useEffect(() => {
    loadPages()
    setMembers(getAllMembers())
  }, [])

  const loadPages = async () => {
    try {
      const { data, error } = await supabase.from("custom_pages").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (error) {
      console.error("Error loading pages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePage = async () => {
    try {
      const { error } = await supabase.from("custom_pages").insert([
        {
          ...formData,
          created_by: currentUser.username,
        },
      ])

      if (error) throw error

      await loadPages()
      setIsCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating page:", error)
    }
  }

  const handleUpdatePage = async () => {
    if (!editingPage) return

    try {
      const { error } = await supabase
        .from("custom_pages")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingPage.id)

      if (error) throw error

      await loadPages()
      setEditingPage(null)
      resetForm()
    } catch (error) {
      console.error("Error updating page:", error)
    }
  }

  const handleDeletePage = async (pageId: string) => {
    try {
      const { error } = await supabase.from("custom_pages").delete().eq("id", pageId)

      if (error) throw error
      await loadPages()
    } catch (error) {
      console.error("Error deleting page:", error)
    }
  }

  const handleTogglePublished = async (pageId: string, isPublished: boolean) => {
    try {
      const { error } = await supabase.from("custom_pages").update({ is_published: !isPublished }).eq("id", pageId)

      if (error) throw error
      await loadPages()
    } catch (error) {
      console.error("Error toggling page status:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      access_type: "all",
      allowed_tiers: [],
      allowed_members: [],
      is_published: true,
    })
  }

  const openEditDialog = (page: CustomPage) => {
    setEditingPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      access_type: page.access_type,
      allowed_tiers: page.allowed_tiers,
      allowed_members: page.allowed_members,
      is_published: page.is_published,
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const getAccessTypeColor = (accessType: string) => {
    switch (accessType) {
      case "all":
        return "bg-green-600"
      case "tier_specific":
        return "bg-blue-600"
      case "custom":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getAccessDescription = (page: CustomPage) => {
    switch (page.access_type) {
      case "all":
        return "All members"
      case "tier_specific":
        return `Tiers: ${page.allowed_tiers.join(", ")}`
      case "custom":
        return `${page.allowed_members.length} specific members`
      default:
        return "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Page Management</h3>
        <Dialog
          open={isCreateOpen || !!editingPage}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false)
              setEditingPage(null)
              resetForm()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPage ? "Edit Page" : "Create New Page"}</DialogTitle>
              <DialogDescription>
                {editingPage
                  ? "Update the page content and settings."
                  : "Create a new custom page with access controls."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setFormData((prev) => ({
                        ...prev,
                        title,
                        slug: generateSlug(title),
                      }))
                    }}
                    placeholder="My Custom Page"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="my-custom-page"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Page Content</Label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                  ]}
                  placeholder="Start writing your page content here..."
                />
              </div>

              <div>
                <Label>Access Control</Label>
                <Select
                  value={formData.access_type}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, access_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="tier_specific">Specific Tiers</SelectItem>
                    <SelectItem value="custom">Custom Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.access_type === "tier_specific" && (
                <div>
                  <Label>Allowed Tiers</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["honorary", "standard", "manager", "executive", "ceo"].map((tier) => (
                      <div key={tier} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tier-${tier}`}
                          checked={formData.allowed_tiers.includes(tier)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({
                                ...prev,
                                allowed_tiers: [...prev.allowed_tiers, tier],
                              }))
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                allowed_tiers: prev.allowed_tiers.filter((t) => t !== tier),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`tier-${tier}`} className="capitalize">
                          {tier}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.access_type === "custom" && (
                <div>
                  <Label>Allowed Members</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded p-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={formData.allowed_members.includes(member.username)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({
                                ...prev,
                                allowed_members: [...prev.allowed_members, member.username],
                              }))
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                allowed_members: prev.allowed_members.filter((m) => m !== member.username),
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: !!checked }))}
                />
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false)
                    setEditingPage(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingPage ? handleUpdatePage : handleCreatePage}>
                  {editingPage ? "Update Page" : "Create Page"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pages.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No custom pages yet</p>
                <p className="text-sm text-gray-400">Create your first custom page to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>{page.title}</span>
                      <Badge className={getAccessTypeColor(page.access_type)}>
                        {page.access_type.replace("_", " ")}
                      </Badge>
                      {!page.is_published && <Badge variant="secondary">Draft</Badge>}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      /{page.slug} • {getAccessDescription(page)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created by {page.created_by} on {new Date(page.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(page)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {page.is_published && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/pages/${page.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublished(page.id, page.is_published)}
                    >
                      {page.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Page</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{page.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePage(page.id)}
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
              <CardContent>
                <div className="text-sm text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: page.content.substring(0, 200) + "..." }} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
