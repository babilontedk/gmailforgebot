import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/lib/plans";

interface PricingCardProps {
  plan: Plan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  return (
    <div
      className={`relative rounded-2xl p-[1px] transition-all duration-300 hover:scale-[1.02] ${
        plan.popular
          ? "bg-gradient-primary shadow-glow animate-pulse-glow"
          : "bg-border hover:bg-gradient-primary/50"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Most Popular
          </span>
        </div>
      )}

      <div className="bg-card rounded-2xl p-6 md:p-8 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gradient-primary">${plan.price}</span>
          <span className="text-muted-foreground text-sm">/ one-time</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-medium text-primary">
            {plan.gmailLimit === "unlimited" ? "Unlimited" : `Up to ${plan.gmailLimit}`} accounts
          </span>
          <span className="text-xs text-muted-foreground">• {plan.duration}</span>
        </div>

        <div className="mt-6 flex-1">
          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-secondary-foreground">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Link to={`/activate?plan=${plan.id}`} className="mt-8 block">
          <Button
            className={`w-full font-semibold transition-opacity hover:opacity-90 ${
              plan.popular
                ? "bg-gradient-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Get {plan.name}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;
