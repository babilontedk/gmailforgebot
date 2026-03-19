import { useState, useEffect } from "react";
import { Copy, Users, Gift, User, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ReferralUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

const Referrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referredBy, setReferredBy] = useState<ReferralUser | null>(null);
  const [referredUsers, setReferredUsers] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchReferralData();
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get own profile with referral code
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code, referred_by")
        .eq("id", user.id)
        .single();

      if (profile) {
        setReferralCode(profile.referral_code);

        // Get who referred me
        if (profile.referred_by) {
          const { data: referrer } = await supabase
            .from("profiles")
            .select("id, email, full_name, created_at")
            .eq("id", profile.referred_by)
            .single();
          if (referrer) setReferredBy(referrer as ReferralUser);
        }
      }

      // Get people I referred
      const { data: myReferrals } = await supabase
        .from("referrals")
        .select("referred_id, created_at")
        .eq("referrer_id", user.id);

      if (myReferrals && myReferrals.length > 0) {
        const ids = myReferrals.map((r) => r.referred_id);
        const { data: users } = await supabase
          .from("profiles")
          .select("id, email, full_name, created_at")
          .in("id", ids);

        if (users) setReferredUsers(users as ReferralUser[]);
      }
    } catch (err: any) {
      console.error("Error fetching referral data:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: "Copied!", description: "Referral code copied to clipboard." });
  };

  const copyLink = () => {
    const link = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-accent mb-4">
              <Gift className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Referral Program</h1>
            <p className="text-muted-foreground mt-1"> earn 0.50$ and 0.01 per sign up.Share your code and grow the community</p>
          </div>

          {/* Your Referral Code */}
          <div className="bg-card rounded-2xl border border-primary/30 p-6 md:p-8 shadow-card shadow-glow mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Your Unique Referral Code</h2>
            <div className="flex items-center gap-3 bg-muted rounded-xl p-4 mb-4">
              <code className="text-xl md:text-2xl font-bold text-primary font-mono flex-1 tracking-widest">
                {referralCode}
              </code>
              <Button size="sm" variant="ghost" onClick={copyCode} className="text-primary hover:text-primary/80">
                <Copy className="w-5 h-5" />
              </Button>
            </div>
            <Button onClick={copyLink} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Share2 className="w-4 h-4 mr-2" /> Copy Referral Link
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{referredUsers.length}</p>
              <p className="text-xs text-muted-foreground">People Referred</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card text-center">
              <User className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{referredBy ? "Yes" : "None"}</p>
              <p className="text-xs text-muted-foreground">Referred By</p>
            </div>
          </div>

          {/* Referred By */}
          {referredBy && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> You Were Referred By
              </h2>
              <div className="flex items-center gap-3 bg-muted rounded-xl p-4">
                <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                  {(referredBy.full_name || referredBy.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{referredBy.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{referredBy.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* People You Referred */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> People You Referred ({referredUsers.length})
            </h2>
            {referredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No referrals yet. Share your code to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referredUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 bg-muted rounded-xl p-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {(u.full_name || u.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{u.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Referrals;
