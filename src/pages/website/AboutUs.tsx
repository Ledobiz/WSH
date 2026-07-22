'use client'

import Link from "next/link";
import { ArrowRight, Heart, Target, Users2, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { coursesUrl, registerUrl } from "@/src/utils/url";

const stats = [
    { value: "2,500+", label: "Active Students" },
    { value: "50+", label: "Courses Available" },
    { value: "4.9/5", label: "Success Rate" },
    { value: "5+", label: "Categories" },
];

const values = [
    {
        icon: Heart,
        title: "Empowerment",
        desc: "We believe every woman deserves the opportunity to learn practical skills and build sustainable income.",
    },
    {
        icon: Target,
        title: "Excellence",
        desc: "Our courses are crafted by industry experts with real-world experience, ensuring the highest quality education.",
    },
    {
        icon: Users2,
        title: "Community",
        desc: "We foster a supportive community where women learn, grow, and succeed together.",
    },
    {
        icon: Sparkles,
        title: "Innovation",
        desc: "We continuously update our curriculum with trending skills and market-relevant content.",
    },
];

const AboutUs = () => {
    return (
        <>
            <section className="py-20 md:py-28" style={{ background: "linear-gradient(135deg, hsl(282 70% 30%), hsl(270 40% 45%))" }}>
                <div className="container text-center text-primary-foreground">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display">About Women Skills Hub</h1>
                        <p className="text-lg md:text-xl opacity-85 leading-relaxed max-w-2xl mx-auto">
                            Women Skills Hub is Nigeria's leading online learning platform dedicated to empowering women with practical, income-generating skills. From beverage production to baking, paper craft to spice blending — we equip women to build sustainable businesses and achieve financial independence.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 md:py-16 bg-secondary/50">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl border border-border bg-card text-center"
                            >
                                <p className="text-2xl md:text-3xl font-bold text-primary font-display">{stat.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 font-display"
                    >
                        Our Values
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {values.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl border border-border bg-card flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <item.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-foreground mb-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-primary">
                <div className="container text-center text-primary-foreground">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Learning?</h2>
                        <p className="text-lg opacity-90">Join thousands of women building skills and income with Women Skills Hub.</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link href={coursesUrl}><Button variant="accent" size="lg" className="hover:scale-105 active:scale-95 transition-transform">Explore Courses <ArrowRight className="h-4 w-4" /></Button></Link>
                            <Link href={registerUrl}><Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hover:scale-105 active:scale-95 transition-transform">Create Account</Button></Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
export default AboutUs