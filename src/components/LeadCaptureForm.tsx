import { useState } from "react";
import { z } from "zod";
import { Check } from "lucide-react";

// Validation schema
const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().min(1, "Company name is required").max(100),
  phone: z.string().trim().max(20).optional(),
  companySize: z.string().min(1, "Please select company size"),
  automationGoal: z.string().trim().min(1, "Please describe what you want to automate").max(500),
  currentWorkflow: z.string().min(1, "Please select an option"),
  urgency: z.string().min(1, "Please select urgency"),
});

type FormData = z.infer<typeof formSchema>;

type FormErrors = Partial<Record<keyof FormData, string>>;

const companySizeOptions = [
  { value: "", label: "Select company size" },
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

const workflowOptions = [
  { value: "", label: "Select current approach" },
  { value: "manually", label: "Manually" },
  { value: "using-tools", label: "Using tools" },
  { value: "partially-automated", label: "Partially automated" },
  { value: "not-sure", label: "Not sure" },
];

const urgencyOptions = [
  { value: "", label: "Select urgency" },
  { value: "asap", label: "ASAP" },
  { value: "this-month", label: "This month" },
  { value: "exploring", label: "Exploring options" },
];

export function LeadCaptureForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    companySize: "",
    automationGoal: "",
    currentWorkflow: "",
    urgency: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Light formatting - just remove non-digits except + for international
    const cleaned = value.replace(/[^\d+\-\s()]/g, "");
    return cleaned.slice(0, 20);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate form
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 px-4 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-6">
          <Check className="w-8 h-8 text-primary animate-check-bounce" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Thanks for reaching out!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          We'll review your workflow and reach out within 24 hours.
        </p>
        <p className="text-sm text-form-helper">
          If we need clarification, we may follow up by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0" noValidate>
      {/* Name */}
      <div className="form-field">
        <label htmlFor="name" className="form-label">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${errors.name ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
          placeholder="Your full name"
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1.5">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="form-field">
        <label htmlFor="email" className="form-label">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
          placeholder="you@company.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1.5">{errors.email}</p>
        )}
      </div>

      {/* Company */}
      <div className="form-field">
        <label htmlFor="company" className="form-label">
          Company <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={`form-input ${errors.company ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
          placeholder="Your company name"
          autoComplete="organization"
        />
        {errors.company && (
          <p className="text-xs text-destructive mt-1.5">{errors.company}</p>
        )}
      </div>

      {/* Phone (Optional) */}
      <div className="form-field">
        <label htmlFor="phone" className="form-label">
          Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          className="form-input"
          placeholder="+1 (555) 123-4567"
          autoComplete="tel"
        />
      </div>

      {/* Company Size */}
      <div className="form-field">
        <label htmlFor="companySize" className="form-label">
          Company Size <span className="text-destructive">*</span>
        </label>
        <select
          id="companySize"
          name="companySize"
          value={formData.companySize}
          onChange={handleChange}
          className={`form-select ${errors.companySize ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""} ${!formData.companySize ? "text-muted-foreground" : ""}`}
        >
          {companySizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.companySize && (
          <p className="text-xs text-destructive mt-1.5">{errors.companySize}</p>
        )}
      </div>

      {/* Automation Goal */}
      <div className="form-field">
        <label htmlFor="automationGoal" className="form-label">
          What are you looking to automate? <span className="text-destructive">*</span>
        </label>
        <textarea
          id="automationGoal"
          name="automationGoal"
          value={formData.automationGoal}
          onChange={handleChange}
          rows={3}
          className={`form-input resize-none ${errors.automationGoal ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
          placeholder="Describe the workflow or task you'd like to automate..."
        />
        <p className="form-helper">1–2 sentences is enough.</p>
        {errors.automationGoal && (
          <p className="text-xs text-destructive mt-1">{errors.automationGoal}</p>
        )}
      </div>

      {/* Current Workflow */}
      <div className="form-field">
        <label htmlFor="currentWorkflow" className="form-label">
          How do you currently handle this workflow? <span className="text-destructive">*</span>
        </label>
        <select
          id="currentWorkflow"
          name="currentWorkflow"
          value={formData.currentWorkflow}
          onChange={handleChange}
          className={`form-select ${errors.currentWorkflow ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""} ${!formData.currentWorkflow ? "text-muted-foreground" : ""}`}
        >
          {workflowOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.currentWorkflow && (
          <p className="text-xs text-destructive mt-1.5">{errors.currentWorkflow}</p>
        )}
      </div>

      {/* Urgency */}
      <div className="form-field">
        <label htmlFor="urgency" className="form-label">
          How soon do you need this? <span className="text-destructive">*</span>
        </label>
        <select
          id="urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          className={`form-select ${errors.urgency ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""} ${!formData.urgency ? "text-muted-foreground" : ""}`}
        >
          {urgencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.urgency && (
          <p className="text-xs text-destructive mt-1.5">{errors.urgency}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}
