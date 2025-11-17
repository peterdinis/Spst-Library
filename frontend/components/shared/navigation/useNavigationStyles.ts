// styles/useNavigationStyles.ts
import { makeStyles, tokens } from '@fluentui/react-components';

export const useNavigationStyles = makeStyles({
  // Main container
  navigationContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: tokens.fontFamilyBase,
  },

  // Desktop Navigation
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 2rem',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    
    ':global(.scrolled)': {
      backgroundColor: tokens.colorNeutralBackground1,
      borderBottomColor: tokens.colorNeutralStroke1,
      boxShadow: tokens.shadow8,
    },
  },

  scrolled: {
    backgroundColor: `${tokens.colorNeutralBackground1} !important`,
    borderBottomColor: `${tokens.colorNeutralStroke1} !important`,
    boxShadow: `${tokens.shadow8} !important`,
  },

  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexShrink: 0,
  },

  logo: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    cursor: 'pointer',
  },

  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },

  brandName: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: '1.25rem',
    color: tokens.colorBrandForeground1,
  },

  brandSubtitle: {
    fontSize: '0.75rem',
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
  },

  navItems: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    flex: 1,
    justifyContent: 'center',
  },

  navItem: {
    position: 'relative',
  },

  navItemWrapper: {
    position: 'relative',
  },

  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    borderRadius: tokens.borderRadiusMedium,
    transition: `all ${tokens.durationFast} ${tokens.curveEasyEase}`,
    position: 'relative',
    fontWeight: tokens.fontWeightMedium,
    border: `1px solid transparent`,
    cursor: 'pointer',
    minHeight: '40px',
    
    ':hover': {
      color: tokens.colorBrandForeground1,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  navLinkActive: {
    color: `${tokens.colorBrandForeground1} !important`,
    backgroundColor: tokens.colorBrandBackground2,
  },

  hasDropdown: {
    paddingRight: '2rem',
  },

  navIcon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
    width: '20px',
    height: '20px',
    position: 'relative',
  },

  navLabel: {
    whiteSpace: 'nowrap',
  },

  badgeContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  floatingBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    minWidth: '16px',
    height: '16px',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  authIndicator: {
    fontSize: '0.75rem',
    opacity: 0.7,
  },

  dropdownChevron: {
    position: 'absolute',
    right: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    color: tokens.colorNeutralForeground3,
  },

  // Dropdown Menu
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '0.25rem',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    padding: '0.5rem',
    minWidth: '220px',
    zIndex: 1001,
    overflow: 'hidden',
  },

  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    borderRadius: tokens.borderRadiusSmall,
    transition: `all ${tokens.durationFast} ${tokens.curveEasyEase}`,
    cursor: 'pointer',
    
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorBrandForeground1,
    },
  },

  dropdownItemActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },

  dropdownIcon: {
    display: 'flex',
    alignItems: 'center',
    width: '16px',
    height: '16px',
  },

  dropdownLabel: {
    flex: 1,
    fontSize: '0.9rem',
  },

  // User Menu
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexShrink: 0,
  },

  themeToggle: {
    minWidth: 'auto',
    padding: '0.5rem',
  },

  userMenu: {
    position: 'relative',
  },

  userButton: {
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
  },

  userAvatar: {
    flexShrink: 0,
  },

  userName: {
    fontSize: '0.9rem',
    fontWeight: tokens.fontWeightMedium,
  },

  userDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    padding: '1rem',
    minWidth: '280px',
    zIndex: 1001,
  },

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '1rem',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: '0.5rem',
  },

  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
  },

  userRole: {
    fontSize: '0.875rem',
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightMedium,
  },

  userId: {
    fontSize: '0.75rem',
    color: tokens.colorNeutralForeground4,
  },

  dropdownItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },

  dropdownLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    borderRadius: tokens.borderRadiusSmall,
    transition: `all ${tokens.durationFast} ${tokens.curveEasyEase}`,
    cursor: 'pointer',
    
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorBrandForeground1,
    },
  },

  dropdownDivider: {
    height: '1px',
    backgroundColor: tokens.colorNeutralStroke2,
    margin: '0.5rem 0',
  },

  // Tablet Navigation
  tabletNavHeader: {
    display: 'none',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backdropFilter: 'blur(10px)',
  },

  tabletNavTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
  },

  tabletBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    flex: 1,
    justifyContent: 'center',
  },

  tabletLogo: {
    fontSize: '1.5rem',
    cursor: 'pointer',
  },

  tabletActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  tabletBadge: {
    flexShrink: 0,
  },

  tabletAvatar: {
    flexShrink: 0,
    cursor: 'pointer',
  },

  tabletToggle: {
    minWidth: 'auto',
    padding: '0.5rem',
  },

  themeToggleTablet: {
    minWidth: 'auto',
    padding: '0.5rem',
  },

  tabletQuickNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '0.5rem 1rem',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  quickNavItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    borderRadius: tokens.borderRadiusMedium,
    transition: `all ${tokens.durationFast} ${tokens.curveEasyEase}`,
    cursor: 'pointer',
    minWidth: '60px',
    
    ':hover': {
      color: tokens.colorBrandForeground1,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  quickNavItemActive: {
    color: `${tokens.colorBrandForeground1} !important`,
    backgroundColor: tokens.colorBrandBackground2,
  },

  quickNavIcon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
  },

  quickNavLabel: {
    fontSize: '0.7rem',
    fontWeight: tokens.fontWeightMedium,
    textAlign: 'center',
  },

  // Mobile Navigation
  mobileNavHeader: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },

  mobileBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    flex: 1,
    justifyContent: 'center',
  },

  mobileLogo: {
    fontSize: '1.5rem',
    cursor: 'pointer',
  },

  mobileActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  mobileBadge: {
    flexShrink: 0,
  },

  mobileAvatar: {
    flexShrink: 0,
    cursor: 'pointer',
  },

  mobileToggle: {
    minWidth: 'auto',
    padding: '0.5rem',
  },

  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },

  mobileNav: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '320px',
    maxWidth: '85vw',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: tokens.shadow16,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
  },

  mobileNavContent: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
  },

  mobileNavFooter: {
    padding: '1rem',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  mobileFooterActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorBrandBackground2,
    position: 'relative',
  },

  closeMobileMenu: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    minWidth: 'auto',
    padding: '0.5rem',
  },

  themeToggleMobile: {
    width: '100%',
    justifyContent: 'flex-start',
  },

  mobileUserMenu: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    padding: '1rem',
    width: '90vw',
    maxWidth: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
    zIndex: 1001,
  },

  mobileUserHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '1rem',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: '0.5rem',
    position: 'relative',
  },

  mobileUserInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
  },

  mobileUserRole: {
    fontSize: '0.875rem',
    color: tokens.colorNeutralForeground3,
  },

  closeUserMenu: {
    position: 'absolute',
    top: '0',
    right: '0',
    minWidth: 'auto',
    padding: '0.5rem',
  },

  // Responsive
  responsiveHide: {
    '@media (max-width: 1023px)': {
      display: 'none !important',
    },
  },

  responsiveShowTablet: {
    display: 'none',
    '@media (min-width: 768px) and (max-width: 1023px)': {
      display: 'flex !important',
    },
  },

  responsiveShowMobile: {
    display: 'none',
    '@media (max-width: 767px)': {
      display: 'flex !important',
    },
  },
});