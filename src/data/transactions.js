// Transações por usuário — espelho do MockWalletRepository
const d = (h) => new Date(Date.now() - h * 3600000).toISOString()

export const TRANSACTIONS_BY_USER = {
  '1': [
    { id: 'tx001', descricao: 'IKD Restaurante',            valor: -42.90,  tipo: 'debito',  categoria: 'Refeição',    data: d(2),   status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'IKD Restaurante',     icone: 'restaurant' },
    { id: 'tx002', descricao: 'Uber Trip',                  valor: -18.70,  tipo: 'debito',  categoria: 'Transporte',  data: d(3),   status: 'aprovada', walletId: 'w4', walletNome: 'Transporte',           merchant: 'Uber',                icone: 'directions_car' },
    { id: 'tx003', descricao: 'Crédito Refeição/Alimentação', valor: 600.00, tipo: 'credito', categoria: 'Crédito',    data: d(24),  status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Origami',             icone: 'add_circle' },
    { id: 'tx004', descricao: 'Amazon.com.br — parcela 1/3', valor: -43.30, tipo: 'debito',  categoria: 'Cultura',     data: d(96),  status: 'aprovada', walletId: 'w5', walletNome: 'Cultura',              merchant: 'Amazon',              icone: 'book' },
    { id: 'tx005', descricao: 'Drogaria Raia',              valor: -64.50,  tipo: 'debito',  categoria: 'Saúde',       data: d(120), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde',                merchant: 'Drogaria Raia',       icone: 'local_pharmacy' },
    { id: 'tx006', descricao: 'Bilhete Único SPTrans',      valor: -4.40,   tipo: 'debito',  categoria: 'Transporte',  data: d(144), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte',           merchant: 'SPTrans',             icone: 'directions_bus' },
    { id: 'tx007', descricao: 'Pão de Açúcar',             valor: -89.90,  tipo: 'debito',  categoria: 'Flexível',    data: d(168), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026',    merchant: 'Pão de Açúcar',       icone: 'shopping_cart' },
    { id: 'tx008', descricao: 'Crédito Transporte',        valor: 400.00,  tipo: 'credito', categoria: 'Crédito',     data: d(336), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte',           merchant: 'Origami',             icone: 'add_circle' },
    { id: 'tx009', descricao: 'Smart Fit — mensalidade',   valor: -99.90,  tipo: 'debito',  categoria: 'Saúde',       data: d(480), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde',                merchant: 'Smart Fit',           icone: 'fitness_center' },
    { id: 'tx010', descricao: 'Netflix',                   valor: -55.90,  tipo: 'debito',  categoria: 'Cultura',     data: d(600), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura',              merchant: 'Netflix',             icone: 'movie' },
  ],
  '2': [
    { id: 'tx001', descricao: 'Restaurante Madero',        valor: -89.00,  tipo: 'debito',  categoria: 'Refeição',    data: d(3),   status: 'aprovada', walletId: 'w1', walletNome: 'Refeição',             merchant: 'Restaurante Madero',  icone: 'restaurant' },
    { id: 'tx002', descricao: 'Crédito Refeição',          valor: 600.00,  tipo: 'credito', categoria: 'Crédito',     data: d(48),  status: 'aprovada', walletId: 'w1', walletNome: 'Refeição',             merchant: 'Origami',             icone: 'add_circle' },
    { id: 'tx003', descricao: 'Farmácia São João',         valor: -45.60,  tipo: 'debito',  categoria: 'Saúde',       data: d(72),  status: 'aprovada', walletId: 'w3', walletNome: 'Saúde e Bem-estar',    merchant: 'Farmácia São João',   icone: 'local_pharmacy' },
  ],
  '3': [
    { id: 'tx001', descricao: 'Assaí Atacadista',          valor: -387.90, tipo: 'debito',  categoria: 'Alimentação', data: d(5),   status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação',          merchant: 'Assaí',               icone: 'shopping_cart' },
    { id: 'tx002', descricao: 'Crédito Alimentação',       valor: 700.00,  tipo: 'credito', categoria: 'Crédito',     data: d(24),  status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação',          merchant: 'Origami',             icone: 'add_circle' },
    { id: 'tx003', descricao: 'Bilhete Único SPTrans',     valor: -4.40,   tipo: 'debito',  categoria: 'Transporte',  data: d(8),   status: 'aprovada', walletId: 'w2', walletNome: 'Transporte',           merchant: 'SPTrans',             icone: 'directions_bus' },
  ],
  // Usuários 4-12 retornam lista vazia ou mínima
  '4':  [],
  '5':  [{ id: 'tx001', descricao: 'Zara Fashion', valor: -289.90, tipo: 'debito', categoria: 'Flexível', data: d(7), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Zara', icone: 'shopping_bag' }],
  '6':  [{ id: 'tx001', descricao: 'Restaurante Fasano', valor: -280.00, tipo: 'debito', categoria: 'Refeição', data: d(24), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Fasano', icone: 'restaurant' }],
  '7':  [{ id: 'tx001', descricao: 'Padaria Central', valor: -12.50, tipo: 'debito', categoria: 'Alimentação', data: d(2), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Estágio', merchant: 'Padaria Central', icone: 'bakery_dining' }],
  '8':  [{ id: 'tx001', descricao: 'D.O.M. Restaurante', valor: -580.00, tipo: 'debito', categoria: 'Refeição Executiva', data: d(2), status: 'aprovada', walletId: 'w2', walletNome: 'Refeição Executiva', merchant: 'D.O.M.', icone: 'restaurant' }],
  '9':  [{ id: 'tx001', descricao: 'Drogasil — estorno', valor: 145.30, tipo: 'credito', categoria: 'Estorno', data: d(48), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde', merchant: 'Drogasil', icone: 'replay' }],
  '10': [],
  '11': [{ id: 'tx001', descricao: 'Lojas Renner — parcela 1/5', valor: -77.94, tipo: 'debito', categoria: 'Flexível', data: d(48), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível', merchant: 'Lojas Renner', icone: 'shopping_bag' }],
  '12': [],
}

// Mapeia direcao a partir do tipo e adiciona campo estabelecimento
function normalize(tx) {
  return {
    ...tx,
    direcao: tx.tipo === 'credito' ? 'credito' : 'debito',
    estabelecimento: tx.merchant ?? tx.descricao,
    walletTipo: null,
    nsu: null, codigoAutorizacao: null, cnpjEstabelecimento: null,
    enderecoEstabelecimento: null, cartaoFinal: null, bandeira: null,
    mcc: null, mccDescricao: null, parcelas: null, valorParcela: null, nomePortador: null,
  }
}

export function getTransactions(userId) {
  const txs = TRANSACTIONS_BY_USER[String(userId)] ?? []
  return txs.map(normalize)
}
