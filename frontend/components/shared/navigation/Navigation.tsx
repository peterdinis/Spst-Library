"use client"

import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  BookOpen,
  Home,
  Search,
  History,
  User,
  Settings,
  Library,
  Users,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  UserCircle,
  ChevronDown,
  Bell,
  Shield,
  Bookmark,
} from 'lucide-react';
import {
  Button,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Badge,
  Avatar,
  Tooltip,
} from '@fluentui/react-components';
import { useNavigationStyles } from './useNavigationStyles';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  children?: NavItem[];
  requiresAuth?: boolean;
}

export interface NavigationProps {
  userRole?: 'student' | 'librarian' | 'admin' | null;
  notificationCount?: number;
  userName?: string;
  userGrade?: string;
  studentId?: string;
}

const LibraryNavigation: React.FC<NavigationProps> = ({
  userRole = 'student',
  notificationCount = 0,
  userName = 'Student',
  userGrade = 'Grade 10',
  studentId = 'S12345'
}) => {
  const styles = useNavigationStyles();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
      setIsUserMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation data based on user role
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        href: '/',
        icon: <Home size={20} />,
      },
      {
        id: 'catalog',
        label: 'Book Catalog',
        href: '/catalog',
        icon: <BookOpen size={20} />,
        badge: notificationCount,
      },
      {
        id: 'search',
        label: 'Search',
        href: '/search',
        icon: <Search size={20} />,
      },
    ];

    const studentItems: NavItem[] = [
      ...baseItems,
      {
        id: 'my-books',
        label: 'My Books',
        href: '/my-books',
        icon: <Library size={20} />,
        requiresAuth: true,
        children: [
          {
            id: 'currently-reading',
            label: 'Currently Reading',
            href: '/my-books/current',
            icon: <Bookmark size={16} />,
          },
          {
            id: 'favorites',
            label: 'Favorites',
            href: '/my-books/favorites',
            icon: <Bookmark size={16} />,
          },
        ],
      },
      {
        id: 'borrowing-history',
        label: 'Borrowing History',
        href: '/history',
        icon: <History size={20} />,
        requiresAuth: true,
      },
    ];

    const librarianItems: NavItem[] = [
      ...baseItems,
      {
        id: 'management',
        label: 'Management',
        href: '#',
        icon: <Settings size={20} />,
        requiresAuth: true,
        children: [
          {
            id: 'manage-books',
            label: 'Manage Books',
            href: '/admin/books',
            icon: <BookOpen size={16} />,
          },
          {
            id: 'manage-members',
            label: 'Library Members',
            href: '/admin/members',
            icon: <Users size={16} />,
          },
          {
            id: 'borrow-requests',
            label: 'Borrow Requests',
            href: '/admin/requests',
            icon: <Bell size={16} />,
            badge: 3,
          },
        ],
      },
      {
        id: 'reports',
        label: 'Reports & Analytics',
        href: '/admin/reports',
        icon: <BarChart3 size={20} />,
        requiresAuth: true,
      },
    ];

    const adminItems: NavItem[] = [
      ...librarianItems,
      {
        id: 'system',
        label: 'System',
        href: '#',
        icon: <Shield size={20} />,
        requiresAuth: true,
        children: [
          {
            id: 'system-settings',
            label: 'System Settings',
            href: '/admin/settings',
            icon: <Settings size={16} />,
          },
          {
            id: 'user-management',
            label: 'User Management',
            href: '/admin/users',
            icon: <Users size={16} />,
          },
        ],
      },
    ];

    switch (userRole) {
      case 'librarian':
        return librarianItems;
      case 'admin':
        return adminItems;
      case 'student':
      default:
        return studentItems;
    }
  };

  const navItems = getNavItems();

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      pointerEvents: 'none',
    },
    open: {
      opacity: 1,
      pointerEvents: 'auto',
    },
  };

  const dropdownVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
      },
    },
  };

  const navItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
      },
    }),
  };

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setActiveItem(item.id);

    if (item.children) {
      setOpenDropdown(openDropdown === item.id ? null : item.id);
    } else {
      setOpenDropdown(null);
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false);
      }
      // Here you would typically use router.push(item.href) for navigation
      console.log(`Navigating to: ${item.href}`);
    }
  };

  const handleUserMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
    setOpenDropdown(null);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderNavItem = (item: NavItem, index: number, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdown === item.id;

    return (
      <motion.div
        key={item.id}
        custom={index}
        variants={navItemVariants as unknown as Variants}
        className={styles.navItem}
      >
        <motion.div className={styles.navItemWrapper}>
          <motion.a
            href={item.href}
            className={`${styles.navLink} ${activeItem === item.id ? styles.navLinkActive : ''} ${hasChildren ? styles.hasDropdown : ''
              }`}
            onClick={(e) => handleNavClick(item, e)}
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={styles.navIcon}>
              {item.badge && item.badge > 0 ? (
                <div className={styles.badgeContainer}>
                  {item.icon}
                  <Badge size="small" appearance="filled" color="danger" className={styles.floatingBadge}>
                    {item.badge}
                  </Badge>
                </div>
              ) : (
                item.icon
              )}
            </span>
            <span className={styles.navLabel}>{item.label}</span>
            {hasChildren && (
              <motion.span
                className={styles.dropdownChevron}
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.span>
            )}
            {item.requiresAuth && (
              <Tooltip content="Requires login" relationship="description">
                <span className={styles.authIndicator}>🔒</span>
              </Tooltip>
            )}
          </motion.a>

          {/* Dropdown Menu */}
          {hasChildren && isDropdownOpen && (
            <motion.div
              className={styles.dropdownMenu}
              variants={dropdownVariants as unknown as Variants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              {item.children!.map((child) => (
                <a
                  key={child.id}
                  href={child.href}
                  className={`${styles.dropdownItem} ${activeItem === child.id ? styles.dropdownItemActive : ''
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(child.id);
                    setOpenDropdown(null);
                    if (window.innerWidth < 768) {
                      setIsMobileMenuOpen(false);
                    }
                    console.log(`Navigating to: ${child.href}`);
                  }}
                >
                  <span className={styles.dropdownIcon}>{child.icon}</span>
                  <span className={styles.dropdownLabel}>{child.label}</span>
                  {child.badge && child.badge > 0 && (
                    <Badge size="small" appearance="filled" color="danger">
                      {child.badge}
                    </Badge>
                  )}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <div className={styles.navigationContainer}>
        {/* Desktop Navigation */}
        <motion.nav
          className={`${styles.desktopNav} ${styles.responsiveHide} ${isScrolled ? styles.scrolled : ''
            }`}
          initial={false}
        >
          <div className={styles.navBrand}>
            <motion.div
              className={styles.logo}
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              📚
            </motion.div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>School Library</span>
              <span className={styles.brandSubtitle}>Knowledge Hub</span>
            </div>
          </div>

          <div className={styles.navItems}>
            {navItems.map((item, index) => renderNavItem(item, index))}
          </div>

          <div className={styles.navActions}>
            <Tooltip content={isDarkMode ? "Switch to light mode" : "Switch to dark mode"} relationship="description">
              <Button
                appearance="subtle"
                onClick={handleThemeToggle}
                icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                className={styles.themeToggle}
              />
            </Tooltip>

            <div className={styles.userMenu}>
              <Tooltip content="Account menu" relationship="description">
                <Button
                  appearance="subtle"
                  onClick={handleUserMenuToggle}
                  icon={
                    <Avatar
                      size={32}
                      name={userName}
                      color="brand"
                      className={styles.userAvatar}
                    />
                  }
                  className={styles.userButton}
                >
                  <span className={styles.userName}>{userName}</span>
                  <motion.span
                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                </Button>
              </Tooltip>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className={styles.userDropdown}
                    variants={dropdownVariants as unknown as Variants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.userInfo}>
                      <Avatar
                        size={48}
                        name={userName}
                        color="brand"
                      />
                      <div className={styles.userDetails}>
                        <strong>{userName}</strong>
                        <span className={styles.userRole}>
                          {userRole === 'admin' ? 'Administrator' :
                            userRole === 'librarian' ? 'Librarian' : 'Student'}
                        </span>
                        <span className={styles.userId}>{studentId}</span>
                      </div>
                    </div>

                    <div className={styles.dropdownItems}>
                      <a href="/profile" className={styles.dropdownLink}>
                        <UserCircle size={18} />
                        <span>My Profile</span>
                      </a>
                      <a href="/settings" className={styles.dropdownLink}>
                        <Settings size={18} />
                        <span>Settings</span>
                      </a>
                      <div className={styles.dropdownDivider} />
                      <a href="/logout" className={styles.dropdownLink}>
                        <LogOut size={18} />
                        <span>Logout</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>

        {/* Mobile Navigation Header */}
        <div className={`${styles.mobileNavHeader} ${styles.responsiveShow} ${isScrolled ? styles.scrolled : ''
          }`}>
          <Button
            appearance="subtle"
            icon={isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={styles.mobileToggle}
          />

          <div className={styles.mobileBrand}>
            <motion.div
              className={styles.mobileLogo}
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              📚
            </motion.div>
            <span>School Library</span>
          </div>

          <div className={styles.mobileActions}>
            {notificationCount > 0 && (
              <Badge size="small" appearance="filled" color="danger" className={styles.mobileBadge}>
                {notificationCount}
              </Badge>
            )}
            <Avatar
              size={32}
              name={userName}
              color="brand"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={styles.mobileAvatar}
            />
          </div>
        </div>

        {/* Mobile Menu Overlay and Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className={styles.mobileOverlay}
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <motion.nav
                className={styles.mobileNav}
                variants={mobileMenuVariants as unknown as Variants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className={styles.mobileNavHeader}>
                  <div className={styles.userProfile}>
                    <Avatar
                      size={48}
                      name={userName}
                      color="brand"
                    />
                    <div className={styles.userInfo}>
                      <strong>{userName}</strong>
                      <span className={styles.userDetails}>
                        {userRole === 'admin' ? 'Administrator' :
                          userRole === 'librarian' ? 'Librarian' : 'Student'} • {studentId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.mobileNavContent}>
                  {navItems.map((item, index) => renderNavItem(item, index, true))}
                </div>

                <div className={styles.mobileNavFooter}>
                  <Button
                    appearance="subtle"
                    onClick={handleThemeToggle}
                    icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    className={styles.themeToggleMobile}
                  >
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* Mobile User Menu */}
        <AnimatePresence>
          {isUserMenuOpen && window.innerWidth < 768 && (
            <motion.div
              className={styles.mobileUserMenu}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.dropdownItems}>
                <a href="/profile" className={styles.dropdownLink}>
                  <UserCircle size={18} />
                  <span>My Profile</span>
                </a>
                <a href="/settings" className={styles.dropdownLink}>
                  <Settings size={18} />
                  <span>Settings</span>
                </a>
                <div className={styles.dropdownDivider} />
                <a href="/logout" className={styles.dropdownLink}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FluentProvider>
  );
};

export default LibraryNavigation;