import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Mail, Phone, MapPin, Globe } from "lucide-react"

export function ResumeContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume</h2>
          <p className="text-gray-600">Download or view my complete resume</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>john.doe@email.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span>johndoe.dev</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications using
            modern technologies. Proven track record of delivering high-quality solutions that improve user experience
            and drive business growth. Strong background in React, Node.js, and cloud technologies.
          </p>
        </CardContent>
      </Card>

      {/* Technical Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Frontend</h4>
              <p className="text-gray-700">React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Vue.js</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Backend</h4>
              <p className="text-gray-700">Node.js, Python, Express.js, FastAPI, RESTful APIs, GraphQL</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Database</h4>
              <p className="text-gray-700">PostgreSQL, MongoDB, Redis, MySQL</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Tools & Technologies</h4>
              <p className="text-gray-700">Git, Docker, AWS, Vercel, Jest, Cypress, Figma</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">Senior Full Stack Developer</h4>
                <p className="text-gray-600">Tech Company Inc.</p>
              </div>
              <span className="text-gray-500 text-sm">2022 - Present</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>Led development of microservices architecture serving 100k+ daily users</li>
              <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
              <li>Mentored junior developers and conducted code reviews</li>
              <li>Collaborated with product team to define technical requirements</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">Frontend Developer</h4>
                <p className="text-gray-600">Digital Agency</p>
              </div>
              <span className="text-gray-500 text-sm">2020 - 2022</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>Built responsive web applications for 20+ clients</li>
              <li>Improved website performance by 40% through optimization</li>
              <li>Collaborated with designers to implement pixel-perfect UIs</li>
              <li>Integrated third-party APIs and payment systems</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">Junior Developer</h4>
                <p className="text-gray-600">Startup Co.</p>
              </div>
              <span className="text-gray-500 text-sm">2019 - 2020</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>Developed and maintained React-based web applications</li>
              <li>Participated in agile development processes</li>
              <li>Fixed bugs and implemented new features</li>
              <li>Learned modern development practices and tools</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">Bachelor of Science in Computer Science</h4>
              <p className="text-gray-600">University of Technology</p>
            </div>
            <span className="text-gray-500 text-sm">2015 - 2019</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
