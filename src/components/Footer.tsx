import { Link } from "react-router-dom";
import { Hexagon, TwitterLogo, LinkedinLogo, Envelope } from "@phosphor-icons/react";

const Footer = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <Hexagon weight="fill" className="text-geo-orange" size={24} />
          <span className="font-bold text-xl tracking-tight text-white">
            GeoHy<span className="text-geo-orange">.</span>
          </span>
        </Link>
        <div className="text-muted-foreground text-sm text-center md:text-left">
          © 2026 GeoHy Energy Systems. Engineering the Lithosphere.
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-white transition-colors">
            <TwitterLogo weight="fill" size={20} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-white transition-colors">
            <LinkedinLogo weight="fill" size={20} />
          </a>
          <a href="mailto:contact@geohy.com" className="text-muted-foreground hover:text-white transition-colors">
            <Envelope weight="fill" size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
