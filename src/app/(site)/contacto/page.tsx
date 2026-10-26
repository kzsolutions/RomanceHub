import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Mail, MessageCircle, ReceiptText, ShieldQuestion, Sparkles } from "lucide-react";
import { StaticPage } from "@/components/layout/StaticPage";
import { ContactForm } from "./ContactForm";

const CONTACT_EMAIL = "kzsolutions00@gmail.com";
const WHATSAPP_HREF = "https://wa.me/258876477153";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Fala com a equipa do RomanceHub por formulário, WhatsApp ou email.",
};

export default function ContactoPage() {
  return (
    <StaticPage
      eyebrow="Contacto"
      title="Estamos aqui para ajudar"
      intro="Tens dúvidas sobre a tua conta, um pagamento ou uma história? Escolhe o canal que preferires. O formulário prepara a mensagem para enviares por email ou WhatsApp; também podes contactar-nos diretamente."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="rounded-2xl border bg-surface p-5 shadow-soft transition-colors hover:border-brand-300 dark:hover:border-brand-800"
        >
          <Mail className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden />
          <p className="mt-3 text-sm font-semibold text-foreground">Email</p>
          <p className="mt-1 break-all text-sm text-muted">{CONTACT_EMAIL}</p>
        </a>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border bg-surface p-5 shadow-soft transition-colors hover:border-brand-300 dark:hover:border-brand-800"
        >
          <MessageCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden />
          <p className="mt-3 text-sm font-semibold text-foreground">WhatsApp</p>
          <p className="mt-1 text-sm text-muted">Abrir conversa com a equipa</p>
        </a>
      </div>

      <h2>Formulário de contacto</h2>
      <div className="rounded-2xl border bg-surface p-5 shadow-soft sm:p-6">
        <ContactForm />
      </div>

      <h2>Em que podemos ajudar</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: ShieldQuestion,
            title: "Conta e acesso",
            text: "Problemas a entrar, confirmação de email, palavra-passe ou sessão.",
          },
          {
            icon: ReceiptText,
            title: "Pagamentos",
            text: "Pedidos, referências, comprovativos e desbloqueio de obras.",
          },
          {
            icon: BookOpen,
            title: "Conteúdo",
            text: "Capítulos em falta, erros de texto ou questões sobre uma história.",
          },
          {
            icon: Sparkles,
            title: "Autores e parcerias",
            text: "Publicação de obras, área de autor e colaborações editoriais.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border bg-surface p-4 shadow-soft">
            <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>

      <h2>Antes de escrever</h2>
      <p>Para conseguirmos ajudar mais rápido, inclui estes dados:</p>
      <ul>
        <li>O email associado à tua conta.</li>
        <li>A referência do pedido, se for sobre um pagamento.</li>
        <li>O título da história e o número do capítulo, se for sobre conteúdo.</li>
      </ul>

      <p className="rounded-xl border border-dashed bg-surface-2 px-4 py-3 text-xs text-muted">
        Nunca te pedimos a palavra-passe por email ou WhatsApp. Se receberes um contacto suspeito em
        nome do RomanceHub, não partilhes dados pessoais e confirma os nossos canais nesta página.
      </p>

      <p className="text-xs text-muted">
        Para informações sobre o tratamento dos teus dados, consulta a{" "}
        <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </StaticPage>
  );
}
