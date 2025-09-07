'use client'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Bell, Menu } from 'lucide-react'
import React from 'react'
import { Sidebar } from './sidebar'
import { getPageTitle } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export const MobileHeader = ({
   showNotifications,
    isScrolled,
     mobileOpen,
     user,
     setShowNotifications,
     setMobileOpen
}:{
    showNotifications:boolean,
    user:UserStatus |null,
    isScrolled:boolean,
    mobileOpen:boolean,
    setMobileOpen:(mobileOpen:boolean)=>void,
    setShowNotifications:(show:boolean)=>void,
}) => {
    const pathname =usePathname()
  return (
     <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-40 lg:hidden transition-all duration-300 ease-in-out",
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-emerald-100/50" 
            : "bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="rounded-xl p-2.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200/50 hover:from-emerald-500/20 hover:to-blue-500/20 hover:border-emerald-300/50 transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/10">
              <Menu className="h-5 w-5 text-emerald-700" />
            </SheetTrigger>
            <SheetContent 
              side="left"
              className="p-0 border-r border-emerald-100/50 w-80 bg-gradient-to-b from-white via-gray-50/80 to-gray-100/50"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent font-bold text-lg">
            {getPageTitle(pathname)}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:from-emerald-50 hover:to-blue-50 hover:border-emerald-200 text-gray-600 hover:text-emerald-600 transition-all duration-300"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border border-white"></span>
              </button>
            </div>
            
            {/* Mobile User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs">
                {user?.profile?.first_name?.charAt(0) || 'U'}{user?.profile.last_name?.charAt(0) || 'S'}
              </span>
            </div>
          </div>
        </div>
      </div>
  )
}
