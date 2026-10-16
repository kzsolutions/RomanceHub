import { redirect } from "next/navigation";

type Params = { slug: string; numero: string };
type Search = { erro?: string };

export default async function ComprarCapituloPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const { erro } = await searchParams;
  const query = erro ? `?erro=${encodeURIComponent(erro)}` : "";
  redirect(`/comprar/${slug}${query}`);
}
