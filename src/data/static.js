// Dados estáticos — espelho completo dos mock datasources do app-cartao

// ─── Home Banners ─────────────────────────────────────────────────────────────
export const BANNERS = [
  { id: 'b1', title: 'PIX sem taxas\npara você!',            subtitle: 'Transfira grátis até 30/Jun',       gradientColors: [4285494682, 4287365808], iconCodePoint: 60216, route: '/payments/pix' },
  { id: 'b2', title: 'Seus vouchers\ncom desconto!',         subtitle: 'Até 40% OFF em parceiros',          gradientColors: [4278224220, 4280496794], iconCodePoint: 57649, route: '/vouchers' },
  { id: 'b3', title: 'Resgate seus\npontos agora!',          subtitle: 'Cinema, iFood, Uber e mais',        gradientColors: [4293498165, 4288423452], iconCodePoint: 59375, route: '/rewards' },
  { id: 'b4', title: 'Indique e ganhe\nR$ 50!',              subtitle: 'Por cada amigo que baixar o app',   gradientColors: [4279378368, 4279900114], iconCodePoint: 59375, route: '/referral' },
  { id: 'b5', title: 'Cashback de 5% em\nrestaurantes!',     subtitle: 'Válido até 30/Jun',                 gradientColors: [4280391411, 4282339765], iconCodePoint: 60216, route: '/partners' },
  { id: 'b6', title: 'Antecipe seu FGTS\ncom taxa zero!',    subtitle: 'Condições especiais',               gradientColors: [4278224220, 4280496794], iconCodePoint: 57685, route: '/partners' },
]

// ─── Disputes ─────────────────────────────────────────────────────────────────
export const DISPUTES = [
  {
    id: 'disp-001', transactionId: 'tx002', description: 'Viagem cancelada mas débito persistiu',
    amount: 18.70, merchantName: 'Uber', status: 'em_analise',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    events: [
      { date: new Date(Date.now() - 2 * 86400000).toISOString(), description: 'Contestação aberta', status: 'aberta' },
      { date: new Date(Date.now() - 1 * 86400000).toISOString(), description: 'Em análise pelo time financeiro', status: 'em_analise' },
    ],
  },
  {
    id: 'disp-002', transactionId: 'tx005', description: 'Cobrança duplicada na farmácia',
    amount: 64.50, merchantName: 'iFood', status: 'aberta',
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    events: [
      { date: new Date(Date.now() - 7 * 86400000).toISOString(), description: 'Contestação aberta', status: 'aberta' },
    ],
  },
  {
    id: 'disp-003', transactionId: 'tx006', description: 'Valor cobrado diferente do informado',
    amount: 120.00, merchantName: 'Posto Shell', status: 'negada',
    date: new Date(Date.now() - 14 * 86400000).toISOString(),
    events: [
      { date: new Date(Date.now() - 14 * 86400000).toISOString(), description: 'Contestação aberta', status: 'aberta' },
      { date: new Date(Date.now() - 12 * 86400000).toISOString(), description: 'Em análise', status: 'em_analise' },
      { date: new Date(Date.now() - 10 * 86400000).toISOString(), description: 'Contestação negada — transação válida', status: 'negada' },
    ],
  },
  {
    id: 'disp-004', transactionId: 'tx007', description: 'Produto não recebido',
    amount: 89.90, merchantName: 'Amazon', status: 'em_analise',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    events: [
      { date: new Date(Date.now() - 5 * 86400000).toISOString(), description: 'Contestação aberta', status: 'aberta' },
      { date: new Date(Date.now() - 3 * 86400000).toISOString(), description: 'Aguardando documentos do estabelecimento', status: 'em_analise' },
    ],
  },
  {
    id: 'disp-005', transactionId: 'tx009', description: 'Cobrança após cancelamento de plano',
    amount: 99.90, merchantName: 'Smart Fit', status: 'resolvida',
    date: new Date(Date.now() - 20 * 86400000).toISOString(),
    events: [
      { date: new Date(Date.now() - 20 * 86400000).toISOString(), description: 'Contestação aberta', status: 'aberta' },
      { date: new Date(Date.now() - 18 * 86400000).toISOString(), description: 'Em análise', status: 'em_analise' },
      { date: new Date(Date.now() - 16 * 86400000).toISOString(), description: 'Documentos analisados — crédito provisório R$ 99,90', status: 'em_analise' },
      { date: new Date(Date.now() - 15 * 86400000).toISOString(), description: 'Estorno aprovado — R$ 99,90 creditado definitivamente', status: 'resolvida' },
    ],
  },
]

