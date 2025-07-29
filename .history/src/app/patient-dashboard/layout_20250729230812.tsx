'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  HeartIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolid,
  CalendarDaysIcon as CalendarSolid,
  DocumentTextIcon as DocumentSolid,
  UserCircleIcon as UserSolid
} from '@heroicons/react/24/solid';

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/patient-dashboard',
      icon: HeartIcon,
      iconSolid: HeartSolid,
    },
    {
      name: 'Appointments',
      href: '/patient-dashboard/appointments',
      icon: CalendarDaysIcon,
      iconSolid: CalendarSolid,
    },
    {
      name: 'Records',
      href: '/patient-dashboard/records',
      icon: DocumentTextIcon,
      iconSolid: DocumentSolid,
    },
    {
      name: 'Profile',
      href: '/patient-dashboard/profile',
      icon: UserCircleIcon,
      iconSolid: UserSolid,
    },
  ];

  return (
    <>
      {children}
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.iconSolid : item.icon;
            
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive ? 'text-cyan-600' : 'text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
