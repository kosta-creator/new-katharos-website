// Analytics - Privacy-friendly Plausible.io (GDPR compliant)
// Replace with your actual domain when deploying

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    ;(window as any).plausible('pageview', { u: url })
  }
}

export function trackEvent(eventName: string, props?: Record<string, string>) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    ;(window as any).plausible(eventName, { props })
  }
}

// Track specific interactions
export function trackPhilosopherClick(agentName: string) {
  trackEvent('Philosopher Click', { agent: agentName })
}

export function trackEmailSubmit(success: boolean) {
  trackEvent('Email Submit', { success: success.toString() })
}

export function trackCTAClick() {
  trackEvent('CTA Click')
}