// ─── Reimbursements ───────────────────────────────────────────────────────────
export const REIMBURSEMENTS = [
  { id: 'reimb-001', category: 'Saúde',      amount: 89.90,  date: new Date(Date.now() - 3 * 86400000).toISOString(),  description: 'Consulta médica particular',    status: 'aguardando', receiptUrl: null,                                                                       resolvedAt: null },
  { id: 'reimb-002', category: 'Home Office', amount: 350.00, date: new Date(Date.now() - 8 * 86400000).toISOString(),  description: 'Cadeira ergonômica home office', status: 'em_analise', receiptUrl: 'https://mock.origami.com.br/receipts/reimb-002.pdf',               resolvedAt: null },
  { id: 'reimb-003', category: 'Alimentação', amount: 42.50,  date: new Date(Date.now() - 15 * 86400000).toISOString(), description: 'Kit lanche reunião remota',       status: 'aprovado',   receiptUrl: 'https://mock.origami.com.br/receipts/reimb-003.pdf', resolvedAt: new Date(Date.now() - 13 * 86400000).toISOString() },
  { id: 'reimb-004', category: 'Educação',    amount: 120.00, date: new Date(Date.now() - 20 * 86400000).toISOString(), description: 'Livro técnico — Clean Code',     status: 'pago',       receiptUrl: 'https://mock.origami.com.br/receipts/reimb-004.pdf', resolvedAt: new Date(Date.now() - 18 * 86400000).toISOString() },
  { id: 'reimb-005', category: 'Saúde',       amount: 75.00,  date: new Date(Date.now() - 30 * 86400000).toISOString(), description: 'Óculos de grau',                 status: 'rejeitado',  receiptUrl: null,                                                                       resolvedAt: new Date(Date.now() - 28 * 86400000).toISOString() },
  { id: 'reimb-006', category: 'Transporte', amount: 156.00, date: new Date(Date.now() - 5 * 86400000).toISOString(),  description: 'Passagem aérea SP-RJ reunião cliente', status: 'aprovado', receiptUrl: 'https://mock.origami.com.br/receipts/reimb-006.pdf', resolvedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'reimb-007', category: 'Outros',     amount: 89.00,  date: new Date(Date.now() - 12 * 86400000).toISOString(), description: 'Material de apresentação para evento', status: 'aguardando', receiptUrl: 'https://mock.origami.com.br/receipts/reimb-007.pdf', resolvedAt: null },
]

// ─── Balance Requests ─────────────────────────────────────────────────────────
export const BALANCE_REQUESTS = [
  { id: 'br-001', walletId: 'w3', amount: 500.00, justificativa: 'Início de mês — saldo insuficiente',   status: 'aguardando', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: null,                                                    approvedBy: null,       rejectionReason: null },
  { id: 'br-002', walletId: 'w6', amount: 200.00, justificativa: 'Procedimento cirúrgico emergencial',  status: 'aprovado',   createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(), approvedBy: 'Gerente RH', rejectionReason: null },
  { id: 'br-003', walletId: 'w4', amount: 100.00, justificativa: 'Semana de viagens a trabalho SP→RJ', status: 'rejeitado',  createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 9 * 86400000).toISOString(), approvedBy: 'Diretor Financeiro', rejectionReason: 'Saldo dentro do limite mensal — não se aplica política de exceção' },
]

// ─── Approvals ────────────────────────────────────────────────────────────────
export const APPROVALS = [
  { id: 'appr-001', type: 'balance_request', status: 'pendente',   requesterName: 'João Pedro Costa',       requesterEmail: 'joao.costa@empresa.com',      amount: 500.00, description: 'Pedido de saldo adicional — carteira Refeição',    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),  decidedAt: null, decidedBy: null, rejectionReason: null },
  { id: 'appr-002', type: 'reimbursement',   status: 'pendente',   requesterName: 'Fernanda Rocha Barbosa', requesterEmail: 'fernanda.rocha@empresa.com',   amount: 89.90,  description: 'Reembolso de consulta médica particular',          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),  decidedAt: null, decidedBy: null, rejectionReason: null },
  { id: 'appr-003', type: 'advance',         status: 'aprovado',   requesterName: 'Carlos Mendes Ribeiro',  requesterEmail: 'carlos.mendes@empresa.com',    amount: 800.00, description: 'Adiantamento para viagem de negócios SP-RJ',       createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),  decidedAt: new Date(Date.now() - 4 * 86400000).toISOString(), decidedBy: 'Diretor Financeiro', rejectionReason: null },
  { id: 'appr-004', type: 'expense_report',  status: 'reprovado',  requesterName: 'Ana Souza Lima',         requesterEmail: 'ana.lima@empresa.com',         amount: 245.30, description: 'Relatório de despesas — Sprint Review Fevereiro',  createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),  decidedAt: new Date(Date.now() - 7 * 86400000).toISOString(), decidedBy: 'Gerente de Projetos', rejectionReason: 'Comprovantes faltando' },
  { id: 'appr-005', type: 'balance_request', status: 'pendente',   requesterName: 'Thiago Nascimento',      requesterEmail: 'thiago.nasc@empresa.com',      amount: 200.00, description: 'Pedido de saldo — carteira Saúde',                 createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),  decidedAt: null, decidedBy: null, rejectionReason: null },
]

