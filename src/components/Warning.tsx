import React from "react";
import Callout from "./Callout";

interface WarningProps {
  title?: string;
  children: React.ReactNode;
}

export default function Warning({ title = "Warning", children }: WarningProps) {
  return <Callout type="warning" title={title}>{children}</Callout>;
}
