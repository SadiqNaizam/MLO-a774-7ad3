import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react'; // Example social icons

const Footer: React.FC = () => {
  console.log("Rendering Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand/About */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">CryptoApp</h3>
            <p className="text-sm text-muted-foreground">
              Securely trade your favorite cryptocurrencies.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/trade" className="text-sm text-foreground hover:text-primary">Trade</Link></li>
              <li><Link to="/wallet" className="text-sm text-foreground hover:text-primary">Wallet</Link></li>
              <li><Link to="/discover" className="text-sm text-foreground hover:text-primary">Discover Assets</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-sm text-foreground hover:text-primary">FAQ</Link></li>
              <li><Link to="/support" className="text-sm text-foreground hover:text-primary">Support</Link></li>
              <li><Link to="/blog" className="text-sm text-foreground hover:text-primary">Blog</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} CryptoApp. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Github className="h-5 w-5" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;