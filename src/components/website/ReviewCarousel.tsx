'use client';

import { reviews } from "@/src/data/reviews";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/src/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

const ReviewCarousel = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <Badge variant="secondary" className="mb-4 text-primary font-medium bg-primary/10">Testimonials</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Students Say</h2>
          <p className="text-muted-foreground text-lg">Real stories from women who transformed their skills and careers.</p>
        </motion.div>

        <div className="max-w-5xl mx-auto px-12">
          <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}>
            <CarouselContent>
              {reviews.slice(0, 10).map((review) => (
                <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-card rounded-2xl border border-border p-6 h-full flex flex-col">
                    <Quote className="h-6 w-6 text-primary/20 mb-3" />
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-4">{review.comment}</p>
                    <div className="flex items-center gap-1 my-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-accent text-accent" : "text-border"}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-border">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.course}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ReviewCarousel;
