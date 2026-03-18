import { useState } from "react";
import { Mail, User, Lock, ShieldCheck, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getUserPlan, saveUserPlan, canCreateAccount, getRemainingAccounts } from "@/lib/plans";
import { Link } from "react-router-dom";

interface CreatedAccount {
  firstName: string;
  lastName: string;
  email: string;
  recoveryEmail: string;
  password: string;
  createdAt: string;
}

const GmailCreatorForm = () => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createdAccounts, setCreatedAccounts] = useState<CreatedAccount[]>(() => {
    const stored = localStorage.getItem("createdAccounts");
    return stored ? JSON.parse(stored) : [];
  });

  const userPlan = getUserPlan();
  const hasActivePlan = !!userPlan.planId;
  const remaining = getRemainingAccounts(userPlan);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasActivePlan) {
      toast({
        title: "No Active Plan",
        description: "Please activate a plan before creating Gmail accounts.",
        variant: "destructive",
      });
      return;
    }

    if (!canCreateAccount(userPlan)) {
      toast({
        title: "Limit Reached",
        description: "You have reached your account creation limit. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    const newAccount: CreatedAccount = {
      firstName,
      lastName,
      email: email.includes("@") ? email : `${email}@gmail.com`,
      recoveryEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    const updated = [...createdAccounts, newAccount];
    setCreatedAccounts(updated);
    localStorage.setItem("createdAccounts", JSON.stringify(updated));

    const updatedPlan = { ...userPlan, accountsCreated: userPlan.accountsCreated + 1 };
    saveUserPlan(updatedPlan);

    toast({
      title: "Account Created!",
      description: `Gmail account ${newAccount.email} has been queued for creation.`,
    });

    setFirstName("");
    setLastName("");
    setEmail("");
    setRecoveryEmail("");
    setPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className={`rounded-xl p-4 flex items-center justify-between ${hasActivePlan ? "bg-muted border border-primary/20" : "bg-destructive/10 border border-destructive/30"}`}>
        <div className="flex items-center gap-3">
          {hasActivePlan ? (
            <ShieldCheck className="w-5 h-5 text-primary" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-destructive" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {hasActivePlan ? `Plan Active — ${remaining === "unlimited" ? "Unlimited" : remaining} accounts remaining` : "No Active Plan"}
            </p>
            <p className="text-xs text-muted-foreground">
              {hasActivePlan
                ? `${userPlan.accountsCreated} accounts created so far`
                : "Activate a plan to start creating Gmail accounts"}
            </p>
          </div>
        </div>
        {!hasActivePlan && (
          <Link to="/pricing">
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              View Plans
            </Button>
          </Link>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleCreate} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm text-muted-foreground">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="pl-10 bg-muted border-border focus:border-primary"
                required
                disabled={!hasActivePlan}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm text-muted-foreground">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="pl-10 bg-muted border-border focus:border-primary"
                required
                disabled={!hasActivePlan}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">Gmail Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              className="pl-10 bg-muted border-border focus:border-primary"
              required
              disabled={!hasActivePlan}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recovery" className="text-sm text-muted-foreground">Recovery Email</Label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="recovery"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="recovery@example.com"
              className="pl-10 bg-muted border-border focus:border-primary"
              required
              disabled={!hasActivePlan}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Strong password"
              className="pl-10 bg-muted border-border focus:border-primary"
              required
              minLength={8}
              disabled={!hasActivePlan}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={!hasActivePlan}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          {hasActivePlan ? "Create Gmail Account" : "Activate Plan First"}
        </Button>
      </form>

      {/* Created accounts list */}
      {createdAccounts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recently Created ({createdAccounts.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {createdAccounts.slice().reverse().map((acc, i) => (
              <div key={i} className="bg-muted rounded-lg p-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-foreground">{acc.email}</p>
                  <p className="text-xs text-muted-foreground">{acc.firstName} {acc.lastName}</p>
                </div>
                <span className="text-xs text-primary font-mono">
                  {new Date(acc.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailCreatorForm;
