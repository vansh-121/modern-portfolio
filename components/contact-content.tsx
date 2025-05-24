import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react"

export function ContactContent() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Get In Touch</h2>
        <p className="text-sm md:text-base text-gray-600">Let's discuss your next project or opportunity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Contact Form */}
        <Card className="order-2 lg:order-1">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">Send a Message</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Fill out the form below and I'll get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <form className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm">
                    First Name
                  </Label>
                  <Input id="firstName" placeholder="John" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm">
                    Last Name
                  </Label>
                  <Input id="lastName" placeholder="Doe" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject" className="text-sm">
                  Subject
                </Label>
                <Input id="subject" placeholder="Project Inquiry" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  className="min-h-[80px] md:min-h-[100px] mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0 space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm md:text-base">Email</p>
                  <p className="text-gray-600 text-sm md:text-base">john.doe@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm md:text-base">Phone</p>
                  <p className="text-gray-600 text-sm md:text-base">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm md:text-base">Location</p>
                  <p className="text-gray-600 text-sm md:text-base">San Francisco, CA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="flex gap-2 md:gap-4">
                <Button variant="outline" size="icon" asChild className="h-8 w-8 md:h-10 md:w-10">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="h-8 w-8 md:h-10 md:w-10">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="h-8 w-8 md:h-10 md:w-10">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">Availability</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs md:text-sm">Available for new projects</span>
                </div>
                <p className="text-gray-600 text-xs md:text-sm">
                  I'm currently accepting new freelance projects and full-time opportunities.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
