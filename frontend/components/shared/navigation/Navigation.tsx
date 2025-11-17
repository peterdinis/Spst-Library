"use client"

import { ReactNode, useState, useEffect, useRef, FC } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  BookOpen,
  Home,
  Search,
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
  Mail,
  HelpCircle,
  BookText,
  FolderTree,
  PenTool,
  Building,
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

const LibraryNavigation: FC<NavigationProps> = ({
  userRole = 'student',
  notificationCount = 0,
  userName = 'Študent',
}) => {
  const styles = useNavigationStyles();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('domov');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on resize and handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
      if (window.innerWidth < 1024) {
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation data based on user role
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        id: 'domov',
        label: 'Domov',
        href: '/',
        icon: <Home size={20} />,
      },
      {
        id: 'knihy',
        label: 'Knihy',
        href: '/books',
        icon: <BookOpen size={20} />,
        badge: notificationCount,
      },
      {
        id: 'kategorie',
        label: 'Kategórie',
        href: '/categories',
        icon: <FolderTree size={20} />,
      },
      {
        id: 'spisovatelia',
        label: 'Spisovatelia',
        href: '/authors',
        icon: <PenTool size={20} />,
      },
      {
        id: 'vydavatelstva',
        label: 'Vydavateľstvá',
        href: '/publishers',
        icon: <Building size={20} />,
      },
    ];

    const studentItems: NavItem[] = [
      ...baseItems,
      {
        id: 'vyhladavanie',
        label: 'Vyhľadávanie',
        href: '/search',
        icon: <Search size={20} />,
      },
    ];

    const librarianItems: NavItem[] = [
      ...baseItems,
      {
        id: 'sprava',
        label: 'Správa',
        href: '#',
        icon: <Settings size={20} />,
        requiresAuth: true,
        children: [
          {
            id: 'sprava-knih',
            label: 'Správa kníh',
            href: '/admin/books',
            icon: <BookText size={16} />,
          },
          {
            id: 'sprava-pouzivatelov',
            label: 'Správa používateľov',
            href: '/admin/users',
            icon: <Users size={16} />,
          },
          {
            id: 'ziadosti-o-vypozicky',
            label: 'Žiadosti o výpožičky',
            href: '/admin/requests',
            icon: <Bell size={16} />,
            badge: 3,
          },
          {
            id: 'sprava-kategorii',
            label: 'Správa kategórií',
            href: '/admin/categories',
            icon: <FolderTree size={16} />,
          },
        ],
      },
      {
        id: 'reporty',
        label: 'Reporty & Štatistiky',
        href: '/admin/reports',
        icon: <BarChart3 size={20} />,
        requiresAuth: true,
      },
    ];

    const adminItems: NavItem[] = [
      ...librarianItems,
      {
        id: 'system',
        label: 'Systém',
        href: '#',
        icon: <Shield size={20} />,
        requiresAuth: true,
        children: [
          {
            id: 'systemove-nastavenia',
            label: 'Systémové nastavenia',
            href: '/admin/settings',
            icon: <Settings size={16} />,
          },
          {
            id: 'sprava-rol',
            label: 'Správa rolí',
            href: '/admin/roles',
            icon: <Users size={16} />,
          },
          {
            id: 'databaza',
            label: 'Správa databázy',
            href: '/admin/database',
            icon: <Library size={16} />,
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
        duration: 0.15,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
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
        delay: i * 0.08,
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
      if (window.innerWidth < 1024) {
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
              <Tooltip content="Vyžaduje prihlásenie" relationship="description">
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
                    if (window.innerWidth < 1024) {
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
              <span className={styles.brandName}>SPŠT Knižnica</span>
              <span className={styles.brandSubtitle}>Vzdelávacie centrum</span>
            </div>
          </div>

          <div className={styles.navItems}>
            {navItems.map((item, index) => renderNavItem(item, index))}
          </div>

          <div className={styles.navActions}>
            <Tooltip content={isDarkMode ? "Prepnúť na svetlý režim" : "Prepnúť na tmavý režim"} relationship="description">
              <Button
                appearance="subtle"
                onClick={handleThemeToggle}
                icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                className={styles.themeToggle}
              />
            </Tooltip>

            {/* Desktop User Menu */}
            <div className={styles.userMenu} ref={userMenuRef}>
              <Tooltip content="Menu účtu" relationship="description">
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
                  <span className={styles.userName}>{userName.split(' ')[0]}</span>
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
                          {userRole === 'admin' ? 'Administrátor' :
                            userRole === 'librarian' ? 'Knihovník' : 'Študent'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.dropdownItems}>
                      <a href="/profile" className={styles.dropdownLink}>
                        <UserCircle size={18} />
                        <span>Môj profil</span>
                      </a>
                      <a href="/notifications" className={styles.dropdownLink}>
                        <Bell size={18} />
                        <span>Notifikácie</span>
                        {notificationCount > 0 && (
                          <Badge size="small" appearance="filled" color="danger">
                            {notificationCount}
                          </Badge>
                        )}
                      </a>
                      <a href="/messages" className={styles.dropdownLink}>
                        <Mail size={18} />
                        <span>Správy</span>
                        <Badge size="small" appearance="filled">2</Badge>
                      </a>
                      <a href="/settings" className={styles.dropdownLink}>
                        <Settings size={18} />
                        <span>Nastavenia</span>
                      </a>
                      <a href="/help" className={styles.dropdownLink}>
                        <HelpCircle size={18} />
                        <span>Pomoc & Podpora</span>
                      </a>
                      <div className={styles.dropdownDivider} />
                      <a href="/logout" className={styles.dropdownLink}>
                        <LogOut size={18} />
                        <span>Odhlásiť sa</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>

        {/* Tablet Navigation Header */}
        <div className={`${styles.tabletNavHeader} ${styles.responsiveShowTablet}`}>
          <div className={styles.tabletNavTop}>
            <Button
              appearance="subtle"
              icon={isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={styles.tabletToggle}
            />
            
            <div className={styles.tabletBrand}>
              <motion.div
                className={styles.tabletLogo}
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                📚
              </motion.div>
              <span>SPŠT Knižnica</span>
            </div>

            <div className={styles.tabletActions}>
              <Button
                appearance="subtle"
                onClick={handleThemeToggle}
                icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                className={styles.themeToggleTablet}
              />
              {notificationCount > 0 && (
                <Badge size="small" appearance="filled" color="danger" className={styles.tabletBadge}>
                  {notificationCount}
                </Badge>
              )}
              <Avatar
                size={32}
                name={userName}
                color="brand"
                onClick={handleUserMenuToggle}
                className={styles.tabletAvatar}
              />
            </div>
          </div>

          {/* Tablet Quick Actions */}
          <div className={styles.tabletQuickNav}>
            {navItems.slice(0, 5).map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                className={`${styles.quickNavItem} ${activeItem === item.id ? styles.quickNavItemActive : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.id);
                  console.log(`Navigating to: ${item.href}`);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.quickNavIcon}>
                  {item.icon}
                </span>
                <span className={styles.quickNavLabel}>{item.label}</span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Header */}
        <div className={`${styles.mobileNavHeader} ${styles.responsiveShowMobile} ${isScrolled ? styles.scrolled : ''
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
            <span>SPŠT Knižnica</span>
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
              onClick={handleUserMenuToggle}
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
                        {userRole === 'admin' ? 'Administrátor' :
                          userRole === 'librarian' ? 'Knihovník' : 'Študent'}
                      </span>
                    </div>
                    <Button
                      appearance="subtle"
                      icon={<X size={20} />}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={styles.closeMobileMenu}
                    />
                  </div>
                </div>

                <div className={styles.mobileNavContent}>
                  {navItems.map((item, index) => renderNavItem(item, index, true))}
                </div>

                <div className={styles.mobileNavFooter}>
                  <div className={styles.mobileFooterActions}>
                    <Button
                      appearance="subtle"
                      onClick={handleThemeToggle}
                      icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                      className={styles.themeToggleMobile}
                    >
                      {isDarkMode ? 'Svetlý režim' : 'Tmavý režim'}
                    </Button>
                    <Button
                      appearance="subtle"
                      href="/help"
                      icon={<HelpCircle size={18} />}
                    >
                      Pomoc
                    </Button>
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* Mobile & Tablet User Menu */}
        <AnimatePresence>
          {isUserMenuOpen && window.innerWidth < 1024 && (
            <>
              <motion.div
                className={styles.mobileOverlay}
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <motion.div
                className={styles.mobileUserMenu}
                ref={mobileUserMenuRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.mobileUserHeader}>
                  <Avatar
                    size={48}
                    name={userName}
                    color="brand"
                  />
                  <div className={styles.mobileUserInfo}>
                    <strong>{userName}</strong>
                    <span className={styles.mobileUserRole}>
                      {userRole === 'admin' ? 'Administrátor' :
                        userRole === 'librarian' ? 'Knihovník' : 'Študent'}
                    </span>
                  </div>
                  <Button
                    appearance="subtle"
                    icon={<X size={20} />}
                    onClick={() => setIsUserMenuOpen(false)}
                    className={styles.closeUserMenu}
                  />
                </div>

                <div className={styles.dropdownItems}>
                  <a href="/profile" className={styles.dropdownLink}>
                    <UserCircle size={18} />
                    <span>Môj profil</span>
                  </a>
                  <a href="/notifications" className={styles.dropdownLink}>
                    <Bell size={18} />
                    <span>Notifikácie</span>
                    {notificationCount > 0 && (
                      <Badge size="small" appearance="filled" color="danger">
                        {notificationCount}
                      </Badge>
                    )}
                  </a>
                  <a href="/messages" className={styles.dropdownLink}>
                    <Mail size={18} />
                    <span>Správy</span>
                    <Badge size="small" appearance="filled">2</Badge>
                  </a>
                  <a href="/settings" className={styles.dropdownLink}>
                    <Settings size={18} />
                    <span>Nastavenia</span>
                  </a>
                  <a href="/help" className={styles.dropdownLink}>
                    <HelpCircle size={18} />
                    <span>Pomoc & Podpora</span>
                  </a>
                  <div className={styles.dropdownDivider} />
                  <a href="/logout" className={styles.dropdownLink}>
                    <LogOut size={18} />
                    <span>Odhlásiť sa</span>
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </FluentProvider>
  );
};

export default LibraryNavigation;