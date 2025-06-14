import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, MessageCircle } from "lucide-react"

export function ContactContent() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Let's Connect</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          I'm always excited to discuss new opportunities, collaborate on interesting projects, 
          or just have a chat about technology and development.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Contact Form */}
        <Card className="order-2 lg:order-1">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Send className="w-4 h-4 md:w-5 md:h-5" />
              Send a Message
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Fill out the form below and I'll get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <form className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm">
                    First Name
                  </Label>
                  <Input id="firstName" placeholder="Your first name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm">
                    Last Name
                  </Label>
                  <Input id="lastName" placeholder="Your last name" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>
                <Input id="email" type="email" placeholder="your.email@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject" className="text-sm">
                  Subject
                </Label>
                <Input id="subject" placeholder="What's this about?" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project, idea, or just say hello..."
                  className="min-h-[100px] md:min-h-[120px] mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
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
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm md:text-base">Email</p>
                  <a href="mailto:vanshsethi121@gmail.com" className="text-gray-600 text-sm md:text-base hover:text-blue-600 transition-colors">
                    vanshsethi121@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm md:text-base">Location</p>
                  <p className="text-gray-600 text-sm md:text-base">India</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm md:text-base">Response Time</p>
                  <p className="text-gray-600 text-sm md:text-base">Usually within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">Connect on Social</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col gap-2">
                  <a href="https://github.com/vansh-121" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs">GitHub</span>
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col gap-2">
                  <a href="https://www.linkedin.com/in/vansh-sethi-vs/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs">LinkedIn</span>
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col gap-2">
                  <a href="https://twitter.com/vanshsethi121" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs">Twitter</span>
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col gap-2">
                  <a href="https://vanshsethi.netlify.app/" target="_blank" rel="noopener noreferrer">
                    <Mail className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs">Portfolio</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg text-blue-800">Current Status</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
                  <span className="text-xs md:text-sm font-medium text-green-700">Available for new projects</span>
                </div>
                <p className="text-gray-600 text-xs md:text-sm">
                  I'm currently open to freelance opportunities, full-time positions, and exciting collaborations. 
                  Let's build something amazing together!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">What I Can Help With</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="space-y-2 text-xs md:text-sm text-gray-600">
                <div>• Full-stack web application development</div>
                <div>• UI/UX design and prototyping</div>
                <div>• Mobile app development</div>
                <div>• Technical consulting and code reviews</div>
                <div>• API development and integration</div>
                <div>• Performance optimization</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}