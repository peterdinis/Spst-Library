"use client"

import { motion } from "framer-motion";
import {
  Text,
  makeStyles,
  tokens,
  Link as FluentLink,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  heroContainer: {
    paddingTop: "40px", // Znížené padding pre vyššie posunutie
    display: "flex",
    alignItems: "center",
    position: "relative",
    zIndex: 10,
    maxWidth: "1400px",
    margin: "0 auto",
    flexDirection: "column-reverse",
    gap: tokens.spacingVerticalXXXL,
    minHeight: "70vh", // Znížená výška
    "@media (min-width: 1024px)": {
      flexDirection: "row",
      gap: tokens.spacingHorizontalXXXL,
      paddingTop: "60px", // Znížené pre desktop
    },
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start", // Zmenené na flex-start
    paddingTop: tokens.spacingVerticalXL, // Pridaný padding navrch
    "@media (min-width: 1024px)": {
      width: "45%",
      justifyContent: "center",
    },
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "flex-start", // Zmenené na flex-start
    justifyContent: "center",
    paddingTop: tokens.spacingVerticalXL, // Pridaný padding navrch
    "@media (min-width: 1024px)": {
      width: "55%",
      alignItems: "center",
    },
  },
  imagePlaceholder: {
    width: "100%",
    maxWidth: "600px", // Mierne zmenšené
    height: "400px", // Mierne zmenšené
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusXLarge,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: tokens.shadow16,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  title: {
    color: tokens.colorBrandForeground1,
    fontSize: "clamp(2.5rem, 4.5vw, 4rem)", // Mierne zmenšené
    fontWeight: tokens.fontWeightBold,
    marginBottom: tokens.spacingVerticalL,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightRegular,
    marginBottom: tokens.spacingVerticalL,
    lineHeight: 1.6,
    maxWidth: "500px",
  },
  quoteContainer: {
    padding: tokens.spacingVerticalL,
    borderLeft: `4px solid ${tokens.colorBrandForeground1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalS,
  },
  quoteText: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: 1.6,
    fontStyle: "italic",
    marginBottom: tokens.spacingVerticalXS,
  },
  authorText: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  linkContainer: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
  linkText: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
  },
  link: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
    ":active": {
      color: tokens.colorBrandForeground1,
    },
  },
});

const Hero: React.FC = () => {
  const styles = useStyles();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      className={styles.heroContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Textový obsah - ľavá strana */}
      <motion.div
        role="contentinfo"
        className={styles.contentContainer}
        variants={contentVariants}
      >
        <Text as="h1" className={styles.title}>
          Školská Knižnica
        </Text>
        
        <Text as="p" className={styles.subtitle}>
          Vitajte v modernej digitálnej knižnici SPŠT. Objavte svet poznania, 
          kde sa tradícia stretáva s technológiou.
        </Text>

        <motion.div
          className={styles.quoteContainer}
          variants={contentVariants}
        >
          <Text as="p" className={styles.quoteText}>
            "Knihy sú jedinečne prenosné kúzlo"
          </Text>
          <Text as="p" className={styles.authorText}>
            — Stephen King
          </Text>
        </motion.div>

        <motion.div
          className={styles.linkContainer}
          variants={contentVariants}
        >
          <Text as="span" className={styles.linkText}>
            Návrat na školskú stránku:
          </Text>
          <FluentLink
            href="https://spsknm.sk"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            appearance="subtle"
          >
            Školská stránka
          </FluentLink>
        </motion.div>
      </motion.div>

      {/* Obrázok - pravá strana */}
      <motion.div
        className={styles.imageContainer}
        variants={imageVariants}
      >
        <div className={styles.imagePlaceholder}>
          🏫 Knižnica SPŠT
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;