// ─── External Benefits ────────────────────────────────────────────────────────
export const EXTERNAL_BENEFITS = [
  {
    id: 'eb-001', nome: 'Gympass', categoria: 'saude',
    descricao: 'Acesso a mais de 50.000 academias, studios e apps fitness em todo o mundo.',
    logoUrl: 'https://mock.origami.com.br/logos/gympass.png',
    siteUrl: 'https://www.gympass.com', ativo: true, valorMensal: 'Incluso no pacote',
    destaques: ['50.000+ academias no Brasil', 'Smart Fit, Bio Ritmo, academia local', 'Apps de meditação e yoga incluídos'],
  },
  {
    id: 'eb-002', nome: 'Alura', categoria: 'educacao',
    descricao: 'Plataforma de cursos de tecnologia com mais de 1.000 cursos disponíveis.',
    logoUrl: 'https://mock.origami.com.br/logos/alura.png',
    siteUrl: 'https://www.alura.com.br', ativo: true, valorMensal: 'Incluso no pacote',
    destaques: ['1.000+ cursos de tecnologia', 'Certificados reconhecidos pelo mercado', 'Trilhas de aprendizado personalizadas'],
  },
  {
    id: 'eb-003', nome: 'Zenklub', categoria: 'saude_mental',
    descricao: 'Plataforma de saúde emocional com sessões de terapia online.',
    logoUrl: 'https://mock.origami.com.br/logos/zenklub.png',
    siteUrl: 'https://zenklub.com', ativo: true, valorMensal: 'R$ 0 (2 sessões/mês)',
    destaques: ['2 sessões de terapia por mês', 'Psicólogos credenciados', 'Atendimento online 24/7'],
  },
  {
    id: 'eb-004', nome: 'Uber for Business', categoria: 'transporte',
    descricao: 'Conta corporativa Uber com viagens custeadas pela empresa.',
    logoUrl: 'https://mock.origami.com.br/logos/uber.png',
    siteUrl: 'https://www.uber.com/business', ativo: true, valorMensal: 'Até R$ 300/mês',
    destaques: ['Até R$ 300 em viagens mensais', 'Fatura centralizada no RH', 'Relatórios de uso'],
  },
  {
    id: 'eb-005', nome: 'TotalPass', categoria: 'saude',
    descricao: 'Acesso ilimitado a academias parceiras por uma mensalidade fixa.',
    logoUrl: 'https://mock.origami.com.br/logos/totalpass.png',
    siteUrl: 'https://totalpass.com', ativo: false, valorMensal: 'Benefício expirado',
    destaques: ['Academias parceiras em todo Brasil', 'Sem fidelidade'],
  },
]

