"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, XCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const calloutVariants = cva(
  "relative w-auto rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success:
          "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
        error:
          "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconVariants = cva("h-4 w-4", {
  variants: {
    variant: {
      default: "text-foreground",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      error: "text-red-600 dark:text-red-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  icon?: React.ReactNode;
  heading: React.ReactNode;
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, icon, heading, children, variant, ...props }, ref) => {
    // Define the icon mapping with proper typing
    const iconMap: Record<string, LucideIcon> = {
      success: CheckCircle2,
      warning: AlertCircle,
      error: XCircle,
      default: AlertCircle,
    };

    // Use the provided icon or get from the map based on variant
    const IconComponent = icon
      ? null // If custom icon is provided as ReactNode
      : (variant && iconMap[variant as string]) || iconMap.default;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(calloutVariants({ variant }), className)}
        {...props}
      >
        {icon ? (
          // Render the custom icon if provided
          icon
        ) : IconComponent ? (
          // Render the mapped icon component
          <IconComponent className={cn(iconVariants({ variant }))} />
        ) : (
          // Fallback to AlertCircle if something goes wrong
          <AlertCircle className={cn(iconVariants({ variant }))} />
        )}

        <h5 className="mb-1 font-medium leading-none tracking-tight">
          {heading}
        </h5>

        <div className="text-sm [&_p]:leading-relaxed">{children}</div>
      </div>
    );
  }
);
Callout.displayName = "Callout";

export { Callout };
