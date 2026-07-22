'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle, X, ChevronLeft, Search, Sparkles, BookOpen, LifeBuoy,
    ArrowRight, Mail, Loader2, GraduationCap, ExternalLink, TrendingUp, Clock, LayoutGrid,
} from "lucide-react";

import {
    kbArticles, kbTopics, suggestedQuestions, KbArticle, KbTopicKey,
    SUPPORT_EMAIL, SUPPORT_WHATSAPP_DISPLAY, supportWhatsappLink,
} from "@/src/data/knowledgeBase";
import {
    getKnowledgeBaseCourses, KnowledgeBaseCourse, KnowledgeBaseCategory,
} from "@/src/services/website/knowledgeBase";
import { searchKnowledge, KnowledgeSearchResult } from "@/src/utils/knowledgeSearch";
import { contactUsUrl, coursesUrl, courseContentUrl } from "@/src/utils/url";

const formatPrice = (course: KnowledgeBaseCourse): string =>
    course.isFree || course.discountedFee <= 0 ? "Free" : `₦${course.discountedFee.toLocaleString()}`;

const budgets: { key: string; label: string; test: (c: KnowledgeBaseCourse) => boolean }[] = [
    { key: "free", label: "Free", test: (c) => c.isFree || c.discountedFee <= 0 },
    { key: "under10", label: "Under ₦10,000", test: (c) => !c.isFree && c.discountedFee > 0 && c.discountedFee < 10000 },
    { key: "10to20", label: "₦10,000 – ₦20,000", test: (c) => c.discountedFee >= 10000 && c.discountedFee <= 20000 },
    { key: "any", label: "Any budget", test: () => true },
];

type ViewName = "home" | "results" | "article" | "course" | "browse" | "quiz";

const CourseCard = ({ course, onOpen }: { course: KnowledgeBaseCourse; onOpen: (c: KnowledgeBaseCourse) => void }) => (
    <button
        onClick={() => onOpen(course)}
        className="w-full text-left flex gap-3 p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors cursor-pointer"
    >
        <img
            src={course.thumbnail || ""}
            alt={course.title}
            className="w-14 h-14 rounded-lg object-cover bg-muted shrink-0"
        />
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground line-clamp-2">{course.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{course.categoryName}</p>
            <p className="text-sm font-semibold text-primary mt-1">{formatPrice(course)}</p>
        </div>
    </button>
);

