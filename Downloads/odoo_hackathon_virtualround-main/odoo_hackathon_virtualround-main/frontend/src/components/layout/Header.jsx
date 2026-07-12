import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks';
import { AssetService } from '@/services';
import { Modal, StatusBadge } from '@/components/common';
import { formatCurrency, formatDate } from '@/utils/formatters';

/**
 * Header Component.
 * Displays top navigation, dynamic breadcrumbs, theme toggles, notification indicators,
 * and a fully operational global quick search + unread notification dropdown drawer.
 */
export const Header = ({ onMobileToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Search autocomplete states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Maintenance Overdue',
      message: 'Dell XPS 15 (AST-2026-001) is overdue for servicing.',
      read: false,
      time: '10m ago',
    },
    {
      id: 2,
      title: 'New Custody Assigned',
      message: 'MacBook Pro assigned to Marcus Vance.',
      read: false,
      time: '2h ago',
    },
    {
      id: 3,
      title: 'System Backup Complete',
      message: 'Database backup compiled successfully.',
      read: true,
      time: '1d ago',
    },
  ]);
  const notificationRef = useRef(null);

  const getPageTitle = () => {
    const pathname = location.pathname;
    if (pathname === '/') return 'Dashboard';
    return pathname.slice(1).replace(/-/g, ' ');
  };

  // Close search/notification dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle asset quick search query autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const data = await AssetService.getAssets();
        const query = searchQuery.toLowerCase().trim();
        const filtered = data.filter(
          (a) =>
            a.assetName.toLowerCase().includes(query) ||
            a.assetCode.toLowerCase().includes(query)
        );
        setSearchResults(filtered.slice(0, 5));
      } catch (err) {
        console.error('Failed to search assets from layout header:', err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleReadStatus = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="header-left">
        <button className="header-mobile-toggle" onClick={onMobileToggle} aria-label="Toggle Sidebar">
          <Menu size={20} />
        </button>
        <div className="breadcrumbs">
          <span>EAM</span> &gt; <span className="active-breadcrumb" style={{ textTransform: 'capitalize' }}>{getPageTitle()}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Search */}
        <div className="header-search" ref={searchRef} style={{ position: 'relative' }}>
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            placeholder="Quick search assets…"
            className="header-search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
          />

          {showSearchResults && searchResults.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                maxHeight: '280px',
                overflowY: 'auto',
              }}
            >
              {searchResults.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {asset.assetName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {asset.assetCode} • {asset.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-actions" style={{ position: 'relative' }}>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications Trigger */}
          <div ref={notificationRef} style={{ display: 'inline-block', position: 'relative' }}>
            <button
              className="header-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="header-indicator" />}
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '320px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 1000,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                    Alert Notifications
                  </strong>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => toggleReadStatus(n.id)}
                      style={{
                        padding: '0.875rem 1rem',
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.03)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: n.read ? 600 : 700,
                              color: n.read ? 'var(--color-text-main)' : 'var(--color-primary)',
                            }}
                          >
                            {n.title}
                          </span>
                          <span style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
                          {n.message}
                        </p>
                      </div>
                      {!n.read && (
                        <div
                          style={{
                            alignSelf: 'center',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User profile */}
        <div className="user-profile">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">Alex Carter</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>

      {/* Asset Quick Detail Modal */}
      {selectedAsset && (
        <Modal isOpen={!!selectedAsset} onClose={() => setSelectedAsset(null)}>
          <Modal.Header onClose={() => setSelectedAsset(null)}>Asset Specification Detail</Modal.Header>
          <Modal.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {selectedAsset.assetName}
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                    Code: <strong>{selectedAsset.assetCode}</strong>
                  </span>
                </div>
                <StatusBadge status={selectedAsset.status} />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  backgroundColor: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  padding: '1rem',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Category</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {selectedAsset.category}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Condition</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {selectedAsset.condition || 'Good'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Purchase Date</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {formatDate(selectedAsset.purchaseDate)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Value</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)' }}>
                    {formatCurrency(selectedAsset.value)}
                  </span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => {
                setSelectedAsset(null);
                navigate(`/assets`);
              }}
              className="btn btn-primary"
            >
              Go to Assets Registry
            </button>
            <button onClick={() => setSelectedAsset(null)} className="btn btn-secondary">
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </header>
  );
};
