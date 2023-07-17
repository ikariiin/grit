import { cloneElement, HTMLProps, ReactElement } from "react";

export interface IconDisplayProps {
  children: ReactElement;
}

export function IconDisplay({ children, className, ...props }: IconDisplayProps & HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={`rounded-full inline-flex items-center justify-center w-9 h-9 bg-primary text-primary-content ${
        className ?? ""
      }`}
      {...props}
    >
      {cloneElement<SVGElement>(children, {
        className: "text-xl",
      })}
    </div>
  );
}
