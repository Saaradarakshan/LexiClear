// app/debug/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Key, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState({
    status: 'checking',
    message: 'Checking API configuration...',
    keyExists: false,
    keyFormat: false,
    apiAccess: false
  })
  const [loading, setLoading] = useState(true)

  const checkApiStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/check-status')
      const data = await response.json()
      setApiStatus(data)
    } catch (error) {
      setApiStatus({
        status: 'error',
        message: 'Failed to connect to API endpoint',
        keyExists: false,
        keyFormat: false,
        apiAccess: false
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  const StatusIcon = ({ status }: { status: boolean }) => 
    status ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Key className="w-8 h-8" />
          API Key Debugger
        </h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="font-semibold text-lg mb-2">How to Fix API Key Issues</h2>
          <ol className="list-decimal ml-5 space-y-2 text-sm">
            <li>Get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-600 underline">OpenAI</a></li>
            <li>Create a <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file in your project root</li>
            <li>Add this line: <code className="bg-gray-100 px-1 py-0.5 rounded">OPENAI_API_KEY=your_key_here</code></li>
            <li>Restart your development server</li>
            <li>Check the status below</li>
          </ol>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">API Status Check</h2>
          <button 
            onClick={checkApiStatus}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3">Checking API status...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              apiStatus.status === 'success' ? 'bg-green-50 border-green-200' :
              apiStatus.status === 'error' ? 'bg-red-50 border-red-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {apiStatus.status === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                 apiStatus.status === 'error' ? <XCircle className="w-5 h-5 text-red-500" /> :
                 <AlertCircle className="w-5 h-5 text-yellow-500" />}
                <span className="font-semibold">Overall Status: {apiStatus.status}</span>
              </div>
              <p>{apiStatus.message}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon status={apiStatus.keyExists} />
                  <span className="font-medium">Key Exists</span>
                </div>
                <p className="text-sm text-gray-600">API key found in environment variables</p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon status={apiStatus.keyFormat} />
                  <span className="font-medium">Valid Format</span>
                </div>
                <p className="text-sm text-gray-600">API key format is correct (starts with sk-)</p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon status={apiStatus.apiAccess} />
                  <span className="font-medium">API Access</span>
                </div>
                <p className="text-sm text-gray-600">Can connect to OpenAI API</p>
              </div>
            </div>

            {apiStatus.status !== 'success' && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mt-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Steps</h3>
                <ul className="list-disc ml-5 text-sm text-yellow-700 space-y-1">
                  {!apiStatus.keyExists && <li>Make sure your .env.local file is in the root directory</li>}
                  {!apiStatus.keyExists && <li>Verify the file is named exactly <code>.env.local</code></li>}
                  {!apiStatus.keyFormat && <li>Ensure your API key starts with "sk-"</li>}
                  {!apiStatus.keyFormat && <li>Check for typos or extra spaces in your API key</li>}
                  {!apiStatus.apiAccess && <li>Verify your OpenAI account has API access</li>}
                  {!apiStatus.apiAccess && <li>Check if your API key has expired or been revoked</li>}
                  {!apiStatus.apiAccess && <li>Ensure your account has sufficient credits</li>}
                  <li>Restart your development server after making changes</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}