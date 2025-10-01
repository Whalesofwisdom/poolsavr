import * as React from "react";

export const Form = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => {
  return <div {...props}>{children}</div>;
};

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}
export const FormItem: React.FC<FormItemProps> = ({ className, ...props }) => (
  <div className={["grid gap-2", className].filter(Boolean).join(" ")} {...props} />
);

export const FormLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
  <label className={["text-sm font-medium leading-none", className].filter(Boolean).join(" ")} {...props} />
);

export const FormControl: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={className} {...props} />
);

export const FormMessage: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={["text-sm text-red-600", className].filter(Boolean).join(" ")} {...props} />
);

export interface FormFieldProps {
  name: string;
  control?: any;
  render: (params: { field: any }) => React.ReactNode;
}

export function FormField({ render }: FormFieldProps) {
  return <>{render({ field: {} })}</>;
}