// ─── Rewards ─────────────────────────────────────────────────────────────────
export const REWARDS_SUMMARY = {
  totalPoints: 2450,
  level: 2,                // Prata
  nextLevelPoints: 5000,   // Ouro
  availableRewards: [
    { id: 'rw-001', name: 'Vale iFood R$30',    points: 300,  category: 'alimentacao',    description: 'Válido em pedidos acima de R$40',        iconName: 'fastfood' },
    { id: 'rw-002', name: 'Vale Cinema',         points: 500,  category: 'cultura',        description: 'Ingresso para qualquer sessão 2D',       iconName: 'movie' },
    { id: 'rw-003', name: 'Cashback 2%',         points: 200,  category: 'cashback',       description: 'Cashback em compras no mês',             iconName: 'monetization_on' },
    { id: 'rw-004', name: 'Gift Card Amazon',    points: 1000, category: 'compras',        description: 'R$50 em compras na Amazon',              iconName: 'shopping_bag' },
    { id: 'rw-005', name: 'Aula de Yoga',        points: 150,  category: 'saude',          description: 'Aula avulsa em studio parceiro',         iconName: 'self_improvement' },
    { id: 'rw-006', name: 'Uber R$20',           points: 250,  category: 'transporte',     description: 'Crédito em viagens Uber',                iconName: 'directions_car' },
    { id: 'rw-007', name: 'Spotify 1 mês',       points: 400,  category: 'entretenimento', description: '1 mês Premium grátis',                   iconName: 'music_note' },
    { id: 'rw-008', name: 'Cashback 5%',         points: 800,  category: 'cashback',       description: 'Cashback premium no mês',                iconName: 'star' },
    { id: 'rw-009', name: 'Gift Card Renner',    points: 600,  category: 'compras',        description: 'R$30 em compras na Renner',              iconName: 'checkroom' },
    { id: 'rw-010', name: 'Vale Farmácia R$25',  points: 350,  category: 'saude',          description: 'Desconto em farmácias parceiras',        iconName: 'local_pharmacy' },
  ],
  history: [
    { id: 'rh-001', description: 'Compra no IKD Restaurante',       points: 50,   date: new Date(Date.now() - 1 * 86400000).toISOString(),   type: 'earned' },
    { id: 'rh-002', description: 'Pagamento QR Code — Padaria Luce',points: 20,   date: new Date(Date.now() - 3 * 86400000).toISOString(),   type: 'earned' },
    { id: 'rh-003', description: 'Bônus de boas-vindas',            points: 200,  date: new Date(Date.now() - 10 * 86400000).toISOString(),  type: 'bonus' },
    { id: 'rh-004', description: 'Resgate Vale Cinema',             points: -500, date: new Date(Date.now() - 15 * 86400000).toISOString(),  type: 'redeemed' },
    { id: 'rh-005', description: 'Compra no Pão de Açúcar',         points: 80,   date: new Date(Date.now() - 20 * 86400000).toISOString(),  type: 'earned' },
    { id: 'rh-006', description: 'Pagamento de boleto — IPTU',      points: 30,   date: new Date(Date.now() - 25 * 86400000).toISOString(),  type: 'earned' },
    { id: 'rh-007', description: 'Bônus indicação — Maria Santos',  points: 100,  date: new Date(Date.now() - 30 * 86400000).toISOString(),  type: 'bonus' },
    { id: 'rh-008', description: 'Resgate Uber R$20',               points: -250, date: new Date(Date.now() - 35 * 86400000).toISOString(),  type: 'redeemed' },
    { id: 'rh-009', description: 'Compra no Subway',                points: 25,   date: new Date(Date.now() - 40 * 86400000).toISOString(),  type: 'earned' },
    { id: 'rh-010', description: 'Bônus aniversário empresa',       points: 500,  date: new Date(Date.now() - 60 * 86400000).toISOString(),  type: 'bonus' },
    { id: 'rh-011', description: 'Compra na Drogaria Raia',         points: 65,   date: new Date(Date.now() - 65 * 86400000).toISOString(),  type: 'earned' },
    { id: 'rh-012', description: 'Expiração pontos inativos',       points: -100, date: new Date(Date.now() - 90 * 86400000).toISOString(),  type: 'expired' },
    { id: 'rh-013', description: 'Recarga celular Vivo',            points: 15,   date: new Date(Date.now() - 95 * 86400000).toISOString(),  type: 'earned' },
    { id: 'rh-014', description: 'Bônus meta mensal atingida',      points: 300,  date: new Date(Date.now() - 100 * 86400000).toISOString(), type: 'bonus' },
    { id: 'rh-015', description: 'Expiração pontos trimestre',      points: -85,  date: new Date(Date.now() - 120 * 86400000).toISOString(), type: 'expired' },
  ],
}

