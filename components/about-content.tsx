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
    <div className="space-y-4 md:space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 md:mb-4 rounded-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=128&width=128"
            alt="Profile"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">John Doe</h2>
        <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4">Full Stack Developer</p>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
          Passionate full-stack developer with 5+ years of experience building modern web applications. I love creating
          beautiful, functional, and user-friendly digital experiences that solve real-world problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {skills.map((skillGroup) => {
          const Icon = skillGroup.icon
          return (
            <Card key={skillGroup.category}>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  {skillGroup.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {skillGroup.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
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
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">Experience</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 space-y-3 md:space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm md:text-base">Senior Full Stack Developer</h4>
            <p className="text-gray-600 text-sm md:text-base">Tech Company Inc. • 2022 - Present</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Leading development of scalable web applications using React, Node.js, and cloud technologies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm md:text-base">Frontend Developer</h4>
            <p className="text-gray-600 text-sm md:text-base">Digital Agency • 2020 - 2022</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Built responsive web applications and collaborated with design teams to create exceptional user
              experiences.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm md:text-base">Junior Developer</h4>
            <p className="text-gray-600 text-sm md:text-base">Startup Co. • 2019 - 2020</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Developed and maintained web applications while learning modern development practices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
