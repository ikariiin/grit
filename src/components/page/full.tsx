import { HTMLProps, ReactNode } from "react";

export interface FullPageProps {
  children: ReactNode;
}

export function FullPage({ children, ...props }: FullPageProps & HTMLProps<HTMLElement>) {
  return (
    <section {...props} className={`${props.className ?? ""} w-screen min-h-screen`}>
      {children}
    </section>
  );
}
