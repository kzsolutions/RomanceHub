import type { Metadata } from "next";
import { ImageIcon, Plus, Save, Trash2 } from "lucide-react";
import { getAdminBanners } from "@/lib/data/admin";
import { Card, Td, TableWrap, Th, inputClass, labelClass, btnPrimary, btnDanger } from "@/components/admin/ui";
import { deleteBanner, upsertBanner } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Banners · Admin" };

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Banners</h1>
      <p className="mt-1 mb-6 text-sm text-muted">{banners.length} banners</p>

      <Card className="mb-6">
        <h2 className="mb-4 font-display text-lg font-bold">Novo banner</h2>
        <form action={upsertBanner} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="title">
              Título *
            </label>
            <input id="title" name="title" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="subtitle">
              Subtítulo
            </label>
            <input id="subtitle" name="subtitle" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="image_url">
              Imagem (URL) *
            </label>
            <input id="image_url" name="image_url" required className={inputClass} placeholder="/banners/exemplo.svg" />
          </div>
          <div>
            <label className={labelClass} htmlFor="link_url">
              Ligação
            </label>
            <input id="link_url" name="link_url" className={inputClass} placeholder="/explorar" />
          </div>
          <div>
            <label className={labelClass} htmlFor="position">
              Posição
            </label>
            <select id="position" name="position" defaultValue="home_strip" className={inputClass}>
              <option value="home_hero">Home · Hero</option>
              <option value="home_strip">Home · Faixa</option>
              <option value="explore">Explorar</option>
              <option value="sidebar">Barra lateral</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="sort_order">
              Ordem
            </label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={inputClass} />
          </div>
          <div className="flex items-end gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 accent-brand-600" />
              Ativo
            </label>
            <button type="submit" className={btnPrimary}>
              <Plus className="h-4 w-4" aria-hidden />
              Criar banner
            </button>
          </div>
        </form>
      </Card>

      {banners.length > 0 ? (
        <TableWrap>
          <thead>
            <tr>
              <Th>Banner</Th>
              <Th>Posição</Th>
              <Th>Ordem</Th>
              <Th>Período</Th>
              <Th>Estado</Th>
              <Th className="text-right">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="align-top hover:bg-surface-2/60">
                <Td>
                  <details>
                    <summary className="flex cursor-pointer items-center gap-3">
                      <span className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
                        {b.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted" aria-hidden />
                        )}
                      </span>
                      <span className="font-semibold">{b.title}</span>
                    </summary>
                    <form action={upsertBanner} className="mt-3 grid gap-2 sm:grid-cols-2">
                      <input type="hidden" name="id" value={b.id} />
                      <input name="title" defaultValue={b.title} className={inputClass} />
                      <input name="subtitle" defaultValue={b.subtitle ?? ""} className={inputClass} placeholder="Subtítulo" />
                      <input name="image_url" defaultValue={b.image_url} className={inputClass} />
                      <input name="link_url" defaultValue={b.link_url ?? ""} className={inputClass} placeholder="Ligação" />
                      <input name="position" defaultValue={b.position} className={inputClass} />
                      <input name="sort_order" type="number" defaultValue={b.sort_order} className={inputClass} />
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          name="is_active"
                          defaultChecked={b.is_active}
                          className="h-4 w-4 accent-brand-600"
                        />
                        Ativo
                      </label>
                      <button type="submit" className={btnPrimary}>
                        <Save className="h-4 w-4" aria-hidden />
                        Guardar
                      </button>
                    </form>
                  </details>
                </Td>
                <Td className="text-muted">{b.position}</Td>
                <Td className="tabular-nums text-muted">{b.sort_order}</Td>
                <Td className="text-xs text-muted">
                  {b.starts_at ? formatDate(b.starts_at) : "—"} → {b.ends_at ? formatDate(b.ends_at) : "∞"}
                </Td>
                <Td>
                  {b.is_active ? (
                    <span className="text-xs font-semibold text-emerald-600">Ativo</span>
                  ) : (
                    <span className="text-xs font-semibold text-muted">Inativo</span>
                  )}
                </Td>
                <Td className="text-right">
                  <form action={deleteBanner}>
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" className={btnDanger}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      Eliminar
                    </button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : (
        <p className="rounded-2xl border border-dashed bg-surface px-6 py-10 text-center text-sm text-muted">
          Ainda não há banners.
        </p>
      )}
    </div>
  );
}
