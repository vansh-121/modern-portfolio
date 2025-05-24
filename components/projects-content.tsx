import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"

export function ProjectsContent() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with Next.js, TypeScript, and Stripe integration.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "PostgreSQL"],
      github: "https://github.com",
      demo: "https://demo.com",
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates and team features.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
      github: "https://github.com",
      demo: "https://demo.com",
    },
    {
      title: "Weather Dashboard",
      description: "A beautiful weather dashboard with location-based forecasts and interactive maps.",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["Vue.js", "TypeScript", "Chart.js", "OpenWeather API"],
      github: "https://github.com",
      demo: "https://demo.com",
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">My Projects</h2>
        <p className="text-sm md:text-base text-gray-600">A collection of my recent work and side projects.</p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {projects.map((project, index) => (
          <Card key={index} className="overflow-hidden">
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
                  <CardTitle className="text-lg md:text-xl">{project.title}</CardTitle>
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
    </div>
  )
}
