import { type ReactElement, type ReactNode, useState } from "react";

export interface CollapseProps {
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
}

export function Collapse({ trigger, children, open = false }: CollapseProps) {
  const [isCollapsed, setIsCollapsed] = useState(open);

  return (
    <>
      <div onClick={() => setIsCollapsed((collapsed) => !collapsed)}>{trigger}</div>
      {isCollapsed && children}
    </>
  );
}
