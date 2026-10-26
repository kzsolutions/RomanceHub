"use client";

import { useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

const CONTACT_EMAIL = "kzsolutions00@gmail.com";
const WHATSAPP_NUMBER = "258876477153";

const TOPICS = [
  "Conta e acesso",
  "Pagamentos",
  "Conteúdo",
  "Autores e parcerias",
  "Privacidade",
  "Outro",
] as const;

const fieldClass =
  "h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40";
const labelClass = "mb-1.5 block text-sm font-medium";
const textareaClass =
  "min-h-36 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring/40";

function readForm(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    topic: String(data.get("topic") ?? "Outro"),
    message: String(data.get("message") ?? "").trim(),
  };
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);

  function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const { name, email, topic, message } = readForm(form);
    const body = `Nome: ${name}\nEmail: ${email}\nAssunto: ${topic}\n\n${message}`;
    const subject = `[RomanceHub] ${topic}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  function handleWhatsApp() {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const { name, email, topic, message } = readForm(form);
    const body = `Olá, sou ${name}.\nAssunto: ${topic}\n\n${message}\n\nEmail: ${email}`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form ref={formRef} onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Nome
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="O teu nome"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="tu@exemplo.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-topic" className={labelClass}>
          Assunto
        </label>
        <select id="contact-topic" name="topic" required defaultValue="Conta e acesso" className={fieldClass}>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Mensagem
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          placeholder="Descreve a tua dúvida com o máximo de detalhe possível. Se for sobre um pagamento, inclui a referência do pedido."
          className={textareaClass}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="gap-2">
          <Send className="h-4 w-4" aria-hidden />
          Enviar por email
        </Button>
        <Button type="button" variant="outline" onClick={handleWhatsApp} className="gap-2">
          <MessageCircle className="h-4 w-4" aria-hidden />
          Enviar por WhatsApp
        </Button>
      </div>

      <p id="contact-form-note" className="text-xs leading-relaxed text-muted">
        O formulário abre a tua aplicação de email ou o WhatsApp com a mensagem já preenchida. Nada é
        enviado automaticamente. Se preferires, escreve diretamente para{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
