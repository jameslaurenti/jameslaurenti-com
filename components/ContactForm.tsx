"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xyklrgwq", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-base border-t border-line pt-10">
        Got it — I'll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="border border-line rounded px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border border-line rounded px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="border border-line rounded px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-accent">
          Something went wrong. Try emailing contact@jameslaurenti.com directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start px-6 py-2.5 bg-ink text-paper text-sm font-medium rounded hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
