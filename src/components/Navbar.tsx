import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Hexagon, List, X } from "@phosphor-icons/react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navLinks = isHome
    ? [
        { label: "Vision", href: "#vision" },
        { label: "The Reactor", href: "#reactor-3d" },
        { label: "Co-Generation", href: "#co-generation" },
        { label: "AI & Robotics", href: "#ai-innovation" },
        { label: "Products", href: "#output" },
      ]
    : [
        { label: "Geophysical Inversion", href: "/ai-inversion" },
        { label: "Autonomous Robotics", href: "/autonomous-robotics" },
        { label: "Plasma Drilling", href: "/plasma-drilling" },
      ];

  const handleClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b-0 border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <Hexagon weight="fill" className="text-3xl text-geo-orange" size={28} />
            <span className="font-bold text-2xl tracking-tight text-white">
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
            {isHome && (
              <a
                href="#contact"
                onClick={() => handleClick("#contact")}
                className="hidden sm:inline-flex bg-geo-orange hover:bg-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all"
              >
                Invest in Orange
              </a>
            )}
            {!isHome && (
              <Link
                to="/"
                className="hidden sm:inline-flex border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors text-foreground"
              >
                ← Back to Home
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
        <div className="md:hidden glass-panel border-t border-white/10 px-6 py-4 space-y-3">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleClick(link.href)}
                className="block text-sm font-medium text-foreground/80 hover:text-geo-orange transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-foreground/50 hover:text-geo-orange transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
