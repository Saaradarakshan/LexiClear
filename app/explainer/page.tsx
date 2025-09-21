// app/explainer/page.tsx
"use client"

import { useState } from "react"
import { BookOpen, Zap, Clock, TrendingUp, ChevronRight, Star, Scale, Shield, FileText, ArrowRight, Users, Target, CheckCircle } from "lucide-react"

type Result = {
  definition?: string
  example?: string
  implications?: string[] | string
  raw?: string
}

const popularTerms = [
  "Force Majeure",
  "Indemnity Clause",
  "Non-Disclosure Agreement",
  "Liquidated Damages",
  "Arbitration Clause",
  "Statute of Limitations"
]

const stats = [
  { value: "10,000+", label: "Terms Explained", icon: BookOpen },
  { value: "98%", label: "Accuracy Rate", icon: Target },
  { value: "24/7", label: "Available", icon: Clock }
]

export default function ExplainerPage() {
  const [term, setTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleExplain(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    setResult(null)

    if (!term.trim()) {
      setError("Please enter a legal term (e.g., “force majeure”).")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: term.trim() }),
      })

      const payload = await res.json()
      if (!res.ok) {
        setError(payload?.error || "Server error")
        setLoading(false)
        return
      }

      // API returns either { result: {definition, example, implications} } or { raw: "..." }
      const parsed = payload.result ?? (payload.raw ? { raw: payload.raw } : payload)

      // If raw text is returned, try to split by headings (best-effort)
      if (typeof parsed === "string" || parsed.raw) {
        const rawText = (typeof parsed === "string") ? parsed : parsed.raw
        // Attempt regex extraction
        const defMatch = rawText.match(/definition[:\s]*([\s\S]*?)(?=example[:\s]|implication[:\s]|$)/i)
        const exMatch = rawText.match(/example[:\s]*([\s\S]*?)(?=implication[:\s]|$)/i)
        const impMatch = rawText.match(/implication[s]?:[\s]*([\s\S]*)/i)

        setResult({
          raw: rawText,
          definition: defMatch?.[1]?.trim() ?? rawText.slice(0, 700),
          example: exMatch?.[1]?.trim(),
          implications: impMatch?.[1]?.trim(),
        })
      } else {
        setResult(parsed)
      }
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  const handlePopularTermClick = (popularTerm: string) => {
    setTerm(popularTerm)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent/10 to-background px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">AI-Powered Legal Explanations</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Understand Legal Jargon in Plain English</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Get instant explanations of complex legal terms with real-world examples and practical implications.
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-8 pb-12 max-w-6xl mx-auto">
        {/* Main Input Card - Positioned at the top */}
        <div className="bg-white/5 rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Explain Legal Terms</h2>
              <p className="text-sm text-muted-foreground">Type any legal term and get a simple explanation with an example and practical implications.</p>
            </div>
          </div>

          <form onSubmit={handleExplain} className="space-y-4 mb-6">
            <label className="block">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder='e.g. "force majeure", "indemnity", "non-disclosure"'
                className="w-full rounded-md border border-white/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Explaining…</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Explain Term</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="border border-white/10 px-4 py-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => { setTerm(""); setResult(null); setError(null); }}
              >
                Clear
              </button>
            </div>
          </form>

          <div>
            {error && <div className="text-red-400 mb-4 p-3 bg-red-400/10 rounded-md">{error}</div>}

            {result && (
              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="p-4 bg-accent/5 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                    <Scale className="w-5 h-5 text-accent" />
                    Definition
                  </h3>
                  <p className="text-muted-foreground">{result.definition ?? result.raw}</p>
                </div>

                {result.example && (
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-accent" />
                      Real-world Example
                    </h3>
                    <p className="text-muted-foreground">{result.example}</p>
                  </div>
                )}

                {result.implications && (
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-accent" />
                      Practical Implications
                    </h3>
                    {Array.isArray(result.implications) ? (
                      <ul className="list-disc ml-5 text-muted-foreground space-y-2">
                        {result.implications.map((i, idx) => <li key={idx}>{i}</li>)}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">{result.implications}</p>
                    )}
                  </div>
                )}

                <div className="text-xs text-muted-foreground mt-3 p-3 bg-white/5 rounded-md">
                  <strong>Disclaimer:</strong> This AI-powered explanation is for informational purposes only and may not be complete or accurate. It does not constitute legal advice. Always consult with a qualified attorney for legal matters.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats and Popular Terms Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stats Section */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Our Impact
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-accent">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Popular Terms */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              Popular Legal Terms
            </h3>
            <div className="space-y-3">
              {popularTerms.map((popularTerm, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularTermClick(popularTerm)}
                  className="w-full flex items-center justify-between p-3 rounded-md hover:bg-white/5 transition-colors text-left group"
                >
                  <span>{popularTerm}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
            
            {/* How It Works - Compact version */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                How It Works
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>1. Enter any legal term or phrase</p>
                <p>2. AI analyzes and breaks down the concept</p>
                <p>3. Get a plain-English explanation with examples</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section at the bottom */}
        <div className="mt-8 bg-accent/10 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-xl mb-3">Need more comprehensive legal help?</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">Connect with qualified legal professionals for personalized advice tailored to your specific situation.</p>
          <button className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-md inline-flex items-center justify-center gap-2">
            Find Legal Help <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}