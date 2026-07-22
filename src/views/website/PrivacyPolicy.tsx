'use client'

import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    return (
        <>
            <section className="bg-primary py-12 md:py-16">
                <div className="container text-primary-foreground">
                    <h1 className="text-3xl md:text-5xl font-bold">Privacy Policy</h1>
                    <p className="text-lg opacity-80 mt-2">Last updated: March 2026</p>
                </div>
            </section>

            <section className="py-10 md:py-16">
                <div className="container max-w-3xl">
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        Women Skills Hub Limited ("we", "our", "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our website and services.
                    </p>
                    <div className="space-y-8">
                        <ul style={{listStyleType: 'number', paddingLeft: '20px'}} className="p-3">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="p-3">Information We Collect</li>
                                <p className="leading-5">
                                    We may collect information about you in the following ways:
                                    <ul style={{listStyleType: 'lower-alpha', paddingLeft: '20px'}}>
                                        <li style={{fontSize: '16px', fontWeight: 'bold', marginTop: '10px'}}>Personal Information</li>
                                        Information you voluntarily provide to us, including but not limited to:<br />
                                        Full Name <br />
                                        Email Address <br />
                                        Phone Number <br />
                                        Address <br />
                                        Any other information you submit through forms, registrations, or communication with us

                                        <li style={{fontSize: '16px', fontWeight: 'bold', marginTop: '10px'}}>Non-Personal Information</li>
                                        Information collected automatically when you visit our website, such as:<br />
                                        IP Address <br />
                                        Browser Type <br />
                                        Device Information <br />
                                        Pages visited and time spent on the website www.womenskillshub.com
                                    </ul>
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">How We Use Your Information</li>
                                <p className="leading-5">
                                    We use the information we collect to:
                                    Provide, operate, and improve our services. <br />
                                    Process registrations, payments, and transactions<br />
                                    Communicate with you, including responding to inquiries and sending updates <br />
                                    Send promotional materials, newsletters, or offers (you may opt out at any time) <br />
                                    Monitor and analyze website usage and trends <br />
                                    Comply with legal obligations
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">Sharing of Your Information</li>
                                <p className="leading-5">
                                    We do not sell or rent your personal information. We may share your information only in the following situations:<br />
                                    With trusted service providers who assist us in operating our website or services. To comply with legal requirements, court orders, or lawful requests
                                    To protect our rights, privacy, safety, or property, and that of our users or the public. In connection with a business transfer, merger, or acquisition
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 3 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">Cookies and Tracking Technologies</li>
                                <p className="leading-5">
                                    We may use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us understand user behavior
                                        and improve our services. You can choose to disable cookies through your browser settings, but this may affect website functionality.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 4 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">Data Security</li>
                                <p className="leading-5">
                                    We implement reasonable administrative, technical, and physical security measures to protect your personal information. 
                                    However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 5 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">Your Rights</li>
                                <p className="leading-5">
                                    You have the right to access, correct, or delete your personal information. 
                                    You may also have the right to object to or restrict certain processing of your data. <br />
                                    To exercise these rights, please contact us using the information provided below.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 6 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">Changes to This Privacy Policy</li>
                                <p className="leading-5">
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. 
                                    You are advised to review this policy periodically for any updates.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 7 * 0.04 }}
                                viewport={{ once: true }}
                            >
                                <li style={{fontSize: '18px', fontWeight: 'bold'}} className="mt-3">Contact Us</li>
                                <p className="leading-5">
                                    If you have any questions or concerns about this Privacy Policy, please contact us at:
                                    <br />
                                    Women Skills Hub Limited<br />
                                    Email: <a href="mailto:support@womenskillshub.com">support@womenskillshub.com</a> <br />
                                    Phone/Whatsapp: 09075144830 <br />
                                    Address: Alagbole, Ojodu, Lagos State, Nigeria
                                </p>
                            </motion.div>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}
export default PrivacyPolicy