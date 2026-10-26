import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "Definições de Cookies",
  description:
    "Que cookies e armazenamento local o RomanceHub utiliza e como podes geri-los no teu navegador.",
};

export default function CookiesPage() {
  return (
    <StaticPage
      eyebrow="Cookies"
      title="Definições de Cookies"
      updated="Outubro de 2026"
      intro="Cookies são pequenos ficheiros guardados no teu navegador. Usamos apenas o necessário para manter a sessão e as preferências de leitura. Não usamos cookies publicitários nem ferramentas de rastreamento de terceiros."
    >
      <h2>1. Cookies essenciais</h2>
      <p>
        São necessários para a plataforma funcionar e não podem ser desativados sem perda de
        funcionalidades:
      </p>
      <ul>
        <li>
          <strong>Sessão (Supabase):</strong> cookies com nomes iniciados por <code>sb-</code> e que
          contêm <code>-auth-token</code>. Guardam a sessão autenticada e permitem manter-te com
          sessão iniciada entre páginas.
        </li>
        <li>
          <strong>Segurança:</strong> cookies técnicos usados durante a autenticação para proteger o
          início e a renovação de sessão.
        </li>
      </ul>
      <p>
        Estes cookies são definidos pelo nosso fornecedor de autenticação e base de dados (Supabase)
        em nome do RomanceHub.
      </p>

      <h2>2. Preferências no dispositivo</h2>
      <p>
        Guardamos duas preferências no <strong>armazenamento local</strong> do teu navegador (não são
        cookies e não são enviadas em cada pedido):
      </p>
      <ul>
        <li>
          <code>theme</code> — tema claro ou escuro escolhido no seletor de tema.
        </li>
        <li>
          <code>rh-reader-font</code> — tamanho de letra escolhido no leitor.
        </li>
      </ul>
      <p>
        Podes apagar estas preferências limpando os dados do site no teu navegador. A leitura
        continua a funcionar, mas voltam aos valores predefinidos.
      </p>

      <h2>3. O que não usamos</h2>
      <ul>
        <li>Cookies publicitários ou de redes sociais.</li>
        <li>Ferramentas de análise de terceiros que rastreiem a tua navegação.</li>
        <li>Perfis de publicidade comportamental.</li>
      </ul>

      <h2>4. Como gerir os cookies</h2>
      <p>
        Podes bloquear ou apagar cookies nas definições do teu navegador (Chrome, Safari, Firefox,
        Edge ou outro). As opções estão normalmente em “Privacidade” ou “Segurança”. Também podes usar
        o modo de navegação privada.
      </p>
      <p>
        Se bloqueares os cookies essenciais, não será possível manter a sessão iniciada nem concluir
        algumas operações de conta. Os cookies essenciais não podem ser desativados seletivamente
        dentro da plataforma.
      </p>

      <h2>5. Alterações</h2>
      <p>
        Se passarmos a usar novos cookies, atualizamos esta página antes de os ativar e, quando a lei
        o exigir, pedimos o teu consentimento.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para dúvidas sobre cookies ou privacidade, contacta-nos pelo telefone{" "}
        <a href="tel:+258876477153">876 477 153</a> ou consulta a{" "}
        <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </StaticPage>
  );
}
