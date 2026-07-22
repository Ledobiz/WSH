'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { blogPosts, blogCategories } from "@/src/data/blog";
import { blogUrl } from "@/src/utils/url";

const BlogCardSkeleton = () => (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <Skeleton className="aspect-[16/10] w-full rounded-none" />
        <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-3 pt-3 border-t border-border">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    </div>
);

const FeaturedSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card rounded-2xl border border-border overflow-hidden mb-10">
        <Skeleton className="aspect-[16/10] md:aspect-auto w-full rounded-none" />
        <div className="p-6 md:p-8 space-y-4 flex flex-col justify-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
    </div>
);

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    const filtered = activeCategory === "All"
        ? blogPosts
        : blogPosts.filter((p) => p.category === activeCategory);

    return (
        <>
            <section className="bg-primary py-12 md:py-20">
                <div className="container text-primary-foreground text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="bg-background/20 text-primary-foreground border-0 backdrop-blur-sm mb-4">
                            <BookOpen className="h-3 w-3 mr-1" /> Our Blog
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold font-display mb-3">
                            Insights, Tips &amp; Stories
                        </h1>
                        <p className="text-primary-foreground/80 max-w-xl mx-auto">
                            Practical advice, success stories, and resources to help you build skills and grow your business.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-10 md:py-16">
                <div className="container">
                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {blogCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                                    activeCategory === cat
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <>
                            <FeaturedSkeleton />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <BlogCardSkeleton key={i} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Featured post */}
                            {filtered.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-10"
                                >
                                    <Link href={`${blogUrl}/${filtered[0].slug}`} className="group">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                                            <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                                                <img
                                                    src={filtered[0].image}
                                                    alt={filtered[0].title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="p-6 md:p-8 flex flex-col justify-center">
                                                <Badge variant="secondary" className="w-fit mb-3 bg-primary/10 text-primary">
                                                    {filtered[0].category}
                                                </Badge>
                                                <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground group-hover:text-primary transition-colors mb-3">
                                                    {filtered[0].title}
                                                </h2>
                                                <p className="text-muted-foreground mb-4 line-clamp-3">{filtered[0].excerpt}</p>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(filtered[0].date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {filtered[0].readTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )}

                            {/* Grid of posts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered.slice(1).map((post, i) => (
                                    <motion.div
                                        key={post.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link href={`${blogUrl}/${post.slug}`} className="group block h-full">
                                            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                                                <div className="aspect-[16/10] overflow-hidden">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="p-5 flex flex-col flex-1">
                                                    <Badge variant="secondary" className="w-fit mb-2 bg-primary/10 text-primary text-[10px]">
                                                        {post.category}
                                                    </Badge>
                                                    <h3 className="font-bold font-display text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{post.excerpt}</p>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {post.readTime}
                                                            </span>
                                                        </div>
                                                        <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                            Read <ArrowRight className="h-3 w-3" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {filtered.length === 0 && (
                                <div className="text-center py-16 text-muted-foreground">
                                    <p className="text-lg">No posts in this category yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default Blog;