// ─── SP Trans cards ───────────────────────────────────────────────────────────
export const SP_TRANS_CARDS = [
  {
    id: 'spt-001',
    cardNumber: '0004 1234 5678 9',
    holderName: 'TIAGO GESCCHINI',
    balance: 18.50,
    lastUsed: new Date(Date.now() - 3 * 3600000).toISOString(),
    expiresAt: '2027-12-31T00:00:00.000Z',
    active: true,
    recentTrips: [
      { id: 'trip-1', line: '8010-10 Pça. da Sé',        direction: 'Sentido Centro',               usedAt: new Date(Date.now() - 3 * 3600000).toISOString(),   fare: 4.40, mode: 'bus'   },
      { id: 'trip-2', line: 'METRÔ - Linha 4-Amarela',   direction: 'Vila Sônia ↔ Luz',             usedAt: new Date(Date.now() - 27 * 3600000).toISOString(),  fare: 4.40, mode: 'metro' },
      { id: 'trip-3', line: 'CPTM - Linha 9-Esmeralda',  direction: 'Osasco ↔ Bruno/Pimentas',     usedAt: new Date(Date.now() - 48 * 3600000).toISOString(),  fare: 4.40, mode: 'train' },
      { id: 'trip-4', line: '2505-10 Pça. da República', direction: 'Sentido Bairro',               usedAt: new Date(Date.now() - 72 * 3600000).toISOString(),  fare: 4.40, mode: 'bus'   },
      { id: 'trip-5', line: 'METRÔ - Linha 2-Verde',     direction: 'Vila Madalena ↔ Vila Prudente',usedAt: new Date(Date.now() - 96 * 3600000).toISOString(),  fare: 4.40, mode: 'metro' },
    ],
  },
]

// ─── Auth sessions ────────────────────────────────────────────────────────────
export function getStaticSessions() {
  return [
    { id: 'session-001', deviceName: 'Samsung Galaxy S24 Ultra', deviceType: 'mobile', location: 'São Paulo, SP',        lastActive: new Date().toISOString(),                         isCurrent: true  },
    { id: 'session-002', deviceName: 'Chrome no Windows',         deviceType: 'web',    location: 'Rio de Janeiro, RJ',  lastActive: new Date(Date.now() - 3 * 3600000).toISOString(), isCurrent: false },
    { id: 'session-003', deviceName: 'iPhone 14 Pro',             deviceType: 'mobile', location: 'Belo Horizonte, MG', lastActive: new Date(Date.now() - 24 * 3600000).toISOString(),isCurrent: false },
  ]
}

