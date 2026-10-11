export const PAYMENT_ERRORS: Record<string, string> = {
  already_owned: "Já tens acesso a este conteúdo.",
  price_not_set: "O preço ainda não foi definido. Tenta novamente mais tarde.",
  story_is_free: "Esta obra é gratuita — podes ler sem pagar.",
  chapter_is_free: "Este capítulo é gratuito — podes ler sem pagar.",
  not_authenticated: "Inicia sessão para continuar.",
  referencia: "Indica a referência da transferência.",
  ficheiro: "O comprovativo não pode exceder 5 MB.",
  upload: "Falha ao carregar o comprovativo. Tenta novamente.",
  estado: "Não foi possível submeter — verifica o estado do pedido.",
  motivo: "Indica o motivo da rejeição.",
  erro: "Ocorreu um erro. Tenta novamente.",
};

export function paymentErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  return PAYMENT_ERRORS[code] ?? PAYMENT_ERRORS.erro;
}
