// app/api/explain/route.ts
import { NextResponse } from "next/server"

// Simple in-memory cache to store responses temporarily
const responseCache = new Map()
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour cache

// Mock responses for common legal terms
const mockResponses: Record<string, any> = {
  "force majeure": {
    definition: "Force majeure is a clause in contracts that frees both parties from liability or obligation when an extraordinary event or circumstance beyond their control prevents one or both parties from fulfilling their obligations under the contract.",
    example: "For example, if a hurricane destroys a factory that was under contract to produce goods, the force majeure clause might excuse the factory from fulfilling its obligations.",
    implications: [
      "Force majeure clauses must be specifically drafted and cannot be assumed to cover all unforeseen events",
      "The clause typically lists specific events like natural disasters, wars, or acts of God",
      "Whether COVID-19 qualifies as force majeure has been heavily litigated with mixed results"
    ]
  },
  "indemnity clause": {
    definition: "An indemnity clause is a contractual obligation where one party agrees to compensate another party for any losses or damages that arise from the contract or from specified circumstances.",
    example: "In a construction contract, the contractor might agree to indemnify the property owner against any claims arising from the contractor's work on the property.",
    implications: [
      "Indemnity clauses can create significant financial liability",
      "They are often heavily negotiated in contracts",
      "The scope of indemnity should be clearly defined to avoid ambiguity"
    ]
  },
  "non-disclosure agreement": {
    definition: "A non-disclosure agreement (NDA) is a legally binding contract that establishes a confidential relationship between parties to protect any type of confidential and proprietary information or trade secrets.",
    example: "When a company shares its business plans with a potential partner, they might sign an NDA to prevent the partner from sharing those plans with competitors.",
    implications: [
      "NDAs must clearly define what constitutes confidential information",
      "They typically have time limitations on the confidentiality obligation",
      "Violations can result in lawsuits and significant damages"
    ]
  },
  "liquidated damages": {
    definition: "Liquidated damages are a predetermined amount of money that must be paid as damages for failure to perform under a contract, when actual damages would be difficult to calculate.",
    example: "A construction contract might include a liquidated damages clause requiring the contractor to pay $1,000 for each day of delay beyond the agreed completion date.",
    implications: [
      "Liquidated damages must be a reasonable estimate of actual damages",
      "If deemed a penalty rather than reasonable estimate, courts may not enforce them",
      "They provide certainty about liability for contract breaches"
    ]
  },
  "arbitration clause": {
    definition: "An arbitration clause is a provision in a contract that requires the parties to resolve disputes through arbitration rather than through court litigation.",
    example: "An employment contract might include an arbitration clause requiring any disputes about employment termination to be resolved through binding arbitration.",
    implications: [
      "Arbitration is generally faster and less formal than court litigation",
      "Arbitration decisions are typically binding with limited appeal rights",
      "Some jurisdictions have specific requirements for enforceable arbitration clauses"
    ]
  },
  "statute of limitations": {
    definition: "A statute of limitations is a law that sets the maximum time after an event within which legal proceedings may be initiated.",
    example: "If a state has a 3-year statute of limitations for personal injury claims, someone injured in a car accident must file suit within 3 years of the accident.",
    implications: [
      "Missing the statute of limitations deadline usually bars the claim completely",
      "Different types of claims have different limitation periods",
      "The clock typically starts ticking when the injury is discovered or should have been discovered"
    ]
  }
}

