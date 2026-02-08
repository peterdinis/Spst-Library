import { FC } from "react";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  BookOpen,
  Clock,
  Users
} from "lucide-react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:knižnica@skola.sk",
    },
  ];

  const openingHours = [
    { day: "Pondelok", time: "8:00 - 16:00" },
    { day: "Utorok", time: "8:00 - 16:00" },
    { day: "Streda", time: "8:00 - 17:00" },
    { day: "Štvrtok", time: "8:00 - 16:00" },
    { day: "Piatok", time: "8:00 - 15:00" },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Hlavný obsah - 3 stĺpce */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Logo a popis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Školská Knižnica</h3>
                <p className="text-sm text-muted-foreground">Centrum poznania</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Moderná školská knižnica poskytujúca prístup k poznaniu a
              vzdelávaniu pre všetkých študentov a učiteľov.
            </p>
            
            {/* Štatistiky */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="font-semibold">500+</p>
                <p className="text-xs text-muted-foreground">Čitateľov</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <BookOpen className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="font-semibold">10k+</p>
                <p className="text-xs text-muted-foreground">Kníh</p>
              </div>
            </div>
          </motion.div>

          {/* Otváracie hodiny */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-bold text-lg mb-6 pb-2 border-b flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Otváracie hodiny
            </h4>
            <div className="space-y-3">
              {openingHours.map((hour) => (
                <div key={hour.day} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{hour.day}</span>
                  <span className="font-medium">{hour.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Poznámka:</span> Počas prázdnin otváracie hodiny obmedzené.
              </p>
            </div>
          </motion.div>

          {/* Kontakt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-bold text-lg mb-6 pb-2 border-b">Kontaktujte nás</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg mt-1">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Adresa</p>
                  <p className="text-sm text-muted-foreground">Školská 123, 123 45 Mesto</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg mt-1">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Telefón</p>
                  <p className="text-sm text-muted-foreground">+421 123 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg mt-1">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">knižnica@skola.sk</p>
                </div>
              </div>
            </div>

            {/* Sociálne siete */}
            <div className="mt-8">
              <p className="font-medium mb-4">Sledujte nás</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      delay: index * 0.1 
                    }}
                    className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Spodná časť */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Školská Knižnica. Všetky práva vyhradené.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Designed with ❤️ pre vzdelávanie
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="/ochrana-osobnych-udajov" className="text-muted-foreground hover:text-foreground transition-colors">
                Ochrana osobných údajov
              </a>
              <a href="/podmienky-pouzivania" className="text-muted-foreground hover:text-foreground transition-colors">
                Podmienky používania
              </a>
              <a href="/mapa-stranky" className="text-muted-foreground hover:text-foreground transition-colors">
                Mapa stránky
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;