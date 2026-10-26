import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, PenLine, ShieldCheck } from "lucide-react";
import { StaticPage } from "@/components/layout/StaticPage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Conhece o RomanceHub, a biblioteca digital de romances originais em português.",
};

export default function SobrePage() {
  return (
    <StaticPage
      eyebrow="Sobre nós"
      title="Histórias de amor para ler onde estiveres"
      intro="O RomanceHub é uma biblioteca digital de romances originais em português. Reunimos histórias de amor, paixão e segundas chances num espaço simples, rápido e agradável de ler — no telemóvel, no tablet ou no computador."
    >
      <h2>O que encontras na plataforma</h2>
      <ul>
        <li>Romances originais organizados por categorias e tags.</li>
        <li>Leitura por capítulos, com progresso guardado na tua conta.</li>
        <li>Favoritos, avaliações e comentários para acompanhares as tuas obras.</li>
        <li>Avisos quando saem novos capítulos das histórias que segues.</li>
        <li>O primeiro capítulo de cada história disponível sem cadastro.</li>
      </ul>

      <h2>Para quem lê</h2>
      <p>
        Queremos que encontres a próxima história em poucos cliques. Podes explorar por categoria,
        popularidade ou novidades, começar pelo primeiro capítulo e criar conta gratuita quando
        quiseres continuar a ler, guardar o progresso e receber novidades.
      </p>

      <h2>Para quem escreve</h2>
      <p>
        Autores aprovados têm uma área própria para acompanhar as suas obras, leituras e avaliações.
        A publicação e a revisão editorial são acompanhadas pela equipa do RomanceHub, para garantir
        qualidade e consistência em cada capítulo.
      </p>

      <h2>O nosso compromisso</h2>
      <ul>
        <li>
          <strong>Qualidade:</strong> histórias cuidadas, com revisão antes de chegarem ao público.
        </li>
        <li>
          <strong>Transparência:</strong> preços, prévias e condições de acesso sempre visíveis.
        </li>
        <li>
          <strong>Respeito:</strong> um espaço seguro para leitores, autores e comentários
          construtivos.
        </li>
        <li>
          <strong>Acesso simples:</strong> o primeiro capítulo é livre e o cadastro é gratuito.
        </li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/explorar" size="lg">
          <BookOpen className="h-4 w-4" aria-hidden />
          Explorar histórias
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button href="/contacto" variant="outline" size="lg">
          <HeartHandshake className="h-4 w-4" aria-hidden />
          Falar connosco
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: BookOpen,
            title: "Leitura por capítulos",
            text: "Continua de onde paraste em qualquer dispositivo.",
          },
          {
            icon: PenLine,
            title: "Histórias originais",
            text: "Romances em português, publicados com acompanhamento editorial.",
          },
          {
            icon: ShieldCheck,
            title: "Conta segura",
            text: "Os teus dados e o teu progresso ficam protegidos na tua conta.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border bg-surface p-4 shadow-soft">
            <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted">
        Consulta também a nossa{" "}
        <Link href="/privacidade">Política de Privacidade</Link>, os{" "}
        <Link href="/termos">Termos de Uso</Link> e as{" "}
        <Link href="/cookies">Definições de Cookies</Link>.
      </p>
    </StaticPage>
  );
}
