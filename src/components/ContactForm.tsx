import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    interest_type: "",
    message: "",
  });

  const contactSchema = z.object({
    name: z.string().trim().min(1, t("contact.name") + " is required").max(100),
    email: z.string().trim().email("Invalid email").max(255),
    company: z.string().trim().max(200).optional(),
    interest_type: z.string().min(1, t("contact.interest") + " is required"),
    message: z.string().trim().min(1, t("contact.message") + " is required").max(2000),
  });

  const fetchGeoIP = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      return {
        ip: data.ip || null,
        location: data.city && data.country_name ? `${data.city}, ${data.country_name}` : null
      };
    } catch {
      return { ip: null, location: null };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({
        title: t("contact.validation_error"),
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const geoInfo = await fetchGeoIP();

      const { error } = await supabase.from("contact_requests").insert({
        name: result.data.name,
        email: result.data.email,
        company: result.data.company || null,
        interest_type: result.data.interest_type,
        message: result.data.message,
        ip_address: geoInfo.ip,
        location: geoInfo.location,
      });

      if (error) throw error;

      toast({
        title: t("contact.success_title"),
        description: t("contact.success_desc"),
      });
      setForm({ name: "", email: "", company: "", interest_type: "", message: "" });
    } catch {
      toast({
        title: t("contact.error_title"),
        description: t("contact.error_desc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-geo-dark border-t border-border">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("contact.title")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("contact.desc")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">{t("contact.name")} *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-background/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50"
                placeholder={t("contact.name_placeholder")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">{t("contact.email")} *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-background/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50"
                placeholder={t("contact.email_placeholder")}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">{t("contact.company")}</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-background/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50"
                placeholder={t("contact.company_placeholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">{t("contact.interest")} *</label>
              <select
                value={form.interest_type}
                onChange={(e) => setForm({ ...form, interest_type: e.target.value })}
                className="w-full bg-background/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50"
                required
              >
                <option value="" className="bg-background">{t("contact.interest_select")}</option>
                <option value="investment" className="bg-background">{t("contact.interest_investment")}</option>
                <option value="demo" className="bg-background">{t("contact.interest_demo")}</option>
                <option value="partnership" className="bg-background">{t("contact.interest_partnership")}</option>
                <option value="general" className="bg-background">{t("contact.interest_general")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">{t("contact.message")} *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full bg-background/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-geo-orange/50 resize-none"
              placeholder={t("contact.message_placeholder")}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-geo-orange hover:bg-orange-500 text-white py-3.5 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("contact.submitting") : t("contact.submit")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
