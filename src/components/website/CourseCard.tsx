'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/src/components/ui/badge";
import { ArrowRight, BarChart3, Monitor, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { toast } from "sonner";
import { coursesUrl } from "@/src/utils/url";
import Link from "next/link";
import { useCart } from "@/src/providers/CartProvider";

interface CardPropertyInterface {
    slug: string,
    title: string,
    lectures: number,
    originalPrice: number,
    discountedPrice: number,
    image: string,
    course: any,
    isFree: boolean,
	index?: number;
}

const CourseCard = ({slug, course, title, lectures, originalPrice, discountedPrice, image, isFree, index = 0}: CardPropertyInterface) => {
	const { addToCart, removeFromCart, loadingId, cartCourses, currency, formatPrice } = useCart();
	const [imgLoaded, setImgLoaded] = useState(false);

	const handleCartEvent = (e: React.MouseEvent, action: string, course: any) => {
		e.preventDefault();
		e.stopPropagation();

		if (action === 'add') {
			addToCart(course);
			toast.success(`${course.title} added to cart!`);
		}
		else {
			removeFromCart(course.id);
			toast.info(`${course.title} removed from cart`);
		}
	}

  	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.05 }}
			viewport={{ once: true }}
			whileHover={{ y: -6 }}
			className="h-full"
		>
			<Link
				href={`${coursesUrl}/${slug}`}
				className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
			>
				<div className="relative aspect-[4/3] overflow-hidden shrink-0">
					{!imgLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
					<img
						src={image}
						alt={title}
						className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
						loading="lazy"
						onLoad={() => setImgLoaded(true)}
					/>

					
					<Badge className={`absolute top-3 left-3 ${isFree ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}  border-0 font-semibold text-xs`}>
						{isFree ? 100 : (originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0)} off
					</Badge>

					{loadingId === course.id ? (
						<div className="spinner-border" style={{color: '#fff'}} role="status">
							<span className="sr-only">Loading...</span>
						</div>
					) : (
						cartCourses.find((c) => c.id === course.id) ? (
							<button
								onClick={(event) => handleCartEvent(event, 'remove', course)}
								className="absolute top-3 right-3 w-9 h-9 rounded-full border shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 bg-primary text-primary-foreground border-primary cursor-pointer"
								aria-label={`Remove ${course} from cart`}
							>
								<ShoppingCart className="h-4 w-4" />
							</button>
						) : (
							<button
								onClick={(event) => handleCartEvent(event, 'add', course)}
								className="absolute top-3 right-3 w-9 h-9 rounded-full border shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 bg-background/80 backdrop-blur-sm text-foreground border-border hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer"
								aria-label={`Add ${title} to cart`}
							>
								<ShoppingCart className="h-4 w-4" />
							</button>
						)
					)}
				</div>

				<div className="p-4 flex flex-col flex-1">
					<h3 className="font-display font-semibold text-card-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.75rem]">
						{title}
					</h3>

					<div className="flex items-center gap-3 text-sm mt-2">
						<div className="flex items-center gap-1 text-muted-foreground">
							<BarChart3 className="h-3.5 w-3.5 shrink-0" />
							<span className="truncate">Beginner</span>
						</div>
						<div className="flex items-center gap-1 text-muted-foreground">
							<Monitor className="h-3.5 w-3.5 shrink-0" />
							<span className="truncate">LMS / Telegram</span>
						</div>
					</div>

					<div className="flex items-center justify-between pt-3 mt-auto border-t border-border">
						<div className="flex items-center gap-2 min-w-0">
							{!isFree && (
								<span className="text-sm text-muted-foreground line-through truncate">{ formatPrice(originalPrice) }</span>
							)}
							<span className="font-bold text-lg text-primary shrink-0">
								{isFree ? "Free" : formatPrice(discountedPrice)}
							</span>
						</div>
						<span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all shrink-0">
							Enroll Now <ArrowRight className="h-3.5 w-3.5" />
						</span>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

export default CourseCard;
