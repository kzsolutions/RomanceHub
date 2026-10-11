import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ "palavra-passe"?: string }>;
}) {
  const { "palavra-passe": pwChanged } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?redirect=/perfil");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, bio, avatar_url, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const roleLabel =
    profile?.role === "admin"
      ? "Administrador"
      : profile?.role === "author"
        ? "Autor"
        : "Leitor";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">O meu perfil</h1>
      <p className="mt-2 text-sm text-muted">
        Conta criada em{" "}
        {new Date(user.created_at).toLocaleDateString("pt-PT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        · {roleLabel}
      </p>

      {pwChanged && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300"
        >
          Palavra-passe alterada com sucesso.
        </div>
      )}

      <div className="mt-8 rounded-2xl border bg-surface p-6 shadow-card sm:p-8">
        <ProfileForm
          initial={{
            name: profile?.name ?? "",
            bio: profile?.bio ?? "",
            avatarUrl: profile?.avatar_url ?? "",
          }}
          email={user.email ?? ""}
        />
      </div>
    </div>
  );
}
