'use client'

import { Badge } from "@/src/components/ui/badge";
import LoadingButton from "@/src/components/website/LoadingButton";
import { sendMessageToCeo } from "@/src/services/website/contact";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ContactUs = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        subject: '', 
        message: '' 
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setSending(true);

        try {
            const contact = await sendMessageToCeo(formData.name, formData.email, formData.subject, formData.message);
            
            if (contact.success) {               
                setSent(true);
            }
            else {
                toast.error('Validation error');    
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSending(false);
        }
    }

    return (
        <>
            <section className="bg-primary py-12 md:py-16">
                <div className="container text-primary-foreground">
                    <h1 className="text-3xl md:text-5xl font-bold">Get In Touch</h1>
                    <p className="text-lg opacity-80 mt-2">We'd love to hear from you</p>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact info */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <div>
                                <Badge variant="secondary" className="mb-4 text-primary font-medium">Contact Info</Badge>
                                <h2 className="text-3xl font-bold text-foreground mb-4">Let's Start a Conversation</h2>
                                <p className="text-muted-foreground">Have questions about our courses? We're here to help!</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { icon: Phone, label: "WhatsApp", value: "+234 907 514 4830" },
                                    { icon: Mail, label: "Email", value: "support@womenskillshub.com" },
                                    { icon: MapPin, label: "Location", value: "Alagbole, Ojodu Berger, Lagos." },
                                ].map((item) => (
                                    <motion.div
                                        key={item.label}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-default"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                                            <item.icon className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{item.label}</p>
                                            <p className="font-medium text-foreground">{item.value}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Form */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 space-y-5">
                                {sent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-3 rounded-xl bg-success/10 text-success text-sm font-medium"
                                    >
                                        <CheckCircle2 className="h-4 w-4" /> Message sent successfully!
                                    </motion.div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Your name"
                                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => handleInputChange('subject', e.target.value)}
                                        placeholder="Enter subject"
                                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        placeholder="How can we help you?"
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-shadow"
                                    />
                                </div>
                                <LoadingButton variant="hero" size="lg" className="w-full h-12" loading={sending} type="submit">
                                    <Send className="h-4 w-4" /> Send Message
                                </LoadingButton>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default ContactUs