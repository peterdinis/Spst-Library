import { FC } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

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

	return (
		<footer className="bg-muted/50 border-t">
			<div className="container mx-auto px-4 py-8">
				{/* Hlavný obsah */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					{/* Logo a popis */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h3 className="text-xl font-bold mb-3">Školská Knižnica</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Moderná školská knižnica poskytujúca prístup k poznaniu a
							vzdelávaniu pre všetkých študentov a učiteľov.
						</p>
					</motion.div>

					{/* Kontakt */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<h4 className="font-semibold mb-3">Kontakt</h4>
						<div className="space-y-2 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4" />
								<span>Školská 123, Mesto</span>
							</div>
							<div className="flex items-center gap-2">
								<Phone className="w-4 h-4" />
								<span>+421 123 456 789</span>
							</div>
							<div className="flex items-center gap-2">
								<Mail className="w-4 h-4" />
								<span>knižnica@skola.sk</span>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Spodná časť */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border"
				>
					<p className="text-sm text-muted-foreground">
						© {currentYear} Školská Knižnica
					</p>

					<div className="flex items-center gap-4">
						{socialLinks.map((social, index) => (
							<motion.a
								key={social.name}
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								initial={{ opacity: 0, scale: 0 }}
								whileInView={{ opacity: 1, scale: 1 }}
								whileHover={{ scale: 1.1 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="p-2 rounded-full bg-background hover:bg-primary/10 transition-colors"
							>
								<social.icon className="w-4 h-4 text-muted-foreground" />
							</motion.a>
						))}
					</div>
				</motion.div>
			</div>
		</footer>
	);
};

export default Footer;
