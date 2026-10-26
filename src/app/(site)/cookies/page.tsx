import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/StaticPage";

const CONTACT_EMAIL = "kzsolutions00@gmail.com";

export const metadata: Metadata = {
  title: "Definições de Cookies",
  description:
    "Que cookies e armazenamento local o RomanceHub utiliza, incluindo publicidade, e como podes gerir as tuas escolhas.",
};

export default function CookiesPage() {
  return (
    <StaticPage
      eyebrow="Cookies"
      title="Definições de Cookies"
      updated="Outubro de 2026"
      intro="Cookies são pequenos ficheiros guardados no teu navegador. Usamos cookies essenciais para manter a sessão e as preferências de leitura e, quando a publicidade está ativa, podemos usar cookies publicitários do Google e dos seus parceiros. Podes gerir as tuas escolhas a qualquer momento."
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

      <h2>3. Cookies publicitários (Google AdSense)</h2>
      <p>
        Quando a publicidade está ativa, o Google e os seus parceiros podem colocar cookies e usar
        identificadores para apresentar anúncios, limitar a repetição, medir o desempenho e, com o
        teu consentimento, personalizar a publicidade. Estes cookies podem recolher informações sobre
        a tua visita a este site e a outros sites.
      </p>
      <p>Exemplos de cookies que podem ser usados pelo Google (os nomes podem variar):</p>
      <ul>
        <li>
          <strong>Publicidade e medição:</strong> <code>__gads</code>, <code>__gpi</code> e{" "}
          <code>IDE</code>.
        </li>
        <li>
          <strong>Preferências e frequência:</strong> <code>NID</code> e outros cookies definidos
          pelos parceiros de publicidade.
        </li>
      </ul>
      <p>
        Estes cookies são geridos por terceiros e ficam sujeitos às respetivas políticas. Para mais
        informações, consulta a{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          página de publicidade do Google
        </a>
        .
      </p>

      <h2>4. Consentimento e escolhas</h2>
      <ul>
        <li>
          Em regiões que exigem consentimento prévio — por exemplo, Espaço Económico Europeu, Reino
          Unido e Suíça — é apresentado um pedido de consentimento através de uma plataforma de
          gestão de consentimento compatível com os requisitos aplicáveis antes de serem colocados
          cookies publicitários.
        </li>
        <li>
          Se recusares, não são usados cookies publicitários personalizados. Poderão ser
          apresentados anúncios não personalizados ou apenas conteúdo, conforme permitido pela lei.
        </li>
        <li>
          Podes alterar ou retirar o consentimento no banner de consentimento, quando disponível, ou
          gerir os cookies nas definições do teu navegador.
        </li>
        <li>
          Podes desativar a publicidade personalizada do Google nas{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Definições de Anúncios
          </a>{" "}
          e obter mais informação em{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>
          .
        </li>
      </ul>

      <h2>5. O que não usamos</h2>
      <ul>
        <li>Venda de dados pessoais.</li>
        <li>Cookies de redes sociais ou botões de partilha que te rastreiem.</li>
        <li>Ferramentas de análise de terceiros que criem perfis de navegação connosco.</li>
        <li>
          Perfis de publicidade comportamental fora dos parceiros de publicidade descritos nesta
          página.
        </li>
      </ul>

      <h2>6. Como gerir os cookies</h2>
      <p>
        Podes bloquear ou apagar cookies nas definições do teu navegador (Chrome, Safari, Firefox,
        Edge ou outro). As opções estão normalmente em “Privacidade” ou “Segurança”. Também podes
        usar o modo de navegação privada.
      </p>
      <p>
        Se bloqueares os cookies essenciais, não será possível manter a sessão iniciada nem concluir
        algumas operações de conta. Os cookies essenciais não podem ser desativados seletivamente
        dentro da plataforma.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Se passarmos a usar novos cookies ou parceiros de publicidade, atualizamos esta página antes
        de os ativar e, quando a lei o exigir, pedimos o teu consentimento.
      </p>

      <h2>8. Contacto</h2>
      <p>
        Para dúvidas sobre cookies ou privacidade, escreve para{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou consulta a{" "}
        <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </StaticPage>
  );
}
