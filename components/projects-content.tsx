import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Star, GitFork } from "lucide-react"
import Image from "next/image"

export function ProjectsContent() {
  const projects = [
    {
      title: "Modern Portfolio Website",
      description: "A macOS-inspired portfolio website built with Next.js, Three.js, and Tailwind CSS featuring interactive 3D backgrounds and smooth animations.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["Next.js", "TypeScript", "Three.js", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com/vansh-121",
      demo: "https://vanshsethi.netlify.app/",
      featured: true,
      stats: { stars: 45, forks: 12 }
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with user authentication, payment integration, and admin dashboard. Built with modern technologies for scalability.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express", "JWT"],
      github: "https://github.com/vansh-121",
      demo: "https://demo.com",
      stats: { stars: 32, forks: 8 }
    },
    {
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates, team features, and intuitive drag-and-drop interface.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["React", "Socket.io", "Node.js", "PostgreSQL", "Redis"],
      github: "https://github.com/vansh-121",
      demo: "https://demo.com",
      stats: { stars: 28, forks: 6 }
    },
    {
      title: "Weather Dashboard",
      description: "Beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics with data visualization.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["Vue.js", "TypeScript", "Chart.js", "OpenWeather API", "Mapbox"],
      github: "https://github.com/vansh-121",
      demo: "https://demo.com",
      stats: { stars: 19, forks: 4 }
    },
    {
      title: "Social Media Dashboard",
      description: "Analytics dashboard for social media management with real-time data visualization and automated reporting features.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL"],
      github: "https://github.com/vansh-121",
      demo: "https://demo.com",
      stats: { stars: 24, forks: 7 }
    },
    {
      title: "Mobile Fitness App",
      description: "Cross-platform fitness tracking app with workout plans, progress tracking, and social features for motivation.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["React Native", "Firebase", "Redux", "Expo", "Node.js"],
      github: "https://github.com/vansh-121",
      demo: "https://demo.com",
      stats: { stars: 36, forks: 11 }
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">My Projects</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          A collection of my recent work showcasing full-stack development, UI/UX design, and modern web technologies. 
          Each project represents a unique challenge and learning opportunity.
        </p>
      </div>

      {/* Featured Project */}
      {projects.filter(p => p.featured).map((project, index) => (
        <Card key={index} className="overflow-hidden border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-2/5">
              <div className="relative h-48 lg:h-full">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-600 text-white">Featured</Badge>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-3/5">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg md:text-xl text-blue-800">{project.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">{project.stats.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{project.stats.forks}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm md:text-base leading-relaxed">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                  <Button size="sm" asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}

      {/* Other Projects Grid */}
      <div className="grid gap-4 md:gap-6">
        {projects.filter(p => !p.featured).map((project, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={300}
                  height={200}
                  className="w-full h-32 md:h-48 lg:h-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3">
                <CardHeader className="p-3 md:p-6">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg md:text-xl">{project.title}</CardTitle>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{project.stats.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        <span>{project.stats.forks}</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm md:text-base">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-3 md:p-6 pt-0">
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button size="sm" asChild className="w-full sm:w-auto">
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* GitHub CTA */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="p-4 md:p-6">
          <div className="text-center space-y-3">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Want to see more?</h3>
            <p className="text-xs md:text-sm text-gray-600">
              Check out my GitHub profile for more projects, contributions, and open-source work.
            </p>
            <Button asChild className="bg-gray-900 hover:bg-gray-800">
              <a href="https://github.com/vansh-121" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                Visit GitHub Profile
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}