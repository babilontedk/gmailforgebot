import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GmailCreatorForm from "@/components/GmailCreatorForm";

const Dashboard = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Gmail Creator</h1>
        <p className="text-muted-foreground mb-8">Fill in the details below to create a new Gmail account.</p>
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card">
          <GmailCreatorForm />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Dashboard;