// ─── Security activity ────────────────────────────────────────────────────────
export function getSecurityActivity() {
  return [
    { id: 'evt-001', descricao: 'Login realizado',           dispositivo: 'Samsung Galaxy S24 Ultra', data: new Date(Date.now() - 2 * 3600000).toISOString(),   tipo: 'login' },
    { id: 'evt-002', descricao: 'PIN transacional alterado', dispositivo: 'iPhone 14 Pro',            data: new Date(Date.now() - 72 * 3600000).toISOString(),  tipo: 'pinAlterado' },
    { id: 'evt-003', descricao: 'Login realizado',           dispositivo: 'iPhone 14 Pro',            data: new Date(Date.now() - 73 * 3600000).toISOString(),  tipo: 'login' },
    { id: 'evt-004', descricao: 'Cartão virtual bloqueado',  dispositivo: 'App Android',              data: new Date(Date.now() - 168 * 3600000).toISOString(), tipo: 'cartaoBloqueado' },
    { id: 'evt-005', descricao: 'Senha alterada',            dispositivo: 'Chrome - Windows 11',      data: new Date(Date.now() - 360 * 3600000).toISOString(), tipo: 'senhaAlterada' },
    { id: 'evt-006', descricao: 'Sessão encerrada',          dispositivo: 'Chrome - Windows 11',      data: new Date(Date.now() - 480 * 3600000).toISOString(), tipo: 'sessaoEncerrada' },
  ]
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export const FAQS = [
  // Cartão (4)
  { question: 'Como criar um cartão virtual?',              answer: 'Acesse a aba Cartões e toque em "Criar cartão virtual". O cartão ficará disponível imediatamente.',      category: 'Cartão' },
  { question: 'Como bloquear meu cartão?',                  answer: 'Acesse a aba Cartões, selecione o cartão desejado e toque em "Bloquear cartão".',                       category: 'Cartão' },
  { question: 'O que fazer se suspeitar de cartão clonado?',answer: 'Bloqueie o cartão imediatamente em Cartões > Bloquear e entre em contato com o suporte.',               category: 'Cartão' },
  { question: 'Meu cartão físico não chegou, o que fazer?', answer: 'Verifique o status de entrega em Cartões > Rastreamento. Se o prazo expirou, solicite uma 2ª via.',     category: 'Cartão' },
  // Conta (3)
  { question: 'Como alterar minha senha?',                  answer: 'Acesse Perfil > Segurança > Alterar Senha. Você precisará confirmar com seu PIN transacional.',          category: 'Conta' },
  { question: 'Como consultar meu saldo?',                  answer: 'O saldo de cada carteira fica visível na tela inicial. Toque em uma carteira para ver detalhes.',        category: 'Conta' },
  { question: 'Por que meu saldo não atualizou?',           answer: 'O saldo é atualizado em tempo real. Puxe a tela para baixo para forçar a atualização.',                 category: 'Conta' },
  // Benefícios (3)
  { question: 'Como solicitar reembolso?',                  answer: 'Acesse Benefícios > Reembolsos, preencha o formulário e anexe o comprovante de pagamento.',              category: 'Benefícios' },
  { question: 'Quais benefícios externos estão disponíveis?',answer: 'Acesse Benefícios > Externos para ver Gympass, Alura, Zenklub e outros parceiros inclusos no pacote.', category: 'Benefícios' },
  { question: 'Como resgatar pontos de recompensa?',        answer: 'Acesse Recompensas, escolha o prêmio desejado e toque em "Resgatar". Os pontos são debitados na hora.',  category: 'Benefícios' },
  // Pagamentos (3)
  { question: 'Como fazer uma transferência PIX?',          answer: 'Acesse Carteiras, selecione a carteira desejada e toque em "PIX". Informe a chave PIX do destinatário.', category: 'Pagamentos' },
  { question: 'Como pagar um boleto pelo app?',             answer: 'Acesse Carteiras > Pagar Boleto, escaneie o código de barras ou digite manualmente e confirme.',          category: 'Pagamentos' },
  { question: 'Como exportar meu extrato?',                 answer: 'Acesse Carteiras > Extrato, escolha o período e o formato (PDF ou CSV) e toque em Exportar.',            category: 'Pagamentos' },
  { question: 'Posso fazer recarga de celular pelo app?',   answer: 'Sim. Acesse Carteiras > Recarga, selecione a operadora e o valor desejado.',                             category: 'Pagamentos' },
  // Segurança (4)
  { question: 'Como ativar biometria?',                     answer: 'Acesse Perfil > Segurança > Biometria e siga as instruções para cadastrar sua digital ou face.',          category: 'Segurança' },
  { question: 'O que é o PIN transacional?',                answer: 'O PIN é um código de 4 dígitos usado para confirmar transações sensíveis como PIX e pagamentos.',         category: 'Segurança' },
  { question: 'Como ativar autenticação em 2 fatores?',     answer: 'Acesse Perfil > Segurança > 2FA e siga as instruções. Você receberá um código por SMS a cada login.',    category: 'Segurança' },
  { question: 'Minha conta foi bloqueada, o que fazer?',    answer: 'Após 5 tentativas incorretas sua conta é bloqueada temporariamente. Aguarde 2h ou contate o RH.',         category: 'Segurança' },
  // Extra
  { question: 'Como encontrar parceiros com desconto?',     answer: 'Acesse a aba Parceiros para ver todos os estabelecimentos que aceitam seu cartão Origami.',              category: 'Benefícios' },
  { question: 'Quais estabelecimentos aceitam meu cartão?', answer: 'Restaurantes, farmácias, supermercados, academias, cinemas e muito mais. Veja na aba Parceiros.',        category: 'Benefícios' },
  { question: 'Por quanto tempo fica disponível o extrato?',answer: 'O extrato fica disponível por 24 meses. Para colaboradores desligados, por 90 dias após o desligamento.', category: 'Pagamentos' },
]

// ─── Expenses ─────────────────────────────────────────────────────────────────
export const EXPENSES = [
  { id: 'exp-001', description: 'Almoço com cliente',   amount: 89.90, date: new Date(Date.now() - 2 * 86400000).toISOString(),  category: 'refeicao',   receiptUrl: null, lat: -23.564, lng: -46.651, merchant: 'IKD Restaurante' },
  { id: 'exp-002', description: 'Uber reunião matriz',  amount: 32.50, date: new Date(Date.now() - 3 * 86400000).toISOString(),  category: 'transporte', receiptUrl: null, lat: null,    lng: null,    merchant: 'Uber' },
  { id: 'exp-003', description: 'Material escritório',  amount: 45.00, date: new Date(Date.now() - 5 * 86400000).toISOString(),  category: 'outros',     receiptUrl: 'https://mock.origami.com.br/receipts/exp-003.pdf', lat: null, lng: null, merchant: 'Kalunga' },
  { id: 'exp-004', description: 'Jantar equipe sprint', amount: 280.00,date: new Date(Date.now() - 7 * 86400000).toISOString(),  category: 'refeicao',   receiptUrl: null, lat: -23.575, lng: -46.668, merchant: 'Restaurante Madero' },
  { id: 'exp-005', description: 'Consulta oftalmologista', amount: 250.00, date: new Date(Date.now() - 4 * 86400000).toISOString(), category: 'saude', receiptUrl: 'https://mock.origami.com.br/receipts/exp-005.pdf', lat: -23.568, lng: -46.650, merchant: 'Clínica Einstein' },
  { id: 'exp-006', description: 'Curso Figma avançado', amount: 149.90, date: new Date(Date.now() - 6 * 86400000).toISOString(), category: 'educacao', receiptUrl: 'https://mock.origami.com.br/receipts/exp-006.pdf', lat: null, lng: null, merchant: 'Alura' },
  { id: 'exp-007', description: 'Cadeira ergonômica', amount: 850.00, date: new Date(Date.now() - 10 * 86400000).toISOString(), category: 'homeoffice', receiptUrl: 'https://mock.origami.com.br/receipts/exp-007.pdf', lat: -23.564, lng: -46.651, merchant: 'Kalunga' },
  { id: 'exp-008', description: 'Supermercado compras semana', amount: 312.40, date: new Date(Date.now() - 1 * 86400000).toISOString(), category: 'alimentacao', receiptUrl: 'https://mock.origami.com.br/receipts/exp-008.pdf', lat: -23.558, lng: -46.662, merchant: 'Pão de Açúcar' },
  { id: 'exp-009', description: 'Uber ida e volta reunião', amount: 47.20, date: new Date(Date.now() - 3 * 86400000).toISOString(), category: 'transporte', receiptUrl: null, lat: -23.570, lng: -46.648, merchant: 'Uber' },
]

// ─── Advances ─────────────────────────────────────────────────────────────────
export const ADVANCES = [
  { id: 'adv-001', amount: 800.00, reason: 'Viagem de negócios SP-RJ (hotel + passagem)',  status: 'aprovado',  requestedAt: new Date(Date.now() - 5 * 86400000).toISOString(), resolvedAt: new Date(Date.now() - 4 * 86400000).toISOString(), approverNote: 'Aprovado. Apresentar comprovantes em até 5 dias.' },
  { id: 'adv-002', amount: 200.00, reason: 'Material de escritório home office',            status: 'pendente',  requestedAt: new Date(Date.now() - 1 * 86400000).toISOString(), resolvedAt: null, approverNote: null },
  { id: 'adv-003', amount: 1500.00,reason: 'Equipamento — notebook para trabalho remoto',  status: 'negado',    requestedAt: new Date(Date.now() - 10 * 86400000).toISOString(),resolvedAt: new Date(Date.now() - 9 * 86400000).toISOString(), approverNote: 'Negado. Política de TI cobre apenas periféricos.' },
]

// ─── Reports ──────────────────────────────────────────────────────────────────
export const REPORTS = [
  { id: 'rep-001', title: 'Viagem SP-RJ Março',          period: '2026-03', totalAmount: 1122.40, expenseCount: 3, status: 'aprovado',   createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), submittedAt: new Date(Date.now() - 9 * 86400000).toISOString(),  expenseIds: ['exp-001','exp-002','exp-003'] },
  { id: 'rep-002', title: 'Sprint Review Fevereiro',      period: '2026-02', totalAmount: 325.30,  expenseCount: 2, status: 'reprovado',  createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), submittedAt: new Date(Date.now() - 19 * 86400000).toISOString(), expenseIds: ['exp-004'] },
  { id: 'rep-003', title: 'Material Home Office Jan',     period: '2026-01', totalAmount: 895.00,  expenseCount: 2, status: 'rascunho',   createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),  submittedAt: null,                                               expenseIds: ['exp-003','exp-007'] },
]

