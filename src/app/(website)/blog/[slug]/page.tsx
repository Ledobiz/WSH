import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import BlogPost from "@/src/views/website/BlogPost";
import { fetchPublishedPostBySlug } from "@/src/services/website/blog";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { post } = await fetchPublishedPostBySlug(slug);

    if (!post) {
        return {
            title: "Blog - Women Skills Hub",
            description: "The home for upskilling for financial independence"
        };
    }

    return {
        title: `${post.title} - Women Skills Hub`,
        description: post.excerpt,
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />
                <BlogPost slug={slug} />
                <Footer />
            </div>
        </PageTransition>
    );
}
