import { useState } from 'react';
import { brandInfo } from '../data/brandData';
import { adminAuthService } from '../services/adminAuthService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import DashboardOverview from './DashboardOverview';
import ProductsManager from './ProductsManager';
import CategoriesManager from './CategoriesManager';
import ApplicationsManager from './ApplicationsManager';
import MessagesManager from './MessagesManager';
import SettingsManager from './SettingsManager';
import AuditLogsViewer from './AuditLogsViewer';

/**
 * AdminLayout Component
 * Navigation shell for Admin CMS
 */
export default function AdminLayout({ adminUser, onLogout, onGoToCustomerSite }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Tổng Quan', icon: 'dashboard' },
    { id: 'products', label: 'Thực Đơn Món', icon: 'coffee' },
    { id: 'categories', label: 'Danh Mục', icon: 'category' },
    { id: 'applications', label: 'Đơn Ứng Tuyển', icon: 'group' },
    { id: 'messages', label: 'Hộp Thư Liên Hệ', icon: 'mail' },
    { id: 'settings', label: 'Cài Đặt Quán', icon: 'settings' },
    { id: 'audit', label: 'Nhật Ký Audit', icon: 'history' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await adminAuthService.signOut();
    } catch (err) {
      console.warn(err);
    }
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#09110d] text-[#edece6] flex">
      {/* Sidebar Overlay on Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d1612] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0">
              <img
                src={brandInfo.logo}
                alt="Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="text-lg font-['Playfair_Display'] font-bold text-white tracking-wide">
                {brandInfo.name}
              </h1>
              <p className="text-[10px] text-[#92f7c3] uppercase tracking-widest font-semibold">
                Admin CMS
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs">
            {menuItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-[#1b4332] text-[#92f7c3] font-bold shadow'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User profile & Switch back */}
        <div className="p-5 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="w-9 h-9 rounded-full bg-[#1b4332] text-[#92f7c3] flex items-center justify-center font-bold text-xs shrink-0">
              {adminUser?.admin?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">
                {adminUser?.admin?.full_name || 'Quản Trị Viên'}
              </div>
              <div className="text-[10px] text-[#92f7c3] uppercase font-semibold">
                Quyền: {adminUser?.admin?.role || 'admin'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={onGoToCustomerSite}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-sm">open_in_browser</span>
              <span>Xem Website Quán</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-300 text-xs font-semibold transition-colors border border-red-500/20"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-white/10 bg-[#0c1410]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <span className="text-sm font-semibold text-white/80 capitalize">
              {menuItems.find(i => i.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/60 text-[#92f7c3] border-[#92f7c3]/30'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Demo Mode'}</span>
            </span>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {activeTab === 'overview' && <DashboardOverview onNavigateTab={setActiveTab} />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'applications' && <ApplicationsManager />}
          {activeTab === 'messages' && <MessagesManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'audit' && <AuditLogsViewer />}
        </main>
      </div>
    </div>
  );
}
