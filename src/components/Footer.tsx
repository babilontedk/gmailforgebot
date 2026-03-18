import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-muted/30">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">GmailForge</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The fastest way to create Gmail accounts at scale. Trusted by thousands.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Product</h4>
          <div className="flex flex-col gap-2">
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/activate" className="text-sm text-muted-foreground hover:text-primary transition-colors">Activate Plan</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Legal</h4>
          <div className="flex flex-col gap-2">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Support</h4>
          <div className="flex flex-col gap-2">
            <a href="mailto:support@gmailforge.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Email Support</a>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} GmailForge. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
