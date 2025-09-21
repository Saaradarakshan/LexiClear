// app/api/simplify/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // Mock implementation for now
    const simplifiedText = `Simplified version of your document:
    
ABC Company (“Disclosing Party”) and XYZ Consultant (“Receiving Party”) agree to keep certain information private. The Receiving Party promises to keep the shared confidential information secret and use it only for the benefit of ABC Company, not for personal gain or sharing with others.`;

    return NextResponse.json({ simplified: simplifiedText });
  } catch (error: any) {
    console.error("Error in document simplification:", error);
    return NextResponse.json(
      { error: "Failed to simplify document", details: error.message },
      { status: 500 }
    );
  }
}