// Add the missing generateFallbackResponse function
function generateFallbackResponse(term: string, reason: string = "API limit") {
  // Check if we have a mock response for this term
  const lowerTerm = term.toLowerCase();
  if (mockResponses[lowerTerm]) {
    return mockResponses[lowerTerm];
  }
  
  // Generate a generic fallback response
  return {
    definition: `${term} is a legal term that refers to concepts in the justice system. (Note: ${reason})`,
    example: `For example, ${term} might apply in situations where...`,
    implications: [
      "Consult legal resources for more specific information",
      "The application of this term may vary by jurisdiction",
      "Consider seeking professional legal advice for your specific situation"
    ]
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const term = (body.term || "").trim()
    
    if (!term) {
      return NextResponse.json(
        { error: "No term provided" }, 
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = term.toLowerCase();
    const cachedResponse = responseCache.get(cacheKey)
    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
      console.log("Returning cached response for:", term)
      return NextResponse.json({ result: cachedResponse.data })
    }

    const apiKey = process.env.OPENAI_API_KEY

    // If no API key, return a generated fallback response
    if (!apiKey) {
      console.log("No API key, returning fallback response for:", term)
      const fallbackResponse = generateFallbackResponse(term, "API not configured")
      // Cache the response
      responseCache.set(cacheKey, {
        data: fallbackResponse,
        timestamp: Date.now()
      })
      return NextResponse.json({ result: fallbackResponse })
    }

    // Validate API key format
    if (!apiKey.startsWith("sk-")) {
      console.error("Invalid API key format")
      return NextResponse.json(
        { error: "Invalid API key format" }, 
        { status: 500 }
      )
    }

    const prompt = `
Explain the legal term "${term}" in plain English. 
Provide a concise definition, a practical example, and 2-3 implications.
Return your response as valid JSON with these keys: 
- definition (string)
- example (string) 
- implications (array of strings)
`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "You are a legal expert. Provide clear, concise explanations of legal terms. Always return valid JSON with definition, example, and implications keys." 
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!openaiRes.ok) {
        const errorText = await openaiRes.text()
        console.error("OpenAI API error:", openaiRes.status, errorText)
        
        if (openaiRes.status === 429) {
          // Rate limit exceeded - return a generated fallback response
          console.log("Rate limit exceeded, returning fallback response for:", term)
          const fallbackResponse = generateFallbackResponse(term, "API rate limit exceeded")
          // Cache the response
          responseCache.set(cacheKey, {
            data: fallbackResponse,
            timestamp: Date.now()
          })
          return NextResponse.json({ result: fallbackResponse })
        }
        
        let errorMsg = "Failed to get explanation"
        if (openaiRes.status === 401) {
          errorMsg = "Invalid API key - please check your OpenAI API key"
        } else if (openaiRes.status >= 500) {
          errorMsg = "OpenAI service is temporarily unavailable"
        }
        
        return NextResponse.json(
          { error: errorMsg, details: errorText }, 
          { status: openaiRes.status }
        )
      }

      const openaiData = await openaiRes.json()
      const content = openaiData.choices?.[0]?.message?.content || "{}"
      
      try {
        const parsed = JSON.parse(content)
        // Cache the successful response
        responseCache.set(cacheKey, {
          data: parsed,
          timestamp: Date.now()
        })
        return NextResponse.json({ result: parsed })
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError)
        // Fallback to a generated response
        const fallbackResponse = generateFallbackResponse(term, "API response parsing failed")
        // Cache the fallback response
        responseCache.set(cacheKey, {
          data: fallbackResponse,
          timestamp: Date.now()
        })
        return NextResponse.json({ result: fallbackResponse })
      }
    } catch (err: any) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        console.error("Request timeout for:", term)
        // Return a generated fallback response on timeout
        const fallbackResponse = generateFallbackResponse(term, "request timeout")
        // Cache the response
        responseCache.set(cacheKey, {
          data: fallbackResponse,
          timestamp: Date.now()
        })
        return NextResponse.json({ result: fallbackResponse })
      }
      throw err
    }
  } catch (err: any) {
    console.error("Unexpected error in explain API:", err)
    
    // Final fallback - return a generated response
    try {
      const body = await req.json()
      const term = (body.term || "unknown term").trim()
      const fallbackResponse = generateFallbackResponse(term, "service temporarily unavailable")
      
      return NextResponse.json({ result: fallbackResponse })
    } catch (parseError) {
      // Ultimate fallback if we can't even parse the request
      return NextResponse.json({ 
        result: {
          definition: "A legal term that refers to concepts in the justice system.",
          example: "In legal practice, this term might be relevant in various contexts.",
          implications: [
            "Consult primary legal sources for authoritative definitions",
            "The application may vary by jurisdiction",
            "Consider seeking advice from a qualified legal professional"
          ]
        }
      })
    }
  }
}
