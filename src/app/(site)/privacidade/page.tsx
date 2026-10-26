import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o RomanceHub recolhe, utiliza e protege os dados pessoais dos leitores e autores.",
};

export default function PrivacidadePage() {
  return (
    <StaticPage
      eyebrow="Privacidade"
      title="Política de Privacidade"
      updated="Outubro de 2026"
      intro="Esta política explica que dados pessoais recolhemos, para que fins os utilizamos e quais são os teus direitos. Aplicamos o princípio da minimização: pedimos apenas o necessário para a plataforma funcionar."
    >
      <h2>1. Responsável pelo tratamento</h2>
      <p>
        O responsável pelo tratamento dos dados é o RomanceHub. Para qualquer questão relacionada
        com privacidade, podes contactar-nos pelo telefone{" "}
        <a href="tel:+258876477153">876 477 153</a>.
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
          <strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo e navegador, e registos
          de segurança estritamente necessários para proteger a plataforma.
        </li>
      </ul>

      <h2>3. Para que usamos os dados</h2>
      <ul>
        <li>Criar e gerir a tua conta e autenticar sessões.</li>
        <li>Guardar o progresso de leitura, favoritos e preferências.</li>
        <li>Processar e confirmar compras e desbloquear obras.</li>
        <li>Enviar avisos sobre capítulos e novidades que escolheste seguir.</li>
        <li>Prevenir fraude, abuso e acessos não autorizados.</li>
        <li>Cumprir obrigações legais aplicáveis.</li>
      </ul>

      <h2>4. Fundamentos do tratamento</h2>
      <p>
        Tratamos dados com base na execução do contrato (conta e acesso), no teu consentimento
        (comunicações e preferências), no cumprimento de obrigações legais e no interesse legítimo
        de manter a plataforma segura e funcional.
      </p>

      <h2>5. Cookies e armazenamento local</h2>
      <p>
        Usamos cookies essenciais para manter a sessão iniciada e preferências guardadas no teu
        dispositivo (tema e tamanho de letra). Não usamos cookies publicitários. Consulta as{" "}
        <Link href="/cookies">Definições de Cookies</Link> para mais detalhes.
      </p>

      <h2>6. Com quem partilhamos</h2>
      <p>
        Não vendemos dados pessoais. Recorremos a prestadores de serviços que tratam dados em nosso
        nome, designadamente alojamento, base de dados e autenticação (Supabase), e meios de
        pagamento usados para confirmar compras (e-Mola e M-Pesa). Podemos ainda divulgar dados se a
        lei o exigir ou para proteger direitos do RomanceHub, dos autores ou dos leitores.
      </p>

      <h2>7. Conservação</h2>
      <p>
        Mantemos os dados enquanto a conta estiver ativa. Se pedires o encerramento, eliminamos ou
        anonimizamos os dados pessoais, exceto os que tenhamos de conservar por obrigação legal
        (por exemplo, registos de pagamentos).
      </p>

      <h2>8. Os teus direitos</h2>
      <p>Podes, nos termos da lei aplicável:</p>
      <ul>
        <li>Aceder aos dados que temos sobre ti.</li>
        <li>Corrigir dados incorretos ou desatualizados.</li>
        <li>Pedir a eliminação da conta e dos dados associados.</li>
        <li>Retirar consentimentos e opor-te a determinados tratamentos.</li>
        <li>Pedir a portabilidade dos dados que forneces.</li>
      </ul>
      <p>
        Para exercer estes direitos, contacta-nos pelo telefone{" "}
        <a href="tel:+258876477153">876 477 153</a>. Responderemos dentro do prazo legal aplicável.
      </p>

      <h2>9. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizativas adequadas, incluindo ligações cifradas, controlo
        de acesso por perfil e políticas de acesso restrito à base de dados. Nenhum sistema é
        totalmente imune a riscos, mas trabalhamos continuamente para reduzir exposição.
      </p>

      <h2>10. Menores</h2>
      <p>
        A plataforma não se destina a menores sem autorização de quem exerça a responsabilidade
        parental. Se acreditares que uma conta foi criada por um menor sem autorização, contacta-nos
        para que possamos atuar.
      </p>

      <h2>11. Alterações</h2>
      <p>
        Podemos atualizar esta política para refletir mudanças na plataforma ou na lei. Publicamos
        sempre a versão em vigor nesta página, com a data da última atualização.
      </p>

      <p className="text-xs text-muted">
        Ver também os <Link href="/termos">Termos de Uso</Link> e as{" "}
        <Link href="/cookies">Definições de Cookies</Link>.
      </p>
    </StaticPage>
  );
}
