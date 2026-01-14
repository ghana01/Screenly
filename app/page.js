"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from '@/app/provider'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Mic, 
  Brain, 
  Clock, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  Globe
} from "lucide-react"

/**
 * Landing Page / Hero Page
 * - Showcases the AI Interview Platform
 * - Explains what it does and how it helps
 * - Provides signup/login option
 */
export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard')
    }
  }, [user, isLoading, router])

  const features = [
    {
      icon: Mic,
      title: "Voice-Powered Interviews",
      description: "Natural voice conversations with AI that feels like talking to a real interviewer"
    },
    {
      icon: Brain,
      title: "AI-Generated Questions",
      description: "Smart questions tailored to job roles, experience levels, and technical requirements"
    },
    {
      icon: BarChart3,
      title: "Instant Feedback",
      description: "Detailed performance analysis with scores on communication, technical skills, and more"
    },
    {
      icon: Clock,
      title: "Save 10+ Hours/Week",
      description: "Automate initial screening and focus only on top candidates"
    },
    {
      icon: Shield,
      title: "Consistent & Unbiased",
      description: "Every candidate gets the same fair evaluation criteria"
    },
    {
      icon: Globe,
      title: "Interview Anytime",
      description: "Candidates can take interviews 24/7 from anywhere in the world"
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Create Interview",
      description: "Set up job position, requirements, and interview questions in minutes"
    },
    {
      step: "2",
      title: "Share Link",
      description: "Send unique interview link to candidates via email or any channel"
    },
    {
      step: "3",
      title: "Candidate Interviews",
      description: "AI conducts voice interview and evaluates responses in real-time"
    },
    {
      step: "4",
      title: "Review & Decide",
      description: "Get detailed feedback, scores, and recommendations for each candidate"
    }
  ]

  const stats = [
    { value: "90%", label: "Time Saved" },
    { value: "24/7", label: "Availability" },
    { value: "100%", label: "Consistent" },
    { value: "Instant", label: "Feedback" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Screenly" width={120} height={40} className="h-8 w-auto" />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth">
                <Button variant="ghost" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 font-medium">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Interview Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Automate Your Hiring with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                AI Voice Interviews
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Screen candidates faster with AI that conducts natural voice interviews, 
              evaluates responses, and provides instant feedback. Save hours on every hire.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl p-4 sm:p-8">
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mic className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Voice Interview in Action</h3>
                    <p className="text-gray-600">Natural conversations powered by advanced AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                The Problem We Solve
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <p className="text-gray-600">Spending hours screening unqualified candidates</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <p className="text-gray-600">Inconsistent interview experiences across candidates</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <p className="text-gray-600">Scheduling conflicts and timezone challenges</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <p className="text-gray-600">Delayed hiring decisions due to slow processes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Solution
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">AI conducts initial interviews automatically</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Every candidate gets the same fair evaluation</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Candidates interview 24/7, any timezone</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Instant feedback and hiring recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Hiring
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your interview process
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes, not days
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section (For Portfolio) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built with Modern Tech Stack
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Production-ready architecture using cutting-edge technologies
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Next.js 16", desc: "React Framework" },
              { name: "Supabase", desc: "Backend & Auth" },
              { name: "OpenRouter", desc: "AI Models" },
              { name: "Web Speech API", desc: "Voice Recognition" },
              { name: "Tailwind CSS", desc: "Styling" },
              { name: "Vercel", desc: "Deployment" }
            ].map((tech, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="font-semibold mb-1">{tech.name}</div>
                <div className="text-sm text-gray-400">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join recruiters who are saving 10+ hours every week with AI-powered interviews
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-blue-200">No credit card required • Free to start</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Screenly" width={100} height={30} className="h-6 w-auto brightness-200" />
            </div>
            <div className="text-sm text-center md:text-right">
              <p>Built by <span className="text-white font-medium">Ghanshyam Kumar Mishra</span></p>
              <p className="mt-1">AI Interview Voice Agent • © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
