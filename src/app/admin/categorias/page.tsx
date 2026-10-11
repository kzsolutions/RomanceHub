import type { Metadata } from "next";
import { Plus, Save, Trash2 } from "lucide-react";
import { getAdminCategories } from "@/lib/data/admin";
import { Card, Td, TableWrap, Th, inputClass, labelClass, btnPrimary, btnDanger } from "@/components/admin/ui";
import { deleteCategory, upsertCategory } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Categorias · Admin" };

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Categorias</h1>
      <p className="mt-1 mb-6 text-sm text-muted">{categories.length} categorias</p>

      <Card className="mb-6">
        <h2 className="mb-4 font-display text-lg font-bold">Nova categoria</h2>
        <form action={upsertCategory} className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass} htmlFor="name">
              Nome
            </label>
            <input id="name" name="name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="icon">
              Ícone (lucide)
            </label>
            <input id="icon" name="icon" className={inputClass} placeholder="Heart" />
          </div>
          <div>
            <label className={labelClass} htmlFor="color">
              Cor (hex)
            </label>
            <input id="color" name="color" className={inputClass} placeholder="#e11d48" />
          </div>
          <div>
            <label className={labelClass} htmlFor="sort_order">
              Ordem
            </label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={inputClass} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelClass} htmlFor="description">
              Descrição
            </label>
            <input id="description" name="description" className={inputClass} />
          </div>
          <div className="flex items-center gap-3 pb-0.5">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 accent-brand-600" />
              Ativa
            </label>
            <button type="submit" className={btnPrimary}>
              <Plus className="h-4 w-4" aria-hidden />
              Criar
            </button>
          </div>
        </form>
      </Card>

      <TableWrap>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Slug</Th>
            <Th>Ícone</Th>
            <Th>Ordem</Th>
            <Th>Estado</Th>
            <Th className="text-right">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="align-top hover:bg-surface-2/60">
              <Td>
                <details>
                  <summary className="cursor-pointer font-semibold">{c.name}</summary>
                  <form action={upsertCategory} className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input type="hidden" name="id" value={c.id} />
                    <input name="name" defaultValue={c.name} className={inputClass} />
                    <input name="slug" defaultValue={c.slug} className={inputClass} />
                    <input name="icon" defaultValue={c.icon ?? ""} className={inputClass} placeholder="Ícone" />
                    <input name="color" defaultValue={c.color ?? ""} className={inputClass} placeholder="Cor" />
                    <input name="sort_order" type="number" defaultValue={c.sort_order} className={inputClass} />
                    <input
                      name="description"
                      defaultValue={c.description ?? ""}
                      className={inputClass}
                      placeholder="Descrição"
                    />
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={c.is_active}
                        className="h-4 w-4 accent-brand-600"
                      />
                      Ativa
                    </label>
                    <button type="submit" className={btnPrimary}>
                      <Save className="h-4 w-4" aria-hidden />
                      Guardar
                    </button>
                  </form>
                </details>
              </Td>
              <Td className="text-muted">/{c.slug}</Td>
              <Td className="text-muted">{c.icon ?? "—"}</Td>
              <Td className="tabular-nums text-muted">{c.sort_order}</Td>
              <Td>
                {c.is_active ? (
                  <span className="text-xs font-semibold text-emerald-600">Ativa</span>
                ) : (
                  <span className="text-xs font-semibold text-muted">Inativa</span>
                )}
              </Td>
              <Td className="text-right">
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
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
    </div>
  );
}
