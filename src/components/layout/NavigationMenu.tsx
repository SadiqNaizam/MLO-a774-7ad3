import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Using shadcn Button for consistency
// Import icons as needed, e.g., import { LayoutDashboard, CandlestickChart, Wallet, Search, User } from 'lucide-react';

// Example navigation items - replace with your actual navigation structure
const navItems = [
  { href: '/dashboard', label: 'Dashboard' /* icon: LayoutDashboard */ },
  { href: '/trade', label: 'Trade' /* icon: CandlestickChart */ },
  { href: '/wallet', label: 'Wallet' /* icon: Wallet */ },
  { href: '/discover', label: 'Discover' /* icon: Search */ },
  { href: '/account', label: 'Account' /* icon: User */ },
];

const NavigationMenu: React.FC = () => {
  console.log("Rendering NavigationMenu");
  const location = useLocation();

  return (
    <nav className="w-64 h-screen bg-background border-r p-4 flex flex-col fixed top-0 left-0 z-40 md:sticky"> {/* Adjust based on layout needs */}
      <div className="mb-8 text-center">
        {/* Placeholder for Logo or App Name */}
        <Link to="/" className="text-2xl font-bold text-primary">
          CryptoApp
        </Link>
      </div>
      <ul className="space-y-2 flex-grow">
        {navItems.map((item) => (
          <li key={item.href}>
            <Button
              variant={location.pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start text-base h-12",
                location.pathname.startsWith(item.href) ? "font-semibold" : ""
              )}
              asChild
            >
              <Link to={item.href}>
                {/* item.icon && <item.icon className="mr-3 h-5 w-5" /> */}
                {item.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
      {/* Optional: Add user profile quick access or settings link at the bottom */}
      <div className="mt-auto">
        {/* Example: <Button variant="outline" className="w-full">Settings</Button> */}
      </div>
    </nav>
  );
};

export default NavigationMenu;