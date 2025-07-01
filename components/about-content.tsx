import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Database, Globe, Smartphone, Award, MapPin } from "lucide-react"
import Image from "next/image"

export function AboutContent() {
  const skills = [
    {
      category: "Frontend",
      icon: Globe,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "JavaScript"],
    },
    {
      category: "Backend",
      icon: Database,
      technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Express", "FastAPI"],
    },
    {
      category: "Mobile & Design",
      icon: Smartphone,
      technologies: ["React Native", "Flutter", "Figma", "Adobe XD", "UI/UX Design"],
    },
    {
      category: "Tools & Cloud",
      icon: Code,
      technologies: ["Git", "Docker", "AWS", "Vercel", "Firebase", "VS Code"],
    },
  ]

  const achievements = [
    "🏆 Built 50+ projects with modern web technologies",
    "🚀 Experienced in full-stack development and deployment",
    "🎨 Strong focus on UI/UX design and user experience",
    "☁️ Cloud architecture and DevOps practices",
    "📱 Cross-platform mobile app development",
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 md:mb-4 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-600">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
            VS
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Vansh Sethi</h2>
        <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4 font-semibold">Full Stack Developer & UI/UX Designer</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">India</span>
        </div>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2 leading-relaxed">
          Passionate full-stack developer with expertise in modern web technologies and a strong eye for design. 
          I specialize in creating scalable, user-friendly applications that solve real-world problems. 
          With experience in both frontend and backend development, I bring ideas to life through clean code and intuitive interfaces.
        </p>
      </div>

      {/* Achievements Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Award className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Key Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="grid grid-cols-1 gap-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 text-sm md:text-base text-gray-700">
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {skills.map((skillGroup) => {
          const Icon = skillGroup.icon
          return (
            <Card key={skillGroup.category} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  {skillGroup.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {skillGroup.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs hover:bg-blue-50 transition-colors">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Experience Section */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">Professional Journey</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 space-y-3 md:space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900 text-sm md:text-base">Full Stack Developer</h4>
            <p className="text-gray-600 text-sm md:text-base">Freelance & Personal Projects • 2022 - Present</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Developing modern web applications using React, Next.js, Node.js, and cloud technologies. 
              Focus on creating scalable solutions with excellent user experience.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-900 text-sm md:text-base">UI/UX Designer</h4>
            <p className="text-gray-600 text-sm md:text-base">Various Projects • 2021 - Present</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Designing intuitive user interfaces and experiences using Figma and Adobe XD. 
              Collaborating with development teams to bring designs to life.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-900 text-sm md:text-base">Student & Learner</h4>
            <p className="text-gray-600 text-sm md:text-base">Continuous Learning • 2020 - Present</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Constantly learning new technologies and best practices. Building projects to apply knowledge 
              and contribute to the developer community.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Philosophy Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg text-purple-800">My Philosophy</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
            "I believe in writing clean, maintainable code and creating user experiences that are not just functional, 
            but delightful. Every project is an opportunity to learn something new and make a positive impact."
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
