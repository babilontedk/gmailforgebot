import PricingCard from "@/components/PricingCard";
import { plans } from "@/lib/plans";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pricing = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">Choose Your Plan</h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            One-time crypto payment. Instant activation after TxID verification. No recurring fees.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Pricing;
