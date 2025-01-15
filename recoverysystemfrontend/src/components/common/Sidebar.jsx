import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Settings,
  ShoppingCart,
  BookOpen,
  Users,
  Menu,
  Package,
  ShoppingBag,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to, isActive, isCollapsed }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
      isActive 
        ? 'bg-blue-900/50 text-white' 
        : 'text-gray-200 hover:bg-blue-900/30 hover:text-white'
    }`}
  >
    <Icon className="h-5 w-5" />
    {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
  </Link>
);

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const customerLinks = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Browse Courses',
      href: '/courses',
      icon: BookOpen
    },
    {
      title: 'Orders',
      href: '/dashboard/orders',
      icon: ShoppingCart
    }
  ];

  const adminLinks = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Products',
      href: '/dashboard/admin/products',
      icon: ShoppingBag
    },
    {
      title: 'Courses',
      href: '/dashboard/admin/courses',
      icon: BookOpen
    },
    {
      title: 'Services',
      href: '/dashboard/admin/services',
      icon: Settings
    },
    {
      title: 'Orders',
      href: '/dashboard/admin/orders',
      icon: ShoppingCart
    }
  ];

  const sidebarItems = isAdmin ? adminLinks : customerLinks;

  const navigation = [
    ...sidebarItems,
    {
      title: 'Services',
      href: '/services',
      icon: Wrench,
      allowedRoles: ['admin', 'user']
    }
  ];

  return (
    <div className="sticky top-0 h-screen bg-blue-950 flex-shrink-0">
      <div className="flex h-full w-64 flex-col transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <Link to="/" className="text-xl font-bold text-white">
              Linux Friends
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 text-gray-200 hover:bg-blue-900/30 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3 py-4">
          {navigation.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.title}
              to={item.href}
              isActive={location.pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-900/50 p-4">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 hover:bg-blue-900/30 hover:text-white"
          >
            <img
              src="/default-avatar.png"
              alt="User"
              className="h-8 w-8 rounded-full"
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-gray-400">{user?.email}</span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;