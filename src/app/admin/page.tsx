import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Eye,
  Flag,
  Heart,
  Layers,
  MessageSquare,
  PenLine,
  Plus,
  ShoppingBag,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { getAdminStats, getAdminCharts } from "@/lib/data/admin";
import { getPendingPaymentsCount } from "@/lib/data/payments";
import { Card } from "@/components/admin/ui";
import { RatingsChart, SignupsChart, TopStoriesChart } from "@/components/admin/Charts";
import { Button } from "@/components/ui/Button";
import { formatMT } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard · Admin" };

export default async function AdminDashboardPage() {
  const [stats, charts, pendingPayments] = await Promise.all([
    getAdminStats(),
    getAdminCharts(),
    getPendingPaymentsCount(),
  ]);

  const cards = [
    { label: "Histórias", value: stats.stories, sub: `${stats.published} publicadas · ${stats.drafts} rascunhos`, icon: BookOpen, href: "/admin/historias" },
    { label: "Utilizadores", value: stats.users, sub: `${stats.authors} autores`, icon: Users, href: "/admin/utilizadores" },
    { label: "Capítulos", value: stats.chapters, sub: "em toda a plataforma", icon: Layers, href: "/admin/historias" },
    { label: "Leituras", value: stats.reads, sub: "acumuladas", icon: Eye },
    { label: "Avaliações", value: stats.ratings, sub: "com estrelas", icon: Star },
    { label: "Favoritos", value: stats.favorites, sub: "guardados", icon: Heart },
    { label: "Comentários", value: stats.comments, sub: "no total", icon: MessageSquare, href: "/admin/comentarios" },
    { label: "Compras", value: stats.purchases, sub: formatMT(stats.revenueCents), icon: ShoppingBag, href: "/admin/pagamentos" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Visão geral</h1>
          <p className="mt-1 text-sm text-muted">Estado atual da plataforma RomanceHub.</p>
        </div>
        <Button href="/admin/historias/nova">
          <Plus className="h-4 w-4" aria-hidden />
          Nova história
        </Button>
      </div>

      {(stats.openReports > 0 || stats.pendingAuthors > 0 || pendingPayments > 0) && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {pendingPayments > 0 && (
            <Link
              href="/admin/pagamentos?estado=pending"
              className="flex items-center gap-3 rounded-2xl border border-gold-400 bg-gold-300/20 p-4 text-sm transition-colors hover:bg-gold-300/30 dark:border-gold-500/30"
            >
              <Wallet className="h-5 w-5 text-gold-600 dark:text-gold-300" aria-hidden />
              <span>
                <strong>{pendingPayments}</strong>{" "}
                {pendingPayments === 1 ? "pagamento por confirmar" : "pagamentos por confirmar"}
              </span>
            </Link>
          )}
          {stats.openReports > 0 && (
            <Link
              href="/admin/reports"
              className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm transition-colors hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10"
            >
              <Flag className="h-5 w-5 text-amber-600" aria-hidden />
              <span>
                <strong>{stats.openReports}</strong>{" "}
                {stats.openReports === 1 ? "denúncia por tratar" : "denúncias por tratar"}
              </span>
            </Link>
          )}
          {stats.pendingAuthors > 0 && (
            <Link
              href="/admin/autores"
              className="flex items-center gap-3 rounded-2xl border border-sky-300 bg-sky-50 p-4 text-sm transition-colors hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/10"
            >
              <PenLine className="h-5 w-5 text-sky-600" aria-hidden />
              <span>
                <strong>{stats.pendingAuthors}</strong>{" "}
                {stats.pendingAuthors === 1 ? "autor por aprovar" : "autores por aprovar"}
              </span>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <Card className="h-full transition-shadow hover:shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <c.icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3 font-display text-2xl font-bold tabular-nums">{c.value}</p>
              <p className="text-sm font-medium">{c.label}</p>
              <p className="text-xs text-muted">{c.sub}</p>
            </Card>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={c.label}>{inner}</div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-bold">Histórias mais lidas</h2>
          {charts.topStories.length > 0 ? (
            <TopStoriesChart data={charts.topStories} />
          ) : (
            <p className="text-sm text-muted">Sem dados.</p>
          )}
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-lg font-bold">Distribuição de avaliações</h2>
          <RatingsChart data={charts.ratingsDistribution} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-bold">Novos registos (6 meses)</h2>
          <SignupsChart data={charts.signups} />
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-300/30 text-gold-600">
              <Wallet className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-3 font-display text-lg font-bold">Monetização</h2>
            <p className="mt-1 text-sm text-muted">
              Receita confirmada: <strong>{formatMT(stats.revenueCents)}</strong> em {stats.purchases}{" "}
              {stats.purchases === 1 ? "compra" : "compras"}.
            </p>
            <p className="mt-2 text-xs text-muted">
              Pagamentos manuais por e-Mola/M-Pesa. Confirma os comprovativos na área de
              pagamentos.
            </p>
          </div>
          <Button href="/admin/pagamentos" variant="outline" className="mt-4 w-full">
            Ver pagamentos
          </Button>
        </Card>
      </div>
    </div>
  );
}