// ─── Vouchers ─────────────────────────────────────────────────────────────────
export const AVAILABLE_VOUCHERS = [
  { id: 'vou-001', merchantName: 'iFood',         description: 'R$ 30 em pedidos acima de R$ 50',        faceValue: 30.00, salePrice: 22.00, category: 'alimentacao',    logoUrl: null, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(), status: 'available', code: null },
  { id: 'vou-002', merchantName: 'Cinemark',       description: 'Ingresso 2D qualquer sessão',             faceValue: 35.00, salePrice: 25.00, category: 'entretenimento', logoUrl: null, expiresAt: new Date(Date.now() + 15 * 86400000).toISOString(), status: 'available', code: null },
  { id: 'vou-003', merchantName: 'Drogaria Raia',  description: '20% OFF em vitaminas e suplementos',     faceValue: 50.00, salePrice: 40.00, category: 'saude',          logoUrl: null, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),  status: 'available', code: null },
  { id: 'vou-004', merchantName: 'Uber',           description: 'R$ 20 em créditos de viagem',             faceValue: 20.00, salePrice: 15.00, category: 'transporte',     logoUrl: null, expiresAt: new Date(Date.now() + 10 * 86400000).toISOString(), status: 'available', code: null },
  { id: 'vou-005', merchantName: 'Amazon',         description: 'R$ 50 em compras acima de R$ 150',        faceValue: 50.00, salePrice: 35.00, category: 'compras',        logoUrl: null, expiresAt: new Date(Date.now() + 20 * 86400000).toISOString(), status: 'available', code: null },
]

