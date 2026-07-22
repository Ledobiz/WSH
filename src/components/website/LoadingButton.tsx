'use client';

import { Button, ButtonProps } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

const LoadingButton = ({ loading, children, disabled, ...props }: LoadingButtonProps) => (
  <Button disabled={disabled || loading} {...props}>
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </Button>
);

export default LoadingButton;
