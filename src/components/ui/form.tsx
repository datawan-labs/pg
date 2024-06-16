import { Label } from "./label";
import { cn } from "@/utils/classnames";
import { ComponentProps, forwardRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

export const FormFieldset = forwardRef<
  HTMLFieldSetElement,
  ComponentProps<"fieldset"> & { title: string }
>(({ className, children, ...props }, ref) => (
  <fieldset
    ref={ref}
    className={cn("grid gap-3 rounded-lg border p-4", className)}
    {...props}
  >
    <legend className="-ml-1 px-1 font-medium text-sm">{props.title}</legend>
    {children}
  </fieldset>
));

export const FormField = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid gap-1", className)} {...props} />
  )
);

export const FormLabel = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    error?: boolean;
  }
>(({ className, error, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn(error && "text-destructive", "text-sm", className)}
    {...props}
  />
));

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
});

export const FormError = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("font-medium text-[0.8rem] text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
});
