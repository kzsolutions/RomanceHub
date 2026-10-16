"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getAuthContext, getCurrentProfile } from "@/lib/supabase/server";

async function isAdminUser(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}

const RPC_ERRORS = new Set([
  "not_authenticated",
  "story_not_found",
  "story_is_free",
  "chapter_not_found",
  "chapter_not_published",
  "chapter_is_free",
  "already_owned",
  "price_not_set",
]);

function parseRpcError(message: string | undefined): string {
  if (!message) return "erro";
  const key = [...RPC_ERRORS].find((k) => message.includes(k));
  return key ?? "erro";
}

/** Cria um pedido de pagamento (o preço é calculado no servidor). */
export async function createPaymentOrder(formData: FormData) {
  const { supabase, userId } = await getAuthContext();

  const storyId = String(formData.get("story_id") ?? "");
  const chapterId = String(formData.get("chapter_id") ?? "") || null;
  const backTo = String(formData.get("back") ?? "/explorar");

  if (!userId) {
    redirect(`/entrar?redirect=${encodeURIComponent(backTo)}`);
  }

  const { data, error } = await supabase.rpc("create_payment_order", {
    p_story_id: storyId,
    p_chapter_id: chapterId ?? undefined,
  });

  if (error) {
    redirect(`${backTo}?erro=${parseRpcError(error.message)}`);
  }

  const order = Array.isArray(data) ? data[0] : data;
  if (!order?.id) {
    redirect(`${backTo}?erro=erro`);
  }

  revalidatePath("/compras");
  redirect(`/pagamento/${order.id}`);
}

/** Submete a referência da transferência e, opcionalmente, o comprovativo. */
export async function submitPaymentProof(formData: FormData) {
  const { supabase, userId } = await getAuthContext();

  const orderId = String(formData.get("order_id") ?? "");
  const paymentRef = String(formData.get("payment_ref") ?? "").trim();
  const file = formData.get("proof");

  if (!userId || !orderId) {
    redirect(`/entrar?redirect=${encodeURIComponent(`/pagamento/${orderId}`)}`);
  }
  if (!paymentRef) {
    redirect(`/pagamento/${orderId}?erro=referencia`);
  }

  let proofPath: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      redirect(`/pagamento/${orderId}?erro=ficheiro`);
    }
    const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    proofPath = `${userId}/${orderId}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(proofPath, file, { upsert: true, contentType: file.type || undefined });
    if (uploadError) {
      console.error("[submitPaymentProof:upload]", uploadError.message);
      redirect(`/pagamento/${orderId}?erro=upload`);
    }
  }

  const { error } = await supabase.rpc("submit_payment_proof", {
    p_order_id: orderId,
    p_payment_ref: paymentRef,
    p_proof_path: proofPath ?? undefined,
  });

  if (error) {
    console.error("[submitPaymentProof]", error.message);
    redirect(`/pagamento/${orderId}?erro=estado`);
  }

  revalidatePath(`/pagamento/${orderId}`);
  revalidatePath("/compras");
  redirect(`/pagamento/${orderId}?enviado=1`);
}

/** Admin: confirma o pagamento e concede acesso (idempotente). */
export async function approvePaymentOrder(formData: FormData) {
  const supabase = await createClient();
  if (!(await isAdminUser())) redirect("/");

  const orderId = String(formData.get("order_id") ?? "");
  if (orderId) {
    const { error } = await supabase.rpc("approve_payment_order", { p_order_id: orderId });
    if (error) console.error("[approvePaymentOrder]", error.message);
  }

  revalidatePath("/admin/pagamentos");
  revalidatePath("/admin");
  revalidatePath("/compras");
  revalidatePath("/ler", "layout");
}

/** Admin: rejeita o pagamento com motivo. */
export async function rejectPaymentOrder(formData: FormData) {
  const supabase = await createClient();
  if (!(await isAdminUser())) redirect("/");

  const orderId = String(formData.get("order_id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!orderId || !reason) {
    redirect(`/admin/pagamentos/${orderId}?erro=motivo`);
  }

  const { error } = await supabase.rpc("reject_payment_order", {
    p_order_id: orderId,
    p_reason: reason,
  });
  if (error) console.error("[rejectPaymentOrder]", error.message);

  revalidatePath("/admin/pagamentos");
  revalidatePath("/admin");
  revalidatePath("/compras");
}

/** Admin: atualiza as instruções de pagamento (settings). */
export async function updatePaymentInstructions(formData: FormData) {
  const supabase = await createClient();
  if (!(await isAdminUser())) redirect("/");

  const method = (key: string): Record<string, unknown> => ({
    number: String(formData.get(`${key}_number`) ?? "").trim(),
    holder: String(formData.get(`${key}_holder`) ?? "").trim(),
    instructions: String(formData.get(`${key}_instructions`) ?? "").trim(),
    reader_guidance: String(formData.get(`${key}_reader_guidance`) ?? "").trim(),
    active: formData.get(`${key}_active`) === "on",
  });

  const value = { emola: method("emola"), mpesa: method("mpesa") };

  const { error } = await supabase
    .from("settings")
    .update({ value: value as never, updated_at: new Date().toISOString() })
    .eq("key", "payment.instructions");

  if (error) console.error("[updatePaymentInstructions]", error.message);

  revalidatePath("/admin/definicoes");
  revalidatePath("/comprar", "layout");
}