const SupportWidget = () => {
    const pathname = usePathname();

    const [open, setOpen] = useState(false);
    const [stack, setStack] = useState<ViewName[]>(["home"]);
    const [loaded, setLoaded] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [courses, setCourses] = useState<KnowledgeBaseCourse[]>([]);
    const [categories, setCategories] = useState<KnowledgeBaseCategory[]>([]);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<KnowledgeSearchResult | null>(null);
    const [resultsTitle, setResultsTitle] = useState("");
    const [activeArticle, setActiveArticle] = useState<KbArticle | null>(null);
    const [activeCourse, setActiveCourse] = useState<KnowledgeBaseCourse | null>(null);
    const [browseCategory, setBrowseCategory] = useState<string | null>(null);

    const [quizCategory, setQuizCategory] = useState<string | null>(null);
    const [quizBudget, setQuizBudget] = useState<string | null>(null);

    const view = stack[stack.length - 1];
    const go = (v: ViewName) => setStack((s) => [...s, v]);
    const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    const resetHome = () => setStack(["home"]);

    // Lazy-load course data the first time the widget is opened.
    useEffect(() => {
        if (!open || loaded || loadingData) return;
        setLoadingData(true);
        getKnowledgeBaseCourses()
            .then((res) => {
                setCourses(res.courses);
                setCategories(res.categories);
                setLoaded(true);
            })
            .finally(() => setLoadingData(false));
    }, [open, loaded, loadingData]);

    const popular = useMemo(
        () => [...courses].sort((a, b) => b.studentsCount - a.studentsCount).slice(0, 6),
        [courses],
    );
    const newest = useMemo(() => courses.slice(0, 6), [courses]); // service returns newest-first
    const browseList = useMemo(
        () => (browseCategory ? courses.filter((c) => c.categorySlug === browseCategory) : courses),
        [courses, browseCategory],
    );
    const quizMatches = useMemo(() => {
        let list = courses;
        if (quizCategory && quizCategory !== "any") list = list.filter((c) => c.categorySlug === quizCategory);
        const budget = budgets.find((b) => b.key === quizBudget);
        if (budget) list = list.filter(budget.test);
        return [...list].sort((a, b) => b.studentsCount - a.studentsCount).slice(0, 6);
    }, [courses, quizCategory, quizBudget]);

    // ---- navigation helpers ----
    const runSearch = (q: string) => {
        const trimmed = q.trim();
        if (!trimmed) return;
        setResults(searchKnowledge(trimmed, kbArticles, courses));
        setResultsTitle(`Results for “${trimmed}”`);
        go("results");
    };
    const openTopic = (topic: KbTopicKey, label: string) => {
        const topicArticles = kbArticles.filter((a) => a.topic === topic);
        setResults({ articles: topicArticles, courses: [], recommend: false, hasResults: topicArticles.length > 0 });
        setResultsTitle(label);
        go("results");
    };
    const openArticle = (a: KbArticle) => { setActiveArticle(a); go("article"); };
    const openCourse = (c: KnowledgeBaseCourse) => { setActiveCourse(c); go("course"); };
    const openBrowse = () => { setBrowseCategory(null); go("browse"); };
    const startQuiz = () => { setQuizCategory(null); setQuizBudget(null); go("quiz"); };

    const closeAndReset = () => { setOpen(false); };

    if (pathname?.startsWith(courseContentUrl)) return null; // don't overlay the immersive lecture player

    const headerTitle =
        view === "home" ? "Help & Support"
        : view === "results" ? resultsTitle
        : view === "article" ? "Answer"
        : view === "course" ? "Course details"
        : view === "browse" ? "Browse courses"
        : "Find your course";

    return (
        <>
            {/* Launcher */}
            <motion.button
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-20 right-5 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                whileTap={{ scale: 0.9 }}
                aria-label={open ? "Close help" : "Open help"}
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X className="h-6 w-6" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <LifeBuoy className="h-6 w-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-[7.5rem] right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm bg-card border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
                        style={{ height: "min(560px, calc(100vh - 10rem))" }}
                    >
                        {/* Header */}
                        <div className="bg-primary text-primary-foreground p-4 flex items-center gap-2 shrink-0">
                            {stack.length > 1 ? (
                                <button onClick={back} className="p-1 -ml-1 rounded-lg hover:bg-primary-foreground/10 cursor-pointer" aria-label="Back">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                    <LifeBuoy className="h-5 w-5" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{headerTitle}</p>
                                {view === "home" && <p className="text-xs opacity-75">Answers about WSH & our courses</p>}
                            </div>
                            <button onClick={closeAndReset} className="p-1 rounded-lg hover:bg-primary-foreground/10 cursor-pointer" aria-label="Close">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto">
                            {/* HOME */}
                            {view === "home" && (
                                <div className="p-4 space-y-5">
                                    <form onSubmit={(e) => { e.preventDefault(); runSearch(query); }} className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Ask a question or search…"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </form>

                                    {/* Quick actions */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={startQuiz} className="flex flex-col items-start gap-1 p-3 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors cursor-pointer text-left">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium text-foreground">Help me choose</span>
                                            <span className="text-[11px] text-muted-foreground">Find the right course</span>
                                        </button>
                                        <button onClick={openBrowse} className="flex flex-col items-start gap-1 p-3 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors cursor-pointer text-left">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium text-foreground">Browse courses</span>
                                            <span className="text-[11px] text-muted-foreground">See what we offer</span>
                                        </button>
                                    </div>

                                    {/* Suggested questions */}
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Popular questions</p>
                                        <div className="space-y-1.5">
                                            {suggestedQuestions.map((q) => (
                                                <button
                                                    key={q}
                                                    onClick={() => (q.toLowerCase().includes("choose") ? startQuiz() : runSearch(q))}
                                                    className="w-full text-left text-sm text-foreground flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors cursor-pointer"
                                                >
                                                    <span>{q}</span>
                                                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Topics */}
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Browse topics</p>
                                        <div className="flex flex-wrap gap-2">
                                            {kbTopics.map((t) => (
                                                <button
                                                    key={t.key}
                                                    onClick={() => openTopic(t.key, t.label)}
                                                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <ContactStrip />
                                </div>
                            )}

                            {/* RESULTS */}
                            {view === "results" && results && (
                                <div className="p-4 space-y-4">
                                    {!results.hasResults ? (
                                        <div className="text-center py-6 space-y-3">
                                            <p className="text-sm text-foreground font-medium">No exact match found</p>
                                            <p className="text-xs text-muted-foreground">Try rephrasing, browse a topic, or reach our team directly.</p>
                                            <div className="flex flex-wrap justify-center gap-2 pt-1">
                                                {kbTopics.map((t) => (
                                                    <button key={t.key} onClick={() => openTopic(t.key, t.label)} className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                                                        {t.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {results.recommend && (
                                                <button onClick={startQuiz} className="w-full flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-left hover:bg-primary/10 transition-colors cursor-pointer">
                                                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                                                    <span className="text-sm text-foreground flex-1">Not sure which to pick? Take the quick course finder.</span>
                                                    <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                                                </button>
                                            )}

                                            {results.articles.length > 0 && (
                                                <div className="space-y-1.5">
                                                    {results.articles.map((a) => (
                                                        <button key={a.id} onClick={() => openArticle(a)} className="w-full text-left text-sm text-foreground flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors cursor-pointer">
                                                            <span>{a.question}</span>
                                                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {results.courses.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium text-muted-foreground">Related courses</p>
                                                    {results.courses.map((c) => <CourseCard key={c.id} course={c} onOpen={openCourse} />)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ARTICLE */}
                            {view === "article" && activeArticle && (
                                <div className="p-4 space-y-4">
                                    <h3 className="font-semibold text-foreground">{activeArticle.question}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{activeArticle.answer}</p>
                                    {activeArticle.links && activeArticle.links.length > 0 && (
                                        <div className="space-y-1.5 pt-1">
                                            {activeArticle.links.map((l) => (
                                                <Link key={l.href} href={l.href} onClick={closeAndReset} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                                                    <ArrowRight className="h-3.5 w-3.5" /> {l.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-border">
                                        <ContactStrip />
                                    </div>
                                </div>
                            )}

                            {/* COURSE */}
                            {view === "course" && activeCourse && (
                                <div className="p-4 space-y-3">
                                    <img src={activeCourse.thumbnail || ""} alt={activeCourse.title} className="w-full h-36 rounded-xl object-cover bg-muted" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">{activeCourse.categoryName}</p>
                                        <h3 className="font-semibold text-foreground">{activeCourse.title}</h3>
                                        <p className="text-lg font-bold text-primary mt-1">
                                            {formatPrice(activeCourse)}
                                            {!activeCourse.isFree && activeCourse.originalFee > activeCourse.discountedFee && (
                                                <span className="text-sm font-normal text-muted-foreground line-through ml-2">₦{activeCourse.originalFee.toLocaleString()}</span>
                                            )}
                                        </p>
                                    </div>
                                    {activeCourse.description && (
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">{activeCourse.description}</p>
                                    )}
                                    {activeCourse.whoIsCourseFor && (
                                        <div>
                                            <p className="text-xs font-medium text-foreground mb-1">Who it&apos;s for</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{activeCourse.whoIsCourseFor}</p>
                                        </div>
                                    )}
                                    <Link href={`${coursesUrl}/${activeCourse.slug}`} onClick={closeAndReset} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                                        View full course <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            )}

                            {/* BROWSE */}
                            {view === "browse" && (
                                <div className="p-4 space-y-3">
                                    {loadingData ? (
                                        <Centered><Loader2 className="h-6 w-6 animate-spin text-primary" /></Centered>
                                    ) : (
                                        <>
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={() => setBrowseCategory(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${!browseCategory ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-muted/40"}`}>All</button>
                                                {categories.map((cat) => (
                                                    <button key={cat.slug} onClick={() => setBrowseCategory(cat.slug)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${browseCategory === cat.slug ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-muted/40"}`}>{cat.name}</button>
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                {browseList.length === 0 ? (
                                                    <p className="text-sm text-muted-foreground text-center py-6">No courses here yet.</p>
                                                ) : (
                                                    browseList.map((c) => <CourseCard key={c.id} course={c} onOpen={openCourse} />)
                                                )}
                                            </div>
                                            <Link href={coursesUrl} onClick={closeAndReset} className="flex items-center justify-center gap-1 text-sm text-primary font-medium hover:underline pt-1">
                                                See all courses <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* QUIZ */}
                            {view === "quiz" && (
                                <div className="p-4 space-y-4">
                                    {loadingData ? (
                                        <Centered><Loader2 className="h-6 w-6 animate-spin text-primary" /></Centered>
                                    ) : (
                                        <>
                                            {/* Step 1: category */}
                                            <div>
                                                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-primary" /> What are you interested in?</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <QuizChip active={quizCategory === "any"} onClick={() => setQuizCategory("any")}>Surprise me</QuizChip>
                                                    {categories.map((cat) => (
                                                        <QuizChip key={cat.slug} active={quizCategory === cat.slug} onClick={() => setQuizCategory(cat.slug)}>{cat.name}</QuizChip>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Step 2: budget */}
                                            {quizCategory && (
                                                <div>
                                                    <p className="text-sm font-medium text-foreground mb-2">What's your budget?</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {budgets.map((b) => (
                                                            <QuizChip key={b.key} active={quizBudget === b.key} onClick={() => setQuizBudget(b.key)}>{b.label}</QuizChip>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Results */}
                                            {quizCategory && quizBudget && (
                                                <div className="space-y-2 pt-1">
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {quizMatches.length > 0 ? "Recommended for you" : "No exact match — try a wider budget"}
                                                    </p>
                                                    {quizMatches.map((c) => <CourseCard key={c.id} course={c} onOpen={openCourse} />)}
                                                    <Link href={coursesUrl} onClick={closeAndReset} className="flex items-center justify-center gap-1 text-sm text-primary font-medium hover:underline pt-1">
                                                        Browse all courses <ArrowRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer: quick lists (home only) */}
                        {view === "home" && (
                            <div className="border-t border-border p-2 flex items-center justify-around shrink-0">
                                <FooterAction icon={TrendingUp} label="Popular" onClick={() => { setResults({ articles: [], courses: popular, recommend: false, hasResults: popular.length > 0 }); setResultsTitle("Most popular"); go("results"); }} />
                                <FooterAction icon={Clock} label="Newest" onClick={() => { setResults({ articles: [], courses: newest, recommend: false, hasResults: newest.length > 0 }); setResultsTitle("Newest courses"); go("results"); }} />
                                <FooterAction icon={LayoutGrid} label="Browse" onClick={openBrowse} />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Centered = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center py-10">{children}</div>
);

const QuizChip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${active ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-muted/40"}`}>
        {children}
    </button>
);

const FooterAction = ({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-muted-foreground hover:text-primary transition-colors cursor-pointer">
        <Icon className="h-4 w-4" />
        <span className="text-[10px]">{label}</span>
    </button>
);

const ContactStrip = () => (
    <div className="rounded-xl bg-muted/40 border border-border p-3">
        <p className="text-xs font-medium text-foreground mb-2">Still need help?</p>
        <div className="flex flex-col gap-1.5">
            <a href={supportWhatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp {SUPPORT_WHATSAPP_DISPLAY}
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Mail className="h-3.5 w-3.5" /> {SUPPORT_EMAIL}
            </a>
            <Link href={contactUsUrl} className="flex items-center gap-2 text-sm text-primary hover:underline">
                <ArrowRight className="h-3.5 w-3.5" /> Contact page
            </Link>
        </div>
    </div>
);

export default SupportWidget;
