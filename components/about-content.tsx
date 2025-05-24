import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Database, Globe, Smartphone } from "lucide-react"
import Image from "next/image"

export function AboutContent() {
  const skills = [
    {
      category: "Frontend",
      icon: Globe,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Angular"],
    },
    {
      category: "Backend",
      icon: Database,
      technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Express", "FastAPI"],
    },
    {
      category: "Mobile",
      icon: Smartphone,
      technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
    },
    {
      category: "Tools",
      icon: Code,
      technologies: ["Git", "Docker", "AWS", "Vercel", "Figma", "VS Code"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=128&width=128"
            alt="Profile"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h2>
        <p className="text-lg text-gray-600 mb-4">Full Stack Developer</p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Passionate full-stack developer with 5+ years of experience building modern web applications. I love creating
          beautiful, functional, and user-friendly digital experiences that solve real-world problems.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skillGroup) => {
          const Icon = skillGroup.icon
          return (
            <Card key={skillGroup.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {skillGroup.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900">Senior Full Stack Developer</h4>
            <p className="text-gray-600">Tech Company Inc. • 2022 - Present</p>
            <p className="text-sm text-gray-500 mt-1">
              Leading development of scalable web applications using React, Node.js, and cloud technologies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Frontend Developer</h4>
            <p className="text-gray-600">Digital Agency • 2020 - 2022</p>
            <p className="text-sm text-gray-500 mt-1">
              Built responsive web applications and collaborated with design teams to create exceptional user
              experiences.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Junior Developer</h4>
            <p className="text-gray-600">Startup Co. • 2019 - 2020</p>
            <p className="text-sm text-gray-500 mt-1">
              Developed and maintained web applications while learning modern development practices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
