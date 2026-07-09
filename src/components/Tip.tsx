import React from "react";
import Callout from "./Callout";

interface TipProps {
  title?: string;
  children: React.ReactNode;
}

export default function Tip({ title = "Tip", children }: TipProps) {
  return <Callout type="success" title={`💡 ${title}`}>{children}</Callout>;
}
