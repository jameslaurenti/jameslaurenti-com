import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — James Laurenti",
  description: "Get in touch.",
};

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Contact
      </h1>
      <p className="text-dim mb-12 leading-relaxed">
        Send me a note. I read everything and try to respond to things that are
        worth responding to.
      </p>

      <ContactForm />

    </div>
  );
}
