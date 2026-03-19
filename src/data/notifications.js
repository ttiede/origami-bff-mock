// Espelho do MockNotificationRepository — notificações por usuário
const d = (h) => new Date(Date.now() - h * 3600000).toISOString()

export const NOTIFICATIONS_BY_USER = {
  '1': [
    { id: 'n1',  tipo: 'credito',   titulo: 'Crédito recebido!',              mensagem: 'Seu benefício de Alimentação de R$ 600,00 foi creditado na carteira Refeição/Alimentação.', data: d(1),    lida: false },
    { id: 'n2',  tipo: 'pagamento', titulo: 'Compra aprovada',                 mensagem: 'Pagamento de R$ 42,90 no IKD Restaurante realizado com sucesso.',                             data: d(2),    lida: true  },
    { id: 'n3',  tipo: 'pagamento', titulo: 'Uber - viagem finalizada',        mensagem: 'Débito de R$ 18,70 na carteira Transporte — Uber Trip.',                                     data: d(3),    lida: true  },
    { id: 'n4',  tipo: 'sistema',   titulo: 'Novo cartão virtual disponível',  mensagem: 'Você pode criar um cartão virtual para compras online com segurança extra.',                 data: d(24),   lida: false },
    { id: 'n5',  tipo: 'promocao',  titulo: '20% OFF em farmácias parceiras',  mensagem: 'Use seu cartão Origami em farmácias parceiras e ganhe 20% de desconto até 30/06.',           data: d(48),   lida: false },
    { id: 'n6',  tipo: 'credito',   titulo: 'Crédito de Transporte',           mensagem: 'Seu benefício de Transporte de R$ 400,00 foi creditado.',                                   data: d(72),   lida: true  },
    { id: 'n7',  tipo: 'pagamento', titulo: 'Compra parcelada aprovada',       mensagem: 'Amazon.com.br — R$ 129,90 em 3x de R$ 43,30 na carteira Cultura.',                          data: d(96),   lida: true  },
    { id: 'n8',  tipo: 'sistema',   titulo: 'Atualização de segurança',        mensagem: 'Atualizamos nossas políticas de privacidade. Confira as mudanças na aba Segurança.',        data: d(120),  lida: true  },
    { id: 'n9',  tipo: 'promocao',  titulo: 'Cashback em streaming!',          mensagem: 'Pague Netflix e Spotify com a carteira Cultura e ganhe 10% de cashback.',                   data: d(168),  lida: true  },
    { id: 'n10', tipo: 'sistema',   titulo: 'Extrato disponível',              mensagem: 'O extrato do mês anterior já está disponível para download.',                               data: d(240),  lida: true  },
  ],
  '2': [
    { id: 'n1', tipo: 'credito',   titulo: 'Crédito recebido!',               mensagem: 'Seu benefício de Refeição de R$ 600,00 foi creditado.',                                     data: d(2),   lida: false },
    { id: 'n2', tipo: 'pagamento', titulo: 'Compra aprovada',                  mensagem: 'Pagamento de R$ 89,00 no Restaurante Madero realizado com sucesso.',                        data: d(3),   lida: true  },
    { id: 'n3', tipo: 'sistema',   titulo: 'Bem-vinda ao Origami!',            mensagem: 'Confira suas carteiras e benefícios disponíveis na tela principal.',                        data: d(24),  lida: true  },
    { id: 'n4', tipo: 'promocao',  titulo: 'Dia das Mães — 15% OFF',           mensagem: 'Aproveite desconto exclusivo em restaurantes parceiros até 12/05.',                        data: d(72),  lida: false },
    { id: 'n5', tipo: 'credito',   titulo: 'Crédito de Saúde',                 mensagem: 'R$ 300,00 creditados na carteira Saúde e Bem-estar.',                                      data: d(120), lida: true  },
    { id: 'n6', tipo: 'sistema',   titulo: 'Política de benefícios atualizada',mensagem: 'A Indústria ABC atualizou as regras de uso. Confira os detalhes.',                         data: d(192), lida: true  },
  ],
  '3': [
    { id: 'n1', tipo: 'credito',   titulo: 'Crédito recebido!',               mensagem: 'Seu benefício de Alimentação de R$ 700,00 foi creditado.',                data: d(4),   lida: false },
    { id: 'n2', tipo: 'pagamento', titulo: 'Compra aprovada',                  mensagem: 'Pagamento de R$ 387,90 no Assaí Atacadista.',                            data: d(5),   lida: true  },
    { id: 'n3', tipo: 'credito',   titulo: 'Crédito de Transporte',            mensagem: 'R$ 300,00 creditados na carteira Transporte.',                           data: d(24),  lida: true  },
    { id: 'n4', tipo: 'promocao',  titulo: 'Economize no supermercado!',       mensagem: 'Parceiros atacadistas com até 25% OFF para beneficiários Origami.',      data: d(120), lida: false },
  ],
  '4': [
    { id: 'n1', tipo: 'sistema',   titulo: 'Bem-vindo ao Origami!',           mensagem: 'Carlos, seus benefícios já estão disponíveis! Configure sua senha e comece a usar.', data: d(0.5), lida: false },
    { id: 'n2', tipo: 'credito',   titulo: 'Créditos iniciais disponíveis',   mensagem: 'R$ 2.050,00 em créditos foram depositados em suas 5 carteiras de benefício.',     data: d(1),   lida: false },
    { id: 'n3', tipo: 'sistema',   titulo: 'Seu cartão físico está a caminho',mensagem: 'O cartão Visa final 8890 será entregue em até 10 dias úteis.',                   data: d(2),   lida: false },
    { id: 'n4', tipo: 'sistema',   titulo: 'Cartão virtual já disponível',    mensagem: 'Enquanto aguarda o físico, use seu cartão virtual Mastercard final 1122.',        data: d(3),   lida: false },
    { id: 'n5', tipo: 'promocao',  titulo: 'Conheça nossos parceiros',        mensagem: 'Mais de 500 estabelecimentos cadastrados com descontos exclusivos para você.',     data: d(4),   lida: false },
  ],
  '5': [
    { id: 'n1', tipo: 'sistema',   titulo: 'Alerta de segurança',             mensagem: 'Detectamos 2 tentativas de login incorretas na sua conta. Se não foi você, altere sua senha.', data: d(1),  lida: false },
    { id: 'n2', tipo: 'credito',   titulo: 'Crédito recebido!',               mensagem: 'R$ 800,00 creditados na carteira Flexível Premium.',                                           data: d(6),  lida: false },
    { id: 'n3', tipo: 'pagamento', titulo: 'Compra aprovada',                  mensagem: 'Pagamento de R$ 289,90 na Zara Fashion.',                                                      data: d(7),  lida: true  },
    { id: 'n4', tipo: 'promocao',  titulo: 'Black Friday antecipada!',        mensagem: 'Até 30% OFF em lojas parceiras nesta semana.',                                                  data: d(72), lida: false },
  ],
  '6': [
    { id: 'n1', tipo: 'sistema',   titulo: 'Conta bloqueada',                 mensagem: 'Sua conta foi bloqueada por excesso de tentativas incorretas. Contate o RH.',                  data: d(0.2), lida: false },
    { id: 'n2', tipo: 'sistema',   titulo: 'Alerta de segurança',             mensagem: 'Detectamos 6 tentativas de login incorretas. Sua conta foi bloqueada definitivamente.',         data: d(0.3), lida: false },
    { id: 'n3', tipo: 'credito',   titulo: 'Crédito recebido',                mensagem: 'R$ 1.500,00 em créditos mensais distribuídos nas 4 carteiras.',                                data: d(24),  lida: true  },
    { id: 'n4', tipo: 'pagamento', titulo: 'Compra aprovada',                  mensagem: 'R$ 280,00 no Restaurante Fasano — Refeição.',                                                  data: d(24),  lida: true  },
  ],
  '7': [
    { id: 'n1', tipo: 'sistema',   titulo: 'Saldo baixo!',                    mensagem: 'Sua carteira Alimentação Estágio está com apenas R$ 23,50. O próximo crédito será em 5 dias.', data: d(1),   lida: false },
    { id: 'n2', tipo: 'sistema',   titulo: 'Saldo crítico de Transporte',     mensagem: 'Restam apenas R$ 8,20 na carteira Transporte Estágio — insuficiente para 1 recarga.',          data: d(2),   lida: false },
    { id: 'n3', tipo: 'credito',   titulo: 'Crédito recebido!',               mensagem: 'R$ 400,00 creditados na carteira Alimentação Estágio.',                                        data: d(120), lida: true  },
    { id: 'n4', tipo: 'promocao',  titulo: 'Desconto em lanchonetes!',        mensagem: 'Apresente seu cartão Origami em lanchonetes parceiras e ganhe 10% de desconto.',               data: d(72),  lida: false },
  ],
  '8': [
    { id: 'n1', tipo: 'credito',   titulo: 'Créditos mensais depositados',    mensagem: 'R$ 8.000,00 em créditos distribuídos nas suas 7 carteiras de benefício.',                     data: d(1),   lida: false },
    { id: 'n2', tipo: 'pagamento', titulo: 'Compra aprovada — D.O.M.',        mensagem: 'Pagamento de R$ 580,00 no D.O.M. Restaurante realizado com sucesso.',                          data: d(2),   lida: true  },
    { id: 'n3', tipo: 'pagamento', titulo: 'MBA INSPER — parcela 1/10',       mensagem: 'Débito de R$ 450,00 na carteira Educação Continuada — INSPER MBA Executivo.',                  data: d(72),  lida: true  },
    { id: 'n4', tipo: 'sistema',   titulo: 'Novo cartão virtual disponível',  mensagem: 'Cartão virtual Elo final 5500 ativado para compras online seguras.',                           data: d(48),  lida: false },
    { id: 'n5', tipo: 'promocao',  titulo: 'Experiência VIP Fasano',          mensagem: 'Clientes premium têm acesso exclusivo ao menu degustação do Fasano com 15% OFF.',              data: d(120), lida: false },
  ],
  '9': [
    { id: 'n1', tipo: 'sistema',   titulo: 'Conta temporariamente bloqueada',mensagem: 'Detectamos 4 tentativas incorretas de login. Sua conta está bloqueada por 2 horas.',         data: d(0.1), lida: false },
    { id: 'n2', tipo: 'sistema',   titulo: 'Alerta de segurança',            mensagem: 'Múltiplas tentativas de acesso detectadas. Se não foi você, entre em contato com o suporte.',  data: d(0.2), lida: false },
    { id: 'n3', tipo: 'sistema',   titulo: 'Cartão físico bloqueado',        mensagem: 'Por motivos de segurança, seu cartão Mastercard final 6688 foi bloqueado temporariamente.',    data: d(1),   lida: false },
    { id: 'n4', tipo: 'pagamento', titulo: 'Estorno processado',             mensagem: 'Estorno de R$ 145,30 (Drogasil — cobrança duplicada) processado na carteira Saúde.',           data: d(48),  lida: false },
  ],
  '10': [
    { id: 'n1', tipo: 'sistema',   titulo: 'Bem-vindo ao Origami!',          mensagem: 'Thiago, seus benefícios de trabalho remoto já estão disponíveis! Configure sua senha para começar.', data: d(0.3), lida: false },
    { id: 'n2', tipo: 'credito',   titulo: 'Créditos iniciais disponíveis',  mensagem: 'R$ 2.350,00 em créditos foram depositados nas suas 4 carteiras de benefício.',                       data: d(1),   lida: false },
    { id: 'n3', tipo: 'sistema',   titulo: 'Cartões a caminho',              mensagem: 'Seus 2 cartões estão sendo preparados. Enquanto isso, use o app para consultar saldos.',            data: d(2),   lida: false },
    { id: 'n4', tipo: 'promocao',  titulo: 'Certificações Cloud com desconto',mensagem: 'Use a carteira Educação Tech para certificações AWS/GCP com 30% de desconto corporativo.',         data: d(4),   lida: false },
  ],
  '11': [
    { id: 'n1', tipo: 'sistema',   titulo: 'Saldo crítico — Transporte',     mensagem: 'Restam apenas R$ 3,50 na carteira Transporte. Insuficiente para Uber ou bilhete único.', data: d(1),   lida: false },
    { id: 'n2', tipo: 'sistema',   titulo: 'Saldo baixo — Flexível',         mensagem: 'Sua carteira Flexível está com R$ 12,30. Você tem 4 parcelas pendentes comprometendo o saldo futuro.', data: d(2), lida: false },
    { id: 'n3', tipo: 'pagamento', titulo: 'Parcela Renner 1/5',              mensagem: 'Débito de R$ 77,94 na carteira Flexível — Lojas Renner parcela 1 de 5.',              data: d(48),  lida: true  },
    { id: 'n4', tipo: 'sistema',   titulo: 'Cartão virtual bloqueado',       mensagem: 'Seu cartão Elo virtual final 8833 foi bloqueado. Para desbloquear, acesse Cartões.',  data: d(72),  lida: false },
    { id: 'n5', tipo: 'credito',   titulo: 'Crédito recebido!',              mensagem: 'R$ 1.200,00 creditados nas suas 3 carteiras. Atenção: parcelas futuras já comprometem R$ 311,76.', data: d(120), lida: true },
  ],
  '12': [
    { id: 'n1', tipo: 'sistema',   titulo: 'Conta encerrada',                mensagem: 'Sua conta foi encerrada após o desligamento do Comércio XYZ. Cartões cancelados.',            data: d(1080), lida: false },
    { id: 'n2', tipo: 'sistema',   titulo: 'Cartões cancelados',             mensagem: 'Todos os seus cartões (Visa 8844, Mastercard 6622) foram cancelados definitivamente.',       data: d(1080), lida: false },
    { id: 'n3', tipo: 'pagamento', titulo: 'Saldos estornados',              mensagem: 'Os saldos restantes foram estornados à empresa.',                                             data: d(1080), lida: false },
    { id: 'n4', tipo: 'sistema',   titulo: 'Acesso somente leitura',        mensagem: 'Você pode consultar seu histórico de transações por até 90 dias após o desligamento.',       data: d(1056), lida: true  },
  ],
}

export function getNotifications(userId) {
  return NOTIFICATIONS_BY_USER[String(userId)] ?? NOTIFICATIONS_BY_USER['1']
}
