'use client';

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionLink }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
      <Icon className="h-10 w-10 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
    {actionLabel && actionLink && (
      <Link href={actionLink}>
        <Button variant="hero" className="cursor-pointer">{actionLabel}</Button>
      </Link>
    )}
  </motion.div>
);

export default EmptyState;
