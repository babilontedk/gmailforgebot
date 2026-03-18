import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Copy, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { plans, saveUserPlan, getUserPlan } from "@/lib/plans";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Placeholder wallet address — replace with your real one
const WALLET_ADDRESS = "YOUR_CRYPTO_WALLET_ADDRESS_HERE";

// Placeholder NOWPayments API integration
// Replace with actual NOWPayments API call
const verifyPayment = async (_txId: string): Promise<boolean> => {
  // TODO: Integrate with NOWPayments API
  // const response = await fetch('https://api.nowpayments.io/v1/payment/status', { ... })
  // For now, accept all TxIDs as valid (placeholder)
  return true;
};

const Activate = () => {
  const [searchParams] = useSearchParams();
  const selectedPlanId = searchParams.get("plan") || "";
  const [planId, setPlanId] = useState(selectedPlanId);
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);
  const { toast } = useToast();

  const currentPlan = getUserPlan();
  const selectedPlan = plans.find((p) => p.id === planId);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId || !txId.trim()) {
      toast({ title: "Missing Info", description: "Please select a plan and enter your TxID.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const valid = await verifyPayment(txId);
      if (valid) {
        const plan = plans.find((p) => p.id === planId)!;
        const now = new Date();
        let expiresAt: string | null = null;
        if (plan.duration !== "Lifetime") {
          const days = parseInt(plan.duration);
          const exp = new Date(now);
          exp.setDate(exp.getDate() + days);
          expiresAt = exp.toISOString();
        }

        saveUserPlan({
          planId,
          accountsCreated: 0,
          txId,
          activatedAt: now.toISOString(),
          expiresAt,
        });

        setActivated(true);
        toast({ title: "Plan Activated!", description: `Your ${plan.name} plan is now active.` });
      }
    } catch {
      toast({ title: "Error", description: "Could not verify payment. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
  };

  if (activated || currentPlan.planId) {
    const activePlan = plans.find((p) => p.id === (currentPlan.planId || planId));
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-lg text-center">
            <div className="bg-card rounded-2xl border border-primary/30 p-8 shadow-card shadow-glow">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Plan Active!</h1>
              <p className="text-muted-foreground mb-6">
                Your <span className="text-primary font-semibold">{activePlan?.name}</span> plan is active.
                {currentPlan.txId && (
                  <span className="block text-xs font-mono text-muted-foreground mt-2">TxID: {currentPlan.txId}</span>
                )}
              </p>
              <Link to="/dashboard">
                <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Activate Your Plan</h1>
          <p className="text-muted-foreground mb-8">Send your payment and paste the Transaction ID below.</p>

          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card space-y-6">
            {/* Step 1: Select Plan */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">1. Select Plan</Label>
              <div className="grid grid-cols-1 gap-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setPlanId(plan.id)}
                    className={`text-left rounded-xl p-4 border transition-all ${
                      planId === plan.id
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "border-border bg-muted hover:border-primary/40"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{plan.name}</span>
                      <span className="text-primary font-bold">${plan.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {plan.gmailLimit === "unlimited" ? "Unlimited" : plan.gmailLimit} accounts • {plan.duration}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Payment */}
            {selectedPlan && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">2. Send ${selectedPlan.price} to this wallet</Label>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                  <code className="text-xs text-foreground flex-1 break-all font-mono">{WALLET_ADDRESS}</code>
                  <Button size="sm" variant="ghost" onClick={copyWallet} className="shrink-0 text-primary hover:text-primary/80">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported: BTC, ETH, USDT, LTC and more via NOWPayments
                </p>
              </div>
            )}

            {/* Step 3: TxID */}
            <form onSubmit={handleActivate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="txid" className="text-sm text-muted-foreground">3. Paste your Transaction ID (TxID)</Label>
                <Input
                  id="txid"
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  placeholder="e.g. 0x1a2b3c4d5e6f..."
                  className="bg-muted border-border focus:border-primary font-mono text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !planId || !txId.trim()}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
              >
                {loading ? "Verifying..." : "Activate Plan"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Activate;
