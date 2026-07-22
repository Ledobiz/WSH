'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import Paystack from '@paystack/inline-js';
import { toast } from "react-toastify";
import { ArrowRight, Check, CreditCard, Percent, ShieldCheck, ShoppingCart, Tag, Trash2, X } from "lucide-react";

import { verifyFlutterwaveTransaction, verifyPaystackTransaction } from "@/src/services/website/cart";
import { validateCoupon, recordCouponUsage } from "@/src/services/website/coupon";
import { useAuth } from "@/src/providers/AuthProvider";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

import EmptyState from "@/src/components/website/EmptyState";
import LoadingButton from "@/src/components/website/LoadingButton";
import { useCart } from "@/src/providers/CartProvider";
import { cartUrl, loginUrl, thankYouUrl } from "@/src/utils/url";

interface Coupon {
    id: string;
    code: string;
    label: string;
    type: "cart" | "course";
    isFixedAmount: boolean;
    discountAmount: number; // ₦ amount when isFixedAmount, otherwise a percentage
    courseId?: string | null; // only for course-specific coupons
    courseName?: string | null;
}

type PaymentMethod = "paystack" | "flutterwave";

const paymentMethods: { id: PaymentMethod; name: string; description: string; logo: string }[] = [
    { id: "flutterwave", name: "Flutterwave", description: "Cards, Mobile Money, Bank Transfer", logo: "/images/flutterwave-logo.png" },
    { id: "paystack", name: "Paystack", description: "Cards, Bank Transfer, USSD", logo: "https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png" },
];

