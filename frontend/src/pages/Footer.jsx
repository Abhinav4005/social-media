import { Facebook, Twitter, Instagram, Sparkles, Youtube, Github, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Features", path: "/features" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
    account: [
      { name: "Profile", path: "/profile" },
      { name: "Settings", path: "/settings" },
      { name: "Notifications", path: "/notifications" },
      { name: "Chat", path: "/chat" },
    ],
    resources: [
      { name: "Help Center", path: "/help" },
      { name: "Community Guidelines", path: "/guidelines" },
      { name: "Safety Center", path: "/safety" },
      { name: "Blog", path: "/blog" },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, color: "hover:text-primary-600", path: "#" },
    { icon: <Twitter className="w-5 h-5" />, color: "hover:text-primary-500", path: "#" },
    { icon: <Instagram className="w-5 h-5" />, color: "hover:text-secondary-500", path: "#" },
    { icon: <Github className="w-5 h-5" />, color: "hover:text-gray-900", path: "#" },
    { icon: <Youtube className="w-5 h-5" />, color: "hover:text-red-600", path: "#" },
  ];

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img
                src="/connecta-logo-icon.png"
                alt="Connecta Logo"
                className="w-9 h-9 object-contain drop-shadow-md"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Connecta
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
              Join our vibrant community where you can connect, share, and grow with friends and like-minded individuals from around the world.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <Mail className="w-5 h-5 text-primary-500" />
                <span className="text-sm">support@connecta.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span className="text-sm">Ayodhya, Uttar Pradesh, India</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-gray-900 dark:text-gray-100 font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-gray-100 font-bold mb-6">Account</h4>
            <ul className="space-y-4">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-gray-100 font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Newsletter (Simplified) section could go here */}

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 dark:text-gray-400 text-sm">
            © {currentYear} <span className="text-gray-600 dark:text-gray-300 font-semibold">Connecta</span>. Built with ❤️ for everyone.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.path}
                whileHover={{ y: -3, scale: 1.1 }}
                className={`w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-400 transition-all ${social.color} hover:bg-white dark:hover:bg-slate-700 hover:shadow-md`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
