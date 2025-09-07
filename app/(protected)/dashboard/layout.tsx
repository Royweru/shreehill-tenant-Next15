"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthContext } from "@/providers/AuthContext";
import { MobileHeader } from "@/components/dashboard/layout/mobileHeader";
import { DesktopHeader } from "@/components/dashboard/layout/desktopHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthContext()
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for headers
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock notifications - replace with real data


  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-gray-50/80 to-emerald-50/40 flex">
      {/* Mobile Header */}
      <MobileHeader
        mobileOpen ={mobileOpen}
        setMobileOpen={setMobileOpen}
        setShowNotifications={setShowNotifications}
        showNotifications ={showNotifications}
        isScrolled={isScrolled}
        user={user}  
    />

      {/* Desktop Sidebar */}
      <div className="w-64 lg:block hidden fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "w-full transition-all duration-300",
          "lg:pl-64 pl-0"
        )}
      >
        {/* Desktop Header */}
      <DesktopHeader 
       setShowNotifications={setShowNotifications}
       showNotifications={showNotifications}
       setShowProfile={setShowProfile}
       showProfile ={showProfile}
       user={user}
       isScrolled ={isScrolled}
      />

        {/* Page Content with correct padding */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="px-4 sm:px-6 lg:px-8 pt-20 lg:pt-16 pb-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

