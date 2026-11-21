'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/src/components/ui/carousel";
import ReviewCard from "@/src/components/website/showcase/ReviewCard";
import { getTopReviews } from "@/src/services/website/showcase";
import type { PublicReview } from "@/src/lib/public-showcase";
import { reviewsUrl } from "@/src/utils/url";

// Testimonials: the 10 highest-rated published student reviews.
const ReviewCarousel = () => {
    const [reviews, setReviews] = useState<PublicReview[] | null>(null);
    const [api, setApi] = useState<CarouselApi>();
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        let active = true;
        getTopReviews(10).then((rows) => { if (active) setReviews(rows); }).catch(() => { if (active) setReviews([]); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!api) return;
        const onSelect = () => setSelected(api.selectedScrollSnap());
        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);
        return () => { api.off("select", onSelect); api.off("reInit", onSelect); };
    }, [api]);

    // Hide the section until there is at least one real review to show.
    if (!reviews || reviews.length === 0) return null;

    const canLoop = reviews.length >= 3;

    return (
        <section className="bg-secondary py-14 md:py-24">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-8 max-w-2xl text-center md:mb-12"
                >
                    <Badge variant="secondary" className="mb-4 bg-primary/10 font-medium text-primary">Testimonials</Badge>
                    <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">What Our Students Say</h2>
                    <p className="text-base text-muted-foreground md:text-lg">Real reviews from women who learned with us.</p>
                </motion.div>

                <div className="mx-auto max-w-5xl md:px-12">
                    <Carousel
                        setApi={setApi}
                        opts={{ align: "start", loop: canLoop }}
                        plugins={canLoop ? [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })] : []}
                    >
                        <CarouselContent className={reviews.length < 3 ? "md:justify-center" : ""}>
                            {reviews.map((review) => (
                                <CarouselItem key={review.id} className="basis-[88%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3">
                                    <ReviewCard review={review} variant="carousel" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {reviews.length > 1 && (
                            <>
                                <CarouselPrevious className="hidden md:flex" />
                                <CarouselNext className="hidden md:flex" />
                            </>
                        )}
                    </Carousel>

                    {reviews.length > 1 && (
                        <div className="mt-5 flex justify-center gap-1.5" role="tablist" aria-label="Choose a review">
                            {reviews.map((review, i) => (
                                <button
                                    key={review.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected === i}
                                    aria-label={`Review ${i + 1}`}
                                    onClick={() => api?.scrollTo(i)}
                                    className="flex h-6 items-center"
                                >
                                    <span className={`block h-2 rounded-full transition-all ${selected === i ? "w-6 bg-primary" : "w-2 bg-primary/25"}`} />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href={reviewsUrl}>See all reviews &amp; practicals <ArrowRight className="h-4 w-4" /></Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewCarousel;
