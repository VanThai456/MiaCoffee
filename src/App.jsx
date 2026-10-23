import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';
import Space from './pages/Space';
import Recruitment from './pages/Recruitment';
import Contact from './pages/Contact';

// Admin CMS Components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import { adminAuthService } from './services/adminAuthService';

/**
 * Main Application Component
 * Manages dual applications:
 * 1. Customer-facing Website (Home, Menu, ProductDetail, Space, Recruitment, Contact)
 * 2. Admin CMS System (#admin)
 */
export default function App() {
  const parseCurrentHash = () => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (rawHash.startsWith('product/')) {
      return { page: 'product-detail', id: rawHash.replace('product/', '') };
    }
    if (rawHash.startsWith('product-detail')) {
      const match = rawHash.match(/id=([^&]+)/);
      return { page: 'product-detail', id: match ? match[1] : null };
    }
    if (['home', 'menu', 'space', 'recruitment', 'contact', 'admin'].includes(rawHash)) {
      return { page: rawHash, id: null };
    }
    return { page: 'home', id: null };
  };

  const initialRoute = parseCurrentHash();
  const [activePage, setActivePage] = useState(initialRoute.page);
  const [selectedProductId, setSelectedProductId] = useState(initialRoute.id || 'prod-001');

  const [adminUser, setAdminUser] = useState(null);
  const [_checkingAuth, setCheckingAuth] = useState(true);

  // Check initial session
  useEffect(() => {
    let isMounted = true;
    adminAuthService.getCurrentAdmin()
      .then(user => {
        if (isMounted) setAdminUser(user);
      })
      .catch(console.warn)
      .finally(() => {
        if (isMounted) setCheckingAuth(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseCurrentHash();
      setActivePage(route.page);
      if (route.id) {
        setSelectedProductId(route.id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageId, extraParam = null) => {
    if (pageId === 'product-detail' || pageId.startsWith('product/')) {
      const prodId = extraParam || (pageId.startsWith('product/') ? pageId.replace('product/', '') : selectedProductId);
      setActivePage('product-detail');
      setSelectedProductId(prodId);
      window.location.hash = `#product/${prodId}`;
    } else {
      setActivePage(pageId);
      window.location.hash = `#${pageId}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin CMS Route
  if (activePage === 'admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => setAdminUser(user)}
          onBackToSite={() => handleNavigate('home')}
        />
      );
    }

    return (
      <AdminLayout
        adminUser={adminUser}
        onLogout={() => {
          setAdminUser(null);
          handleNavigate('home');
        }}
        onGoToCustomerSite={() => handleNavigate('home')}
      />
    );
  }

  // Customer-facing Website Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#101915] text-[#edece6]">
      {/* Global Shared Header */}
      <Header activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && <Home onNavigate={handleNavigate} />}
        {activePage === 'menu' && <Menu onNavigate={handleNavigate} />}
        {activePage === 'product-detail' && (
          <ProductDetail
            productId={selectedProductId}
            onNavigate={handleNavigate}
          />
        )}
        {activePage === 'space' && <Space />}
        {activePage === 'recruitment' && <Recruitment />}
        {activePage === 'contact' && <Contact />}
      </main>

      {/* Global Shared Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
