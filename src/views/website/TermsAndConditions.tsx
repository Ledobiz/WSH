'use client'

import { motion } from "framer-motion";
import Link from "next/link";
import { privacyPolicyUrl } from "@/src/utils/url";

const sections = [
    {
        title: "Company Information",
        body: (
            <>
                Women Skills Hub Limited is a skills development and training company focused on empowering women through online and physical trainings, digital products, coaching, and educational resources.
            </>
        ),
    },
    {
        title: "Acceptance of Terms",
        body: (
            <>
                By using this website or purchasing any course or service, you confirm that: <br />
                You are at least 18 years old or have consent from a parent or legal guardian.<br />
                You understand and accept these Terms in full.<br />
                You agree to use our Services lawfully and responsibly.
            </>
        ),
    },
    {
        title: "Use of Website",
        body: (
            <>
                You agree not to:<br />
                a) Violate any applicable laws or regulations.<br />
                b) Use the website for any illegal or unauthorized purpose.<br />
                c) Transmit harmful or malicious content.<br />
                d) Engage in any activity that disrupts or interferes with our Services. <br />
                e) Copy, modify, distribute, sell, or exploit any part of the website or its content without written permission. <br />
                f) Attempt to gain unauthorized access to our systems or networks. <br /><br />
                <em>We reserve the right to restrict or terminate access if misuse is detected.</em>
            </>
        ),
    },
    {
        title: "Courses, Trainings, and Programs",
        body: (
            <>
                All training may be delivered online, physically, or through our website. Course outlines, duration, access period, and delivery method will be clearly stated before enrollment. Enrollment grants you access for <strong>your personal use only</strong> and does not permit sharing or resale of materials.
            </>
        ),
    },
    {
        title: "Payments",
        body: (
            <>
                All prices are listed in Nigerian Naira (₦) unless stated otherwise. Full payment is required before access to any course, training, or digital product is granted. We reserve the right to change prices at any time without affecting already paid enrollments.
            </>
        ),
    },
    {
        title: "Refunds and Cancellations",
        body: (
            <>
                All payments made to Women Skills Hub Limited are final and non-refundable, unless otherwise stated in writing. No refunds will be issued for failure to attend classes, incomplete participation, or change of mind. Any exceptions will be considered strictly at the discretion of the organization.
            </>
        ),
    },
    {
        title: "Intellectual Property",
        body: (
            <>
                All content provided by Women Skills Hub Limited including videos, manuals, PDFs, graphics, logos, and training materials remains our intellectual property.<br />
                You may not: <br />
                a) Share paid materials with third parties.<br />
                b) Reproduce, duplicate, distribute, or create derivative works without written consent.<br />
                c) Use our trademarks or logos without permission.<br />
                d) Use our materials for commercial purposes without permission.
            </>
        ),
    },
    {
        title: "User Conduct",
        body: (
            <>
                Participants and users must maintain respectful communication in all learning communities. Avoid posting harmful, abusive, or misleading information and follow all guidelines provided during trainings and within community groups. <br />
                Violation may result in removal without refund.
            </>
        ),
    },
    {
        title: "Disclaimer",
        body: (
            <>
                Our trainings are educational in nature. We do not guarantee income, business success, or specific results. Outcomes depend on individual effort, skills, and external factors.
            </>
        ),
    },
    {
        title: "Limitation of Liability",
        body: (
            <>
                Women Skills Hub Limited shall not be liable for any loss, damage, or injury arising from the use of our website, trainings, or materials. Our liability, if any, shall not exceed the amount paid for the specific service.
            </>
        ),
    },
    {
        title: "Third-Party Platforms",
        body: (
            <>
                We may use third-party tools such as payment processors or communication platforms. We are not responsible for their policies, services, or downtime.
            </>
        ),
    },
    {
        title: "Privacy",
        body: (
            <>
                Your use of our website is also governed by our{" "}
                <Link href={privacyPolicyUrl} className="text-primary hover:underline">Privacy Policy</Link>, which explains how we collect and use personal information.
            </>
        ),
    },
    {
        title: "Changes to These Terms",
        body: (
            <>
                We may update these Terms at any time. Continued use of our Services after changes are posted means you accept the revised Terms.
            </>
        ),
    },
    {
        title: "Governing Law",
        body: (
            <>
                These Terms shall be governed by the laws of the Federal Republic of Nigeria. Any disputes will be resolved in the courts of Lagos State, Nigeria.
            </>
        ),
    },
    {
        title: "Contact Us",
        body: (
            <>
                If you have any questions or concerns, please contact us at:
                <br />
                Women Skills Hub Limited<br />
                Email: <a href="mailto:support@womenskillshub.com" className="text-primary hover:underline">support@womenskillshub.com</a> <br />
                Phone/Whatsapp: 09075144830 <br />
                Address: Alagbole, Ojodu, Lagos State, Nigeria
            </>
        ),
    },
];

const TermsAndConditions = () => {
    return (
        <>
            <section className="bg-primary py-12 md:py-16">
                <div className="container text-primary-foreground">
                    <h1 className="text-3xl md:text-5xl font-bold">Terms and Conditions</h1>
                    <p className="text-lg opacity-80 mt-2">Last updated: January 2026</p>
                </div>
            </section>

            <section className="py-10 md:py-16">
                <div className="container max-w-3xl">
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        Welcome to Women Skills Hub Limited. These Terms and Conditions govern your use of our website, online platforms, training programs, products, and services. By accessing this website or enrolling in any of our programs, you agree to comply with and be bound by these Terms. If you do not agree, please discontinue use of our Services.
                    </p>
                    <div className="space-y-8">
                        <ol className="list-decimal pl-5 space-y-6">
                            {sections.map((section, i) => (
                                <motion.li
                                    key={section.title}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (i % 4) * 0.04 }}
                                    viewport={{ once: true }}
                                    className="text-lg font-bold text-foreground"
                                >
                                    {section.title}
                                    <p className="text-sm md:text-base font-normal text-muted-foreground leading-relaxed mt-2">
                                        {section.body}
                                    </p>
                                </motion.li>
                            ))}
                        </ol>
                    </div>
                    <p className="text-muted-foreground mt-8 leading-relaxed">
                        By using our website and services, you agree to our terms and conditions above.
                    </p>
                </div>
            </section>
        </>
    );
};

export default TermsAndConditions;
