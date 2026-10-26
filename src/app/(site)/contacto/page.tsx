import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Phone, ReceiptText, ShieldQuestion, Sparkles } from "lucide-react";
import { StaticPage } from "@/components/layout/StaticPage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Fala com a equipa do RomanceHub pelo telefone 876 477 153.",
};

const PHONE_DISPLAY = "876 477 153";
const PHONE_HREF = "tel:+258876477153";

export default function ContactoPage() {
  return (
    <StaticPage
      eyebrow="Contacto"
      title="Estamos aqui para ajudar"
      intro="Tens dúvidas sobre a tua conta, um pagamento ou uma história? Fala connosco pelo telefone. Respondemos o mais breve possível."
    >
      <div className="rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50 to-transparent p-6 shadow-soft dark:border-brand-900/60 dark:from-brand-950/40">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
              <Phone className="h-4 w-4" aria-hidden />
              Telefone
            </p>
            <a
              href={PHONE_HREF}
              className="mt-1 block font-display text-3xl font-bold tracking-tight text-foreground hover:text-brand-600 dark:hover:text-brand-400"
            >
              {PHONE_DISPLAY}
            </a>
            <p className="mt-1 text-xs text-muted">Chamada para a rede móvel nacional.</p>
          </div>
          <Button href={PHONE_HREF} size="lg">
            <Phone className="h-4 w-4" aria-hidden />
            Ligar agora
          </Button>
        </div>
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

      <h2>Antes de ligar</h2>
      <p>Para conseguirmos ajudar mais rápido, tem estes dados à mão:</p>
      <ul>
        <li>O email associado à tua conta.</li>
        <li>A referência do pedido, se for sobre um pagamento.</li>
        <li>O título da história e o número do capítulo, se for sobre conteúdo.</li>
      </ul>

      <p className="rounded-xl border border-dashed bg-surface-2 px-4 py-3 text-xs text-muted">
        Nunca te pedimos a palavra-passe por telefone. Se receberes um contacto suspeito em nome do
        RomanceHub, não partilhes dados pessoais e confirma o número nesta página.
      </p>

      <p className="text-xs text-muted">
        Para informações sobre o tratamento dos teus dados, consulta a{" "}
        <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </StaticPage>
  );
}
