"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertTriangle } from "lucide-react"
import { authenticate, getLoginAttempts, incrementLoginAttempts, isBlocked, redirectIfBlocked } from "@/lib/auth"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()

  useEffect(() => {
    redirectIfBlocked()
    setAttempts(getLoginAttempts())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (isBlocked()) {
      redirectIfBlocked()
      return
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = authenticate(username, password, rememberMe)

    if (user) {
      if (user.status === "suspended") {
        setError("Your account has been suspended. Please contact an administrator.")
      } else if (user.status === "inactive") {
        setError("Your account is inactive. Please contact an administrator.")
      } else {
        router.push("/")
      }
    } else {
      const newAttempts = incrementLoginAttempts()
      setAttempts(newAttempts)

      if (newAttempts >= 5) {
        setError("Too many failed attempts. Redirecting to guest page...")
        setTimeout(() => {
          window.location.href = "http://www.joinus.projectarcadia.xyz"
        }, 2000)
      } else {
        setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`)
      }
    }

    setLoading(false)
  }

  const remainingAttempts = 5 - attempts

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PA</span>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Project Arcadia
          </CardTitle>
          <CardDescription>Member Portal Access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={loading}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Keep me signed in for 30 days
              </Label>
            </div>

            {attempts > 0 && remainingAttempts > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {attempts} failed attempt{attempts > 1 ? "s" : ""}. {remainingAttempts} remaining before lockout.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading || remainingAttempts <= 0}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need access? Contact an administrator or{" "}
              <a
                href="https://tally.so/r/m6zWyk"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                apply here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
