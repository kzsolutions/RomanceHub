import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de utilização do RomanceHub: conta, leitura, compras, conteúdo e responsabilidades.",
};

export default function TermosPage() {
  return (
    <StaticPage
      eyebrow="Termos"
      title="Termos de Uso"
      updated="Outubro de 2026"
      intro="Ao criar conta ou utilizar o RomanceHub aceitas estas condições. Lê-as com atenção. Se não concordares, não deves utilizar a plataforma."
    >
      <h2>1. A plataforma</h2>
      <p>
        O RomanceHub disponibiliza histórias de romance originais em português, lidas por capítulos,
        com funcionalidades de conta, favoritos, progresso, avaliações, comentários e compras.
      </p>

      <h2>2. Conta</h2>
      <ul>
        <li>Deves fornecer informação verdadeira e mantê-la atualizada.</li>
        <li>
          És responsável por manter a palavra-passe segura e por toda a atividade realizada na tua
          conta.
        </li>
        <li>Não podes partilhar a conta nem vender ou ceder o acesso a terceiros.</li>
        <li>
          A plataforma destina-se a maiores de idade ou a menores com autorização de quem exerça a
          responsabilidade parental.
        </li>
        <li>
          Podemos suspender ou encerrar contas que violem estes termos ou que apresentem sinais de
          fraude ou abuso.
        </li>
      </ul>

      <h2>3. Leitura e acesso</h2>
      <ul>
        <li>O primeiro capítulo de cada história pode ser lido sem cadastro.</li>
        <li>
          A partir do segundo capítulo é obrigatório ter conta. O cadastro é gratuito e dá acesso à
          leitura durante os períodos promocionais em vigor.
        </li>
        <li>
          Quando não existir período promocional, aplicam-se as condições indicadas na página da
          obra: capítulos gratuitos, prévia e/ou compra.
        </li>
        <li>
          O acesso é pessoal e não transmissível. Não é permitido contornar limites de prévia,
          paywall ou mecanismos de proteção.
        </li>
      </ul>

      <h2>4. Conteúdo e propriedade intelectual</h2>
      <p>
        Os textos, capas, marcas e restantes elementos da plataforma estão protegidos por direitos de
        autor e pertencem ao RomanceHub ou aos respetivos autores. É proibido copiar, reproduzir,
        distribuir, vender, traduzir ou explorar comercialmente o conteúdo sem autorização escrita.
        Também é proibido recolher conteúdo de forma automatizada (scraping) ou contornar medidas
        técnicas de proteção.
      </p>

      <h2>5. Compras e pagamentos</h2>
      <ul>
        <li>
          As compras de obras completas são pagamentos únicos e dão acesso permanente à obra
          enquanto esta estiver disponível na plataforma.
        </li>
        <li>
          Os pagamentos são confirmados pela equipa após verificação do comprovativo submetido
          (e-Mola ou M-Pesa).
        </li>
        <li>
          Pedidos com referência ou comprovativo inválido podem ser rejeitados. Nesse caso, o acesso
          não é desbloqueado.
        </li>
        <li>
          Reembolsos seguem a lei aplicável e são analisados caso a caso, designadamente em situações
          de erro comprovado ou indisponibilidade prolongada do conteúdo adquirido.
        </li>
        <li>
          Promoções e períodos de acesso gratuito podem ser alterados ou terminados, sem afetar
          compras já confirmadas.
        </li>
      </ul>

      <h2>6. Comentários e avaliações</h2>
      <p>
        Ao publicares comentários ou avaliações, concedes ao RomanceHub autorização para os exibir na
        plataforma. É proibido publicar conteúdo ilegal, ofensivo, difamatório, spam ou que viole
        direitos de terceiros. Podemos remover conteúdo e limitar a participação de quem não cumpra
        estas regras.
      </p>

      <h2>7. Disponibilidade</h2>
      <p>
        Trabalhamos para manter a plataforma disponível, mas podem ocorrer interrupções por
        manutenção, atualizações ou fatores fora do nosso controlo. Não garantimos funcionamento
        ininterrupto ou isento de erros.
      </p>

      <h2>8. Limitação de responsabilidade</h2>
      <p>
        Na medida permitida pela lei, o RomanceHub não é responsável por danos indiretos ou por
        perdas resultantes de utilização indevida da plataforma, de indisponibilidades temporárias ou
        de conteúdos publicados por utilizadores. Nada nestes termos exclui responsabilidades que não
        possam ser legalmente excluídas.
      </p>

      <h2>9. Alterações</h2>
      <p>
        Podemos atualizar estes termos. A versão em vigor está sempre nesta página, com a data da
        última atualização. A utilização continuada após alterações significa aceitação das novas
        condições.
      </p>

      <h2>10. Lei aplicável e contacto</h2>
      <p>
        Estes termos regem-se pela lei moçambicana. Para questões, contacta-nos pelo telefone{" "}
        <a href="tel:+258876477153">876 477 153</a>.
      </p>

      <p className="text-xs text-muted">
        Ver também a <Link href="/privacidade">Política de Privacidade</Link> e as{" "}
        <Link href="/cookies">Definições de Cookies</Link>.
      </p>
    </StaticPage>
  );
}
