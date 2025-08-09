"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, type Member } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

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

function CustomPageDisplay({ params }: { params: { slug: string } }) {
  const [page, setPage] = useState<CustomPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<Member | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    const fetchPage = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchError } = await supabase
          .from("custom_pages")
          .select("*")
          .eq("slug", params.slug)
          .single()

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            // No rows found
            setError("Page not found.")
          } else {
            setError("Failed to load page content.")
            console.error("Error fetching custom page:", fetchError)
          }
          setPage(null)
          return
        }

        if (data) {
          // Access control logic
          let hasAccess = false
          if (currentUser?.isAdmin) {
            hasAccess = true // Admins can always view
          } else if (!data.is_published) {
            hasAccess = false // Not published, non-admins can't see
          } else if (data.access_type === "all") {
            hasAccess = true
          } else if (data.access_type === "tier_specific" && currentUser) {
            hasAccess = data.allowed_tiers.includes(currentUser.tier)
          } else if (data.access_type === "custom" && currentUser) {
            hasAccess = data.allowed_members.includes(currentUser.username)
          }

          if (hasAccess) {
            setPage(data)
          } else {
            setError("You do not have permission to view this page.")
            setPage(null)
          }
        } else {
          setError("Page not found.")
          setPage(null)
        }
      } catch (err) {
        setError("An unexpected error occurred.")
        console.error("Unexpected error:", err)
        setPage(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [params.slug, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PA</span>
          </div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {page?.title || "Custom Page"}
              </h1>
            </div>
          </div>
          <Badge variant="secondary">
            {user?.name} • {user?.role?.replace("-", " ")}
          </Badge>
        </div>
      </header>

      {/* Page Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {error ? (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Access Denied
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-800">{error}</p>
              </CardContent>
            </Card>
          ) : page ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{page.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  Created by {page.created_by} on {new Date(page.created_at).toLocaleDateString()}
                </p>
                {!page.is_published && (
                  <Badge variant="secondary" className="mt-2">
                    Draft (Not Published)
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Page not found or inaccessible.</p>
                  <p className="text-sm text-gray-400">Please check the URL or your permissions.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <AuthGuard>
      <CustomPageDisplay params={params} />
    </AuthGuard>
  )
}
