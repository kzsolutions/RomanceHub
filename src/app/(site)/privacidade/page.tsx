import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/StaticPage";

const CONTACT_EMAIL = "kzsolutions00@gmail.com";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o RomanceHub recolhe, utiliza e protege os dados pessoais dos leitores e autores, incluindo cookies e publicidade.",
};

export default function PrivacidadePage() {
  return (
    <StaticPage
      eyebrow="Privacidade"
      title="Política de Privacidade"
      updated="Outubro de 2026"
      intro="Esta política explica que dados pessoais recolhemos, para que fins os utilizamos, com quem os partilhamos e quais são os teus direitos. Aplicamos o princípio da minimização: pedimos apenas o necessário para a plataforma funcionar."
    >
      <h2>1. Responsável pelo tratamento</h2>
      <p>
        O responsável pelo tratamento dos dados é o RomanceHub. Para qualquer questão relacionada
        com privacidade, podes contactar-nos por email em{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou através da{" "}
        <Link href="/contacto">página de contacto</Link>.
      </p>

      <h2>2. Dados que recolhemos</h2>
      <ul>
        <li>
          <strong>Dados de conta:</strong> nome, endereço de email, palavra-passe (guardada de forma
          encriptada) e, se escolheres, fotografia de perfil.
        </li>
        <li>
          <strong>Atividade na plataforma:</strong> progresso de leitura, favoritos, avaliações,
          comentários e histórias seguidas.
        </li>
        <li>
          <strong>Compras:</strong> pedidos, referências de pagamento, estado do pedido e
          comprovativos que submetes.
        </li>
        <li>
          <strong>Contactos:</strong> nome, email e conteúdo da mensagem que nos envias por email ou
          WhatsApp.
        </li>
        <li>
          <strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo e navegador, e registos
          de segurança estritamente necessários para proteger a plataforma.
        </li>
        <li>
          <strong>Dados de publicidade:</strong> quando a publicidade está ativa, podem ser
          recolhidos identificadores de cookies e de dispositivo, endereço IP, localização
          aproximada, páginas visitadas e interações com anúncios. Estes dados podem ser tratados por
          nós ou por parceiros de publicidade, como o Google.
        </li>
      </ul>

      <h2>3. Para que usamos os dados</h2>
      <ul>
        <li>Criar e gerir a tua conta e autenticar sessões.</li>
        <li>Guardar o progresso de leitura, favoritos e preferências.</li>
        <li>Processar e confirmar compras e desbloquear obras.</li>
        <li>Enviar avisos sobre capítulos e novidades que escolheste seguir.</li>
        <li>Responder a pedidos de apoio e a mensagens de contacto.</li>
        <li>Prevenir fraude, abuso e acessos não autorizados.</li>
        <li>
          Mostrar anúncios, limitar a repetição de anúncios, medir o seu desempenho e, quando
          consentido, personalizar a publicidade.
        </li>
        <li>Cumprir obrigações legais aplicáveis.</li>
      </ul>

      <h2>4. Fundamentos do tratamento</h2>
      <p>
        Tratamos dados com base na execução do contrato (conta e acesso), no teu consentimento
        (comunicações, preferências e cookies publicitários), no cumprimento de obrigações legais e
        no interesse legítimo de manter a plataforma segura, funcional e sustentável. Quando a lei
        exigir consentimento para publicidade personalizada, esse consentimento é pedido antes de
        serem utilizados os respetivos cookies.
      </p>

      <h2>5. Cookies e armazenamento local</h2>
      <p>
        Usamos cookies essenciais para manter a sessão iniciada e preferências guardadas no teu
        dispositivo (tema e tamanho de letra). Quando a publicidade está ativa, podem também ser
        usados cookies e identificadores publicitários, incluindo do Google AdSense e dos seus
        parceiros. Consulta as <Link href="/cookies">Definições de Cookies</Link> para mais detalhes
        e para saberes como gerir as tuas escolhas.
      </p>

      <h2>6. Publicidade e Google AdSense</h2>
      <p>
        Podemos exibir publicidade através do Google AdSense. O Google e os seus parceiros podem
        utilizar cookies, identificadores de dispositivo, endereço IP e informações sobre a tua
        navegação para apresentar, limitar e medir anúncios.
      </p>
      <ul>
        <li>
          Os fornecedores terceiros, incluindo o Google, utilizam cookies para apresentar anúncios
          com base em visitas anteriores a este site e a outros sites na Internet.
        </li>
        <li>
          A utilização de cookies publicitários permite ao Google e aos seus parceiros apresentar
          anúncios baseados na tua visita a este site e/ou a outros sites.
        </li>
        <li>
          Podes desativar a publicidade personalizada nas{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Definições de Anúncios do Google
          </a>
          . Podes também gerir preferências em{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>{" "}
          ou nas definições do teu navegador.
        </li>
        <li>
          Para mais informações sobre como o Google utiliza dados em publicidade, consulta a{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            página de publicidade do Google
          </a>
          .
        </li>
      </ul>
      <p>
        Se ativarmos anúncios personalizados em regiões que exigem consentimento prévio — por
        exemplo, Espaço Económico Europeu, Reino Unido e Suíça — será apresentado um pedido de
        consentimento através de uma plataforma de gestão de consentimento compatível com os
        requisitos aplicáveis antes de serem colocados cookies publicitários. Se recusares, não
        serão usados cookies publicitários personalizados; poderão ser apresentados anúncios não
        personalizados ou apenas conteúdo, conforme permitido pela lei.
      </p>

      <h2>7. Com quem partilhamos</h2>
      <p>
        Não vendemos dados pessoais. Recorremos a prestadores de serviços que tratam dados em nosso
        nome, designadamente alojamento, base de dados e autenticação (Supabase), meios de pagamento
        usados para confirmar compras (e-Mola e M-Pesa) e, quando a publicidade está ativa,
        fornecedores de publicidade e medição, incluindo o Google. Estes fornecedores podem tratar
        dados de acordo com as suas próprias políticas de privacidade. Podemos ainda divulgar dados
        se a lei o exigir ou para proteger direitos do RomanceHub, dos autores ou dos leitores.
      </p>

      <h2>8. Transferências internacionais</h2>
      <p>
        Alguns prestadores, incluindo o Google, podem tratar dados fora de Moçambique. Quando isso
        acontece, procuramos garantir que são aplicadas salvaguardas adequadas, como cláusulas
        contratuais-tipo ou mecanismos equivalentes previstos na legislação aplicável.
      </p>

      <h2>9. Conservação</h2>
      <p>
        Mantemos os dados enquanto a conta estiver ativa. Se pedires o encerramento, eliminamos ou
        anonimizamos os dados pessoais, exceto os que tenhamos de conservar por obrigação legal (por
        exemplo, registos de pagamentos). Os dados tratados por parceiros de publicidade são
        conservados de acordo com os prazos definidos nas respetivas políticas.
      </p>

      <h2>10. Os teus direitos</h2>
      <p>Podes, nos termos da lei aplicável:</p>
      <ul>
        <li>Aceder aos dados que temos sobre ti.</li>
        <li>Corrigir dados incorretos ou desatualizados.</li>
        <li>Pedir a eliminação da conta e dos dados associados.</li>
        <li>Retirar consentimentos e opor-te a determinados tratamentos.</li>
        <li>Opor-te à publicidade personalizada e gerir os cookies publicitários.</li>
        <li>Pedir a portabilidade dos dados que forneces.</li>
        <li>Apresentar reclamação à autoridade de proteção de dados competente.</li>
      </ul>
      <p>
        Para exercer estes direitos, contacta-nos por email em{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Responderemos dentro do prazo legal
        aplicável.
      </p>

      <h2>11. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizativas adequadas, incluindo ligações cifradas, controlo
        de acesso por perfil e políticas de acesso restrito à base de dados. Nenhum sistema é
        totalmente imune a riscos, mas trabalhamos continuamente para reduzir a exposição.
      </p>

      <h2>12. Menores</h2>
      <p>
        A plataforma não se destina a menores sem autorização de quem exerça a responsabilidade
        parental. A publicidade não é dirigida intencionalmente a menores. Se acreditares que uma
        conta foi criada por um menor sem autorização, contacta-nos para que possamos atuar.
      </p>

      <h2>13. Alterações</h2>
      <p>
        Podemos atualizar esta política para refletir mudanças na plataforma, nos parceiros de
        publicidade ou na lei. Publicamos sempre a versão em vigor nesta página, com a data da última
        atualização. Se a alteração for significativa, damos um aviso adequado antes de a aplicar.
      </p>

      <h2>14. Contacto</h2>
      <p>
        Para questões de privacidade, escreve para{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou usa a{" "}
        <Link href="/contacto">página de contacto</Link>.
      </p>

      <p className="text-xs text-muted">
        Ver também os <Link href="/termos">Termos de Uso</Link> e as{" "}
        <Link href="/cookies">Definições de Cookies</Link>.
      </p>
    </StaticPage>
  );
}
