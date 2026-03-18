import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-secondary-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>We collect only the information necessary to provide our service: account creation details (names, emails, passwords) and payment transaction IDs.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>Your information is used solely for the purpose of creating Gmail accounts as requested and managing your subscription.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Data Storage</h2>
            <p>Account creation data is stored locally in your browser. We do not store your passwords or personal information on our servers.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Third-Party Services</h2>
            <p>We use NOWPayments for payment processing. Their privacy policy governs the handling of payment data.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Contact</h2>
            <p>For privacy-related inquiries, contact us at support@gmailforge.com.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
