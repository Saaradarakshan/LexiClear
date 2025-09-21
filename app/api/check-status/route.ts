// app/api/check-status/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    let status = {
      status: 'error',
      message: '',
      keyExists: false,
      keyFormat: false,
      apiAccess: false
    }

    // Check if API key exists
    if (!apiKey) {
      status.status = 'no-key'
      status.message = 'OPENAI_API_KEY not found in environment variables'
      return NextResponse.json(status)
    }
    
    status.keyExists = true

    // Check if API key has correct format
    const isValidFormat = apiKey.startsWith("sk-")
    status.keyFormat = isValidFormat
    
    if (!isValidFormat) {
      status.status = 'error'
      status.message = 'API key format is incorrect (should start with sk-)'
      return NextResponse.json(status)
    }

    // Test the API key with a simple request
    try {
      const testRes = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
        // Add timeout to avoid hanging
        signal: AbortSignal.timeout(5000)
      })
      
      if (testRes.status === 401) {
        status.status = 'error'
        status.message = 'Invalid API key - authentication failed'
        return NextResponse.json(status)
      }
      
      if (!testRes.ok) {
        status.status = 'error'
        status.message = `API test failed with status: ${testRes.status}`
        return NextResponse.json(status)
      }
      
      status.status = 'success'
      status.message = 'API key is valid and working'
      status.apiAccess = true
      return NextResponse.json(status)
      
    } catch (testError: any) {
      if (testError.name === 'TimeoutError') {
        status.status = 'error'
        status.message = 'API test timed out - check your network connection'
      } else {
        status.status = 'error'
        status.message = `API test failed: ${testError.message}`
      }
      return NextResponse.json(status)
    }
    
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      message: error.message || 'Unknown error checking API status',
      keyExists: false,
      keyFormat: false,
      apiAccess: false
    })
  }
}