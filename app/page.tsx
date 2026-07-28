import type { Metadata } from "next";
import AssistantScene from "@/components/AssistantScene";

export const metadata: Metadata = {
  title: "Hisham Khashman | AI Assistant",
  description:
    "Ask Hisham about his background, projects, experience, and current work."
};

export default function Home() {
  return <AssistantScene />;
}
