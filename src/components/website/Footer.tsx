'use client';

import Link from "next/link";
import { Heart, Facebook, Instagram } from "lucide-react";
import { aboutUsUrl, blogUrl, contactUsUrl, coursesUrl, faq, privacyPolicyUrl, refundPolicyUrl, termsAndConditionsUrl } from "@/src/utils/url";

const Footer = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    return (
        <footer className="bg-foreground text-background">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={`${appUrl}/images/wsh-logo-light.jpeg`} alt="Women Skills Hub" className="h-10 w-10 rounded-full object-cover" />
                            <span className="font-display font-bold text-lg">Women Skills Hub</span>
                        </div>
                        <p className="text-sm opacity-70 leading-relaxed">
                            Empowering women with practical, income-generating skills. Learn at your own pace and turn your passion into profit.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <a href="https://www.facebook.com/womenskillshub" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="https://www.instagram.com/womenskillshub" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://www.tiktok.com/@womenskillshub" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm opacity-70">
                            <li><Link href={coursesUrl} className="hover:opacity-100 transition-opacity">All Courses</Link></li>
                            <li><Link href={aboutUsUrl} className="hover:opacity-100 transition-opacity">About Us</Link></li>
                            <li><Link href={contactUsUrl} className="hover:opacity-100 transition-opacity">Contact</Link></li>
                            <li><Link href={blogUrl} className="hover:opacity-100 transition-opacity">Blog</Link></li>
                            <li><Link href={faq} className="hover:opacity-100 transition-opacity">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2 text-sm opacity-70">
                            <li><Link href={`${coursesUrl}?category=beverage-production`} className="hover:opacity-100 transition-opacity">Beverage Production</Link></li>
                            <li><Link href="/courses?category=art-of-baking" className="hover:opacity-100 transition-opacity">Art Of Baking</Link></li>
                            <li><Link href="/courses?category=paper-craft" className="hover:opacity-100 transition-opacity">Paper Craft</Link></li>
                            <li><Link href="/courses?category=nigerian-snacks" className="hover:opacity-100 transition-opacity">Nigerian Snacks</Link></li>
                            <li><Link href="/courses?category=the-art-of-spice-blend" className="hover:opacity-100 transition-opacity">The Art Of Spice Blend</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Contact */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm opacity-70">
                            <li><Link href={privacyPolicyUrl} className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
                            <li><Link href={termsAndConditionsUrl} className="hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
                            <li><Link href={refundPolicyUrl} className="hover:opacity-100 transition-opacity">Refund Policy</Link></li>
                        </ul>
                        <h4 className="font-display font-semibold mt-6 mb-3">Contact</h4>
                        <ul className="space-y-2 text-sm opacity-70">
                            <li>WhatsApp: +234 907 514 4830</li>
                            <li>RC: 7108779</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-60">
                    <p>© {new Date().getFullYear()} Women Skills Hub Limited. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="h-3 w-3 fill-current" /> for women everywhere
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
