import { aboutUsUrl, contactUsUrl, coursesUrl, faq, refundPolicyUrl, registerUrl } from "@/src/utils/url";

/**
 * Curated business knowledge for the support widget. This is the hand-authored corpus
 * (course facts come live from the DB instead — see services/website/knowledgeBase.ts).
 *
 * Seeded from the real content on the FAQ, About Us, Contact, and policy pages. Keep it
 * in sync with those pages as the business changes. It's also the exact text a future AI
 * layer would retrieve from, so keep answers accurate and self-contained.
 */

export interface KbArticle {
    id: string;
    topic: KbTopicKey;
    question: string;
    /** Extra terms people might search that aren't in the question — improves matching. */
    keywords: string[];
    answer: string;
    links?: { label: string; href: string }[];
}

export type KbTopicKey = "getting-started" | "payments-refunds" | "courses-certificates" | "about" | "contact";

export interface KbTopic {
    key: KbTopicKey;
    label: string;
    description: string;
}

export const SUPPORT_EMAIL = "support@womenskillshub.com";
export const SUPPORT_WHATSAPP = "+2349075144830";
export const SUPPORT_WHATSAPP_DISPLAY = "+234 907 514 4830";
export const supportWhatsappLink = `https://wa.me/${SUPPORT_WHATSAPP.replace(/[^0-9]/g, "")}`;

export const kbTopics: KbTopic[] = [
    { key: "getting-started", label: "Getting Started", description: "Enrolling, accessing courses, learning at your pace" },
    { key: "payments-refunds", label: "Payments & Refunds", description: "How to pay, currencies, refunds" },
    { key: "courses-certificates", label: "Courses & Certificates", description: "What we teach, access, certificates" },
    { key: "about", label: "About Women Skills Hub", description: "Who we are and what we stand for" },
    { key: "contact", label: "Contact & Support", description: "How to reach a human" },
];

