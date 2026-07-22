'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Share2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import CourseCard from "@/src/components/website/CourseCard";
import { blogPosts } from "@/src/data/blog";
import { homepageCourses } from "@/src/services/website/course";
import { blogUrl } from "@/src/utils/url";

const getTotalLectures = (course: any): number => {
    if (!course.courseModules) return 0;
    return course.courseModules.reduce(
        (total: number, module: any) => total + (module.moduleComponents?.length || 0),
        0
    );
};

// Lightweight markdown-ish renderer for the static blog content.
const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
        if (line.startsWith("## ")) {
            return <h2 key={i} className="text-xl md:text-2xl font-bold font-display text-foreground mt-8 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith("### ")) {
            return <h3 key={i} className="text-lg font-bold font-display text-foreground mt-6 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith("- **")) {
            const parts = line.slice(2).split("**");
            return (
                <li key={i} className="ml-4 text-muted-foreground mb-1 list-disc">
                    <strong className="text-foreground">{parts[1]}</strong>{parts[2]}
                </li>
            );
        }
        if (line.startsWith("- ")) {
            return <li key={i} className="ml-4 text-muted-foreground mb-1 list-disc">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\./)) {
            const text = line.replace(/^\d+\.\s*/, "");
            const parts = text.split(/\*\*(.*?)\*\*/g);
            return (
                <li key={i} className="ml-4 text-muted-foreground mb-1 list-decimal">
                    {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part)}
                </li>
            );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
            return <p key={i} className="font-semibold text-foreground mt-4 mb-1">{line.slice(2, -2)}</p>;
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
            <p key={i} className="text-muted-foreground leading-relaxed mb-2">
                {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part)}
            </p>
        );
    });
};

const BlogPost = ({ slug }: { slug: string }) => {
    const router = useRouter();
    const post = blogPosts.find((p) => p.slug === slug);

    const [recommended, setRecommended] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const result = await homepageCourses();
                if (result.success) setRecommended((result.courses || []).slice(0, 4));
            } catch (error) {
                console.log("Error loading recommended courses:", error);
            }
        };
        fetchCourses();
    }, []);

    if (!post) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
                <Button variant="hero" onClick={() => router.push(blogUrl)}>
                    Back to Blog
                </Button>
            </div>
        );
    }

    const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

    const relatedPosts = blogPosts
        .filter((p) => p.category === post.category && p.slug !== post.slug)
        .slice(0, 2);

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: post.title, url });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard.");
            }
        } catch {
            // user dismissed the share sheet — ignore
        }
    };

    return (
        <>
            {/* Hero image */}
            <div className="w-full h-64 md:h-96 relative overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>

            <section className="py-8 md:py-12">
                <div className="container max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">{post.category}</Badge>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {post.readTime}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-4xl font-bold font-display text-foreground mb-4 leading-tight">
                            {post.title}
                        </h1>

                        {/* Author & share */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">W</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{post.author}</p>
                                    <p className="text-xs text-muted-foreground">Published author</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                        </div>

                        {/* Content */}
                        <article className="prose-custom">
                            {renderContent(post.content)}
                        </article>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border gap-4">
                            {prevPost ? (
                                <Link href={`${blogUrl}/${prevPost.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="line-clamp-1">{prevPost.title}</span>
                                </Link>
                            ) : <div />}
                            {nextPost ? (
                                <Link href={`${blogUrl}/${nextPost.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-right">
                                    <span className="line-clamp-1">{nextPost.title}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : <div />}
                        </div>

                        {/* Related posts */}
                        {relatedPosts.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-border">
                                <h3 className="text-lg font-bold font-display text-foreground mb-4 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary" /> Related Posts
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {relatedPosts.map((rp) => (
                                        <Link key={rp.slug} href={`${blogUrl}/${rp.slug}`} className="group">
                                            <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="aspect-[16/9] overflow-hidden">
                                                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">{rp.readTime}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommended Courses */}
                        {recommended.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-border">
                                <h3 className="text-lg font-bold font-display text-foreground mb-2 flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-primary" /> Recommended Courses
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">Turn what you&apos;ve read into real skills — explore our courses.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {recommended.map((course, i) => (
                                        <CourseCard
                                            key={course.slug}
                                            course={course}
                                            slug={course.slug}
                                            title={course.title}
                                            lectures={getTotalLectures(course)}
                                            originalPrice={course.originalFee}
                                            discountedPrice={course.discountedFee}
                                            image={course.thumbnail ?? ''}
                                            isFree={course.isFree}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default BlogPost;
