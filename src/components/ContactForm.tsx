import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().max(200).optional(),
  interest_type: z.string().min(1, "Please select an interest type"),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    interest_type: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({
        title: "Validation Error",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: result.data.name,
        email: result.data.email,
        company: result.data.company || null,
        interest_type: result.data.interest_type,
        message: result.data.message,
      });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Thank you! Our team will be in touch shortly.",
      });
      setForm({ name: "", email: "", company: "", interest_type: "", message: "" });
    } catch {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-geo-dark">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-muted-foreground text-lg">
            Interested in Orange Hydrogen? Request a demo, explore investment opportunities, or discuss partnership.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Company</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Interest Type *</label>
              <select
                value={form.interest_type}
                onChange={(e) => setForm({ ...form, interest_type: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50"
                required
              >
                <option value="" className="bg-geo-panel">Select...</option>
                <option value="investment" className="bg-geo-panel">Investment</option>
                <option value="demo" className="bg-geo-panel">Demo Request</option>
                <option value="partnership" className="bg-geo-panel">Partnership</option>
                <option value="general" className="bg-geo-panel">General Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50 resize-none"
              placeholder="Tell us about your interest..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-geo-orange hover:bg-orange-500 text-white py-3.5 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
