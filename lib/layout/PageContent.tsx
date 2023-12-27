import { ReactNode } from "react";

export function PageContent({ children }: { children: ReactNode }) {
  return <div className="w-full flex flex-col">{children}</div>;
}
