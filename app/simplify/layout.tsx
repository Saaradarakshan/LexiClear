// app/layout.tsx (or app/simplify/layout.tsx if it exists)
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Legal AI Assistant</title>
        <meta name="description" content="Simplify legal documents with AI" />
        {/* Make sure all elements have unique keys if you're mapping */}
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
}