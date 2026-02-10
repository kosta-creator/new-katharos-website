// Simple email storage - replace with real service in production
const EMAIL_STORE: string[] = []

export async function submitEmail(email: string): Promise<{ success: boolean; message: string }> {
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address' }
  }
  
  // Check if already subscribed
  if (EMAIL_STORE.includes(email.toLowerCase())) {
    return { success: true, message: 'You are already on the list' }
  }
  
  // Store email (replace with actual API call)
  EMAIL_STORE.push(email.toLowerCase())
  console.log('New subscriber:', email)
  console.log('Total subscribers:', EMAIL_STORE.length)
  
  // In production, send to:
  // - ConvertKit
  // - Mailchimp
  // - SendGrid
  // - Your backend
  
  return { 
    success: true, 
    message: 'Welcome to the temple. Check your inbox for the path forward.' 
  }
}

export function getSubscriberCount(): number {
  return EMAIL_STORE.length
}
