import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => {
  const classes = [
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} {...props} />;
};

export default Card;