const CartPage = () => {
    const { cartCourses, totalFees, removeFromCart, clearCart, currency, convertAmount, formatPrice } = useCart();

    const [removing, setRemoving] = useState<string | null>(null);
    const [paying, setPaying] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("flutterwave");
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
    const [couponError, setCouponError] = useState('');
    const router = useRouter();
    const { user } = useAuth();   

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        }
    }, []);

    const subtotalNGN = totalFees;

    // Discount for a single course-scoped coupon, applied to that course's price.
    const courseCouponDiscount = (coupon: Coupon): number => {
        const item = cartCourses.find((i) => i.id === coupon.courseId);
        if (!item) return 0;
        const base = item.discountedFee || 0;
        return coupon.isFixedAmount ? Math.min(coupon.discountAmount, base) : (base * coupon.discountAmount) / 100;
    };

    const totalDiscountNGN = (() => {
        let discount = 0;
        for (const c of appliedCoupons) {
            if (c.type === "course") discount += courseCouponDiscount(c);
        }
        const cartCoupon = appliedCoupons.find((c) => c.type === "cart");
        if (cartCoupon) {
            discount += cartCoupon.isFixedAmount
                ? Math.min(cartCoupon.discountAmount, subtotalNGN)
                : (subtotalNGN * cartCoupon.discountAmount) / 100;
        }
        return Math.min(Math.round(discount), subtotalNGN);
    })();

    const totalNGN = selectedPayment === 'paystack' ? (subtotalNGN - totalDiscountNGN) + ((subtotalNGN - totalDiscountNGN) * 0.015) : subtotalNGN - totalDiscountNGN;

    const makePaymentWithFlutterwave = async () => {
        if (!user || user.role != 'student') {
            toast.info('Please log in to proceed to checkout');
            router.push(`${loginUrl}?return=${cartUrl}`);
            return;
        }

        setPaying(true);

        const convertedTotal = convertAmount(totalNGN);
        const displayTotal = Number(convertedTotal.toFixed(2));

        const txRef = `wsh_${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`;

        if (typeof window !== 'undefined' && (window as any).FlutterwaveCheckout) {
            const modal = (window as any).FlutterwaveCheckout({
                public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
                tx_ref: txRef,
                amount: displayTotal,
                currency: currency || 'NGN',
                payment_options: 'card, ussd, banktransfer, opay, mobilemoneyghana, mobilemoneyuganda, mobilemoneyrwanda, mobilemoneyzambia',
                meta: {
                    consumer_id: user.id,
                    consumer_email: user.email,
                },
                customer: {
                    email: user.email,
                    phone_number: user.phone || '',
                    name: user.name,
                },
                customizations: {
                    title: 'Women Skills Hub Online Course Payment',
                    description: 'Life changing courses for financial independence',
                    logo: 'https://res.cloudinary.com/asifatkazeem/image/upload/v1766900704/mkk11iymqwpcrkvcmq7o.jpg',
                },
                callback: async function (payment: any) {
                    const response = await verifyFlutterwaveTransaction(payment.transaction_id, user.id);

                    modal.close();
                    setPaying(false);

                    if (response.success) {
                        if (appliedCoupons.length > 0) {
                            await recordCouponUsage(appliedCoupons.map((c) => c.id));
                        }
                        localStorage.setItem('payments-done', 'yes');
                        toast.success('Payment successful! You have been enrolled in the course(s).');
                        router.push(`${thankYouUrl}?ref=${txRef}&gateway=Paystack`);
                    }
                    else {
                        toast.error(response.message || 'Payment verification failed. Please contact support.');
                    }
                },
                onclose: function (incomplete: boolean) {
                    if (incomplete === true) {
                        // Record event in analytics
                        setPaying(false);
                        toast.error('Payment process was not completed. You may try again.');
                    }
                    modal.close();
                },
            });
        } else {
            toast.error('Payment gateway is not available. Please try again later.');
            setPaying(false);
        }
    }

    const makePaymentWithPaystack = async () => {
        if (!user || user.role != 'student') {
            toast.info('Please log in to proceed to checkout');
            router.push(`${loginUrl}?return=${cartUrl}`);
            return;
        }

        setPaying(true);

        const convertedTotal = convertAmount(totalNGN);
        const paystackAmount = Math.round(convertedTotal * 100);

        const paystackReference = `wsh_${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`;
        
        const paystack = new Paystack();
        paystack.checkout({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
            email: user.email,
            amount: paystackAmount,
            currency: currency || 'NGN',
            onSuccess: async (transaction: any) => {
                setPaying(false);

                const response = await verifyPaystackTransaction(paystackReference, user.id);
                if (response.success) {
                    if (appliedCoupons.length > 0) {
                        await recordCouponUsage(appliedCoupons.map((c) => c.id));
                    }
                    localStorage.setItem('payments-done', 'yes');
                    toast.success('Payment successful! You have been enrolled in the course(s).');
                    router.push(`${thankYouUrl}?ref=${paystackReference}&gateway=Flutterwave`);
                } else {
                    toast.error(response.message || 'Payment verification failed. Please contact support.');
                }
            },
            onLoad: (response: any) => {
                console.log("onLoad: ", response);
            },
            onCancel: () => {
                toast.error('Payment process was not completed. You may try again.');
                setPaying(false);
            },
            onError: (error: any) => {
                console.log("Error: ", error.message);
                toast.error('Something went wrong. Payment process was not completed, you may try again.');
                setPaying(false);
            }
        });
    }

    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        setCouponError("");
        const code = couponCode.trim();
        if (!code) return;

        if (appliedCoupons.some((c) => c.code.toUpperCase() === code.toUpperCase())) {
            setCouponError("This coupon is already applied");
            return;
        }

        setApplyingCoupon(true);
        try {
            const result = await validateCoupon(
                code,
                cartCourses.map((i) => ({ courseId: i.id, price: i.discountedFee, title: i.title })),
            );

            if (!result.success || !result.coupon) {
                setCouponError(result.message);
                return;
            }

            const found = result.coupon;

            // Conflict rules: only one cart-wide coupon, and one per course.
            if (found.type === "cart" && appliedCoupons.some((c) => c.type === "cart")) {
                setCouponError("Only one cart-wide coupon can be applied");
                return;
            }
            if (found.type === "course" && appliedCoupons.some((c) => c.type === "course" && c.courseId === found.courseId)) {
                setCouponError(`A coupon is already applied to ${found.courseName}`);
                return;
            }

            const autoLabel = found.isFixedAmount ? `${formatPrice(found.discountAmount)} off` : `${found.discountAmount}% off`;
            setAppliedCoupons((prev) => [...prev, {
                id: found.id,
                code: found.code,
                label: found.name || autoLabel,
                type: found.type,
                isFixedAmount: found.isFixedAmount,
                discountAmount: found.discountAmount,
                courseId: found.courseId,
                courseName: found.courseName,
            }]);
            setCouponCode("");
            toast.success("Coupon applied!");
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = (code: string) => {
        setAppliedCoupons((prev) => prev.filter((c) => c.code !== code));
    };

    const getCouponForItem = (itemId: string): Coupon | undefined => {
        return appliedCoupons.find((c) => c.type === "course" && c.courseId === itemId);
    };

    // Discount shown against a single cart item (its course-specific coupon only).
    const itemDiscountFor = (course: any): number => {
        const coupon = getCouponForItem(course.id);
        return coupon ? Math.round(courseCouponDiscount(coupon)) : 0;
    };

    const cartWideCoupon = appliedCoupons.find((c) => c.type === "cart");

    const handlePay = async () => {        
        if (selectedPayment === 'flutterwave') {
            await makePaymentWithFlutterwave();
        } 
        else if (selectedPayment == 'paystack') {
            await makePaymentWithPaystack();
        }
    };

    const handleRemove = async (id: string) => {
        setRemoving(id);
        await removeFromCart(id);
        setRemoving(null);
    }

    return (
        <>
            <section className="bg-primary py-10 md:py-14">
                <div className="container text-primary-foreground">
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                        <ShoppingCart className="h-8 w-8" /> Checkout
                    </h1>
                </div>
            </section>

            <section className="py-10 md:py-16">
                <div className="container">
                    {cartCourses.length === 0 ? (
                        <EmptyState
                            icon={ShoppingCart}
                            title="Your cart is empty"
                            description="Looks like you haven't added any courses yet. Browse our catalogue to find something you love!"
                            actionLabel="Browse Courses"
                            actionLink="/courses"
                        />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Cart items */}
                                <div className="space-y-4">
                                    {cartCourses.map((course) => {
                                        const itemCoupon = getCouponForItem(course.id);
                                        const itemDiscount = itemDiscountFor(course);
                                        const finalPrice = course.discountedFee - itemDiscount;

                                        return (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{
                                                    opacity: removing === course.id ? 0 : 1,
                                                    x: removing === course.id ? -100 : 0,
                                                    y: 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="relative p-4 bg-card rounded-2xl border border-border shadow-card"
                                            >
                                                <div className="flex gap-4">
                                                    <img src={course.thumbnail} alt={course.title} className="w-24 h-20 rounded-xl object-cover" />
                                                    
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-muted-foreground line-through text-sm">
                                                                {course.isFree ? 'Free' : formatPrice(course.originalFee)}
                                                            </span>
                                                            {itemDiscount > 0 ? (
                                                                <>
                                                                    <span className="text-muted-foreground line-through text-sm">
                                                                        {formatPrice(course.discountedFee)}
                                                                    </span>
                                                                    <span className="font-bold text-primary">
                                                                        {formatPrice(finalPrice)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="font-bold text-primary">
                                                                    {formatPrice(course.discountedFee)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(course.id)}
                                                        className="text-destructive hover:text-destructive/80 hover:scale-110 active:scale-95 transition-all self-start cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Coupon badge on item */}
                                                <AnimatePresence>
                                                    {itemCoupon && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-3 flex items-center gap-2"
                                                        >
                                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1.5">
                                                                <Percent className="h-3 w-3" />
                                                                {itemCoupon.code}: {itemCoupon.label}
                                                            </Badge>
                                                            <span className="text-xs text-primary font-semibold">
                                                                −{formatPrice(itemDiscount)}
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                    {cartWideCoupon && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className={`${itemCoupon ? "mt-1" : "mt-3"} flex items-center gap-2`}
                                                        >
                                                            <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20 gap-1.5">
                                                                <Tag className="h-3 w-3" />
                                                                {cartWideCoupon.code}: {cartWideCoupon.label}
                                                            </Badge>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Coupon code section */}
                                <div className="bg-card rounded-2xl border border-border p-5">
                                    <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                                        <Tag className="h-5 w-5 text-primary" /> Coupon Codes
                                    </h2>

                                    {appliedCoupons.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {appliedCoupons.map((coupon) => (
                                                <motion.div
                                                    key={coupon.code}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={`flex items-center justify-between p-3 rounded-xl border ${
                                                    coupon.type === "cart"
                                                        ? "bg-primary/5 border-primary/20"
                                                        : "bg-accent/5 border-accent/20"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {coupon.type === "cart" ? (
                                                            <Tag className="h-4 w-4 text-primary shrink-0" />
                                                        ) : (
                                                            <Percent className="h-4 w-4 text-accent-foreground shrink-0" />
                                                        )}
                                                        <span className="font-semibold text-foreground text-sm">{coupon.code}</span>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-[10px] px-2 py-0 ${
                                                            coupon.type === "cart"
                                                                ? "bg-primary/10 text-primary"
                                                                : "bg-accent/10 text-accent-foreground"
                                                            }`}
                                                        >
                                                            {coupon.type === "cart" ? "Cart-wide" : "Course-specific"}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">{coupon.label}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveCoupon(coupon.code)}
                                                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => {
                                                setCouponCode(e.target.value);
                                                setCouponError("");
                                            }}
                                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                            className="flex-1"
                                        />
                                        <Button variant="outline" onClick={handleApplyCoupon} disabled={applyingCoupon || !couponCode.trim()}>
                                            {applyingCoupon ? "Applying..." : "Apply"}
                                        </Button>
                                    </div>
                                    {couponError && (
                                        <p className="text-destructive text-xs mt-2">{couponError}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Have a coupon? Enter it above to apply your discount.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" /> Choose Payment Method
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {paymentMethods.map((method) => (
                                            <>
                                                {currency === 'NGN' && method.id === 'paystack' && (
                                                    <motion.button
                                                        key={method.id}
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setSelectedPayment(method.id)}
                                                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                                                            selectedPayment === method.id
                                                            ? "border-primary bg-primary/5 shadow-card"
                                                            : "border-border bg-card hover:border-primary/30"
                                                        }`}
                                                    >
                                                        <AnimatePresence>
                                                            {selectedPayment === method.id && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    exit={{ scale: 0 }}
                                                                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                                                >
                                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={method.logo}
                                                                alt={method.name}
                                                                className="w-10 h-10 rounded-lg object-contain shrink-0 bg-muted p-1"
                                                            />
                                                            <div>
                                                                <p className="font-semibold text-foreground text-sm">{method.name}</p>
                                                                <p className="text-xs text-muted-foreground">{method.description}</p>
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                )}

                                                {method.id == 'flutterwave' && (
                                                    <motion.button
                                                        key={method.id}
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setSelectedPayment(method.id)}
                                                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                                                            selectedPayment === method.id
                                                            ? "border-primary bg-primary/5 shadow-card"
                                                            : "border-border bg-card hover:border-primary/30"
                                                        }`}
                                                    >
                                                        <AnimatePresence>
                                                            {selectedPayment === method.id && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    exit={{ scale: 0 }}
                                                                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                                                >
                                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={method.logo}
                                                                alt={method.name}
                                                                className="w-10 h-10 rounded-lg object-contain shrink-0 bg-muted p-1"
                                                            />
                                                            <div>
                                                                <p className="font-semibold text-foreground text-sm">{method.name}</p>
                                                                <p className="text-xs text-muted-foreground">{method.description}</p>
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                )}
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order summary */}
                            <div>
                                <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-4 sticky top-20">
                                    <h2 className="font-display text-xl font-bold text-foreground">Order Summary</h2>
                                    <div className="space-y-3 text-sm">
                                        {cartCourses.map((course) => {
                                            const discount = itemDiscountFor(course);
                                            return (
                                                <div key={course.id} className="space-y-1">
                                                    <div className="flex justify-between text-foreground">
                                                        <span className="truncate mr-2">{course.title}</span>
                                                        <span className="shrink-0">{formatPrice(course.discountedFee)}</span>
                                                    </div>
                                                    {discount > 0 && (
                                                        <div className="flex justify-between text-primary text-xs pl-2">
                                                            <span>Coupon savings</span>
                                                            <span>−{formatPrice(discount)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        <div className="border-t border-border pt-2 space-y-1">
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Subtotal</span>
                                                <span>{formatPrice(subtotalNGN)}</span>
                                            </div>
                                            {totalDiscountNGN > 0 && (
                                                <div className="flex justify-between text-primary font-medium">
                                                    <span>Total Discount</span>
                                                    <span>−{formatPrice(totalDiscountNGN)}</span>
                                                </div>
                                            )}
                                            {selectedPayment === 'paystack' && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Gateway Processing Fee</span>
                                                    <span>{formatPrice((subtotalNGN - totalDiscountNGN) * 0.015)}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground text-base">
                                                <span>Total</span>
                                                <span>{formatPrice(totalNGN)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Applied coupons summary */}
                                    {appliedCoupons.length > 0 && (
                                        <div className="space-y-1.5">
                                            {appliedCoupons.map((c) => (
                                                <div key={c.code} className="flex items-center gap-1.5 text-xs text-primary">
                                                    <Check className="h-3 w-3" />
                                                    <span className="font-medium">{c.code}</span>
                                                    <span className="text-muted-foreground">— {c.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary text-xs text-muted-foreground">
                                        <CreditCard className="h-3.5 w-3.5 shrink-0" />
                                        Paying with <span className="font-semibold text-foreground">{paymentMethods.find((m) => m.id === selectedPayment)?.name}</span>
                                    </div>

                                    <LoadingButton
                                        variant="hero"
                                        size="lg"
                                        className="w-full h-12"
                                        loading={paying}
                                        onClick={handlePay}
                                    >
                                        Pay {formatPrice(totalNGN)} <ArrowRight className="h-4 w-4" />
                                    </LoadingButton>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Secure payment · SSL encrypted
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
export default CartPage