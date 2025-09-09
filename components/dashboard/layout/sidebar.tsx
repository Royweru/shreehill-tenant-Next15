import { navigation } from "@/constants";
import { ChevronRight, HelpCircle, LogOut, Settings } from "lucide-react";
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
            relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200
            ${isActive 
              ? 'bg-gradient-to-r from-emerald-500/15 to-blue-500/15 shadow-md border border-emerald-500/20' 
              : 'hover:bg-gray-50 hover:shadow-sm'
            }
            ${isHovered ? 'transform translate-x-1' : ''}
          `}
        >
          {/* Icon container */}
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
            ${isActive 
              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-sm' 
              : 'bg-gray-100 group-hover:bg-emerald-500'
            }
          `}>
            <Icon className={`
              w-4 h-4 transition-colors duration-200
              ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-white'}
            `} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`
              font-medium text-sm transition-colors duration-200
              ${isActive ? 'text-gray-900' : 'text-gray-700'}
            `}>
              {item.label}
            </p>
          </div>
          
          {/* Badge or Arrow */}
          {item.badge ? (
            <span className="px-2 py-0.5 text-xs font-medium text-white bg-emerald-500 rounded-full">
              {item.badge}
            </span>
          ) : (
            <ChevronRight className={`
              w-3 h-3 transition-all duration-200
              ${isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}
            `} />
          )}

          {/* Active indicator */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-r-full"></div>
          )}
        </Link>
      </div>
    );
  };

  return (
    <div className="h-full bg-white border-r border-gray-200">
      {/* Compact Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="font-bold text-base bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Shreehill
            </h1>
            <p className="text-xs text-gray-500">Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navigation.map((item, index) => (
            <NavigationItem key={item.link} item={item} index={index} />
          ))}
        </div>
      </nav>

      {/* Compact Bottom Section */}
      <div className="p-3 border-t border-gray-200 bg-gray-50/50">
        {/* Mini Payment Status */}
        <div className="px-3 py-2 mb-3 rounded-lg bg-emerald-50 border border-emerald-100">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Next Due</span>
            <span className="font-semibold text-emerald-600">Dec 1</span>
          </div>
        </div>

        {/* Compact Actions */}
        <div className="space-y-1">
          {[
            { icon: Settings, label: 'Settings', link: '/dashboard/settings' },
            { icon: HelpCircle, label: 'Help', link: '/dashboard/help' },
            { icon: LogOut, label: 'Sign Out', link: '/logout', danger: true }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.link}
                href={item.link}
                onClick={() => onClose?.(true)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${item.danger 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};