import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Katharos Systems | Truth as a Service',
  description: 'Experience purity from chaos. Multi-agent AI debate system forging truth through sacred conflict. Seven minds. One truth.',
  keywords: 'AI ethics, multi-agent debate, bias detection, scam prevention, AI consensus, Socratic method, truth verification',
  authors: [{ name: 'Katharos Systems' }],
  openGraph: {
    title: 'Katharos Systems | Truth as a Service',
    description: 'Experience purity from chaos. Seven minds debate to forge truth.',
    url: 'https://katharossystems.ai',
    siteName: 'Katharos Systems',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Katharos Systems | Truth as a Service',
    description: 'Experience purity from chaos. Seven minds debate to forge truth.',
    creator: '@katharosai',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
