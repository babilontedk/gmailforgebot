import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Refund = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Refund Policy</h1>
        <div className="space-y-6 text-sm text-secondary-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Refund Eligibility</h2>
            <p>Due to the digital nature of our service, all sales are final. Refunds are only issued if the service fails to deliver as described.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. How to Request a Refund</h2>
            <p>To request a refund, contact support@gmailforge.com with your TxID and a description of the issue within 7 days of purchase.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Processing Time</h2>
            <p>Approved refunds will be processed within 5-7 business days to the original payment method (cryptocurrency wallet).</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Non-Refundable Cases</h2>
            <p>Refunds will not be issued for: used account quotas, plan downgrades, or issues caused by third-party services.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Refund;
