"use client"

import { ArrowRight, FileText, BookOpen, Scale, Shield, Zap, Users, CheckCircle, Star } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(101,85,255,0.1),transparent_50%)]" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/30">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-balance">LexiClear</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </div>

        <button className="glass-effect bg-transparent border border-foreground px-4 py-2 rounded-md hover:bg-white/10 transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 bg-white/10 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3 mr-1" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            AI Legal Assistant
          </h1>

          <p className="text-xl lg:text-2xl text-muted-foreground text-balance mb-12 max-w-3xl mx-auto leading-relaxed">
            Transforming complex legal language into simple, clear guidance. Get instant explanations and document
            summaries powered by cutting-edge AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-lg flex items-center justify-center gap-2 animate-glow">
              Try Simplifier <ArrowRight className="w-5 h-5" />
            </button>
            {/* <button className="border border-foreground bg-transparent hover:bg-white/10 px-8 py-4 text-lg rounded-lg flex items-center justify-center gap-2">
              Try Explainer <BookOpen className="w-5 h-5" />
            </button> */}
            <Link href="/explainer">
  <button className="border border-foreground bg-transparent hover:bg-white/10 px-8 py-4 text-lg rounded-lg flex items-center justify-center gap-2">
    Try Explainer <BookOpen className="w-5 h-5" />
  </button>
</Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">10,000+ Legal Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section id="features" className="relative z-10 px-6 lg:px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Simplifier Card */}
            <div
              className="group relative p-8 lg:p-12 bg-white/10 rounded-xl border border-white/20 hover:border-primary/50 transition-all duration-500 cursor-pointer animate-float"
              onMouseEnter={() => setHoveredCard("simplifier")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-balance">Simplify Legal Documents</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Turn lengthy legal documents into plain-English summaries with key rights, obligations, and important
                  clauses highlighted for easy understanding.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /><span className="text-sm">Contract analysis in seconds</span></div>
                  <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /><span className="text-sm">Risk assessment & recommendations</span></div>
                  <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /><span className="text-sm">Key terms extraction</span></div>
                </div>

                <button className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                  Try Simplifier <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Explainer Card */}
            <div
              className="group relative p-8 lg:p-12 bg-white/10 rounded-xl border border-white/20 hover:border-accent/50 transition-all duration-500 cursor-pointer animate-float"
              onMouseEnter={() => setHoveredCard("explainer")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-balance">Explain Legal Terms</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Type any legal term and instantly get simple explanations with real-life examples, context, and
                  practical implications for your situation.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /><span className="text-sm">Instant term definitions</span></div>
                  <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /><span className="text-sm">Real-world examples</span></div>
                  <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /><span className="text-sm">Contextual implications</span></div>
                </div>

                <button className="w-full bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                  Try Explainer <BookOpen className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 lg:px-8 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">{"<"}3s</div>
            <div className="text-muted-foreground">Response Time</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-muted-foreground">Documents Processed</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">24/7</div>
            <div className="text-muted-foreground">Availability</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-8 py-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
              <Scale className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold">LexiClear</span>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-sm text-muted-foreground max-w-2xl text-balance">
              <strong>Disclaimer:</strong> This is an AI-powered assistant and not a substitute for professional legal
              advice. Always consult with qualified legal professionals for important legal matters.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}