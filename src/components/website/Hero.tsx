'use client'

import { motion } from "framer-motion";
import { ArrowRight, Star, GraduationCap, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { coursesUrl, registerUrl } from "@/src/utils/url";

const Hero = () => {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <section className="relative overflow-hidden bg-primary">
            <div className="container py-16 md:py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-primary-foreground space-y-6"
                    >
                        <Badge className="bg-background/20 text-primary-foreground border-0 backdrop-blur-sm text-sm py-1.5 px-4">
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            50+ Courses Available
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Master New Skills With Expert-Led Courses
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 max-w-lg leading-relaxed">
                            Learn high-impact, career-focused courses designed for women — from digital skills to business, crafts, and professional development.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href={coursesUrl}>
                                <Button variant="accent" size="lg" className="text-base h-12 px-8 hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                                    Explore Courses <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href={registerUrl}>
                                <Button variant="outline" size="lg" className="text-base h-12 px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                                    Join for Free
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 fill-accent text-accent" />
                                <span className="font-semibold">4.9</span>
                                <span className="opacity-70 text-sm">Success Rate</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4" />
                                <span className="opacity-70 text-sm">1000+ Students</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative">
                            <img
                                src={`${appUrl}/images/wsh-hero-img.jpg`}
                                alt="Women learning skills at Women Skills Hub"
                                className="w-full max-w-lg mx-auto rounded-3xl"
                                loading="eager"
                                width="512"
                                height="512"
                            />
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-4 -left-4 bg-background rounded-2xl p-4 shadow-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                        <GraduationCap className="h-5 w-5 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">Get Certified</p>
                                        <p className="text-xs text-muted-foreground">Earn industry certificates</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </section>
    )
}
export default Hero