export const MY_VOUCHERS = [
  { id: 'vou-my-001', merchantName: 'Rappi',    description: '15% OFF no primeiro pedido',    faceValue: 40.00, salePrice: 0.00, category: 'alimentacao',    logoUrl: null, expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'purchased', code: 'RAPPI15MOCK' },
  { id: 'vou-my-002', merchantName: 'iFood',    description: 'R$ 30 em pedidos acima de R$ 50', faceValue: 30.00, salePrice: 22.00, category: 'alimentacao', logoUrl: null, expiresAt: new Date(Date.now() + 20 * 86400000).toISOString(), status: 'purchased', code: 'IFOOD30-XK9M2' },
  { id: 'vou-my-003', merchantName: 'Cinemark', description: 'Ingresso 2D qualquer sessão',    faceValue: 35.00, salePrice: 25.00, category: 'entretenimento', logoUrl: null, expiresAt: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'expired', code: 'CINE-EXPIRED-001' },
  { id: 'vou-my-004', merchantName: 'Smart Fit', description: '1 mês grátis de academia',     faceValue: 99.90, salePrice: 0.00, category: 'saude',          logoUrl: null, expiresAt: new Date(Date.now() + 15 * 86400000).toISOString(), status: 'purchased', code: 'SMARTFIT-FREE-2026' },
]

// ─── Geofence Zones ───────────────────────────────────────────────────────────
export const GEOFENCE_ZONES = [
  { id: 'gz-001', name: 'Av. Paulista — Gympass',  description: 'Zona de desconto parceiro Gympass', latitude: -23.5646, longitude: -46.6527, radiusMeters: 300, isActive: true,  partnerId: 'p4', type: 'partner' },
  { id: 'gz-002', name: 'Origami Office',           description: 'Escritório principal Origami',      latitude: -23.5630, longitude: -46.6543, radiusMeters: 100, isActive: true,  partnerId: null, type: 'office'  },
  { id: 'gz-003', name: 'Mercado Livre Hub',        description: 'Hub de parceiros ML',               latitude: -23.5489, longitude: -46.6388, radiusMeters: 200, isActive: true,  partnerId: null, type: 'partner' },
  { id: 'gz-004', name: 'Aeroporto Congonhas',      description: 'Check-in automático viagens',       latitude: -23.6271, longitude: -46.6559, radiusMeters: 500, isActive: false, partnerId: null, type: 'airport' },
  { id: 'gz-005', name: 'Shopping Ibirapuera',      description: 'Parceiros no shopping',             latitude: -23.5897, longitude: -46.6612, radiusMeters: 250, isActive: true,  partnerId: null, type: 'mall'    },
  { id: 'gz-006', name: 'Zona Restrita — CPD',     description: 'Área restrita do centro de processamento de dados', latitude: -23.5550, longitude: -46.6400, radiusMeters: 50, isActive: true, partnerId: null, type: 'restricted' },
  { id: 'gz-007', name: 'Estação Consolação',      description: 'Zona de trânsito — metrô Consolação', latitude: -23.5567, longitude: -46.6604, radiusMeters: 150, isActive: true, partnerId: null, type: 'transit' },
]

// ─── Digital Wallet Cards ─────────────────────────────────────────────────────
export const DIGITAL_WALLET_CARDS = [
  { cardId: 'c1', cardLast4: '4625', cardBrand: 'visa',       cardNome: 'LUCAS OLIVEIRA', provider: 'google_pay',  isProvisioned: true,  tokenId: 'tok-gp-001' },
  { cardId: 'c2', cardLast4: '9501', cardBrand: 'mastercard', cardNome: 'LUCAS OLIVEIRA', provider: 'samsung_pay', isProvisioned: false, tokenId: null },
  { cardId: 'c3', cardLast4: '2210', cardBrand: 'elo',        cardNome: 'LUCAS OLIVEIRA', provider: 'google_pay',  isProvisioned: true,  tokenId: 'tok-gp-002' },
]
