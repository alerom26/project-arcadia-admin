import { ArrowRight, Users, Target, Lightbulb, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Project Arcadia
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#looking-for" className="text-gray-600 hover:text-blue-600 transition-colors">
              What We Seek
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="https://tally.so/r/m6zWyk" target="_blank" rel="noopener noreferrer">
              Apply Now
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Welcome to Project Arcadia
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Building the future through innovation, collaboration, and exceptional talent. Join us in creating something
            extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="https://tally.so/r/m6zWyk" target="_blank" rel="noopener noreferrer">
                Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#about">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-gray-900">What We Do</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Project Arcadia is at the forefront of innovation, bringing together visionary minds to tackle complex
              challenges and create groundbreaking solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Innovation Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We foster cutting-edge research and development, pushing the boundaries of what's possible in
                  technology and business solutions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Collaborative Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Building a community of exceptional professionals who share knowledge, resources, and expertise to
                  achieve collective success.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Strategic Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Delivering transformative strategies and implementations that drive measurable results for our
                  partners and stakeholders.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We're Looking For Section */}
      <section id="looking-for" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-gray-900">What We're Looking For</h3>
            <p className="text-xl text-gray-600">
              We seek exceptional individuals who share our vision and passion for innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Visionary Thinkers</h4>
                  <p className="text-gray-600">
                    Individuals who can see beyond the present and envision transformative solutions for tomorrow's
                    challenges.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Technical Excellence</h4>
                  <p className="text-gray-600">
                    Professionals with deep expertise in their fields and a commitment to continuous learning and
                    improvement.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Collaborative Spirit</h4>
                  <p className="text-gray-600">
                    Team players who thrive in diverse environments and contribute to collective success through shared
                    knowledge and support.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Entrepreneurial Mindset</h4>
                  <p className="text-gray-600">
                    Self-motivated individuals who take initiative, embrace challenges, and drive projects from
                    conception to completion.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">5</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Adaptability</h4>
                  <p className="text-gray-600">
                    Flexible professionals who can navigate changing landscapes and pivot strategies while maintaining
                    focus on core objectives.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">6</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Impact-Driven</h4>
                  <p className="text-gray-600">
                    Passionate individuals committed to creating meaningful change and leaving a positive mark on the
                    world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h3 className="text-4xl font-bold mb-6">Ready to Join Project Arcadia?</h3>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards an extraordinary journey. Submit your application and become part of something
            revolutionary.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="https://tally.so/r/m6zWyk" target="_blank" rel="noopener noreferrer">
              Apply Now - It Takes 5 Minutes <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-gray-900">Get In Touch</h3>
            <p className="text-xl text-gray-600">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Email Us</h4>
              <p className="text-gray-600">hello@projectarcadia.com</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Call Us</h4>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Visit Us</h4>
              <p className="text-gray-600">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PA</span>
              </div>
              <span className="text-xl font-bold">Project Arcadia</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">Building the future, together.</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://tally.so/r/m6zWyk" target="_blank" rel="noopener noreferrer">
                  Apply Today
                </Link>
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Project Arcadia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
