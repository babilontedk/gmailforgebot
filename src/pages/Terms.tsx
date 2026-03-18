import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-3xl prose-invert">
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
        <div className="space-y-6 text-sm text-secondary-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using GmailForge, you accept and agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Service Description</h2>
            <p>GmailForge provides tools for creating Gmail accounts. The service is provided on a subscription basis with different tiers offering varying account creation limits.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. User Responsibilities</h2>
            <p>Users are solely responsible for how they use the accounts created through our service. Users must comply with Google's Terms of Service and all applicable laws.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Payment & Billing</h2>
            <p>All payments are one-time and processed through cryptocurrency. Plans are activated upon TxID verification. Prices are in USD equivalent.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Account Limits</h2>
            <p>Each plan has specific account creation limits. Exceeding these limits requires upgrading to a higher-tier plan.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Disclaimer</h2>
            <p>The service is provided "as is" without warranties of any kind. We are not responsible for any actions taken by users with accounts created through our platform.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
            <p>GmailForge shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the modified terms.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
