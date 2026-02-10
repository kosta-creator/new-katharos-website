'use client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function LegalModal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A2E] border border-[#C9A84C] p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#C4BEB5] hover:text-[#C9A84C] transition-colors"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold text-[#C9A84C] mb-6">{title}</h2>
        <div className="text-[#C4BEB5] space-y-4 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export function PrivacyPolicyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <LegalModal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <p>
        <strong>Last Updated:</strong> February 2026
      </p>
      <p>
        Katharos Systems values your privacy. This Privacy Policy explains how we collect, 
        use, and protect your personal information.
      </p>
      <h3 className="text-xl font-bold text-[#E8913A] mt-4">Information We Collect</h3>
      <p>
        We collect only your email address when you voluntarily subscribe to our beta waitlist. 
        We do not collect any other personal information automatically.
      </p>
      <h3 className="text-xl font-bold text-[#E8913A] mt-4">How We Use Your Information</h3>
      <p>
        Your email is used solely to send you updates about Katharos Systems, including beta 
        access invitations and product announcements. We will never sell or share your email 
        with third parties.
      </p>
      <h3 className="text-xl font-bold text-[#E8913A] mt-4">Analytics</h3>
      <p>
        We use privacy-friendly analytics (Plausible) that does not use cookies or track 
        personal information. No data leaves your browser that could identify you.
      </p>
      <h3 className="text-xl font-bold text-[#E8913A] mt-4">Contact</h3>
      <p>
        For privacy questions, contact us at team@katharos.systems
      </p>
    </LegalModal>
  )
}

export function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <LegalModal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <p>
        <strong>Last Updated:</strong> February 2026
      </p>
      <p>
        By accessing and using the Katharos Systems website, you accept and agree to be bound 
        by the terms and provisions of this agreement.
      </p>
      <h3 className="text-xl font-bold text-[#E8913A] mt-4">Use License</h3>
      <p>
        Permission is granted to temporarily access the materials on Katharos Systems' website 
        for personal, non-commercial transitory viewing only.
      </p>
      <h3 className="text-xl font-bold text-[#E8913A] mt-4">Disclaimer</h3>
      <p>
        The materials on Katharos Systems' website are provided on an 'as is' basis. 
        Katharos Systems makes no warranties, expressed or implied, and hereby disclaims 
        and negates all other warranties including, without limitation, implied warranties 
        or conditions of merchantability, fitness for a particular purpose, or non-infringement 
        of intellectual property or other violation of rights.
      </p>
      <h3 className="text-xl font-bold text-[#E8913A] mt-4">Contact</h3>
      <p>
        For questions about these Terms, contact team@katharos.systems
      </p>
    </LegalModal>
  )
}
