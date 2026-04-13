import { notFound } from "next/navigation";
import { LocalEditor } from "@/components/local-editor";

export const metadata = {
  title: "MDX editor",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MdxEditorPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <LocalEditor />;
}
