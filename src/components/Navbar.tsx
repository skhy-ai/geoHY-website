import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Hexagon, List, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navLinks = isHome
    ? [
        { label: t("nav.vision"), href: "#vision" },
        { label: t("nav.reactor"), href: "#reactor-3d" },
        { label: t("nav.cogen"), href: "#co-generation" },
        { label: t("nav.ai"), href: "#ai-innovation" },
        { label: t("nav.products"), href: "#output" },
      ]
    : [
        { label: t("nav.inversion"), href: "/ai-inversion" },
        { label: t("nav.robotics"), href: "/autonomous-robotics" },
        { label: t("nav.plasma"), href: "/plasma-drilling" },
      ];

  const handleClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };


  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <Hexagon weight="fill" className="text-3xl text-geo-orange" size={28} />
            <span className="font-bold text-2xl tracking-tight text-foreground">
              GeoHy<span className="text-geo-orange">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-baseline space-x-8">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => handleClick(link.href)}
                  className="hover:text-geo-orange transition-colors text-sm font-medium text-foreground/80"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`transition-colors text-sm font-medium ${
                    location.pathname === link.href
                      ? "text-geo-orange"
                      : "text-foreground/50 hover:text-geo-orange"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 mr-2 border-r border-border pr-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {isHome && (
              <a
                href="#contact"
                onClick={() => handleClick("#contact")}
                className="hidden sm:inline-flex bg-geo-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all"
              >
                {t("nav.invest")}
              </a>
            )}
            {!isHome && (
              <Link
                to="/"
                className="hidden sm:inline-flex border border-border bg-card/50 hover:bg-card/80 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors text-foreground"
              >
                ← {t("nav.back")}
              </Link>
            )}
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-panel border-t border-border px-6 py-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("nav.settings")}</span>
            <div className="flex gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
          <div className="space-y-4">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => handleClick(link.href)}
                  className="block text-lg font-medium text-foreground/80 hover:text-geo-orange transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-medium text-foreground/50 hover:text-geo-orange transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
