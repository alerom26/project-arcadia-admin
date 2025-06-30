"use client"

import { Shield, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Scale, Users, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"
import type { Member } from "@/lib/auth"

function CodeOfConductPage() {
  const [user, setUser] = useState<Member | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

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
              <Shield className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Complete Code of Conduct
              </h1>
            </div>
          </div>
          <Badge variant="secondary">
            {user?.name} • {user?.role?.replace("-", " ")}
          </Badge>
        </div>
      </header>

      {/* Code of Conduct Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="h-6 w-6 mr-3 text-green-600" />
                Project Arcadia Code of Conduct
              </CardTitle>
              <CardDescription className="text-base">
                Effective Date: January 1, 2024 | Version 2.1 | Last Updated: December 15, 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Acknowledgment Required:</strong> All members must read, understand, and agree to abide by
                  this Code of Conduct. Violation of these guidelines may result in disciplinary action up to and
                  including removal from Project Arcadia.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Core Values */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-green-600">Our Core Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-semibold mb-2">Respect & Dignity</h4>
                    <p className="text-sm text-gray-600">
                      We treat every member with respect, regardless of their background, experience level, or position
                      within the organization.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-semibold mb-2">Integrity & Honesty</h4>
                    <p className="text-sm text-gray-600">
                      We conduct ourselves with the highest ethical standards, being truthful in all our interactions
                      and commitments.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-semibold mb-2">Collaboration & Teamwork</h4>
                    <p className="text-sm text-gray-600">
                      We work together towards common goals, supporting each other and sharing knowledge freely.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-600 pl-4">
                    <h4 className="font-semibold mb-2">Excellence & Growth</h4>
                    <p className="text-sm text-gray-600">
                      We strive for excellence in all our endeavors while continuously learning and improving ourselves.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-600 pl-4">
                    <h4 className="font-semibold mb-2">Confidentiality & Trust</h4>
                    <p className="text-sm text-gray-600">
                      We maintain strict confidentiality of internal matters and build trust through reliable actions.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-600 pl-4">
                    <h4 className="font-semibold mb-2">Innovation & Creativity</h4>
                    <p className="text-sm text-gray-600">
                      We encourage creative thinking and innovative solutions while respecting established processes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expected Behavior */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-blue-600 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Expected Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Communication Standards</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span>Use professional and respectful language in all communications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span>Listen actively and consider different perspectives</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span>Provide constructive feedback and criticism</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span>Respond to messages and requests in a timely manner</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span>Use appropriate channels for different types of communication</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Professional Conduct</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Attend scheduled meetings and notify in advance if unable to attend</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Meet deadlines and commitments or communicate delays promptly</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Maintain confidentiality of sensitive information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Follow established procedures and protocols</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>Seek help when needed and offer assistance to others</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Collaboration & Teamwork</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>Share knowledge and resources openly with team members</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>Support team decisions even when you initially disagreed</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>Credit others for their contributions and ideas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>Resolve conflicts through direct, respectful communication</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>Mentor new members and help them integrate into the team</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Behavior */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-red-600 flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                Prohibited Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Zero Tolerance Policy:</strong> The following behaviors will result in immediate disciplinary
                  action, potentially including immediate removal from Project Arcadia.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-3 text-red-600">Harassment & Discrimination</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>
                      Harassment based on race, gender, religion, sexual orientation, or any other protected
                      characteristic
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Bullying, intimidation, or threatening behavior</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Unwelcome sexual advances or inappropriate sexual content</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Personal attacks or insults directed at individuals</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-red-600">Confidentiality Violations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Sharing internal discussions, documents, or information with external parties</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Disclosing member personal information without consent</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Taking screenshots or recordings of private conversations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Sharing login credentials or access tokens</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-red-600">Disruptive Behavior</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Deliberately disrupting meetings or collaborative work</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Spamming channels or sending excessive irrelevant messages</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Sabotaging projects, systems, or other members' work</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>Persistent violation of established procedures after warnings</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disciplinary Process */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-orange-600 flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Disciplinary Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Progressive Discipline</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h5 className="font-medium text-yellow-700">Step 1: Verbal Warning</h5>
                      <p className="text-sm text-gray-600">Private discussion with leadership about the issue</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h5 className="font-medium text-orange-700">Step 2: Written Warning</h5>
                      <p className="text-sm text-gray-600">Formal documentation of the violation and expectations</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h5 className="font-medium text-red-700">Step 3: Probationary Status</h5>
                      <p className="text-sm text-gray-600">Temporary restriction of privileges and close monitoring</p>
                    </div>
                    <div className="border-l-4 border-red-700 pl-4">
                      <h5 className="font-medium text-red-800">Step 4: Membership Review</h5>
                      <p className="text-sm text-gray-600">Leadership council review for potential removal</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Immediate Actions</h4>
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Serious Violations</h5>
                      <p className="text-sm text-red-700">
                        Harassment, discrimination, confidentiality breaches, or sabotage may result in immediate
                        suspension or removal.
                      </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <h5 className="font-medium text-orange-800 mb-2">Investigation Process</h5>
                      <p className="text-sm text-orange-700">
                        All reports are investigated fairly and confidentially. Members have the right to present their
                        side.
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Appeal Process</h5>
                      <p className="text-sm text-blue-700">
                        Members may appeal disciplinary decisions to the Executive Council within 7 days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting Procedures */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-purple-600 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Reporting Procedures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">How to Report</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Direct Contact</p>
                        <p className="text-sm text-gray-600">Contact any Leadership Council member directly</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Anonymous Report</p>
                        <p className="text-sm text-gray-600">Use the anonymous reporting form (link in resources)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-medium">HR Channel</p>
                        <p className="text-sm text-gray-600">Email main@projectarcadia.xyz for sensitive matters</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">What to Include</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <span>Date, time, and location of the incident</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <span>Names of individuals involved</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <span>Detailed description of what occurred</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <span>Any witnesses present</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <span>Screenshots or evidence (if applicable)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <Lock className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Confidentiality Guaranteed:</strong> All reports are handled with strict confidentiality.
                  Retaliation against anyone who reports violations in good faith is strictly prohibited.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Acknowledgment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Member Acknowledgment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-700 mb-4">
                  By participating in Project Arcadia, I acknowledge that I have read, understood, and agree to abide by
                  this Code of Conduct. I understand that violations may result in disciplinary action up to and
                  including removal from the organization.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Member: {user?.name}</p>
                    <p className="text-sm text-gray-600">Role: {user?.role?.replace("-", " ")}</p>
                    <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                  <Badge className="bg-green-600">Acknowledged</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default function CodeOfConduct() {
  return (
    <AuthGuard>
      <CodeOfConductPage />
    </AuthGuard>
  )
}
