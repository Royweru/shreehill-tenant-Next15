import { navigation } from "@/constants";
import { ChevronRight, HelpCircle, LogOut, Settings, Shield } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = ({
  onClose
}:{
  onClose?:(close:boolean)=>void;
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const pathname = usePathname();

  const NavigationItem = ({ item, index }:{item:any, index:any}) => {
    const Icon = item.icon;
    const isActive = pathname === item.link || item.active;
    const isHovered = hoveredItem === index;

    return (
      <div
        className="relative group"
        onMouseEnter={() => setHoveredItem(index)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Link
          href={item.link}
          onClick={() => onClose?.(true)}
          className={`
            relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ease-out
            ${isActive 
              ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 shadow-lg shadow-emerald-500/10 border border-emerald-500/30' 
              : 'hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-blue-500/10 hover:shadow-md hover:shadow-emerald-500/5'
            }
            ${isHovered ? 'transform translate-x-2' : ''}
            group-hover:scale-[1.02]
          `}
        >
          {/* Glowing background effect for active item */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-2xl blur-xl"></div>
          )}
          
          {/* Icon container with gradient background */}
          <div className={`
            relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300
            ${isActive 
              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/30' 
              : 'bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-emerald-500 group-hover:to-blue-500 group-hover:shadow-md'
            }
          `}>
            <Icon className={`
              w-5 h-5 transition-all duration-300
              ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-white'}
            `} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className={`
                  font-semibold text-sm transition-colors duration-300
                  ${isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
                `}>
                  {item.label}
                </p>
                <p className={`
                  text-xs transition-colors duration-300
                  ${isActive ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'}
                `}>
                  {item.description}
                </p>
              </div>
              
              {/* Badge or Arrow */}
              {item.badge ? (
                <span className={`
                  px-2 py-1 text-xs font-medium text-white rounded-full
                  ${item.badgeColor || 'bg-emerald-500'}
                  shadow-lg
                `}>
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className={`
                  w-4 h-4 transition-all duration-300
                  ${isActive ? 'text-emerald-500 translate-x-1' : 'text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1'}
                `} />
              )}
            </div>
          </div>

          {/* Active indicator line */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-r-full shadow-lg shadow-emerald-500/50"></div>
          )}
        </Link>
      </div>
    );
  };

  return (
    <div className="h-full bg-gradient-to-b from-white via-gray-50/80
     to-gray-100/50 backdrop-blur-xl border-r border-gray-200/80">
      {/* Header Section with enhanced styling */}
      <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-emerald-50/80 to-blue-50/80">
        <div className="flex items-center gap-4">
          {/* Logo with enhanced gradient and glow effect */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-md opacity-30 -z-10"></div>
          </div>
          
          <div>
            <h1 className="font-heading text-xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Shreehill
            </h1>
            <p className="text-sm text-gray-500 font-medium">Tenant Portal</p>
          </div>
        </div>
      </div>

    

      {/* Enhanced Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
            Main Navigation
          </p>
          {navigation.map((item, index) => (
            <NavigationItem key={item.link} item={item} index={index} />
          ))}
        </div>
      </nav>

      {/* Enhanced Bottom Section */}
      <div className="p-4 border-t border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-gray-100/40">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
            Account
          </p>
          
          {/* Quick Stats */}
          <div className="px-4 py-3 mb-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-blue-50/80 border border-emerald-100/50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Next Payment</span>
              <span className="font-semibold text-emerald-600">Dec 1st</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-1.5 rounded-full w-3/4"></div>
            </div>
          </div>

          {[
            { icon: Settings, label: 'Settings', link: '/dashboard/settings' },
            { icon: HelpCircle, label: 'Help & Support', link: '/dashboard/help' },
            { icon: LogOut, label: 'Sign Out', link: '/logout', danger: true }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.link}
                href={item.link}
                onClick={() => onClose?.(true)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                  ${item.danger 
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                  group
                `}
              >
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                  ${item.danger 
                    ? 'bg-red-100 group-hover:bg-red-200' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};