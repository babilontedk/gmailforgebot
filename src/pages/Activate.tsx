import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Copy, CheckCircle2, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { plans, saveUserPlan, getUserPlan } from "@/lib/plans";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SUPPORTED_CURRENCIES = [
  { label: "BTC", value: "btc" },
  { label: "ETH", value: "eth" },
  { label: "USDT (TRC20)", value: "usdttrc20" },
  { label: "LTC", value: "ltc" },
  { label: "TRX", value: "trx" },
  { label: "SOL", value: "sol" },
  { label: "BNB (BSC)", value: "bnbbsc" },
  { label: "DOGE", value: "doge" },
];

const Activate = () => {
  const [searchParams] = useSearchParams();
  const selectedPlanId = searchParams.get("plan") || "";
  const [planId, setPlanId] = useState(selectedPlanId);
  const [payCurrency, setPayCurrency] = useState("btc");
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [activated, setActivated] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { toast } = useToast();

  const currentPlan = getUserPlan();
  const selectedPlan = plans.find((p) => p.id === planId);

  // Create a payment via NOWPayments
  const handleCreatePayment = async () => {
    if (!planId || !selectedPlan) {
      toast({ title: "Select a Plan", description: "Please select a plan first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("nowpayments", {
        body: {
          action: "create-payment",
          price_amount: selectedPlan.price,
          order_id: `${planId}-${Date.now()}`,
          order_description: `${selectedPlan.name} Plan`,
          pay_currency: payCurrency,
        },
      });

      if (error) throw error;

      if (data?.payment_id) {
        setPaymentData(data);
        toast({ title: "Payment Created", description: "Send the exact amount to the address shown below." });
      } else {
        throw new Error(data?.message || "Failed to create payment");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Could not create payment.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Check payment status
  const handleCheckStatus = async () => {
    if (!paymentData?.payment_id) return;

    setCheckingStatus(true);
    try {
      const { data, error } = await supabase.functions.invoke("nowpayments", {
        body: {
          action: "payment-status",
          payment_id: paymentData.payment_id,
        },
      });

      if (error) throw error;

      const status = data?.payment_status;

      if (status === "finished" || status === "confirmed") {
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
          txId: String(paymentData.payment_id),
          activatedAt: now.toISOString(),
          expiresAt,
        });

        setActivated(true);
        toast({ title: "Plan Activated!", description: `Your ${plan.name} plan is now active.` });
      } else if (status === "waiting" || status === "confirming" || status === "sending") {
        toast({ title: "Payment Pending", description: `Status: ${status}. Please wait for confirmation.` });
      } else if (status === "failed" || status === "expired") {
        toast({ title: "Payment Failed", description: `Status: ${status}. Please create a new payment.`, variant: "destructive" });
        setPaymentData(null);
      } else {
        toast({ title: "Status Update", description: `Current status: ${status || "unknown"}` });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Could not check status.", variant: "destructive" });
    } finally {
      setCheckingStatus(false);
    }
  };

  // Auto-check status every 30 seconds when payment is pending
  useEffect(() => {
    if (!paymentData?.payment_id || activated) return;
    const interval = setInterval(handleCheckStatus, 30000);
    return () => clearInterval(interval);
  }, [paymentData, activated]);

  const copyAddress = () => {
    if (paymentData?.pay_address) {
      navigator.clipboard.writeText(paymentData.pay_address);
      toast({ title: "Copied!", description: "Payment address copied to clipboard." });
    }
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
                  <span className="block text-xs font-mono text-muted-foreground mt-2">Payment ID: {currentPlan.txId}</span>
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
          <p className="text-muted-foreground mb-8">Pay with crypto via NOWPayments — fast and secure.</p>

          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card space-y-6">
            {/* Step 1: Select Plan */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">1. Select Plan</Label>
              <div className="grid grid-cols-1 gap-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => { setPlanId(plan.id); setPaymentData(null); }}
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

            {/* Step 2: Select Currency & Create Payment */}
            {selectedPlan && !paymentData && (
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">2. Select crypto & pay</Label>
                <div className="grid grid-cols-4 gap-2">
                  {SUPPORTED_CURRENCIES.map((cur) => (
                    <button
                      key={cur.value}
                      type="button"
                      onClick={() => setPayCurrency(cur.value)}
                      className={`rounded-lg py-2 px-3 text-xs font-bold uppercase border transition-all ${
                        payCurrency === cur.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {cur.label}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleCreatePayment}
                  disabled={loading}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Payment...</>
                  ) : (
                    `Pay $${selectedPlan.price} with ${payCurrency.toUpperCase()}`
                  )}
                </Button>
              </div>
            )}

            {/* Step 3: Payment Details */}
            {paymentData && (
              <div className="space-y-4">
                <Label className="text-sm text-muted-foreground">3. Send the exact amount</Label>
                
                <div className="bg-muted rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Amount</span>
                    <span className="font-bold text-foreground font-mono">
                      {paymentData.pay_amount} {paymentData.pay_currency?.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Send to address</span>
                    <div className="flex items-center gap-2 bg-background rounded-lg p-3">
                      <code className="text-xs text-foreground flex-1 break-all font-mono">
                        {paymentData.pay_address}
                      </code>
                      <Button size="sm" variant="ghost" onClick={copyAddress} className="shrink-0 text-primary hover:text-primary/80">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Payment ID</span>
                    <span className="font-mono text-foreground">{paymentData.payment_id}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-mono text-primary">{paymentData.payment_status || "waiting"}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckStatus}
                  disabled={checkingStatus}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  {checkingStatus ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Check Payment Status</>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Status auto-checks every 30 seconds. Your plan activates instantly once payment is confirmed.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Activate;
