import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const Index = () => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-xl">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
            Get AI Automation Tailored to Your Business
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us a bit about your workflow — we'll review it and reach out within 24 hours.
          </p>
        </header>

        {/* Form Card */}
        <article className="bg-card rounded-xl shadow-soft p-6 sm:p-10">
          <LeadCaptureForm />
        </article>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Your information is secure and will never be shared.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
