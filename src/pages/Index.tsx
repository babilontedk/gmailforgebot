import { Link } from "react-router-dom";
import { ArrowRight, Mail, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import { plans } from "@/lib/plans";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Zap,
    title: "Instant Creation",
    description: "Create Gmail accounts in seconds with our streamlined process.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and never shared with third parties.",
  },
  {
    icon: Users,
    title: "Bulk Support",
    description: "Create hundreds of accounts efficiently with our bulk mode.",
  },
  {
    icon: Mail,
    title: "Full Customization",
    description: "Set custom names, passwords, and recovery emails for each account.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(175 80% 50%) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <Zap className="w-3 h-3" /> Trusted by 10,000+ users worldwide
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Create Gmail Accounts
            <br />
            <span className="text-gradient-primary">At Scale</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The fastest and most reliable Gmail account creator. Custom names, passwords, recovery emails — all in one dashboard.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pricing">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity text-base px-8 shadow-glow">
                View Plans <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary transition-colors text-base px-8">
                Open Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why GmailForge?</h2>
            <p className="mt-3 text-muted-foreground">Everything you need to create Gmail accounts efficiently.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors shadow-card group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 bg-muted/20" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-muted-foreground">One-time payment. No recurring fees. Pay with crypto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-gradient-card rounded-2xl p-10 border border-border shadow-card">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">Choose a plan and start creating Gmail accounts in minutes.</p>
            <Link to="/pricing">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow px-8">
                Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
