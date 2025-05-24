"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, MessageCircle, Video, BookOpen, Star, ExternalLink } from "lucide-react"

export function ServicesContent() {
  const services = [
    {
      id: "1on1-session",
      title: "1:1 Mentorship Session",
      description: "Personalized guidance on your career, projects, and technical challenges.",
      duration: "60 minutes",
      price: "$75",
      icon: Users,
      features: [
        "Career roadmap planning",
        "Code review and feedback",
        "Technical interview prep",
        "Portfolio optimization",
        "Industry insights",
      ],
      rating: 4.9,
      reviews: 127,
      availability: "Available",
      bookingUrl: "https://topmate.io/johndoe/1on1-session",
    },
    {
      id: "career-guidance",
      title: "Career Guidance Package",
      description: "Comprehensive career planning and strategy development for developers.",
      duration: "90 minutes",
      price: "$120",
      icon: BookOpen,
      features: [
        "Career assessment",
        "Skill gap analysis",
        "Learning path creation",
        "Resume optimization",
        "LinkedIn profile review",
        "Follow-up session included",
      ],
      rating: 5.0,
      reviews: 89,
      availability: "Available",
      bookingUrl: "https://topmate.io/johndoe/career-guidance",
    },
    {
      id: "code-review",
      title: "Code Review Session",
      description: "In-depth code review with best practices and optimization suggestions.",
      duration: "45 minutes",
      price: "$60",
      icon: MessageCircle,
      features: [
        "Code quality assessment",
        "Performance optimization",
        "Security review",
        "Best practices guidance",
        "Refactoring suggestions",
      ],
      rating: 4.8,
      reviews: 156,
      availability: "Available",
      bookingUrl: "https://topmate.io/johndoe/code-review",
    },
    {
      id: "mock-interview",
      title: "Mock Technical Interview",
      description: "Practice technical interviews with real-world scenarios and feedback.",
      duration: "75 minutes",
      price: "$90",
      icon: Video,
      features: [
        "System design questions",
        "Coding challenges",
        "Behavioral questions",
        "Detailed feedback report",
        "Interview tips and strategies",
      ],
      rating: 4.9,
      reviews: 203,
      availability: "Limited slots",
      bookingUrl: "https://topmate.io/johndoe/mock-interview",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      company: "Google",
      text: "John's mentorship helped me land my dream job at Google. His insights were invaluable!",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Full Stack Developer",
      company: "Stripe",
      text: "The career guidance session was exactly what I needed. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Software Engineer",
      company: "Microsoft",
      text: "Amazing code review session. Learned so much about best practices and optimization.",
      rating: 5,
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Professional Services</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Accelerate your career with personalized mentorship and guidance from an experienced developer
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 md:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">{service.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={service.availability === "Available" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {service.availability}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {service.rating} ({service.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg md:text-xl font-bold text-blue-600">{service.price}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.duration}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm md:text-base mt-2">{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm md:text-base mb-2">What's included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-xs md:text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full" onClick={() => window.open(service.bookingUrl, "_blank")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Testimonials */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">What People Say</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-700 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-xs md:text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4 md:p-6">
          <div className="text-center space-y-2 md:space-y-3">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Ready to Get Started?</h3>
            <p className="text-xs md:text-sm text-gray-600">
              Have questions or need a custom package? Let's discuss your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => window.open("mailto:john.doe@email.com", "_blank")}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button onClick={() => window.open("https://topmate.io/johndoe", "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Services
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
