import { Link } from "react-router-dom";
import { Hexagon, TwitterLogo, LinkedinLogo, Envelope } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-background py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <Link to="/" className="flex items-center gap-2">
              <Hexagon weight="fill" className="text-geo-orange" size={24} />
              <span className="font-bold text-xl tracking-tight text-foreground">
                GeoHy<span className="text-geo-orange">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left">
              {t("footer.tagline")}
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-geo-orange transition-colors">
                <TwitterLogo weight="fill" size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-geo-orange transition-colors">
                <LinkedinLogo weight="fill" size={24} />
              </a>
              <a href="mailto:contact@geohy.com" className="text-muted-foreground hover:text-geo-orange transition-colors">
                <Envelope weight="fill" size={24} />
              </a>
            </div>
            <div className="text-muted-foreground text-xs font-mono">
              © 2026 GeoHy Energy Systems. {t("footer.rights")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
