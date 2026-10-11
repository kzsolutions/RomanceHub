import Link from "next/link";
import { ArrowRight, BookOpen, Crown, Library, Layers, PenLine, Star } from "lucide-react";
import { getHomeData } from "@/lib/data/stories";
import { CategoryIcon } from "@/components/stories/CategoryIcon";
import { SectionHeading } from "@/components/stories/SectionHeading";
import { StoryGrid } from "@/components/stories/StoryCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNumber, formatRating } from "@/lib/utils";

export default async function HomePage() {
  const data = await getHomeData();
  const [spotlight, ...otherFeatured] = data.featured;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.16),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(233,185,73,0.10),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
                Romances originais em português
              </p>
              <h1 className="animate-fade-up mt-4 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                Onde o amor se escreve
                <span className="italic text-brand-600 dark:text-brand-400"> linha a linha</span>
              </h1>
              <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Descobre, lê e revive histórias de paixão, segundas chances e encontros que mudam
                tudo — da enemies-to-lovers ao casamento por contrato.
              </p>
              <div className="animate-fade-up mt-8 flex flex-wrap gap-3">
                <Button href="/explorar" size="lg">
                  Explorar histórias
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button href="/criar-conta" variant="outline" size="lg">
                  Criar conta grátis
                </Button>
              </div>
              <dl className="animate-fade-up mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t pt-6">
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    <Library className="h-3.5 w-3.5" aria-hidden /> Histórias
                  </dt>
                  <dd className="font-display text-2xl font-bold">{data.stats.stories}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden /> Capítulos
                  </dt>
                  <dd className="font-display text-2xl font-bold">{data.stats.chapters}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    <Layers className="h-3.5 w-3.5" aria-hidden /> Categorias
                  </dt>
                  <dd className="font-display text-2xl font-bold">{data.stats.categories}</dd>
                </div>
              </dl>
            </div>

            {spotlight && (
              <Link
                href={`/historias/${spotlight.slug}`}
                className="group relative mx-auto w-full max-w-sm"
              >
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-brand-200/40 via-transparent to-gold-300/30 blur-xl" />
                <div className="relative flex gap-4 rounded-3xl border bg-surface p-4 shadow-card transition-shadow duration-300 group-hover:shadow-card-hover">
                  <div className="aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:w-36">
                    {spotlight.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={spotlight.coverUrl}
                        alt={`Capa de ${spotlight.title}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col py-1">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="brand" icon={Crown}>
                        Destaque
                      </Badge>
                      {spotlight.isFree && <Badge variant="free">Grátis</Badge>}
                    </div>
                    <h2 className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-400">
                      {spotlight.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted">{spotlight.authorName}</p>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
                      {spotlight.synopsis}
                    </p>
                    <div className="mt-auto flex items-center gap-3 pt-3 text-xs">
                      <span className="flex items-center gap-1 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" aria-hidden />
                        {formatRating(spotlight.ratingAvg)}
                      </span>
                      <span className="flex items-center gap-1 text-muted">
                        <BookOpen className="h-3.5 w-3.5" aria-hidden />
                        {formatNumber(spotlight.readsCount)} leituras
                      </span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                      Ler agora
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Faixa de banners promocionais */}
      {data.banners.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.banners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.linkUrl ?? "/explorar"}
                className="group relative block h-28 overflow-hidden rounded-2xl border shadow-soft transition-shadow hover:shadow-card sm:h-32"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Destaques */}
      {otherFeatured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Escolhidas para ti"
            title="Histórias em destaque"
            href="/explorar?ordenar=rating"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {otherFeatured.map((story) => (
              <Link
                key={story.id}
                href={`/historias/${story.slug}`}
                className="group flex gap-4 rounded-2xl border bg-surface p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:w-28">
                  {story.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={story.coverUrl}
                      alt={`Capa de ${story.title}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap gap-1.5">
                    {story.isFree ? (
                      <Badge variant="free">Grátis</Badge>
                    ) : (
                      <Badge variant="premium" icon={Crown}>
                        Premium
                      </Badge>
                    )}
                    <Badge variant={story.completion === "complete" ? "complete" : "ongoing"}>
                      {story.completion === "complete" ? "Concluída" : "Em curso"}
                    </Badge>
                  </div>
                  <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-400">
                    {story.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {story.authorName}
                    {story.category && ` · ${story.category.name}`}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {story.synopsis}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-3 text-xs">
                    <span className="flex items-center gap-1 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" aria-hidden />
                      {formatRating(story.ratingAvg)}
                    </span>
                    <span className="flex items-center gap-1 text-muted">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden />
                      {formatNumber(story.readsCount)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Novidades */}
      {data.novidades.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Recém-chegadas"
            title="Novidades na plataforma"
            href="/explorar?ordenar=novidades"
          />
          <StoryGrid stories={data.novidades} eagerCount={4} />
        </section>
      )}

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <SectionHeading title="Explora por categoria" href="/categorias" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {data.categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-soft"
                style={{ backgroundColor: cat.color ?? "#cf216d" }}
              >
                <CategoryIcon name={cat.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold group-hover:text-brand-700 dark:group-hover:text-brand-400">
                  {cat.name}
                </span>
                <span className="block text-xs text-muted">
                  {cat.storyCount} {cat.storyCount === 1 ? "história" : "histórias"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mais lidas */}
      {data.maisLidas.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="O que está a ser lido"
            title="Mais lidas esta semana"
            href="/explorar?ordenar=mais-lidas"
          />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.maisLidas.map((story, i) => (
              <li key={story.id}>
                <Link
                  href={`/historias/${story.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border bg-surface p-3 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="w-7 shrink-0 text-center font-display text-2xl font-bold text-brand-500/70 dark:text-brand-400/70">
                    {i + 1}
                  </span>
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                    {story.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.coverUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-400">
                      {story.title}
                    </p>
                    <p className="truncate text-xs text-muted">{story.authorName}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                      <BookOpen className="h-3 w-3" aria-hidden />
                      {formatNumber(story.readsCount)} leituras
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Grátis */}
      {data.gratuitas.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Sem pagar nada"
            title="Grátis para começar"
            href="/explorar?gratis=1"
          />
          <StoryGrid stories={data.gratuitas} />
        </section>
      )}

      {/* CTA final */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 px-6 py-12 text-center shadow-card sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_45%)]"
          />
          <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Cria a tua conta e guarda as tuas leituras
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/85">
            Acompanha o teu progresso, guarda favoritos e recebe aviso quando saírem novos capítulos
            das tuas histórias favoritas.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Button
              href="/criar-conta"
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50"
            >
              <PenLine className="h-4 w-4" aria-hidden />
              Criar conta grátis
            </Button>
            <Button href="/explorar" variant="outline" size="lg" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              Continuar a explorar
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
