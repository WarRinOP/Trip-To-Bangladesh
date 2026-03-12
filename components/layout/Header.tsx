'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Our Story', href: '/about' },
    { label: 'Travel Guide', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-background-primary shadow-md' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 z-50">
                            <span className="font-serif text-2xl font-bold text-accent-gold tracking-widest uppercase">
                                Trip to Bangladesh
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {LINKS.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="relative group text-sm font-medium text-text-primary hover:text-accent-gold transition-colors focus:outline-none focus:text-accent-gold"
                                    >
                                        {link.label}
                                        {/* Hover Gold Underline */}
                                        <motion.div
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-gold origin-left"
                                            initial={{ scaleX: isActive ? 1 : 0 }}
                                            whileHover={{ scaleX: 1 }}
                                            animate={{ scaleX: isActive ? 1 : 0 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        />
                                    </Link>
                                );
                            })}

                            {/* AI Planner button */}
                            <Link
                                href="/itinerary-generator"
                                className={`relative inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 ${
                                    pathname === '/itinerary-generator'
                                        ? 'bg-accent-gold/20 border-accent-gold text-accent-gold shadow-[0_0_14px_rgba(201,168,76,0.35)]'
                                        : 'border-accent-gold/40 text-accent-gold/80 hover:border-accent-gold hover:text-accent-gold hover:shadow-[0_0_14px_rgba(201,168,76,0.25)] hover:bg-accent-gold/10'
                                }`}
                                aria-label="AI Itinerary Planner"
                            >
                                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                AI Planner
                            </Link>

                            <Link
                                href="/contact"
                                className="relative inline-flex items-center justify-center px-6 py-2 border border-accent-gold text-sm font-medium text-accent-gold overflow-hidden group focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-background-primary"
                            >
                                <span className="absolute inset-0 w-full h-full bg-accent-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                                <span className="relative z-10 group-hover:text-background-primary transition-colors duration-300">
                                    Plan Your Journey
                                </span>
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center z-50">
                            <button
                                type="button"
                                className="text-text-primary hover:text-accent-gold focus:outline-none focus:text-accent-gold p-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="fixed inset-0 z-40 bg-background-primary pt-24 pb-6 px-4 flex flex-col items-center shadow-xl md:hidden overflow-y-auto"
                    >
                        <nav className="flex flex-col space-y-6 text-center w-full max-w-sm">
                            {LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-xl font-serif text-text-primary hover:text-accent-gold transition-colors focus:outline-none focus:text-accent-gold"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-3 w-full">
                                {/* AI Planner — mobile */}
                                <Link
                                    href="/itinerary-generator"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-accent-gold/50 text-accent-gold/90 font-medium hover:border-accent-gold hover:text-accent-gold hover:bg-accent-gold/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                                >
                                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                                    AI Planner
                                </Link>

                                <Link
                                    href="/contact"
                                    className="w-full relative flex items-center justify-center px-6 py-3 border border-accent-gold text-lg font-serif text-accent-gold group overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-gold"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-accent-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                                    <span className="relative z-10 group-hover:text-background-primary transition-colors duration-300">
                                        Plan Your Journey
                                    </span>
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
