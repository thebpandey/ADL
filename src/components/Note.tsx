import React from "react";
import Callout from "./Callout";

interface NoteProps {
  title?: string;
  children: React.ReactNode;
}

export default function Note({ title = "Note", children }: NoteProps) {
  return <Callout type="info" title={title}>{children}</Callout>;
}
