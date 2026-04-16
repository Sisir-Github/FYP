import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">⛰️</span>
              <div>
                <h3 className="text-lg font-heading font-bold text-white">Everest Encounter</h3>
                <p className="text-[10px] tracking-widest uppercase text-white/50">
                  Treks & Expedition
                </p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Experience the majesty of the Himalayas with Nepal's trusted trekking partner.
              Professional guides, safe expeditions, unforgettable memories.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebookF, href: '#' },
                { icon: FaInstagram, href: '#' },
                { icon: FaTwitter, href: '#' },
                { icon: FaYoutube, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-500 transition-colors duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider mb-5 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Trek Packages', path: '/treks' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-accent-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Treks */}
          <div>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider mb-5 text-white">
              Popular Treks
            </h4>
            <ul className="space-y-3">
              {[
                'Everest Base Camp Trek',
                'Annapurna Circuit',
                'Langtang Valley Trek',
                'Manaslu Circuit Trek',
                'Island Peak Climbing',
              ].map((trek) => (
                <li key={trek}>
                  <Link
                    to="/treks"
                    className="text-sm text-gray-400 hover:text-accent-400 transition-colors"
                  >
                    {trek}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider mb-5 text-white">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiLocationMarker className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  Thamel, Kathmandu, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <HiPhone className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a href="tel:+9771234567890" className="text-sm text-gray-400 hover:text-accent-400">
                  +977-1-234567890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <HiMail className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a
                  href="mailto:info@everestencounter.com"
                  className="text-sm text-gray-400 hover:text-accent-400"
                >
                  info@everestencounter.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} Everest Encounter Treks and Expedition Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-xs text-gray-500 hover:text-gray-300">Privacy Policy</Link>
            <Link to="#" className="text-xs text-gray-500 hover:text-gray-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
