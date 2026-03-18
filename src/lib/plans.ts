export interface Plan {
  id: string;
  name: string;
  price: number;
  gmailLimit: number | "unlimited";
  duration: string;
  features: string[];
  popular?: boolean;
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 3.5,
    gmailLimit: 50,
    duration: "30 days",
    features: [
      "Create up to 50 Gmail accounts",
      "Custom first & last names",
      "Recovery email support",
      "Custom passwords",
      "30-day access",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 10,
    gmailLimit: 450,
    duration: "60 days",
    features: [
      "Create up to 450 Gmail accounts",
      "Custom first & last names",
      "Recovery email support",
      "Custom passwords",
      "60-day access",
      "Priority email support",
      "Bulk creation mode",
    ],
    popular: true,
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: 55,
    gmailLimit: "unlimited",
    duration: "Lifetime",
    features: [
      "Unlimited Gmail accounts",
      "Custom first & last names",
      "Recovery email support",
      "Custom passwords",
      "Lifetime access",
      "24/7 priority support",
      "Bulk creation mode",
      "API access (coming soon)",
    ],
  },
];

export interface UserPlan {
  planId: string | null;
  accountsCreated: number;
  txId: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
}

export function getDefaultUserPlan(): UserPlan {
  return {
    planId: null,
    accountsCreated: 0,
    txId: null,
    activatedAt: null,
    expiresAt: null,
  };
}

export function getUserPlan(): UserPlan {
  const stored = localStorage.getItem("userPlan");
  return stored ? JSON.parse(stored) : getDefaultUserPlan();
}

export function saveUserPlan(plan: UserPlan) {
  localStorage.setItem("userPlan", JSON.stringify(plan));
}

export function canCreateAccount(userPlan: UserPlan): boolean {
  if (!userPlan.planId) return false;
  const plan = plans.find((p) => p.id === userPlan.planId);
  if (!plan) return false;
  if (plan.gmailLimit === "unlimited") return true;
  return userPlan.accountsCreated < plan.gmailLimit;
}

export function getRemainingAccounts(userPlan: UserPlan): number | "unlimited" {
  if (!userPlan.planId) return 0;
  const plan = plans.find((p) => p.id === userPlan.planId);
  if (!plan) return 0;
  if (plan.gmailLimit === "unlimited") return "unlimited";
  return Math.max(0, plan.gmailLimit - userPlan.accountsCreated);
}
