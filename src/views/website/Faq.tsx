'use client'

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/src/components/ui/accordion";

const Faq = () => {
    return (
        <>
            <section className="py-16 md:py-24 bg-primary">
                <div className="container text-center text-primary-foreground">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-display">Frequently Asked Questions</h1>
                    <p className="text-lg opacity-90">Find answers to common questions about Women Skills Hub</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container max-w-3xl">
                    <Accordion type="single" collapsible className="space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-0" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    How do I access the online courses?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Simply register your account on our Website/Learning Management System (LMS),
                                    browse through our course catalog, select the course you wish to enroll in,
                                    add the course to your cart, and proceed to checkout. Once your payment is confirmed,
                                    you will gain immediate access to the course materials.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-1" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    Are the courses beginner-friendly?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Yes! All courses are designed for beginners and intermediate learners, with step-by-step instructions and practical demonstrations.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-2" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    Can I get a refund if the course is not as advertised?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Yes! All courses are designed for beginners and intermediate learners, with step-by-step instructions and practical demonstrations.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 3 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-3" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    Do I need special equipment?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Basic kitchen tools or craft supplies are required depending on the course. A detailed list is provided in each course outline before you start.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 4 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-4" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    Are the courses suitable for business purposes?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Yes. Many of our students start small bakeries, beverage businesses, or craft shops using the skills learned.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 5 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-5" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    What courses are available?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    We offer three main categories: <br />
                                    Baking & Culinary Arts: Cake recipes, commercial bread, yogurt parfait, pillow donuts, small chops, cake boxes & boards. <br />
                                    Mixology & Beverage Arts: Mocktails, cocktails, Mixology Art. <br /> 
                                    Paper Crafts & Creative Packaging: Gift boxes, cake boxes, small chops paper cups.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 6 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-6" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    Can I monetize the skills I learn?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Absolutely! Our courses are practical and business-focused, with tips to start small businesses or side hustles.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 7 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-7" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    How long do I have access to my course?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Students have lifetime access to their purchased courses, including updates and bonus materials.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 8 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-8" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    Can I learn at my own pace?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Yes. All courses are fully online and self-paced, so you can fit learning around your schedule.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 9 * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <AccordionItem value="faq-9" className="border border-border rounded-xl px-4 bg-card">
                                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                                    How do I contact support?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    You can reach us via: <br />
                                    Email: support@womenskillshub.com<br />
                                    WhatsApp: +2349075144830<br />
                                    
                                    You can also use the floating whatsapp widget on the bottom-right side on your screen for quick assistance.
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    </Accordion>
                </div>
            </section>
        </>
    )
}
export default Faq