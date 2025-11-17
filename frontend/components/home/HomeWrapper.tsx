"use client"

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  BookOpen,
  Search,
  Users,
  BarChart3,
  ArrowRight,
  Star,
  TrendingUp,
  Library,
  Bookmark,
  Award,
  GraduationCap,
  Calendar,
  ChevronRight,
  Play,
  Pause,
  Clock,
  Eye,
  Heart,
  Share2,
  BookText,
  Sparkles,
  Zap,
  Rocket,
  Coffee,
  Lightbulb,
  Target
} from 'lucide-react';
import {
  Button,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Card,
  CardHeader,
  CardPreview,
  CardFooter,
  Badge,
  Avatar,
  Text,
  Title1,
  Title2,
  Title3,
  Subtitle1,
  Body1,
  Body2,
  Caption1,
  tokens,
  makeStyles,
} from '@fluentui/react-components';

const useHomeStyles = makeStyles({
  // Main container
  homeContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  // Glass morphism effects
  glassCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
  },

  glassNav: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },

  // Animated background elements
  floatingOrbs: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    filter: 'blur(40px)',
  },

  orb1: {
    top: '10%',
    left: '10%',
    width: '300px',
    height: '300px',
    animation: 'float 8s ease-in-out infinite',
  },

  orb2: {
    top: '60%',
    right: '10%',
    width: '400px',
    height: '400px',
    animation: 'float 6s ease-in-out infinite 1s',
  },

  orb3: {
    bottom: '20%',
    left: '20%',
    width: '200px',
    height: '200px',
    animation: 'float 10s ease-in-out infinite 2s',
  },

  // Hero section
  heroSection: {
    position: 'relative',
    padding: '140px 2rem 100px',
    textAlign: 'center',
    color: 'white',
    maxWidth: '1400px',
    margin: '0 auto',
  },

  heroContent: {
    position: 'relative',
    zIndex: 2,
  },

  heroTitle: {
    fontSize: '5rem',
    fontWeight: 800,
    marginBottom: '1.5rem',
    background: 'linear-gradient(45deg, #fff 20%, #a5b4fc 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },

  heroSubtitle: {
    fontSize: '1.4rem',
    marginBottom: '3rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 3rem',
    lineHeight: 1.6,
    fontWeight: 300,
    letterSpacing: '0.01em',
  },

  ctaButtons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '4rem',
  },

  primaryButton: {
    background: 'linear-gradient(45deg, #ff6b6b, #ffa726)',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 32px',
    fontSize: '1.1rem',
    fontWeight: 600,
    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
    
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
    },
  },

  secondaryButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    padding: '16px 32px',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'white',
    
    ':hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },

  // Features section
  featuresSection: {
    padding: '120px 2rem',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    position: 'relative',
  },

  sectionTitle: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '3.5rem',
    fontWeight: 800,
    background: 'linear-gradient(45deg, #fff 30%, #94a3b8 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },

  sectionSubtitle: {
    textAlign: 'center',
    marginBottom: '4rem',
    fontSize: '1.3rem',
    color: '#94a3b8',
    maxWidth: '600px',
    margin: '0 auto 4rem',
    lineHeight: 1.6,
    fontWeight: 300,
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2.5rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },

  featureCard: {
    background: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '2.5rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    
    ':hover': {
      transform: 'translateY(-12px) scale(1.02)',
      boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)',
    },
  },

  featureIconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
  },

  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: 'white',
  },

  featureDescription: {
    color: '#94a3b8',
    lineHeight: 1.6,
    fontSize: '1.1rem',
  },

  // Books section
  booksSection: {
    padding: '120px 2rem',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  },

  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2.5rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },

  bookCard: {
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.4s ease',
    
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    },
  },

  bookImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  },

  bookContent: {
    padding: '1.5rem',
  },

  bookTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: 'white',
    lineHeight: 1.3,
  },

  bookAuthor: {
    color: '#94a3b8',
    marginBottom: '1rem',
    fontSize: '1rem',
  },

  bookStats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
  },

  // Stats section
  statsSection: {
    padding: '100px 2rem',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  statCard: {
    textAlign: 'center',
    padding: '3rem 2rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    
    ':hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateY(-5px)',
    },
  },

  statIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
  },

  // CTA section
  ctaSection: {
    padding: '120px 2rem',
    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  ctaTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    marginBottom: '1.5rem',
    color: 'white',
    letterSpacing: '-0.02em',
  },

  ctaSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '3rem',
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '600px',
    margin: '0 auto 3rem',
    lineHeight: 1.6,
    fontWeight: 300,
  },

  // Animations
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
  },

  '@keyframes glow': {
    '0%, 100%': {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
    },
    '50%': {
      boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)',
    },
  },

  // Responsive
  responsiveText: {
    '@media (max-width: 768px)': {
      fontSize: '3rem !important',
    },
    '@media (max-width: 480px)': {
      fontSize: '2.2rem !important',
    },
  },
});

interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  rating: number;
  borrowCount: number;
  category: string;
  description: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
}

// Properly typed animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const heroVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.3,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const scaleIn: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const HomeWrapper: React.FC = () => {
  const styles = useHomeStyles();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sample data with better content
  const popularBooks: Book[] = [
    {
      id: '1',
      title: 'Umelá Inteligencia v Praxi',
      author: 'Prof. Peter Novák',
      coverColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      rating: 4.9,
      borrowCount: 234,
      category: 'Technológie',
      description: 'Moderný pohľad na aplikácie AI v každodennom živote'
    },
    {
      id: '2',
      title: 'Kvantová Fyzika Pre Začiatočníkov',
      author: 'Dr. Elena Kováčová',
      coverColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      rating: 4.7,
      borrowCount: 189,
      category: 'Veda',
      description: 'Jednoduché vysvetlenie komplexných kvantových javov'
    },
    {
      id: '3',
      title: 'Digitálna Transformácia Spoločnosti',
      author: 'Ing. Martin Varga',
      coverColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      rating: 4.8,
      borrowCount: 156,
      category: 'Sociológia',
      description: 'Ako technológie menia našu spoločnosť'
    },
    {
      id: '4',
      title: 'Budúcnosť Vzdelávania',
      author: 'Mgr. Zuzana Horváthová',
      coverColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      rating: 4.6,
      borrowCount: 278,
      category: 'Vzdelávanie',
      description: 'Inovatívne prístupy k modernému vzdelávaniu'
    },
  ];

  const features: Feature[] = [
    {
      id: '1',
      title: 'Inteligentné Vyhľadávanie',
      description: 'Pokročilý vyhľadávací systém s AI odporúčaním a filtrami pre rýchle nájdenie potrebných materiálov.',
      icon: <Zap size={32} />,
      gradient: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
    },
    {
      id: '2',
      title: 'Digitálna Knižnica',
      description: 'Prístup k tisícom digitálnych kníh, vedeckých článkov a výskumných prác kedykoľvek a kdekoľvek.',
      icon: <BookText size={32} />,
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    {
      id: '3',
      title: 'Personalizované Odporúčania',
      description: 'Systém šitý na mieru, ktorý sa učí z vašich preferencií a navrhuje relevantný obsah.',
      icon: <Sparkles size={32} />,
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    },
    {
      id: '4',
      title: 'Komunitné Fórum',
      description: 'Prostredie pre diskusie, zdieľanie poznatkov a spoluprácu medzi študentmi a pedagógmi.',
      icon: <Users size={32} />,
      gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    },
  ];

  const stats = [
    { number: '25K+', label: 'Digitálnych Kníh', icon: <BookText size={32} /> },
    { number: '15K+', label: 'Aktívnych Čitateľov', icon: <Users size={32} /> },
    { number: '98%', label: 'Spokojných Používateľov', icon: <Heart size={32} /> },
    { number: '24/7', label: 'Dostupná Podpora', icon: <Clock size={32} /> },
  ];

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <div className={styles.homeContainer}>
        {/* Animated Background Orbs */}
        <div className={`${styles.floatingOrbs} ${styles.orb1}`} />
        <div className={`${styles.floatingOrbs} ${styles.orb2}`} />
        <div className={`${styles.floatingOrbs} ${styles.orb3}`} />

        {/* Hero Section */}
        <motion.section
          className={styles.heroSection}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className={styles.heroContent}>
            <motion.div variants={heroVariants}>
              <motion.h1 
                className={`${styles.heroTitle} ${styles.responsiveText}`}
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.4 }}
              >
                Objavte Svet
                <motion.span
                  style={{ display: 'block', background: 'linear-gradient(45deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Vedomostí
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className={styles.heroSubtitle}
                variants={fadeInUp}
              >
                Moderná digitálna knižnica SPŠT ponúka prístup k tisícom kníh, 
                výskumných prác a vzdelávacích materiálov. Posúvame hranice vzdelávania.
              </motion.p>
            </motion.div>

            <motion.div 
              className={styles.ctaButtons}
              variants={containerVariants}
            >
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className={styles.primaryButton}
                  icon={<Rocket size={20} />}
                  iconPosition="before"
                >
                  Začať Objavovať
                </Button>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className={styles.secondaryButton}
                  icon={<Play size={20} />}
                  iconPosition="before"
                >
                  Prehliadka Knižnice
                </Button>
              </motion.div>
            </motion.div>

            {/* Live Stats */}
            <motion.div
              variants={fadeInUp}
              style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}
            >
              {stats.slice(0, 3).map((stat, index) => (
                <motion.div
                  key={stat.label}
                  style={{ textAlign: 'center' }}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div 
                    style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, delay: index * 0.5, repeat: Infinity }}
                  >
                    {stat.number}
                  </motion.div>
                  <div style={{ fontSize: '1rem', opacity: 0.8 }}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 className={styles.sectionTitle} variants={fadeInUp}>
              Prečo Si Vybrať Našu Knižnicu?
            </motion.h2>
            <motion.p className={styles.sectionSubtitle} variants={fadeInUp}>
              Kombinujeme tradičné hodnoty s modernými technológiami pre najlepší vzdelávací zážitok
            </motion.p>

            <motion.div 
              className={styles.featuresGrid}
              variants={staggerVariants}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  variants={index % 2 === 0 ? slideInLeft : slideInRight}
                  whileHover={{ y: -8 }}
                >
                  <div className={styles.featureCard}>
                    <motion.div
                      className={styles.featureIconWrapper}
                      style={{ background: feature.gradient }}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                    <motion.div
                      style={{ marginTop: '1.5rem' }}
                      whileHover={{ x: 5 }}
                    >
                      <Button 
                        appearance="subtle" 
                        icon={<ArrowRight size={16} />}
                        iconPosition="after"
                        style={{ color: 'white' }}
                      >
                        Preskúmať
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Popular Books Section */}
        <section className={styles.booksSection}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 className={styles.sectionTitle} variants={fadeInUp}>
              Najobľúbenejšie Tituly
            </motion.h2>
            <motion.p className={styles.sectionSubtitle} variants={fadeInUp}>
              Knihy, ktoré si naši študenti najviac užívajú
            </motion.p>

            <motion.div 
              className={styles.booksGrid}
              variants={staggerVariants}
            >
              {popularBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  custom={index}
                >
                  <div className={styles.bookCard}>
                    <div 
                      className={styles.bookImage}
                      style={{ background: book.coverColor }}
                    />
                    <div className={styles.bookContent}>
                      <Badge 
                        appearance="filled" 
                        shape="rounded"
                        style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.1)' }}
                      >
                        {book.category}
                      </Badge>
                      <h3 className={styles.bookTitle}>{book.title}</h3>
                      <p className={styles.bookAuthor}>{book.author}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {book.description}
                      </p>
                      <div className={styles.bookStats}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Star size={16} fill="currentColor" color="#fbbf24" />
                          <span style={{ color: 'white', fontWeight: 600 }}>{book.rating}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Eye size={16} color="#94a3b8" />
                          <span style={{ color: '#94a3b8' }}>{book.borrowCount} čitateľov</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 className={styles.sectionTitle} variants={fadeInUp}>
              Knižnica v Číslach
            </motion.h2>
            
            <motion.div 
              className={styles.statsGrid}
              variants={staggerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={styles.statCard}>
                    <motion.div
                      className={styles.statIcon}
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 3, delay: index * 0.5, repeat: Infinity }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, delay: index * 0.3, repeat: Infinity }}
                    >
                      {stat.number}
                    </motion.div>
                    <div style={{ color: '#94a3b8', fontSize: '1.1rem' }}>{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 className={styles.ctaTitle} variants={fadeInUp}>
              Pridajte sa k nám
            </motion.h2>
            <motion.p className={styles.ctaSubtitle} variants={fadeInUp}>
              Staňte sa súčasťou našej vzdelávacej komunity a objavte nekonečné možnosti poznania
            </motion.p>
            
            <motion.div
              style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
              variants={fadeInUp}
            >
              <Button 
                className={styles.primaryButton}
                icon={<GraduationCap size={20} />}
                iconPosition="before"
              >
                Získať Prístup
              </Button>
              <Button 
                className={styles.secondaryButton}
                icon={<Coffee size={20} />}
                iconPosition="before"
              >
                Virtuálna Prehliadka
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </FluentProvider>
  );
};

export default HomeWrapper;