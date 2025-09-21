// app/simplify/page.tsx
"use client";

import { useState } from "react";
import { FileText, Sparkles, Download, Copy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Head from "next/head";

export default function SimplifyPage() {
  const [documentText, setDocumentText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimplify = async () => {
    if (!documentText.trim()) {
      setError("Please paste a legal document to simplify");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: documentText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to simplify document");
      }

      setSimplifiedText(data.simplified);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(simplifiedText);
  };

  const handleDownload = () => {
    const blob = new Blob([simplifiedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simplified-document.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>Simplify Legal Documents | Legal AI Assistant</title>
        <meta name="description" content="Simplify complex legal documents into easy-to-understand language using AI" />
      </Head>
      
      <div className="min-h-screen px-6 lg:px-8 py-12 bg-background text-foreground">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="bg-white/5 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Simplify Legal Documents</h1>
                <p className="text-sm text-muted-foreground">
                  Paste any legal document and get a simplified, easy-to-understand version.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="document" className="block text-sm font-medium mb-2">
                    Legal Document Text
                  </label>
                  <textarea
                    id="document"
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    placeholder="Paste your legal document here..."
                    className="w-full h-64 rounded-md border border-white/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  />
                </div>

                <button
                  onClick={handleSimplify}
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Simplifying...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Simplify Document</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="text-red-400 p-3 bg-red-400/10 rounded-md">
                    {error}
                  </div>
                )}
              </div>

              {/* Output Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="simplified" className="block text-sm font-medium">
                    Simplified Version
                  </label>
                  
                  {simplifiedText && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-md hover:bg-white/5"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 rounded-md hover:bg-white/5"
                        title="Download as text file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <div
                    className="w-full h-64 rounded-md border border-white/10 bg-transparent px-4 py-3 overflow-y-auto"
                  >
                    {simplifiedText ? (
                      <div className="whitespace-pre-wrap">{simplifiedText}</div>
                    ) : (
                      <div className="text-muted-foreground">
                        Your simplified document will appear here...
                      </div>
                    )}
                  </div>
                  
                  {loading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="font-semibold text-lg mb-2">How It Works</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>1. Paste your legal document into the input box</li>
                <li>2. Click "Simplify Document" to process it with AI</li>
                <li>3. Review the simplified version in plain English</li>
                <li>4. Copy or download the result for your records</li>
              </ul>
              
              <div className="text-xs text-muted-foreground mt-4 p-3 bg-white/5 rounded-md">
                <strong>Disclaimer:</strong> This AI-powered simplification is for informational purposes only and may not capture all legal nuances. It does not constitute legal advice. Always consult with a qualified attorney for legal matters.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}