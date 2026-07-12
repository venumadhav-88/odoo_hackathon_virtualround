import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Header } from '@/components/layout';

/**
 * MainLayout Component.
 * Scaffolding shell for authenticated pages. Composes dynamic Sidebar and responsive Header.
 * @returns {JSX.Element} Main dashboard layout.
 */
const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-container">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleToggleSidebar} 
        mobileOpen={isMobileSidebarOpen}
      />
      <div className="main-content">
        <Header onMobileToggle={handleToggleMobileSidebar} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
