import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-background-secondary border-t border-accent-gold pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h2 className="font-serif text-2xl font-bold text-accent-gold tracking-widest uppercase mb-4">
                            Trip to Bangladesh
                        </h2>
                        <p className="text-text-muted text-sm leading-relaxed max-w-sm">
                            Discover the uncharted beauty of Bangladesh. A legacy tourism agency founded by Mahmud Hasan Khan, recognized by Lonely Planet as a Guardian Angel for international travelers.
                        </p>
                        <div className="inline-block mt-4 border border-accent-gold/30 p-3 rounded-sm bg-background-primary/50">
                            <p className="text-accent-gold text-xs font-semibold tracking-wide uppercase text-center">
                                Recognized By
                            </p>
                            <p className="font-serif text-text-primary text-xl italic text-center mt-1">
                                Lonely Planet
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 md:pl-8">
                        <h3 className="font-serif text-xl text-text-primary mb-4">Explore</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Destinations', href: '/destinations' },
                                { label: 'Our Story', href: '/about' },
                                { label: 'Travel Guide', href: '/blog' },
                                { label: 'Contact Us', href: '/contact' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-text-muted hover:text-accent-gold transition-colors text-sm focus:outline-none focus:text-accent-gold"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-xl text-text-primary mb-4">Get in Touch</h3>
                        <p className="text-text-muted text-sm mb-4">
                            Ready to plan your bespoke journey? Reach out to us directly.
                        </p>
                        <a
                            href="https://wa.me/880XXXXXXXXXX"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-accent-gold hover:text-text-primary transition-colors text-sm font-medium focus:outline-none focus:underline"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                        <div className="pt-2">
                            <a href="mailto:contact@trip2bangladesh.com" className="text-text-muted hover:text-accent-gold transition-colors text-sm focus:outline-none focus:text-accent-gold block">
                                contact@trip2bangladesh.com
                            </a>
                        </div>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-accent-gold/20 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-text-muted text-xs">
                        © {new Date().getFullYear()} Trip to Bangladesh. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 space-x-4">
                        <Link href="/privacy" className="text-text-muted hover:text-accent-gold transition-colors text-xs focus:outline-none focus:underline">Privacy Policy</Link>
                        <Link href="/terms" className="text-text-muted hover:text-accent-gold transition-colors text-xs focus:outline-none focus:underline">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
