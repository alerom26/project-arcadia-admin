"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { acceptCodeOfConduct } from "@/lib/auth"

interface CodeOfConductModalProps {
  user: {
    id: string
    name: string
    role: string
  }
  onAccept: () => void
}

export function CodeOfConductModal({ user, onAccept }: CodeOfConductModalProps) {
  const [hasRead, setHasRead] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)

  const handleAccept = () => {
    if (hasRead && hasAgreed) {
      acceptCodeOfConduct(user.id)
      onAccept()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-y-auto">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center text-2xl">
            <Shield className="h-6 w-6 mr-3 text-green-600" />
            Code of Conduct Acceptance Required
          </CardTitle>
          <CardDescription>
            Welcome {user.name}! Before accessing the Project Arcadia portal, you must read and accept our Code of
            Conduct.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>First Time Login:</strong> All members must acknowledge and agree to abide by our Code of Conduct
              before accessing the portal.
            </AlertDescription>
          </Alert>

          <ScrollArea className="h-[400px] border rounded-lg p-4 bg-gray-50 overflow-y-auto">
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-600">Project Arcadia Code of Conduct</h3>
                <p className="text-gray-700 mb-4">
                  This Code of Conduct outlines our expectations for all members of Project Arcadia, as well as the
                  consequences for unacceptable behavior.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-blue-600">Our Core Values</h4>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span>
                      <strong>Respect & Dignity:</strong> Treat every member with respect, regardless of their
                      background or position.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span>
                      <strong>Integrity & Honesty:</strong> Conduct yourself with the highest ethical standards in all
                      interactions.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span>
                      <strong>Collaboration & Teamwork:</strong> Work together towards common goals and support each
                      other.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <span>
                      <strong>Confidentiality & Trust:</strong> Maintain strict confidentiality of internal matters.
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-600">Expected Behavior</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Use professional and respectful language in all communications</li>
                  <li>• Attend scheduled meetings and notify in advance if unable to attend</li>
                  <li>• Maintain confidentiality of sensitive information</li>
                  <li>• Follow established procedures and protocols</li>
                  <li>• Share knowledge and resources openly with team members</li>
                  <li>• Provide constructive feedback and criticism</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-red-600">Prohibited Behavior</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Harassment, discrimination, or bullying of any kind</li>
                  <li>• Sharing internal information with external parties</li>
                  <li>• Deliberately disrupting meetings or collaborative work</li>
                  <li>• Personal attacks or inappropriate behavior</li>
                  <li>• Sabotaging projects, systems, or other members' work</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-orange-600">Disciplinary Process</h4>
                <p className="text-gray-700 mb-2">Violations will be addressed through progressive discipline:</p>
                <ol className="space-y-1 ml-4">
                  <li>1. Verbal warning and discussion</li>
                  <li>2. Written warning with documentation</li>
                  <li>3. Probationary status with restricted privileges</li>
                  <li>4. Membership review and potential removal</li>
                </ol>
                <p className="text-red-700 mt-2 font-medium">
                  Serious violations (harassment, confidentiality breaches, sabotage) may result in immediate removal.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-purple-600">Reporting</h4>
                <p className="text-gray-700">
                  If you witness or experience violations of this Code of Conduct, please report them to leadership
                  immediately. All reports will be handled confidentially, and retaliation is strictly prohibited.
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="flex-shrink-0 space-y-4 border-t pt-4 bg-white">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="read-agreement"
                checked={hasRead}
                onCheckedChange={(checked) => setHasRead(checked as boolean)}
              />
              <label htmlFor="read-agreement" className="text-sm font-medium">
                I have read and understand the complete Code of Conduct
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agree-terms"
                checked={hasAgreed}
                onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
                disabled={!hasRead}
              />
              <label htmlFor="agree-terms" className="text-sm font-medium">
                I agree to abide by this Code of Conduct and understand that violations may result in disciplinary
                action
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={handleAccept}
                disabled={!hasRead || !hasAgreed}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Accept Code of Conduct
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
