'use client'

import { motion } from "framer-motion";

const RefundPolicy = () => {
    return (
        <>
            <section className="bg-primary py-12 md:py-16">
                <div className="container text-primary-foreground">
                    <h1 className="text-3xl md:text-5xl font-bold">Refund Policy</h1>
                    <p className="text-lg opacity-80 mt-2">Last updated: March 2026</p>
                </div>
            </section>
            <section className="py-10 md:py-16">
                <div className="container max-w-3xl">
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        At Women Skills Hub, we strive to provide high-quality learning experiences. Please review our refund policy below.
                    </p>
                    <div className="space-y-8">
                        <ul style={{listStyleType: 'number', paddingLeft: '20px'}} className="p-3">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="p-3">Access to Online Courses</li>
                                <p className="leading-5">
                                    Once payment is completed, students are granted immediate access to course content on our website, including:<br />
                                    Pre-recorded video lessons<br />
                                    Downloadable materials<br />
                                    Course resources and bonuses <br />

                                    <em style={{color: 'red'}}>
                                        Due to the digital nature of our courses, all payments are non-refundable once access has been granted, except as stated in Section 2 below.
                                    </em>
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">Refund Guarantee – Course Not as Advertised</li>
                                <p className="leading-5">
                                    A full refund will be granted ONLY
                                    <strong>
                                        if the content delivered is significantly different from what was stated in the official course outline, sales page, or promotional flyer
                                        and the refund request is made within 48 hours of gaining course access
                                    </strong>
                                    <br />
                                    Each request will be reviewed fairly, and if confirmed, a refund will be issued.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">No Refunds Will Be Issued For</li>
                                <p className="leading-5">
                                    Change of mind after purchase, Failure to complete the course, Internet, device, or technical issues on the student’s end and 
                                    Lack of results where the course content matches what was advertised.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 3 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">How to Request a Refund</li>
                                <p className="leading-5">
                                    Refund requests must be submitted within 48 hours of course access and should include:<br />
                                    Full name used during enrollment<br />
                                    Course Purchased<br />
                                    Proof of purchase (transaction ID, receipt)<br />
                                    Reason for the refund request<br />
                                    Your email address<br />
                                    Your whatsapp number<br />
                                    All refund requests should be sent to: <a href="mailto:support@womenskillshub.com">support@womenskillshub.com</a>
                                    with the subject line "Refund Request - [Course Name]".
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 4 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">Refund Processing Timeline</li>
                                <p className="leading-5">
                                    Approved refunds will be processed within 7–14 business days, depending on the payment method used.
                                </p>
                            </motion.div>
                        </ul>
                        
                        <br />
                        By using our website and services, you agree to the terms of this Refund Policy.
                    </div>
                </div>
            </section>
        </>
    )
}
export default RefundPolicy