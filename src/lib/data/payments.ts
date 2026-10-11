import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { PAGE_SIZE } from "@/lib/data/admin";

export type PurchaseStatus = Database["public"]["Enums"]["purchase_status"];
export type PurchaseKind = Database["public"]["Enums"]["purchase_kind"];

export type PaymentMethodConfig = {
  number: string;
  holder: string;
  instructions: string;
  reader_guidance: string;
  active: boolean;
};

export type PaymentInstructions = {
  emola: PaymentMethodConfig;
  mpesa: PaymentMethodConfig;
  activeMethod: "emola" | "mpesa" | null;
};

function mergeMethod(value: unknown): PaymentMethodConfig {
  const v = (value ?? {}) as Partial<PaymentMethodConfig>;
  return {
    number: typeof v.number === "string" ? v.number : "",
    holder: typeof v.holder === "string" ? v.holder : "",
    instructions: typeof v.instructions === "string" ? v.instructions : "",
    reader_guidance: typeof v.reader_guidance === "string" ? v.reader_guidance : "",
    active: Boolean(v.active),
  };
}

export async function getPaymentInstructions(): Promise<PaymentInstructions> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "payment.instructions")
    .maybeSingle();

  if (error) console.error("[getPaymentInstructions]", error.message);

  const value = (data?.value ?? {}) as { emola?: unknown; mpesa?: unknown };
  const emola = mergeMethod(value.emola);
  const mpesa = mergeMethod(value.mpesa);

  return {
    emola,
    mpesa,
    activeMethod: emola.active ? "emola" : mpesa.active ? "mpesa" : null,
  };
}

export type PaymentOrder = {
  id: string;
  reference: string | null;
  kind: PurchaseKind;
  status: PurchaseStatus;
  priceCents: number;
  paymentRef: string | null;
  proofPath: string | null;
  rejectionReason: string | null;
  createdAt: string;
  paidAt: string | null;
  paymentMethod: string;
  storyTitle: string | null;
  storySlug: string | null;
  chapterNumber: number | null;
  chapterTitle: string | null;
};

type OrderRow = {
  id: string;
  reference: string | null;
  kind: PurchaseKind;
  status: PurchaseStatus;
  price_cents: number;
  payment_ref: string | null;
  proof_path: string | null;
  rejection_reason: string | null;
  created_at: string;
  paid_at: string | null;
  payment_method: string;
  story: { title: string; slug: string } | null;
  chapter: { title: string; number: number } | null;
};

const ORDER_SELECT =
  "id,reference,kind,status,price_cents,payment_ref,proof_path,rejection_reason,created_at,paid_at,payment_method,story:stories(title,slug),chapter:chapters(title,number)";

function mapOrder(o: OrderRow): PaymentOrder {
  return {
    id: o.id,
    reference: o.reference,
    kind: o.kind,
    status: o.status,
    priceCents: o.price_cents,
    paymentRef: o.payment_ref,
    proofPath: o.proof_path,
    rejectionReason: o.rejection_reason,
    createdAt: o.created_at,
    paidAt: o.paid_at,
    paymentMethod: o.payment_method,
    storyTitle: o.story?.title ?? null,
    storySlug: o.story?.slug ?? null,
    chapterNumber: o.chapter?.number ?? null,
    chapterTitle: o.chapter?.title ?? null,
  };
}

export function orderContentLabel(order: PaymentOrder): string {
  if (order.kind === "story") return order.storyTitle ?? "Obra completa";
  const story = order.storyTitle ?? "História";
  return order.chapterNumber !== null
    ? `${story} — Capítulo ${order.chapterNumber}`
    : story;
}

/** Pedidos/compras do próprio leitor (o RLS garante o isolamento). */
export async function getMyPaymentOrders(): Promise<PaymentOrder[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("purchases")
    .select(ORDER_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getMyPaymentOrders]", error.message);
    return [];
  }
  return ((data ?? []) as unknown as OrderRow[]).map(mapOrder);
}

export async function getPaymentOrder(id: string): Promise<PaymentOrder | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select(ORDER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getPaymentOrder]", error.message);
    return null;
  }
  if (!data) return null;
  return mapOrder(data as unknown as OrderRow);
}

export type PurchaseTarget = {
  story: {
    id: string;
    title: string;
    slug: string;
    isFree: boolean;
    priceCents: number | null;
    coverUrl: string | null;
  };
  chapter: {
    id: string;
    number: number;
    title: string;
    isFree: boolean;
    priceCents: number | null;
  } | null;
};

export async function getPurchaseTarget(
  slug: string,
  chapterNumber?: number,
): Promise<PurchaseTarget | null> {
  const supabase = await createClient();
  const { data: story, error } = await supabase
    .from("stories")
    .select("id,title,slug,is_free,price_cents,cover_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[getPurchaseTarget]", error.message);
    return null;
  }
  if (!story) return null;

  let chapter: PurchaseTarget["chapter"] = null;
  if (chapterNumber !== undefined) {
    const { data: ch } = await supabase
      .from("chapters")
      .select("id,number,title,is_free,price_cents")
      .eq("story_id", story.id)
      .eq("number", chapterNumber)
      .eq("is_published", true)
      .maybeSingle();
    if (ch) {
      chapter = {
        id: ch.id,
        number: ch.number,
        title: ch.title,
        isFree: ch.is_free,
        priceCents: ch.price_cents,
      };
    }
  }

  return {
    story: {
      id: story.id,
      title: story.title,
      slug: story.slug,
      isFree: story.is_free,
      priceCents: story.price_cents,
      coverUrl: story.cover_url,
    },
    chapter,
  };
}

/** URL assinado temporário para um comprovativo (admin). */
export async function getProofSignedUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(path, 60 * 60);
  if (error) {
    console.error("[getProofSignedUrl]", error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export type AdminPaymentOrder = PaymentOrder & { userName: string };

export async function getAdminPaymentOrders(filters: {
  status?: PurchaseStatus | "all";
  page?: number;
}): Promise<{ items: AdminPaymentOrder[]; total: number }> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("purchases")
    .select(`${ORDER_SELECT},user:profiles!purchases_user_id_fkey(name)`, { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);

  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) {
    console.error("[getAdminPaymentOrders]", error.message);
    return { items: [], total: 0 };
  }

  const items = ((data ?? []) as unknown as (OrderRow & { user: { name: string } | null })[]).map(
    (o) => ({ ...mapOrder(o), userName: o.user?.name ?? "—" }),
  );

  return { items, total: count ?? 0 };
}

export async function getAdminPaymentOrder(id: string): Promise<AdminPaymentOrder | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select(`${ORDER_SELECT},user:profiles!purchases_user_id_fkey(name)`)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getAdminPaymentOrder]", error.message);
    return null;
  }
  if (!data) return null;
  const row = data as unknown as OrderRow & { user: { name: string } | null };
  return { ...mapOrder(row), userName: row.user?.name ?? "—" };
}

export async function getPendingPaymentsCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}