export const kbArticles: KbArticle[] = [
    // ---- Getting started ----
    {
        id: "how-to-enroll",
        topic: "getting-started",
        question: "How do I enroll in / access a course?",
        keywords: ["enroll", "sign up", "register", "buy", "purchase", "access course", "start learning", "get started"],
        answer:
            "Create an account, browse the course catalogue, pick the course you want, add it to your cart and check out. As soon as your payment is confirmed you get immediate access to the course materials in your learner dashboard.",
        links: [
            { label: "Browse courses", href: coursesUrl },
            { label: "Create an account", href: registerUrl },
        ],
    },
    {
        id: "self-paced",
        topic: "getting-started",
        question: "Can I learn at my own pace?",
        keywords: ["self paced", "pace", "schedule", "anytime", "online", "flexible", "time"],
        answer:
            "Yes. All courses are fully online and self-paced, so you can fit learning around your schedule and go as fast or slow as you like.",
    },
    {
        id: "equipment",
        topic: "getting-started",
        question: "Do I need any special equipment?",
        keywords: ["equipment", "tools", "materials", "supplies", "requirements", "need"],
        answer:
            "Only basic kitchen tools or craft supplies, depending on the course. Each course outline includes a detailed list of what you'll need before you start.",
    },
    {
        id: "beginner-friendly",
        topic: "getting-started",
        question: "Are the courses beginner-friendly?",
        keywords: ["beginner", "newbie", "starter", "no experience", "easy", "intermediate"],
        answer:
            "Yes. Courses are designed for beginners and intermediate learners, with step-by-step instructions and practical demonstrations you can follow along with.",
    },

    // ---- Payments & refunds ----
    {
        id: "payment-methods",
        topic: "payments-refunds",
        question: "What payment methods do you accept?",
        keywords: ["payment", "pay", "card", "bank transfer", "ussd", "mobile money", "paystack", "flutterwave", "methods"],
        answer:
            "You can pay by card, bank transfer, USSD and mobile money through our secure checkout (powered by Paystack and Flutterwave). You can also switch between NGN and USD using the currency toggle before you pay.",
        links: [{ label: "Browse courses", href: coursesUrl }],
    },
    {
        id: "currency",
        topic: "payments-refunds",
        question: "Can I pay in USD or another currency?",
        keywords: ["usd", "dollar", "naira", "ngn", "currency", "exchange rate", "international"],
        answer:
            "Yes. Use the currency switch on the site to see prices in your currency; the amount is converted at checkout so you can pay in your preferred currency.",
    },
    {
        id: "refunds",
        topic: "payments-refunds",
        question: "Can I get a refund?",
        keywords: ["refund", "money back", "cancel", "not as advertised", "guarantee"],
        answer:
            "Yes. A refund is available if a course's content is significantly different from what was advertised and you request it within the window described in our refund policy. Reach out to support with your order details and we'll help.",
        links: [
            { label: "Read the refund policy", href: refundPolicyUrl },
            { label: "Contact support", href: contactUsUrl },
        ],
    },

    // ---- Courses & certificates ----
    {
        id: "what-courses",
        topic: "courses-certificates",
        question: "What courses / categories are available?",
        keywords: ["courses", "categories", "what do you teach", "catalogue", "catalog", "baking", "mixology", "paper craft", "snacks", "spice"],
        answer:
            "We teach practical, income-generating skills across categories such as Baking & Culinary Arts (cakes, bread, yogurt parfait, donuts, small chops), Mixology & Beverage Arts (mocktails, cocktails), and Paper Crafts & Creative Packaging (gift boxes, cake boxes). Browse the full, up-to-date catalogue to see everything on offer.",
        links: [{ label: "Browse all courses", href: coursesUrl }],
    },
    {
        id: "course-access-length",
        topic: "courses-certificates",
        question: "How long do I have access to my course?",
        keywords: ["lifetime", "access", "how long", "expire", "forever", "updates"],
        answer:
            "You get lifetime access to any course you purchase, including future updates and bonus materials added to that course.",
    },
    {
        id: "monetize",
        topic: "courses-certificates",
        question: "Can I make money / start a business from the skills?",
        keywords: ["monetize", "business", "income", "earn", "side hustle", "sell", "make money"],
        answer:
            "Absolutely. The courses are practical and business-focused, with tips for starting small businesses and side hustles. Many students go on to start bakeries, beverage businesses and craft shops with what they learn.",
    },
    {
        id: "business-use",
        topic: "courses-certificates",
        question: "Are the courses suitable for business purposes?",
        keywords: ["business", "commercial", "sell", "shop", "bakery", "startup"],
        answer:
            "Yes. Many students use their skills commercially — starting small bakeries, beverage businesses or craft shops using exactly what they learn in the courses.",
    },
    {
        id: "certificates",
        topic: "courses-certificates",
        question: "Do I get a certificate?",
        keywords: ["certificate", "certification", "completion", "download certificate", "proof"],
        answer:
            "Courses that offer a certificate let you download one once you've completed all the lectures. You'll find your certificates in the Certificates section of your learner dashboard.",
    },

    // ---- About ----
    {
        id: "who-we-are",
        topic: "about",
        question: "What is Women Skills Hub?",
        keywords: ["about", "who are you", "what is", "company", "mission", "womenskillshub", "wsh"],
        answer:
            "Women Skills Hub is Nigeria's leading online learning platform dedicated to empowering women with practical, income-generating skills — from beverage production and baking to paper craft and spice blending — so they can build sustainable businesses and achieve financial independence.",
        links: [{ label: "More about us", href: aboutUsUrl }],
    },
    {
        id: "our-values",
        topic: "about",
        question: "What does Women Skills Hub stand for?",
        keywords: ["values", "mission", "vision", "empowerment", "community", "why"],
        answer:
            "Our values are Empowerment (every woman deserves the chance to learn and earn), Excellence (courses crafted by industry experts), Community (women learning and succeeding together) and Innovation (curriculum kept current with in-demand skills).",
        links: [{ label: "More about us", href: aboutUsUrl }],
    },

    // ---- Contact ----
    {
        id: "contact-support",
        topic: "contact",
        question: "How do I contact support / a human?",
        keywords: ["contact", "support", "help", "human", "talk to someone", "email", "whatsapp", "phone", "reach"],
        answer:
            `You can reach our team by email at ${SUPPORT_EMAIL} or on WhatsApp at ${SUPPORT_WHATSAPP_DISPLAY}. We're happy to help and typically respond within a few hours.`,
        links: [{ label: "Go to the contact page", href: contactUsUrl }],
    },
];

/** Handful of prompts shown on the home view to guide people in. */
export const suggestedQuestions: string[] = [
    "How do I enroll in a course?",
    "What payment methods do you accept?",
    "Can I get a refund?",
    "Do I get a certificate?",
    "Help me choose a course",
];

export const faqUrl = faq;
