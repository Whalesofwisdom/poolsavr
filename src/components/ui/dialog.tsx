import * as React from "react";

export interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, children }) => {
  if (!open) return null;
  return <div>{children}</div>;
};

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  overlayClassName?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  className,
  overlayClassName,
  ...props
}) => {
  return (
    <div className={["fixed inset-0 z-50 flex items-center justify-center", overlayClassName].filter(Boolean).join(" ")}> 
      <div
        className={[
          "relative z-50 w-full max-w-lg rounded-lg border bg-background text-foreground shadow-lg",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={["flex flex-col space-y-1.5 text-center sm:text-left", className].filter(Boolean).join(" ")} {...props} />
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={["text-lg font-semibold leading-none tracking-tight", className].filter(Boolean).join(" ")} {...props} />
);

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={["text-sm text-muted-foreground", className].filter(Boolean).join(" ")} {...props} />
);

export default Dialog;


