import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }
      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    mobileMenuRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-text">BimaNiti</span>
        </Link>
        <div className="desktop-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          <NavLink to="/blog" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Blog
          </NavLink>
          <NavLink to="/news" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            News
          </NavLink>
          <NavLink to="/archives" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Archives
          </NavLink>
          <NavLink to="/about" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            About
          </NavLink>
          <NavLink to="/contact" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Contact
          </NavLink>
          <button className="theme-toggle" aria-label="Toggle dark mode" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
        <button
          ref={menuBtnRef}
          className="mobile-menu-btn"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMobileMenuOpen ? 'close-icon' : 'menu-icon'}>
            {isMobileMenuOpen ? (
              <>
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </>
            ) : (
              <>
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
              </>
            )}
          </svg>
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={closeMobileMenu} aria-hidden="true" />
      )}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        inert={!isMobileMenuOpen ? '' : undefined}
      >
        <div className="mobile-nav-content">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={closeMobileMenu}>
            Home
          </NavLink>
          <NavLink to="/blog" end className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={closeMobileMenu}>
            Blog
          </NavLink>
          <NavLink to="/news" end className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={closeMobileMenu}>
            News
          </NavLink>
          <NavLink to="/archives" end className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={closeMobileMenu}>
            Archives
          </NavLink>
          <NavLink to="/about" end className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={closeMobileMenu}>
            About
          </NavLink>
          <NavLink to="/contact" end className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={closeMobileMenu}>
            Contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
