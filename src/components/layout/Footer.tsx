import Link from "next/link";
import { BookOpen, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
	return (
		<footer className="w-full bg-slate-900 text-slate-300 py-12 px-6 mt-12 rounded-t-[3rem] border-t border-slate-800">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-primary/20 rounded-lg">
							<BookOpen className="h-6 w-6 text-primary" />
						</div>
						<h3 className="text-xl font-bold text-white tracking-tight">
							Knižnica SPŠT
						</h3>
					</div>
					<p className="text-sm text-slate-400 max-w-xs">
						Moderný elektronický knižničný systém pre študentov a učiteľov Strednej priemyselnej školy technickej.
					</p>
				</div>
				
				<div className="space-y-4">
					<h4 className="text-lg font-semibold text-white">Rýchle odkazy</h4>
					<ul className="space-y-2 text-sm">
						<li>
							<Link href="/books" className="hover:text-primary transition-colors">
								Katalóg kníh
							</Link>
						</li>
						<li>
							<Link href="/categories" className="hover:text-primary transition-colors">
								Kategórie
							</Link>
						</li>
						<li>
							<Link href="/authors" className="hover:text-primary transition-colors">
								Autori
							</Link>
						</li>
					</ul>
				</div>

				<div className="space-y-4">
					<h4 className="text-lg font-semibold text-white">Kontakt</h4>
					<ul className="space-y-3 text-sm">
						<li className="flex items-center gap-3">
							<MapPin className="h-4 w-4 text-primary" />
							<span>SPŠT, Slovenská republika</span>
						</li>
						<li className="flex items-center gap-3">
							<Mail className="h-4 w-4 text-primary" />
							<a href="mailto:kniznica@spst.sk" className="hover:text-primary transition-colors">
								kniznica@spst.sk
							</a>
						</li>
						<li className="flex items-center gap-3">
							<Phone className="h-4 w-4 text-primary" />
							<span>+421 900 000 000</span>
						</li>
					</ul>
				</div>
			</div>
			<div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
				&copy; {new Date().getFullYear()} Knižnica SPŠT. Všetky práva vyhradené.
			</div>
		</footer>
	);
}
