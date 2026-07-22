'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { useCart } from "@/src/providers/CartProvider";
import { myCoursesUrl } from "@/src/utils/url";
import { Button } from "@/src/components/ui/button";
import { useSearchParams } from "next/navigation";
import { fetchNewlyPaidCourses } from "@/src/services/website/cart";
import { useAuth } from "@/src/providers/AuthProvider";

interface PaidCourseInterface {
    id: string;
    title: string;
    thumbnail: string|null;
    discountedFee: number;
    originalFee: number;
    isFree: boolean;
}

const totalFees = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.isFree ? 0 : (item.discountedFee || item.originalFee || 0), 0);
};

const ThankYou = () => {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { formatPrice } = useCart();
    const reference = searchParams?.get('ref');
    const paymentMethod = searchParams?.get('gateway');

    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState<PaidCourseInterface[]>([]);
    const router = useRouter();

    useEffect(() => {
        const paymentsDone = localStorage.getItem('payments-done');
        if (!paymentsDone || paymentsDone !== 'yes') {
            router.push('/');
        } else {
            localStorage.removeItem('payments-done');
        }

        const fetchPaidCourses = async (reference: any) => {
            setLoading(true);

            if (!user?.id) {
                return;
            }

            try {
                const result = await fetchNewlyPaidCourses(user.id, reference)
                console.log(result?.courses);
                
                setCartItems(result?.courses);
            } catch (error) {
                console.log('Error fetching paid courses on thank you page', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPaidCourses(reference);
    }, [user, reference, router]);

    return (
        <section className="py-20 md:py-32">
            <div className="container max-w-2xl text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                    className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle className="h-12 w-12 text-primary-foreground" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
                >
                    Payment Successful! 🎉
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-muted-foreground mb-8"
                >
                    Thank you for your purchase! {cartItems.length === 1
                        ? "Your course access has been activated."
                        : `All ${cartItems.length} courses have been activated.`}{" "}
                    You can start learning right away.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card rounded-2xl border border-border p-6 mb-8 text-left"
                >
                    <h2 className="font-display font-bold text-foreground mb-4">Order Details</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-medium text-foreground">#{reference}</span>
                        </div>

                        <div className="border-t border-border pt-3 space-y-2">
                            <span className="text-muted-foreground text-xs uppercase tracking-wide">
                                {cartItems.length === 1 ? "Course" : `Courses (${cartItems.length})`}
                            </span>
                            {cartItems.map((course, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="font-medium text-foreground">{course.title}</span>
                                    <span className="text-muted-foreground">{course.isFree ? 'Free' : formatPrice(course.discountedFee)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-1">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-medium text-foreground">{paymentMethod}</span>
                        </div>

                        <div className="border-t border-border pt-3 flex justify-between">
                            <span className="font-semibold text-foreground">Total Amount For Course(s)</span>
                            <span className="font-bold text-primary">{formatPrice(totalFees(cartItems))}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-muted-foreground mb-8"
                >
                    A confirmation email has been sent to your registered email address.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Link href={myCoursesUrl}>
                        <Button variant="hero" size="lg" className="cursor-pointer">
                            <BookOpen className="h-4 w-4" /> Start Learning <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
export default ThankYou