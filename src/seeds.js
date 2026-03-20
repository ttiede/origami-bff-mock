// ─── Seed Data for Dynamic Sandbox ──────────────────────────────────────────
// All data here is used as the initial state. Deep-cloned on init and on reset.
// DO NOT mutate these objects at runtime — always work on the cloned state.

const d = (h) => new Date(Date.now() - h * 3600000).toISOString()
const dDays = (days) => new Date(Date.now() - days * 86400000).toISOString()
const dFuture = (days) => new Date(Date.now() + days * 86400000).toISOString()
const NOW = () => new Date().toISOString()

// ─── Users (12) ─────────────────────────────────────────────────────────────
export const SEED_USERS = [
  { id: '1', nome: 'Lucas Oliveira Silva', cpf: '61151275131', email: 'lucas.silva@techsolutions.com.br', telefone: '(11) 99876-5432', empresa: 'Tech Solutions Ltda', departamento: 'Tecnologia', cargo: 'Desenvolvedor Senior', senha: 'Origami1', primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0 },
  { id: '2', nome: 'Maria Santos Ferreira', cpf: '72253325031', email: 'maria.ferreira@industriaabc.com.br', telefone: '(21) 98765-4321', empresa: 'Indústria ABC S.A.', departamento: 'Recursos Humanos', cargo: 'Gerente de RH', senha: 'Origami2!', primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0 },
  { id: '3', nome: 'João Pedro Costa', cpf: '85310785043', email: 'joao.costa@comercioxyz.com.br', telefone: '(31) 97654-3210', empresa: 'Comércio XYZ Ltda', departamento: 'Financeiro', cargo: 'Analista Financeiro', senha: 'Origami3!', primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0 },
  { id: '4', nome: 'Carlos Eduardo Mendes', cpf: '71965103561', email: 'carlos.mendes@techsolutions.com.br', telefone: '(11) 96543-2109', empresa: 'Tech Solutions Ltda', departamento: 'Produto', cargo: 'Product Manager', senha: null, primeiroAcesso: true, bloqueioDefinitivo: false, tentativasFalhas: 0 },
  { id: '5', nome: 'Ana Carolina Lima', cpf: '80587310057', email: 'ana.lima@industriaabc.com.br', telefone: '(21) 95432-1098', empresa: 'Indústria ABC S.A.', departamento: 'Marketing', cargo: 'Coordenadora de Marketing', senha: 'Origami5!', primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 2 },
  { id: '6', nome: 'Roberto Almeida', cpf: '76127261066', email: 'roberto.almeida@comercioxyz.com.br', telefone: '(31) 94321-0987', empresa: 'Comércio XYZ Ltda', departamento: 'Logística', cargo: 'Gerente de Logística', senha: 'Origami6!', primeiroAcesso: false, bloqueioDefinitivo: true, tentativasFalhas: 0 },
  { id: '7', nome: 'Fernanda Rocha Barbosa', cpf: '66392332154', email: 'fernanda.barbosa@startupnovaera.com.br', telefone: '(11) 93210-9876', empresa: 'Startup Nova Era', departamento: 'Desenvolvimento', cargo: 'Estagiária de Desenvolvimento', senha: 'Origami7!', primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0 },
  { id: '8', nome: 'Diego Nascimento Santos', cpf: '46881973659', email: 'diego.santos@megacorp.com.br', telefone: '(11) 92109-8765', empresa: 'MegaCorp International', departamento: 'Diretoria Executiva', cargo: 'Diretor de Operações', senha: 'Origami8!', primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0 },
  { id: '9', nome: 'Patrícia Vieira Duarte', cpf: '99356327254', email: 'patricia.duarte@consultoriadelta.com.br', telefone: '(21) 91098-7654', empresa: 'Consultoria Delta', departamento: 'Jurídico', cargo: 'Advogada Sênior', senha: 'Origami9!', primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 4, bloqueioAte: new Date(Date.now() + 2 * 3600000).toISOString() },
  { id: '10', nome: 'Thiago Martins Ribeiro', cpf: '95181756085', email: 'thiago.ribeiro@remotetech.com.br', telefone: '(48) 90987-6543', empresa: 'RemoteTech LTDA', departamento: 'Infraestrutura', cargo: 'Engenheiro DevOps', senha: null, primeiroAcesso: true, bloqueioDefinitivo: false, tentativasFalhas: 0 },
  { id: '11', nome: 'Juliana Campos Neto', cpf: '48063581776', email: 'juliana.neto@varejoexpress.com.br', telefone: '(19) 98765-1234', empresa: 'Varejo Express', departamento: 'Vendas', cargo: 'Supervisora de Vendas', senha: 'Origami11!', primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 1 },
  { id: '12', nome: 'Rafael Souza Pereira', cpf: '83970523214', email: 'rafael.pereira@comercioxyz.com.br', telefone: '(31) 97654-0987', empresa: 'Comércio XYZ Ltda', departamento: 'Comercial', cargo: 'Ex-Vendedor (Desligado)', senha: 'Origami12!', primeiroAcesso: false, bloqueioDefinitivo: true, tentativasFalhas: 0 },
]

// ─── Wallets by User (30 total) ─────────────────────────────────────────────
export function buildSeedWallets() {
  const NOW_ISO = NOW()
  return {
    '1': [
      { id: 'w1', nome: 'Flexível ACT 2026', tipo: 'flexivel', saldo: 111.85, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Pode ser usado de acordo com as regras de uso da sua empresa em lojas físicas e virtuais e para compra em parceiros.', gastoSugeridoPorDia: 7.00, regrasDeUso: ['Alimentação','Conveniência','Farmácia','Livraria','Combustível'] },
      { id: 'w2', nome: 'Benefício Flexível', tipo: 'flexivel', saldo: 320.00, limiteDisponivel: 800.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício flexível para uso em diversos estabelecimentos conforme regras da empresa.', gastoSugeridoPorDia: 10.00, regrasDeUso: ['Alimentação','Refeição','Transporte','Cultura'] },
      { id: 'w3', nome: 'Refeição/Alimentação', tipo: 'refeicao', saldo: 445.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Carteira exclusiva para refeição e alimentação em restaurantes, lanchonetes e supermercados.', gastoSugeridoPorDia: 20.00, regrasDeUso: ['Restaurantes','Lanchonetes','Supermercados','Padarias'] },
      { id: 'w4', nome: 'Transporte', tipo: 'transporte', saldo: 280.00, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Carteira para transporte público e mobilidade urbana.', gastoSugeridoPorDia: 15.00, regrasDeUso: ['Ônibus','Metrô','Uber','99','Combustível'] },
      { id: 'w5', nome: 'Cultura', tipo: 'cultura', saldo: 150.00, limiteDisponivel: 200.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício cultural para livros, cinema, teatro e eventos.', gastoSugeridoPorDia: 5.00, regrasDeUso: ['Livrarias','Cinema','Teatro','Shows','Streaming'] },
      { id: 'w6', nome: 'Saúde', tipo: 'saude', saldo: 430.75, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício para cuidados com saúde e bem-estar.', gastoSugeridoPorDia: 14.00, regrasDeUso: ['Farmácias','Consultas','Exames','Academia'] },
      { id: 'w7', nome: 'Educação', tipo: 'educacao', saldo: 0.00, limiteDisponivel: 300.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Carteira de educação zerada — saldo insuficiente para transações.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Cursos','Livros','Certificações'] },
      { id: 'w8', nome: 'PIX Limite', tipo: 'flexivel', saldo: 5000.00, limiteDisponivel: 5000.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Carteira no limite máximo PIX diário para testes de limite.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['PIX','Transferências'] },
    ],
    '2': [
      { id: 'w1', nome: 'Refeição', tipo: 'refeicao', saldo: 380.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Carteira de refeição para uso em restaurantes e lanchonetes.', gastoSugeridoPorDia: 25.00, regrasDeUso: ['Restaurantes','Lanchonetes','Padarias','Cafeterias'] },
      { id: 'w2', nome: 'Flexível', tipo: 'flexivel', saldo: 250.00, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício flexível multifuncional conforme política da Indústria ABC.', gastoSugeridoPorDia: 8.00, regrasDeUso: ['Supermercados','Farmácias','Combustível','Conveniência'] },
      { id: 'w3', nome: 'Saúde e Bem-estar', tipo: 'saude', saldo: 175.50, limiteDisponivel: 300.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício para farmácias, consultas e academia.', gastoSugeridoPorDia: 6.00, regrasDeUso: ['Farmácias','Consultas','Academia','Ótica'] },
    ],
    '3': [
      { id: 'w1', nome: 'Alimentação', tipo: 'alimentacao', saldo: 520.00, limiteDisponivel: 700.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Carteira de alimentação para supermercados e hortifrútis.', gastoSugeridoPorDia: 18.00, regrasDeUso: ['Supermercados','Hortifrúti','Mercearias','Atacadistas'] },
      { id: 'w2', nome: 'Transporte', tipo: 'transporte', saldo: 180.00, limiteDisponivel: 300.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-transporte para deslocamento diário.', gastoSugeridoPorDia: 12.00, regrasDeUso: ['Ônibus','Metrô','Bilhete Único','Combustível'] },
    ],
    '4': [
      { id: 'w1', nome: 'Flexível Tech', tipo: 'flexivel', saldo: 500.00, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício flexível da Tech Solutions para uso amplo.', gastoSugeridoPorDia: 16.00, regrasDeUso: ['Alimentação','Farmácia','Combustível','Conveniência','Livraria'] },
      { id: 'w2', nome: 'Refeição', tipo: 'refeicao', saldo: 600.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-refeição para restaurantes e lanchonetes.', gastoSugeridoPorDia: 30.00, regrasDeUso: ['Restaurantes','Lanchonetes','Padarias','Delivery'] },
      { id: 'w3', nome: 'Transporte', tipo: 'transporte', saldo: 400.00, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-transporte para mobilidade.', gastoSugeridoPorDia: 20.00, regrasDeUso: ['Uber','99','Metrô','Ônibus','Combustível'] },
      { id: 'w4', nome: 'Cultura', tipo: 'cultura', saldo: 200.00, limiteDisponivel: 200.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício cultural da Tech Solutions.', gastoSugeridoPorDia: 5.00, regrasDeUso: ['Livrarias','Cinema','Teatro','Streaming','Cursos'] },
      { id: 'w5', nome: 'Educação', tipo: 'educacao', saldo: 350.00, limiteDisponivel: 350.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício educacional para cursos e certificações.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Cursos online','Certificações','Idiomas','Livros técnicos'] },
    ],
    '5': [
      { id: 'w1', nome: 'Flexível Premium', tipo: 'flexivel', saldo: 680.00, limiteDisponivel: 800.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Carteira única flexível da Indústria ABC — uso amplo conforme política corporativa.', gastoSugeridoPorDia: 22.00, regrasDeUso: ['Alimentação','Refeição','Farmácia','Combustível','Transporte','Cultura'] },
    ],
    '6': [
      { id: 'w1', nome: 'Refeição', tipo: 'refeicao', saldo: 290.00, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-refeição Comércio XYZ.', gastoSugeridoPorDia: 25.00, regrasDeUso: ['Restaurantes','Lanchonetes','Delivery'] },
      { id: 'w2', nome: 'Transporte', tipo: 'transporte', saldo: 150.00, limiteDisponivel: 350.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-transporte para deslocamento.', gastoSugeridoPorDia: 15.00, regrasDeUso: ['Ônibus','Metrô','Combustível'] },
      { id: 'w3', nome: 'Saúde', tipo: 'saude', saldo: 420.00, limiteDisponivel: 450.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício saúde para farmácias e consultas.', gastoSugeridoPorDia: 10.00, regrasDeUso: ['Farmácias','Consultas','Exames','Ótica'] },
      { id: 'w4', nome: 'Home Office', tipo: 'homeoffice', saldo: 200.00, limiteDisponivel: 300.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício home office para equipamentos e mobiliário.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Papelaria','Informática','Mobiliário','Ergonomia'] },
    ],
    '7': [
      { id: 'w1', nome: 'Alimentação Estágio', tipo: 'alimentacao', saldo: 23.50, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-alimentação de estágio.', gastoSugeridoPorDia: 12.00, regrasDeUso: ['Lanchonetes','Supermercados','Padarias'] },
      { id: 'w2', nome: 'Transporte Estágio', tipo: 'transporte', saldo: 8.20, limiteDisponivel: 200.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-transporte de estágio.', gastoSugeridoPorDia: 8.00, regrasDeUso: ['Ônibus','Metrô','Bilhete Único'] },
    ],
    '8': [
      { id: 'w1', nome: 'Alimentação Premium', tipo: 'alimentacao', saldo: 1200.00, limiteDisponivel: 1500.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício alimentação premium executivo.', gastoSugeridoPorDia: 40.00, regrasDeUso: ['Restaurantes premium','Delivery','Supermercados'] },
      { id: 'w2', nome: 'Refeição Executiva', tipo: 'refeicao', saldo: 900.00, limiteDisponivel: 1200.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-refeição executivo.', gastoSugeridoPorDia: 30.00, regrasDeUso: ['Restaurantes','Delivery premium'] },
      { id: 'w3', nome: 'Transporte Executivo', tipo: 'transporte', saldo: 600.00, limiteDisponivel: 800.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Transporte executivo ampliado.', gastoSugeridoPorDia: 25.00, regrasDeUso: ['Uber','Táxi','Combustível','Estacionamento'] },
      { id: 'w4', nome: 'Educação Continuada', tipo: 'educacao', saldo: 2000.00, limiteDisponivel: 3000.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'MBA, cursos executivos, certificações.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['MBA','Cursos executivos','Certificações internacionais'] },
      { id: 'w5', nome: 'Home Office Premium', tipo: 'homeoffice', saldo: 1500.00, limiteDisponivel: 2000.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Equipamentos e setup de alto nível.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Eletrônicos','Mobiliário ergonômico','Internet'] },
      { id: 'w6', nome: 'Saúde & Bem-estar', tipo: 'saude', saldo: 800.00, limiteDisponivel: 1000.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Plano saúde complementar, academia, wellbeing.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Academia','Consultas','Psicologia','Spa'] },
      { id: 'w7', nome: 'Cultura & Lazer', tipo: 'cultura', saldo: 500.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Cinema, teatro, streaming, livros.', gastoSugeridoPorDia: 10.00, regrasDeUso: ['Cinema','Teatro','Streaming','Shows','Livros'] },
    ],
    '9': [
      { id: 'w1', nome: 'Refeição', tipo: 'refeicao', saldo: 320.00, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-refeição Consultoria Delta.', gastoSugeridoPorDia: 20.00, regrasDeUso: ['Restaurantes','Lanchonetes'] },
      { id: 'w2', nome: 'Flexível Jurídico', tipo: 'flexivel', saldo: 450.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Flexível para uso conforme política jurídica.', gastoSugeridoPorDia: 15.00, regrasDeUso: ['Livraria jurídica','Cursos OAB','Conveniência'] },
      { id: 'w3', nome: 'Saúde', tipo: 'saude', saldo: 280.00, limiteDisponivel: 350.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício saúde.', gastoSugeridoPorDia: 9.00, regrasDeUso: ['Farmácias','Consultas','Exames'] },
    ],
    '10': [
      { id: 'w1', nome: 'Alimentação', tipo: 'alimentacao', saldo: 700.00, limiteDisponivel: 700.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Alimentação para trabalho remoto.', gastoSugeridoPorDia: 20.00, regrasDeUso: ['Supermercados','Delivery','Restaurantes'] },
      { id: 'w2', nome: 'Home Office Integral', tipo: 'homeoffice', saldo: 2000.00, limiteDisponivel: 2000.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Setup completo de home office.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Eletrônicos','Internet','Mobiliário'] },
      { id: 'w3', nome: 'Educação Tech', tipo: 'educacao', saldo: 1500.00, limiteDisponivel: 1500.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Certificações e cursos de tecnologia.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['AWS','Google Cloud','Cursos técnicos','Certificações'] },
      { id: 'w4', nome: 'Flexível RemoteTech', tipo: 'flexivel', saldo: 400.00, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício flexível para colaboradores remotos.', gastoSugeridoPorDia: 12.00, regrasDeUso: ['Combustível','Conveniência','Farmácia'] },
    ],
    '11': [
      { id: 'w1', nome: 'Flexível', tipo: 'flexivel', saldo: 12.30, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Benefício flexível Varejo Express.', gastoSugeridoPorDia: 12.00, regrasDeUso: ['Alimentação','Farmácia','Conveniência'] },
      { id: 'w2', nome: 'Refeição', tipo: 'refeicao', saldo: 189.90, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-refeição para restaurantes.', gastoSugeridoPorDia: 18.00, regrasDeUso: ['Restaurantes','Lanchonetes'] },
      { id: 'w3', nome: 'Transporte', tipo: 'transporte', saldo: 3.50, limiteDisponivel: 250.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Vale-transporte.', gastoSugeridoPorDia: 10.00, regrasDeUso: ['Ônibus','Metrô','Bilhete Único'] },
    ],
    '12': [
      { id: 'w1', nome: 'Alimentação', tipo: 'alimentacao', saldo: 0.00, limiteDisponivel: 0.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Encerrado.', gastoSugeridoPorDia: 0.00, regrasDeUso: [] },
      { id: 'w2', nome: 'Refeição', tipo: 'refeicao', saldo: 0.00, limiteDisponivel: 0.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Encerrado.', gastoSugeridoPorDia: 0.00, regrasDeUso: [] },
      { id: 'w3', nome: 'Transporte', tipo: 'transporte', saldo: 0.00, limiteDisponivel: 0.00, ativo: true, ultimaAtualizacao: NOW_ISO, descricao: 'Encerrado.', gastoSugeridoPorDia: 0.00, regrasDeUso: [] },
    ],
  }
}

// ─── Cards by User (10+ cards across users) ─────────────────────────────────
export const SEED_CARDS_BY_USER = {
  '1': [
    { id: 'c1', tipo: 'fisico', status: 'ativo', bandeira: 'visa', ultimosDigitos: '4625', nomePortador: 'LUCAS O SILVA', validade: '12/28', carteirasVinculadas: ['Flexível ACT 2026','Refeição/Alimentação','Benefício Flexível'], contactless: true, pin: '5678', internationalMode: false },
    { id: 'c2', tipo: 'virtual', status: 'ativo', bandeira: 'mastercard', ultimosDigitos: '9501', nomePortador: 'LUCAS O SILVA', validade: '11/30', carteirasVinculadas: ['Transporte','Cultura'], contactless: false, pin: null },
    { id: 'c3', tipo: 'virtual', status: 'ativo', bandeira: 'elo', ultimosDigitos: '2210', nomePortador: 'LUCAS O SILVA', validade: '03/28', carteirasVinculadas: ['Saúde'], contactless: false, pin: null },
    { id: 'c4', tipo: 'fisico', status: 'pendente', bandeira: 'visa', ultimosDigitos: '7744', nomePortador: 'LUCAS O SILVA', validade: '06/29', carteirasVinculadas: ['Educação'], contactless: true, pin: null, internationalMode: false },
    { id: 'c5', tipo: 'fisico', status: 'bloqueado', bandeira: 'mastercard', ultimosDigitos: '3388', nomePortador: 'LUCAS O SILVA', validade: '09/28', carteirasVinculadas: ['Flexível ACT 2026','Transporte'], contactless: true, pin: '2468', internationalMode: false },
    { id: 'c6', tipo: 'virtual', status: 'cancelado', bandeira: 'elo', ultimosDigitos: '5566', nomePortador: 'LUCAS O SILVA', validade: '01/27', carteirasVinculadas: ['Cultura'], contactless: false, pin: null },
    { id: 'c7', tipo: 'fisico', status: 'ativo', bandeira: 'visa', ultimosDigitos: '9922', nomePortador: 'LUCAS O SILVA', validade: '04/29', carteirasVinculadas: ['Flexível ACT 2026','Benefício Flexível'], contactless: true, pin: '1357', internationalMode: true },
  ],
  '2': [
    { id: 'c1', tipo: 'fisico', status: 'ativo', bandeira: 'mastercard', ultimosDigitos: '7821', nomePortador: 'MARIA S FERREIRA', validade: '08/27', carteirasVinculadas: ['Refeição','Flexível','Saúde e Bem-estar'], contactless: true, pin: '1111' },
    { id: 'c2', tipo: 'virtual', status: 'ativo', bandeira: 'visa', ultimosDigitos: '5533', nomePortador: 'MARIA S FERREIRA', validade: '05/29', carteirasVinculadas: ['Flexível'], contactless: false, pin: '2222' },
  ],
  '3': [
    { id: 'c1', tipo: 'fisico', status: 'ativo', bandeira: 'elo', ultimosDigitos: '3456', nomePortador: 'JOAO P COSTA', validade: '10/27', carteirasVinculadas: ['Alimentação','Transporte'], contactless: true, pin: '3333' },
  ],
  '4': [
    { id: 'c1', tipo: 'fisico', status: 'pendente', bandeira: 'visa', ultimosDigitos: '8890', nomePortador: 'CARLOS E MENDES', validade: '02/29', carteirasVinculadas: ['Flexível Tech','Refeição','Transporte'], contactless: true, pin: '4444' },
    { id: 'c2', tipo: 'virtual', status: 'ativo', bandeira: 'mastercard', ultimosDigitos: '1122', nomePortador: 'CARLOS E MENDES', validade: '02/29', carteirasVinculadas: ['Cultura','Educação'], contactless: false, pin: '5555' },
  ],
  '5': [
    { id: 'c1', tipo: 'virtual', status: 'ativo', bandeira: 'visa', ultimosDigitos: '9012', nomePortador: 'ANA C LIMA', validade: '07/28', carteirasVinculadas: ['Flexível Premium'], contactless: false, pin: '6666' },
  ],
  '6': [
    { id: 'c1', tipo: 'fisico', status: 'ativo', bandeira: 'visa', ultimosDigitos: '5678', nomePortador: 'ROBERTO ALMEIDA', validade: '01/28', carteirasVinculadas: ['Refeição','Transporte'], contactless: true, pin: '7777' },
    { id: 'c2', tipo: 'fisico', status: 'bloqueado', bandeira: 'mastercard', ultimosDigitos: '1234', nomePortador: 'ROBERTO ALMEIDA', validade: '09/26', carteirasVinculadas: ['Saúde'], contactless: true, pin: '8888' },
    { id: 'c3', tipo: 'virtual', status: 'ativo', bandeira: 'elo', ultimosDigitos: '6677', nomePortador: 'ROBERTO ALMEIDA', validade: '04/29', carteirasVinculadas: ['Home Office'], contactless: false, pin: '9999' },
  ],
  '7': [
    { id: 'c1', tipo: 'fisico', status: 'ativo', bandeira: 'elo', ultimosDigitos: '4401', nomePortador: 'FERNANDA R BARBOSA', validade: '06/28', carteirasVinculadas: ['Alimentação Estágio','Transporte Estágio'], contactless: false, pin: '1212' },
  ],
  '8': [
    { id: 'c1', tipo: 'fisico', status: 'ativo', bandeira: 'visa', ultimosDigitos: '9900', nomePortador: 'DIEGO N SANTOS', validade: '12/29', carteirasVinculadas: ['Alimentação Premium','Refeição Executiva','Transporte Executivo','Educação Continuada','Home Office Premium'], contactless: true, pin: '3434' },
    { id: 'c2', tipo: 'fisico', status: 'ativo', bandeira: 'mastercard', ultimosDigitos: '3311', nomePortador: 'DIEGO N SANTOS', validade: '12/29', carteirasVinculadas: ['Saúde & Bem-estar','Cultura & Lazer'], contactless: true, pin: '5656' },
    { id: 'c3', tipo: 'virtual', status: 'ativo', bandeira: 'visa', ultimosDigitos: '7700', nomePortador: 'DIEGO N SANTOS', validade: '06/30', carteirasVinculadas: ['Educação Continuada','Home Office Premium'], contactless: false, pin: '7878' },
    { id: 'c4', tipo: 'virtual', status: 'ativo', bandeira: 'elo', ultimosDigitos: '5500', nomePortador: 'DIEGO N SANTOS', validade: '06/30', carteirasVinculadas: ['Cultura & Lazer'], contactless: false, pin: '9090' },
  ],
  '9': [
    { id: 'c1', tipo: 'fisico', status: 'bloqueado', bandeira: 'mastercard', ultimosDigitos: '6688', nomePortador: 'PATRICIA V DUARTE', validade: '03/28', carteirasVinculadas: ['Refeição','Flexível Jurídico','Saúde'], contactless: true, pin: '2323' },
    { id: 'c2', tipo: 'virtual', status: 'ativo', bandeira: 'visa', ultimosDigitos: '2299', nomePortador: 'PATRICIA V DUARTE', validade: '09/29', carteirasVinculadas: ['Flexível Jurídico'], contactless: false, pin: '4545' },
  ],
  '10': [
    { id: 'c1', tipo: 'fisico', status: 'pendente', bandeira: 'visa', ultimosDigitos: '1155', nomePortador: 'THIAGO M RIBEIRO', validade: '04/29', carteirasVinculadas: ['Alimentação','Flexível RemoteTech'], contactless: true, pin: '6767' },
    { id: 'c2', tipo: 'virtual', status: 'pendente', bandeira: 'mastercard', ultimosDigitos: '3366', nomePortador: 'THIAGO M RIBEIRO', validade: '04/29', carteirasVinculadas: ['Home Office Integral','Educação Tech'], contactless: false, pin: '8989' },
  ],
  '11': [
    { id: 'c1', tipo: 'fisico', status: 'ativo', bandeira: 'visa', ultimosDigitos: '2277', nomePortador: 'JULIANA C NETO', validade: '11/27', carteirasVinculadas: ['Flexível','Refeição','Transporte'], contactless: true, pin: '1010' },
    { id: 'c2', tipo: 'virtual', status: 'bloqueado', bandeira: 'elo', ultimosDigitos: '8833', nomePortador: 'JULIANA C NETO', validade: '05/28', carteirasVinculadas: ['Flexível'], contactless: false, pin: '2020' },
  ],
  '12': [
    { id: 'c1', tipo: 'fisico', status: 'cancelado', bandeira: 'visa', ultimosDigitos: '8844', nomePortador: 'RAFAEL S PEREIRA', validade: '09/26', carteirasVinculadas: ['Alimentação','Refeição','Transporte'], contactless: true, pin: '0000' },
    { id: 'c2', tipo: 'virtual', status: 'cancelado', bandeira: 'mastercard', ultimosDigitos: '6622', nomePortador: 'RAFAEL S PEREIRA', validade: '09/26', carteirasVinculadas: ['Alimentação'], contactless: false, pin: '0000' },
  ],
}

// ─── Transactions by User (200+ across all users) ───────────────────────────
export function buildSeedTransactions() {
  return {
    '1': [
      { id: 'tx001', descricao: 'IKD Restaurante', valor: -42.90, tipo: 'debito', categoria: 'Refeição', data: d(2), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'IKD Restaurante' },
      { id: 'tx002', descricao: 'Uber Trip', valor: -18.70, tipo: 'debito', categoria: 'Transporte', data: d(3), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: 'Uber' },
      { id: 'tx003', descricao: 'Crédito Refeição/Alimentação', valor: 600.00, tipo: 'credito', categoria: 'Crédito', data: d(24), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Origami' },
      { id: 'tx004', descricao: 'Amazon.com.br — parcela 1/3', valor: -43.30, tipo: 'debito', categoria: 'Cultura', data: d(96), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Amazon' },
      { id: 'tx005', descricao: 'Drogaria Raia', valor: -64.50, tipo: 'debito', categoria: 'Saúde', data: d(120), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde', merchant: 'Drogaria Raia' },
      { id: 'tx006', descricao: 'Bilhete Único SPTrans', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(144), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: 'SPTrans' },
      { id: 'tx007', descricao: 'Pão de Açúcar', valor: -89.90, tipo: 'debito', categoria: 'Flexível', data: d(168), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Pão de Açúcar' },
      { id: 'tx008', descricao: 'Crédito Transporte', valor: 400.00, tipo: 'credito', categoria: 'Crédito', data: d(336), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: 'Origami' },
      { id: 'tx009', descricao: 'Smart Fit — mensalidade', valor: -99.90, tipo: 'debito', categoria: 'Saúde', data: d(480), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde', merchant: 'Smart Fit' },
      { id: 'tx010', descricao: 'Netflix', valor: -55.90, tipo: 'debito', categoria: 'Cultura', data: d(600), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Netflix' },
      // Additional transactions for user 1 to reach 200+ total
      { id: 'tx011', descricao: 'Padaria Real', valor: -15.80, tipo: 'debito', categoria: 'Refeição', data: d(4), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Padaria Real' },
      { id: 'tx012', descricao: 'Livraria Saraiva', valor: -67.90, tipo: 'debito', categoria: 'Cultura', data: d(5), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Livraria Saraiva' },
      { id: 'tx013', descricao: 'Farmácia Drogasil', valor: -32.40, tipo: 'debito', categoria: 'Saúde', data: d(6), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde', merchant: 'Drogasil' },
      { id: 'tx014', descricao: 'iFood — Japa da Esquina', valor: -48.90, tipo: 'debito', categoria: 'Refeição', data: d(8), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'iFood' },
      { id: 'tx015', descricao: '99 — Viagem trabalho', valor: -22.30, tipo: 'debito', categoria: 'Transporte', data: d(10), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: '99' },
      { id: 'tx016', descricao: 'Restaurante Madero', valor: -95.00, tipo: 'debito', categoria: 'Refeição', data: d(12), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Madero' },
      { id: 'tx017', descricao: 'Shell — Combustível', valor: -180.00, tipo: 'debito', categoria: 'Transporte', data: d(14), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: 'Posto Shell' },
      { id: 'tx018', descricao: 'Spotify Premium', valor: -21.90, tipo: 'debito', categoria: 'Cultura', data: d(720), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Spotify' },
      { id: 'tx019', descricao: 'Crédito Flexível', valor: 500.00, tipo: 'credito', categoria: 'Crédito', data: d(672), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Origami' },
      { id: 'tx020', descricao: 'Extra Supermercados', valor: -156.70, tipo: 'debito', categoria: 'Flexível', data: d(192), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Extra' },
      { id: 'tx021', descricao: 'Farmácia Pacheco', valor: -28.50, tipo: 'debito', categoria: 'Saúde', data: d(200), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde', merchant: 'Pacheco' },
      { id: 'tx022', descricao: 'Bob\'s Burger', valor: -29.90, tipo: 'debito', categoria: 'Refeição', data: d(216), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Bob\'s' },
      { id: 'tx023', descricao: 'Uber Trip', valor: -14.50, tipo: 'debito', categoria: 'Transporte', data: d(240), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: 'Uber' },
      { id: 'tx024', descricao: 'Crédito Cultura', valor: 200.00, tipo: 'credito', categoria: 'Crédito', data: d(672), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Origami' },
      { id: 'tx025', descricao: 'Crédito Saúde', valor: 500.00, tipo: 'credito', categoria: 'Crédito', data: d(672), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde', merchant: 'Origami' },
      { id: 'tx026', descricao: 'Cinema Kinoplex', valor: -35.00, tipo: 'debito', categoria: 'Cultura', data: d(264), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Kinoplex' },
      { id: 'tx027', descricao: 'Rappi — Sushi San', valor: -62.50, tipo: 'debito', categoria: 'Refeição', data: d(288), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Rappi' },
      { id: 'tx028', descricao: 'Bilhete Único SPTrans', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(312), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: 'SPTrans' },
      { id: 'tx029', descricao: 'Droga Raia — Vitaminas', valor: -45.90, tipo: 'debito', categoria: 'Saúde', data: d(360), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde', merchant: 'Droga Raia' },
      { id: 'tx030', descricao: 'Restaurante Fasano', valor: -280.00, tipo: 'debito', categoria: 'Refeição', data: d(384), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Fasano' },
      { id: 'tx031', descricao: 'PIX recebido — reembolso', valor: 45.00, tipo: 'credito', categoria: 'PIX', data: d(400), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'PIX' },
      { id: 'tx032', descricao: 'Uber Trip', valor: -28.90, tipo: 'debito', categoria: 'Transporte', data: d(408), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: 'Uber' },
      { id: 'tx033', descricao: 'McDonald\'s', valor: -34.90, tipo: 'debito', categoria: 'Refeição', data: d(432), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'McDonald\'s' },
      { id: 'tx034', descricao: 'Supermercado Dia', valor: -78.30, tipo: 'debito', categoria: 'Flexível', data: d(456), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Dia' },
      { id: 'tx035', descricao: 'Amazon.com.br — parcela 2/3', valor: -43.30, tipo: 'debito', categoria: 'Cultura', data: d(768), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Amazon' },
      { id: 'tx036', descricao: 'Smart Fit — mensalidade', valor: -99.90, tipo: 'debito', categoria: 'Saúde', data: d(1152), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde', merchant: 'Smart Fit' },
      { id: 'tx037', descricao: 'Netflix', valor: -55.90, tipo: 'debito', categoria: 'Cultura', data: d(1272), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Netflix' },
      { id: 'tx038', descricao: 'Crédito Refeição/Alimentação', valor: 600.00, tipo: 'credito', categoria: 'Crédito', data: d(696), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Origami' },
      { id: 'tx039', descricao: 'Padaria Luce', valor: -12.50, tipo: 'debito', categoria: 'Refeição', data: d(504), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Padaria Luce' },
      { id: 'tx040', descricao: 'Shell — Combustível', valor: -195.00, tipo: 'debito', categoria: 'Transporte', data: d(528), status: 'aprovada', walletId: 'w4', walletNome: 'Transporte', merchant: 'Posto Shell' },
      // Transactions with ALL statuses
      { id: 'tx041', descricao: 'Compra pendente — Magazine Luiza', valor: -349.90, tipo: 'debito', categoria: 'Flexível', data: d(1), status: 'pendente', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Magazine Luiza' },
      { id: 'tx042', descricao: 'Compra cancelada — Americanas', valor: -129.90, tipo: 'debito', categoria: 'Flexível', data: d(72), status: 'cancelada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Americanas' },
      { id: 'tx043', descricao: 'Estorno — Drogasil cobrança duplicada', valor: 64.50, tipo: 'credito', categoria: 'Estorno', data: d(48), status: 'estornada', walletId: 'w6', walletNome: 'Saúde', merchant: 'Drogasil' },
      // Transaction with full receipt data (NSU, auth code, CNPJ, etc.)
      { id: 'tx044', descricao: 'Restaurante Fasano — almoço executivo', valor: -320.00, tipo: 'debito', categoria: 'Refeição', data: d(6), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Fasano', direcao: 'debito', nsu: '001234567890', codigoAutorizacao: 'AUTH-98765', cnpjEstabelecimento: '12.345.678/0001-90', enderecoEstabelecimento: 'Rua Haddock Lobo, 1738 — Jardim Paulista, SP', cartaoFinal: '4625', bandeira: 'visa', mcc: '5812', mccDescricao: 'Restaurantes', parcelas: 1, valorParcela: 320.00, nomePortador: 'LUCAS O SILVA' },
      // Multi-month transactions (older months for month navigation)
      { id: 'tx045', descricao: 'Crédito Mensal Fev', valor: 600.00, tipo: 'credito', categoria: 'Crédito', data: dDays(45), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Origami' },
      { id: 'tx046', descricao: 'Compra Fevereiro — Carrefour', valor: -234.50, tipo: 'debito', categoria: 'Flexível', data: dDays(50), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Carrefour' },
      { id: 'tx047', descricao: 'Crédito Mensal Jan', valor: 600.00, tipo: 'credito', categoria: 'Crédito', data: dDays(75), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Origami' },
      { id: 'tx048', descricao: 'Compra Janeiro — Extra', valor: -178.30, tipo: 'debito', categoria: 'Flexível', data: dDays(80), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Extra' },
      { id: 'tx049', descricao: 'Crédito Mensal Dez', valor: 600.00, tipo: 'credito', categoria: 'Crédito', data: dDays(105), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Origami' },
      { id: 'tx050', descricao: 'Compra Dezembro — Natalina', valor: -456.00, tipo: 'debito', categoria: 'Flexível', data: dDays(110), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Natalina' },
      // All categories coverage
      { id: 'tx051', descricao: 'PIX enviado — aluguel', valor: -1500.00, tipo: 'debito', categoria: 'PIX', data: d(50), status: 'aprovada', walletId: 'w8', walletNome: 'PIX Limite', merchant: 'PIX' },
      { id: 'tx052', descricao: 'Boleto — IPTU parcela 3', valor: -245.00, tipo: 'debito', categoria: 'Boleto', data: d(100), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Prefeitura SP' },
      { id: 'tx053', descricao: 'QR Code — Padaria Luce', valor: -18.50, tipo: 'debito', categoria: 'QR Code', data: d(20), status: 'aprovada', walletId: 'w3', walletNome: 'Refeição/Alimentação', merchant: 'Padaria Luce' },
      { id: 'tx054', descricao: 'Recarga Vivo', valor: -30.00, tipo: 'debito', categoria: 'Recarga', data: d(150), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Vivo' },
      { id: 'tx055', descricao: 'Saque bancário', valor: -200.00, tipo: 'debito', categoria: 'Saque', data: d(200), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Banco do Brasil' },
      { id: 'tx056', descricao: 'PIX Cash Out — banco', valor: -500.00, tipo: 'debito', categoria: 'PIX Cash Out', data: d(250), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'PIX Cash Out' },
      { id: 'tx057', descricao: 'Home Office — Monitor Dell', valor: -890.00, tipo: 'debito', categoria: 'Home Office', data: d(300), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível ACT 2026', merchant: 'Dell' },
      { id: 'tx058', descricao: 'Educação — Curso Alura', valor: -79.90, tipo: 'debito', categoria: 'Educação', data: d(350), status: 'aprovada', walletId: 'w5', walletNome: 'Cultura', merchant: 'Alura' },
    ],
    '2': [
      { id: 'tx001', descricao: 'Restaurante Madero', valor: -89.00, tipo: 'debito', categoria: 'Refeição', data: d(3), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Restaurante Madero' },
      { id: 'tx002', descricao: 'Crédito Refeição', valor: 600.00, tipo: 'credito', categoria: 'Crédito', data: d(48), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Origami' },
      { id: 'tx003', descricao: 'Farmácia São João', valor: -45.60, tipo: 'debito', categoria: 'Saúde', data: d(72), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde e Bem-estar', merchant: 'Farmácia São João' },
      { id: 'tx004', descricao: 'Subway', valor: -28.90, tipo: 'debito', categoria: 'Refeição', data: d(5), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Subway' },
      { id: 'tx005', descricao: 'Supermercado Carrefour', valor: -234.50, tipo: 'debito', categoria: 'Flexível', data: d(8), status: 'aprovada', walletId: 'w2', walletNome: 'Flexível', merchant: 'Carrefour' },
      { id: 'tx006', descricao: 'iFood Delivery', valor: -52.90, tipo: 'debito', categoria: 'Refeição', data: d(24), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'iFood' },
      { id: 'tx007', descricao: 'Crédito Flexível', valor: 400.00, tipo: 'credito', categoria: 'Crédito', data: d(48), status: 'aprovada', walletId: 'w2', walletNome: 'Flexível', merchant: 'Origami' },
      { id: 'tx008', descricao: 'Drogaria Raia', valor: -78.30, tipo: 'debito', categoria: 'Saúde', data: d(96), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde e Bem-estar', merchant: 'Drogaria Raia' },
      { id: 'tx009', descricao: 'Restaurante Outback', valor: -145.00, tipo: 'debito', categoria: 'Refeição', data: d(120), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Outback' },
      { id: 'tx010', descricao: 'Crédito Saúde', valor: 300.00, tipo: 'credito', categoria: 'Crédito', data: d(120), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde e Bem-estar', merchant: 'Origami' },
      { id: 'tx011', descricao: 'Padaria Real', valor: -18.50, tipo: 'debito', categoria: 'Refeição', data: d(144), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Padaria Real' },
      { id: 'tx012', descricao: 'Supermercado Pão de Açúcar', valor: -189.90, tipo: 'debito', categoria: 'Flexível', data: d(168), status: 'aprovada', walletId: 'w2', walletNome: 'Flexível', merchant: 'Pão de Açúcar' },
      { id: 'tx013', descricao: 'Consulta Dr. Silva', valor: -250.00, tipo: 'debito', categoria: 'Saúde', data: d(192), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde e Bem-estar', merchant: 'Dr. Silva' },
      { id: 'tx014', descricao: 'Burguer King', valor: -32.90, tipo: 'debito', categoria: 'Refeição', data: d(200), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Burger King' },
      { id: 'tx015', descricao: 'Crédito Refeição', valor: 600.00, tipo: 'credito', categoria: 'Crédito', data: d(720), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Origami' },
      { id: 'tx016', descricao: 'Farmácia Pacheco', valor: -35.00, tipo: 'debito', categoria: 'Saúde', data: d(240), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde e Bem-estar', merchant: 'Pacheco' },
      { id: 'tx017', descricao: 'Restaurante Coco Bambu', valor: -178.00, tipo: 'debito', categoria: 'Refeição', data: d(264), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Coco Bambu' },
      { id: 'tx018', descricao: 'Atacadão', valor: -312.40, tipo: 'debito', categoria: 'Flexível', data: d(288), status: 'aprovada', walletId: 'w2', walletNome: 'Flexível', merchant: 'Atacadão' },
      { id: 'tx019', descricao: 'Drogasil — Vitaminas', valor: -62.80, tipo: 'debito', categoria: 'Saúde', data: d(312), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde e Bem-estar', merchant: 'Drogasil' },
      { id: 'tx020', descricao: 'Rappi — Pizza Hut', valor: -59.90, tipo: 'debito', categoria: 'Refeição', data: d(336), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Rappi' },
    ],
    '3': [
      { id: 'tx001', descricao: 'Assaí Atacadista', valor: -387.90, tipo: 'debito', categoria: 'Alimentação', data: d(5), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Assaí' },
      { id: 'tx002', descricao: 'Crédito Alimentação', valor: 700.00, tipo: 'credito', categoria: 'Crédito', data: d(24), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Origami' },
      { id: 'tx003', descricao: 'Bilhete Único SPTrans', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(8), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: 'SPTrans' },
      { id: 'tx004', descricao: 'Supermercado Extra', valor: -145.60, tipo: 'debito', categoria: 'Alimentação', data: d(48), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Extra' },
      { id: 'tx005', descricao: 'Uber Trip', valor: -15.90, tipo: 'debito', categoria: 'Transporte', data: d(72), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: 'Uber' },
      { id: 'tx006', descricao: 'Hortifrúti Natural', valor: -67.80, tipo: 'debito', categoria: 'Alimentação', data: d(96), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Hortifrúti' },
      { id: 'tx007', descricao: 'Bilhete Único SPTrans', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(120), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: 'SPTrans' },
      { id: 'tx008', descricao: 'Crédito Transporte', valor: 300.00, tipo: 'credito', categoria: 'Crédito', data: d(24), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: 'Origami' },
      { id: 'tx009', descricao: 'Carrefour Hipermercado', valor: -198.30, tipo: 'debito', categoria: 'Alimentação', data: d(144), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Carrefour' },
      { id: 'tx010', descricao: 'Metrô', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(168), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: 'Metrô SP' },
      { id: 'tx011', descricao: 'Atacadão', valor: -256.90, tipo: 'debito', categoria: 'Alimentação', data: d(192), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Atacadão' },
      { id: 'tx012', descricao: 'Crédito Alimentação', valor: 700.00, tipo: 'credito', categoria: 'Crédito', data: d(696), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Origami' },
      { id: 'tx013', descricao: 'Mercearia da Vila', valor: -34.50, tipo: 'debito', categoria: 'Alimentação', data: d(216), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Mercearia da Vila' },
      { id: 'tx014', descricao: '99 — trabalho', valor: -19.80, tipo: 'debito', categoria: 'Transporte', data: d(240), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: '99' },
      { id: 'tx015', descricao: 'Pão de Açúcar', valor: -123.40, tipo: 'debito', categoria: 'Alimentação', data: d(264), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação', merchant: 'Pão de Açúcar' },
    ],
    '4': [],
    '5': [
      { id: 'tx001', descricao: 'Zara Fashion', valor: -289.90, tipo: 'debito', categoria: 'Flexível', data: d(7), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Zara' },
      { id: 'tx002', descricao: 'Uber Trip', valor: -24.50, tipo: 'debito', categoria: 'Flexível', data: d(12), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Uber' },
      { id: 'tx003', descricao: 'iFood — Sushi', valor: -78.90, tipo: 'debito', categoria: 'Flexível', data: d(24), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'iFood' },
      { id: 'tx004', descricao: 'Crédito Flexível Premium', valor: 800.00, tipo: 'credito', categoria: 'Crédito', data: d(6), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Origami' },
      { id: 'tx005', descricao: 'Farmácia Raia', valor: -45.00, tipo: 'debito', categoria: 'Flexível', data: d(48), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Raia' },
      { id: 'tx006', descricao: 'Supermercado Dia', valor: -112.30, tipo: 'debito', categoria: 'Flexível', data: d(72), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Dia' },
      { id: 'tx007', descricao: 'Shell — Combustível', valor: -150.00, tipo: 'debito', categoria: 'Flexível', data: d(96), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Shell' },
      { id: 'tx008', descricao: 'Renner — Roupas', valor: -189.90, tipo: 'debito', categoria: 'Flexível', data: d(120), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Renner' },
      { id: 'tx009', descricao: 'Crédito Flexível Premium', valor: 800.00, tipo: 'credito', categoria: 'Crédito', data: d(672), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Origami' },
      { id: 'tx010', descricao: 'Bob\'s Paulista', valor: -29.90, tipo: 'debito', categoria: 'Flexível', data: d(144), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível Premium', merchant: 'Bob\'s' },
    ],
    '6': [
      { id: 'tx001', descricao: 'Restaurante Fasano', valor: -280.00, tipo: 'debito', categoria: 'Refeição', data: d(24), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Fasano' },
      { id: 'tx002', descricao: 'Uber Trip', valor: -35.00, tipo: 'debito', categoria: 'Transporte', data: d(48), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: 'Uber' },
      { id: 'tx003', descricao: 'Drogaria Raia', valor: -89.50, tipo: 'debito', categoria: 'Saúde', data: d(72), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde', merchant: 'Drogaria Raia' },
      { id: 'tx004', descricao: 'Crédito Refeição', valor: 500.00, tipo: 'credito', categoria: 'Crédito', data: d(24), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Origami' },
      { id: 'tx005', descricao: 'Papelaria Kalunga', valor: -67.00, tipo: 'debito', categoria: 'Home Office', data: d(96), status: 'aprovada', walletId: 'w4', walletNome: 'Home Office', merchant: 'Kalunga' },
      { id: 'tx006', descricao: 'Restaurante Arabia', valor: -95.00, tipo: 'debito', categoria: 'Refeição', data: d(120), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Arabia' },
      { id: 'tx007', descricao: 'Crédito Transporte', valor: 350.00, tipo: 'credito', categoria: 'Crédito', data: d(24), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: 'Origami' },
      { id: 'tx008', descricao: 'Metrô', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(144), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte', merchant: 'Metrô SP' },
      { id: 'tx009', descricao: 'Farmácia Drogasil', valor: -42.00, tipo: 'debito', categoria: 'Saúde', data: d(168), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde', merchant: 'Drogasil' },
      { id: 'tx010', descricao: 'Crédito Saúde', valor: 450.00, tipo: 'credito', categoria: 'Crédito', data: d(24), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde', merchant: 'Origami' },
    ],
    '7': [
      { id: 'tx001', descricao: 'Padaria Central', valor: -12.50, tipo: 'debito', categoria: 'Alimentação', data: d(2), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Estágio', merchant: 'Padaria Central' },
      { id: 'tx002', descricao: 'Bilhete Único', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(3), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte Estágio', merchant: 'SPTrans' },
      { id: 'tx003', descricao: 'Crédito Alimentação', valor: 400.00, tipo: 'credito', categoria: 'Crédito', data: d(120), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Estágio', merchant: 'Origami' },
      { id: 'tx004', descricao: 'Crédito Transporte', valor: 200.00, tipo: 'credito', categoria: 'Crédito', data: d(120), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte Estágio', merchant: 'Origami' },
      { id: 'tx005', descricao: 'McDonald\'s', valor: -24.90, tipo: 'debito', categoria: 'Alimentação', data: d(24), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Estágio', merchant: 'McDonald\'s' },
      { id: 'tx006', descricao: 'Bilhete Único', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(27), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte Estágio', merchant: 'SPTrans' },
      { id: 'tx007', descricao: 'iFood — Lanche', valor: -18.90, tipo: 'debito', categoria: 'Alimentação', data: d(48), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Estágio', merchant: 'iFood' },
      { id: 'tx008', descricao: 'Bilhete Único', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(51), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte Estágio', merchant: 'SPTrans' },
      { id: 'tx009', descricao: 'Padaria Real', valor: -15.20, tipo: 'debito', categoria: 'Alimentação', data: d(72), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Estágio', merchant: 'Padaria Real' },
      { id: 'tx010', descricao: 'Metrô', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(75), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte Estágio', merchant: 'Metrô SP' },
      { id: 'tx011', descricao: 'Bob\'s', valor: -22.90, tipo: 'debito', categoria: 'Alimentação', data: d(96), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Estágio', merchant: 'Bob\'s' },
      { id: 'tx012', descricao: 'Bilhete Único', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(99), status: 'aprovada', walletId: 'w2', walletNome: 'Transporte Estágio', merchant: 'SPTrans' },
    ],
    '8': [
      { id: 'tx001', descricao: 'D.O.M. Restaurante', valor: -580.00, tipo: 'debito', categoria: 'Refeição Executiva', data: d(2), status: 'aprovada', walletId: 'w2', walletNome: 'Refeição Executiva', merchant: 'D.O.M.' },
      { id: 'tx002', descricao: 'Uber Black', valor: -85.00, tipo: 'debito', categoria: 'Transporte', data: d(4), status: 'aprovada', walletId: 'w3', walletNome: 'Transporte Executivo', merchant: 'Uber' },
      { id: 'tx003', descricao: 'INSPER MBA — parcela 1/10', valor: -450.00, tipo: 'debito', categoria: 'Educação', data: d(72), status: 'aprovada', walletId: 'w4', walletNome: 'Educação Continuada', merchant: 'INSPER' },
      { id: 'tx004', descricao: 'Restaurante Fasano — almoço executivo', valor: -320.00, tipo: 'debito', categoria: 'Refeição Executiva', data: d(48), status: 'aprovada', walletId: 'w2', walletNome: 'Refeição Executiva', merchant: 'Fasano' },
      { id: 'tx005', descricao: 'Apple Store — iPad Pro', valor: -899.00, tipo: 'debito', categoria: 'Home Office', data: d(96), status: 'aprovada', walletId: 'w5', walletNome: 'Home Office Premium', merchant: 'Apple' },
      { id: 'tx006', descricao: 'Crédito Mensal Geral', valor: 8000.00, tipo: 'credito', categoria: 'Crédito', data: d(1), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Premium', merchant: 'Origami' },
      { id: 'tx007', descricao: 'Uber Black', valor: -120.00, tipo: 'debito', categoria: 'Transporte', data: d(24), status: 'aprovada', walletId: 'w3', walletNome: 'Transporte Executivo', merchant: 'Uber' },
      { id: 'tx008', descricao: 'Restaurante Jun Sakamoto', valor: -450.00, tipo: 'debito', categoria: 'Refeição Executiva', data: d(120), status: 'aprovada', walletId: 'w2', walletNome: 'Refeição Executiva', merchant: 'Jun Sakamoto' },
      { id: 'tx009', descricao: 'Smart Fit — Personal', valor: -250.00, tipo: 'debito', categoria: 'Saúde', data: d(144), status: 'aprovada', walletId: 'w6', walletNome: 'Saúde & Bem-estar', merchant: 'Smart Fit' },
      { id: 'tx010', descricao: 'Cinemark IMAX', valor: -80.00, tipo: 'debito', categoria: 'Cultura', data: d(168), status: 'aprovada', walletId: 'w7', walletNome: 'Cultura & Lazer', merchant: 'Cinemark' },
      { id: 'tx011', descricao: 'Whole Foods Market', valor: -345.00, tipo: 'debito', categoria: 'Alimentação', data: d(192), status: 'aprovada', walletId: 'w1', walletNome: 'Alimentação Premium', merchant: 'Whole Foods' },
      { id: 'tx012', descricao: 'Uber Black', valor: -95.00, tipo: 'debito', categoria: 'Transporte', data: d(216), status: 'aprovada', walletId: 'w3', walletNome: 'Transporte Executivo', merchant: 'Uber' },
      { id: 'tx013', descricao: 'Netflix + Disney+', valor: -75.80, tipo: 'debito', categoria: 'Cultura', data: d(240), status: 'aprovada', walletId: 'w7', walletNome: 'Cultura & Lazer', merchant: 'Netflix' },
      { id: 'tx014', descricao: 'Restaurante Mani', valor: -390.00, tipo: 'debito', categoria: 'Refeição Executiva', data: d(264), status: 'aprovada', walletId: 'w2', walletNome: 'Refeição Executiva', merchant: 'Mani' },
      { id: 'tx015', descricao: 'Estacionamento Valet', valor: -45.00, tipo: 'debito', categoria: 'Transporte', data: d(288), status: 'aprovada', walletId: 'w3', walletNome: 'Transporte Executivo', merchant: 'Valet' },
    ],
    '9': [
      { id: 'tx001', descricao: 'Drogasil — estorno', valor: 145.30, tipo: 'credito', categoria: 'Estorno', data: d(48), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde', merchant: 'Drogasil' },
      { id: 'tx002', descricao: 'Livraria Jurídica', valor: -89.90, tipo: 'debito', categoria: 'Flexível', data: d(24), status: 'aprovada', walletId: 'w2', walletNome: 'Flexível Jurídico', merchant: 'Livraria Jurídica' },
      { id: 'tx003', descricao: 'Restaurante Mocotó', valor: -75.00, tipo: 'debito', categoria: 'Refeição', data: d(72), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Mocotó' },
      { id: 'tx004', descricao: 'Crédito Refeição', valor: 500.00, tipo: 'credito', categoria: 'Crédito', data: d(120), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'Origami' },
      { id: 'tx005', descricao: 'Crédito Flexível Jurídico', valor: 600.00, tipo: 'credito', categoria: 'Crédito', data: d(120), status: 'aprovada', walletId: 'w2', walletNome: 'Flexível Jurídico', merchant: 'Origami' },
      { id: 'tx006', descricao: 'Farmácia São Paulo', valor: -56.80, tipo: 'debito', categoria: 'Saúde', data: d(96), status: 'aprovada', walletId: 'w3', walletNome: 'Saúde', merchant: 'Farmácia São Paulo' },
      { id: 'tx007', descricao: 'Curso OAB Atualização', valor: -350.00, tipo: 'debito', categoria: 'Flexível', data: d(168), status: 'aprovada', walletId: 'w2', walletNome: 'Flexível Jurídico', merchant: 'OAB' },
      { id: 'tx008', descricao: 'iFood Delivery', valor: -45.90, tipo: 'debito', categoria: 'Refeição', data: d(144), status: 'aprovada', walletId: 'w1', walletNome: 'Refeição', merchant: 'iFood' },
    ],
    '10': [],
    '11': [
      { id: 'tx001', descricao: 'Lojas Renner — parcela 1/5', valor: -77.94, tipo: 'debito', categoria: 'Flexível', data: d(48), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível', merchant: 'Lojas Renner' },
      { id: 'tx002', descricao: 'Restaurante Popular', valor: -15.00, tipo: 'debito', categoria: 'Refeição', data: d(3), status: 'aprovada', walletId: 'w2', walletNome: 'Refeição', merchant: 'Restaurante Popular' },
      { id: 'tx003', descricao: 'Bilhete Único', valor: -4.40, tipo: 'debito', categoria: 'Transporte', data: d(4), status: 'aprovada', walletId: 'w3', walletNome: 'Transporte', merchant: 'SPTrans' },
      { id: 'tx004', descricao: 'Crédito Flexível', valor: 400.00, tipo: 'credito', categoria: 'Crédito', data: d(120), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível', merchant: 'Origami' },
      { id: 'tx005', descricao: 'Crédito Refeição', valor: 500.00, tipo: 'credito', categoria: 'Crédito', data: d(120), status: 'aprovada', walletId: 'w2', walletNome: 'Refeição', merchant: 'Origami' },
      { id: 'tx006', descricao: 'Crédito Transporte', valor: 250.00, tipo: 'credito', categoria: 'Crédito', data: d(120), status: 'aprovada', walletId: 'w3', walletNome: 'Transporte', merchant: 'Origami' },
      { id: 'tx007', descricao: 'Subway', valor: -18.90, tipo: 'debito', categoria: 'Refeição', data: d(24), status: 'aprovada', walletId: 'w2', walletNome: 'Refeição', merchant: 'Subway' },
      { id: 'tx008', descricao: 'Lojas Renner — parcela 2/5', valor: -77.94, tipo: 'debito', categoria: 'Flexível', data: d(720), status: 'aprovada', walletId: 'w1', walletNome: 'Flexível', merchant: 'Lojas Renner' },
    ],
    '12': [],
  }
}

// ─── Notifications by User (20+ across users) ──────────────────────────────
export function buildSeedNotifications() {
  return {
    '1': [
      { id: 'n1', tipo: 'credito', titulo: 'Crédito recebido!', mensagem: 'Seu benefício de Alimentação de R$ 600,00 foi creditado na carteira Refeição/Alimentação.', data: d(1), lida: false, actionUrl: '/wallets/w3' },
      { id: 'n2', tipo: 'pagamento', titulo: 'Compra aprovada', mensagem: 'Pagamento de R$ 42,90 no IKD Restaurante realizado com sucesso.', data: d(2), lida: true, actionUrl: '/transactions/tx001' },
      { id: 'n3', tipo: 'pagamento', titulo: 'Uber - viagem finalizada', mensagem: 'Débito de R$ 18,70 na carteira Transporte — Uber Trip.', data: d(3), lida: true, actionUrl: null },
      { id: 'n4', tipo: 'sistema', titulo: 'Novo cartão virtual disponível', mensagem: 'Você pode criar um cartão virtual para compras online com segurança extra.', data: d(24), lida: false, actionUrl: '/cards' },
      { id: 'n5', tipo: 'promocao', titulo: '20% OFF em farmácias parceiras', mensagem: 'Use seu cartão Origami em farmácias parceiras e ganhe 20% de desconto até 30/06.', data: d(48), lida: false, actionUrl: '/partners?category=farmacia' },
      { id: 'n6', tipo: 'credito', titulo: 'Crédito de Transporte', mensagem: 'Seu benefício de Transporte de R$ 400,00 foi creditado.', data: d(72), lida: true, actionUrl: null },
      { id: 'n7', tipo: 'pagamento', titulo: 'Compra parcelada aprovada', mensagem: 'Amazon.com.br — R$ 129,90 em 3x de R$ 43,30 na carteira Cultura.', data: d(96), lida: true, actionUrl: null },
      { id: 'n8', tipo: 'sistema', titulo: 'Atualização de segurança', mensagem: 'Atualizamos nossas políticas de privacidade. Confira as mudanças na aba Segurança.', data: d(120), lida: true, actionUrl: '/security' },
      { id: 'n9', tipo: 'promocao', titulo: 'Cashback em streaming!', mensagem: 'Pague Netflix e Spotify com a carteira Cultura e ganhe 10% de cashback.', data: d(168), lida: true, actionUrl: '/vouchers' },
      { id: 'n10', tipo: 'sistema', titulo: 'Extrato disponível', mensagem: 'O extrato do mês anterior já está disponível para download.', data: d(240), lida: true, actionUrl: '/statement' },
    ],
    '2': [
      { id: 'n1', tipo: 'credito', titulo: 'Crédito recebido!', mensagem: 'Seu benefício de Refeição de R$ 600,00 foi creditado.', data: d(2), lida: false },
      { id: 'n2', tipo: 'pagamento', titulo: 'Compra aprovada', mensagem: 'Pagamento de R$ 89,00 no Restaurante Madero realizado com sucesso.', data: d(3), lida: true },
      { id: 'n3', tipo: 'sistema', titulo: 'Bem-vinda ao Origami!', mensagem: 'Confira suas carteiras e benefícios disponíveis na tela principal.', data: d(24), lida: true },
      { id: 'n4', tipo: 'promocao', titulo: 'Dia das Mães — 15% OFF', mensagem: 'Aproveite desconto exclusivo em restaurantes parceiros até 12/05.', data: d(72), lida: false },
      { id: 'n5', tipo: 'credito', titulo: 'Crédito de Saúde', mensagem: 'R$ 300,00 creditados na carteira Saúde e Bem-estar.', data: d(120), lida: true },
      { id: 'n6', tipo: 'sistema', titulo: 'Política de benefícios atualizada', mensagem: 'A Indústria ABC atualizou as regras de uso. Confira os detalhes.', data: d(192), lida: true },
    ],
    '3': [
      { id: 'n1', tipo: 'credito', titulo: 'Crédito recebido!', mensagem: 'Seu benefício de Alimentação de R$ 700,00 foi creditado.', data: d(4), lida: false },
      { id: 'n2', tipo: 'pagamento', titulo: 'Compra aprovada', mensagem: 'Pagamento de R$ 387,90 no Assaí Atacadista.', data: d(5), lida: true },
      { id: 'n3', tipo: 'credito', titulo: 'Crédito de Transporte', mensagem: 'R$ 300,00 creditados na carteira Transporte.', data: d(24), lida: true },
      { id: 'n4', tipo: 'promocao', titulo: 'Economize no supermercado!', mensagem: 'Parceiros atacadistas com até 25% OFF para beneficiários Origami.', data: d(120), lida: false },
    ],
    '4': [
      { id: 'n1', tipo: 'sistema', titulo: 'Bem-vindo ao Origami!', mensagem: 'Carlos, seus benefícios já estão disponíveis! Configure sua senha e comece a usar.', data: d(0.5), lida: false },
      { id: 'n2', tipo: 'credito', titulo: 'Créditos iniciais disponíveis', mensagem: 'R$ 2.050,00 em créditos foram depositados em suas 5 carteiras de benefício.', data: d(1), lida: false },
      { id: 'n3', tipo: 'sistema', titulo: 'Seu cartão físico está a caminho', mensagem: 'O cartão Visa final 8890 será entregue em até 10 dias úteis.', data: d(2), lida: false },
      { id: 'n4', tipo: 'sistema', titulo: 'Cartão virtual já disponível', mensagem: 'Enquanto aguarda o físico, use seu cartão virtual Mastercard final 1122.', data: d(3), lida: false },
      { id: 'n5', tipo: 'promocao', titulo: 'Conheça nossos parceiros', mensagem: 'Mais de 500 estabelecimentos cadastrados com descontos exclusivos para você.', data: d(4), lida: false },
    ],
    '5': [
      { id: 'n1', tipo: 'sistema', titulo: 'Alerta de segurança', mensagem: 'Detectamos 2 tentativas de login incorretas na sua conta. Se não foi você, altere sua senha.', data: d(1), lida: false },
      { id: 'n2', tipo: 'credito', titulo: 'Crédito recebido!', mensagem: 'R$ 800,00 creditados na carteira Flexível Premium.', data: d(6), lida: false },
      { id: 'n3', tipo: 'pagamento', titulo: 'Compra aprovada', mensagem: 'Pagamento de R$ 289,90 na Zara Fashion.', data: d(7), lida: true },
      { id: 'n4', tipo: 'promocao', titulo: 'Black Friday antecipada!', mensagem: 'Até 30% OFF em lojas parceiras nesta semana.', data: d(72), lida: false },
    ],
    '6': [
      { id: 'n1', tipo: 'sistema', titulo: 'Conta bloqueada', mensagem: 'Sua conta foi bloqueada por excesso de tentativas incorretas. Contate o RH.', data: d(0.2), lida: false },
      { id: 'n2', tipo: 'sistema', titulo: 'Alerta de segurança', mensagem: 'Detectamos 6 tentativas de login incorretas. Sua conta foi bloqueada definitivamente.', data: d(0.3), lida: false },
      { id: 'n3', tipo: 'credito', titulo: 'Crédito recebido', mensagem: 'R$ 1.500,00 em créditos mensais distribuídos nas 4 carteiras.', data: d(24), lida: true },
      { id: 'n4', tipo: 'pagamento', titulo: 'Compra aprovada', mensagem: 'R$ 280,00 no Restaurante Fasano — Refeição.', data: d(24), lida: true },
    ],
    '7': [
      { id: 'n1', tipo: 'sistema', titulo: 'Saldo baixo!', mensagem: 'Sua carteira Alimentação Estágio está com apenas R$ 23,50. O próximo crédito será em 5 dias.', data: d(1), lida: false },
      { id: 'n2', tipo: 'sistema', titulo: 'Saldo crítico de Transporte', mensagem: 'Restam apenas R$ 8,20 na carteira Transporte Estágio — insuficiente para 1 recarga.', data: d(2), lida: false },
      { id: 'n3', tipo: 'credito', titulo: 'Crédito recebido!', mensagem: 'R$ 400,00 creditados na carteira Alimentação Estágio.', data: d(120), lida: true },
      { id: 'n4', tipo: 'promocao', titulo: 'Desconto em lanchonetes!', mensagem: 'Apresente seu cartão Origami em lanchonetes parceiras e ganhe 10% de desconto.', data: d(72), lida: false },
    ],
    '8': [
      { id: 'n1', tipo: 'credito', titulo: 'Créditos mensais depositados', mensagem: 'R$ 8.000,00 em créditos distribuídos nas suas 7 carteiras de benefício.', data: d(1), lida: false },
      { id: 'n2', tipo: 'pagamento', titulo: 'Compra aprovada — D.O.M.', mensagem: 'Pagamento de R$ 580,00 no D.O.M. Restaurante realizado com sucesso.', data: d(2), lida: true },
      { id: 'n3', tipo: 'pagamento', titulo: 'MBA INSPER — parcela 1/10', mensagem: 'Débito de R$ 450,00 na carteira Educação Continuada — INSPER MBA Executivo.', data: d(72), lida: true },
      { id: 'n4', tipo: 'sistema', titulo: 'Novo cartão virtual disponível', mensagem: 'Cartão virtual Elo final 5500 ativado para compras online seguras.', data: d(48), lida: false },
      { id: 'n5', tipo: 'promocao', titulo: 'Experiência VIP Fasano', mensagem: 'Clientes premium têm acesso exclusivo ao menu degustação do Fasano com 15% OFF.', data: d(120), lida: false },
    ],
    '9': [
      { id: 'n1', tipo: 'sistema', titulo: 'Conta temporariamente bloqueada', mensagem: 'Detectamos 4 tentativas incorretas de login. Sua conta está bloqueada por 2 horas.', data: d(0.1), lida: false },
      { id: 'n2', tipo: 'sistema', titulo: 'Alerta de segurança', mensagem: 'Múltiplas tentativas de acesso detectadas. Se não foi você, entre em contato com o suporte.', data: d(0.2), lida: false },
      { id: 'n3', tipo: 'sistema', titulo: 'Cartão físico bloqueado', mensagem: 'Por motivos de segurança, seu cartão Mastercard final 6688 foi bloqueado temporariamente.', data: d(1), lida: false },
      { id: 'n4', tipo: 'pagamento', titulo: 'Estorno processado', mensagem: 'Estorno de R$ 145,30 (Drogasil — cobrança duplicada) processado na carteira Saúde.', data: d(48), lida: false },
    ],
    '10': [
      { id: 'n1', tipo: 'sistema', titulo: 'Bem-vindo ao Origami!', mensagem: 'Thiago, seus benefícios de trabalho remoto já estão disponíveis! Configure sua senha para começar.', data: d(0.3), lida: false },
      { id: 'n2', tipo: 'credito', titulo: 'Créditos iniciais disponíveis', mensagem: 'R$ 2.350,00 em créditos foram depositados nas suas 4 carteiras de benefício.', data: d(1), lida: false },
      { id: 'n3', tipo: 'sistema', titulo: 'Cartões a caminho', mensagem: 'Seus 2 cartões estão sendo preparados. Enquanto isso, use o app para consultar saldos.', data: d(2), lida: false },
      { id: 'n4', tipo: 'promocao', titulo: 'Certificações Cloud com desconto', mensagem: 'Use a carteira Educação Tech para certificações AWS/GCP com 30% de desconto corporativo.', data: d(4), lida: false },
    ],
    '11': [
      { id: 'n1', tipo: 'sistema', titulo: 'Saldo crítico — Transporte', mensagem: 'Restam apenas R$ 3,50 na carteira Transporte. Insuficiente para Uber ou bilhete único.', data: d(1), lida: false },
      { id: 'n2', tipo: 'sistema', titulo: 'Saldo baixo — Flexível', mensagem: 'Sua carteira Flexível está com R$ 12,30. Você tem 4 parcelas pendentes comprometendo o saldo futuro.', data: d(2), lida: false },
      { id: 'n3', tipo: 'pagamento', titulo: 'Parcela Renner 1/5', mensagem: 'Débito de R$ 77,94 na carteira Flexível — Lojas Renner parcela 1 de 5.', data: d(48), lida: true },
      { id: 'n4', tipo: 'sistema', titulo: 'Cartão virtual bloqueado', mensagem: 'Seu cartão Elo virtual final 8833 foi bloqueado. Para desbloquear, acesse Cartões.', data: d(72), lida: false },
      { id: 'n5', tipo: 'credito', titulo: 'Crédito recebido!', mensagem: 'R$ 1.200,00 creditados nas suas 3 carteiras. Atenção: parcelas futuras já comprometem R$ 311,76.', data: d(120), lida: true },
    ],
    '12': [
      { id: 'n1', tipo: 'sistema', titulo: 'Conta encerrada', mensagem: 'Sua conta foi encerrada após o desligamento do Comércio XYZ. Cartões cancelados.', data: d(1080), lida: false },
      { id: 'n2', tipo: 'sistema', titulo: 'Cartões cancelados', mensagem: 'Todos os seus cartões (Visa 8844, Mastercard 6622) foram cancelados definitivamente.', data: d(1080), lida: false },
      { id: 'n3', tipo: 'pagamento', titulo: 'Saldos estornados', mensagem: 'Os saldos restantes foram estornados à empresa.', data: d(1080), lida: false },
      { id: 'n4', tipo: 'sistema', titulo: 'Acesso somente leitura', mensagem: 'Você pode consultar seu histórico de transações por até 90 dias após o desligamento.', data: d(1056), lida: true },
    ],
  }
}

// ─── Sessions by User ────────────────────────────────────────────────────────
export function buildSeedSessions() {
  return {
    '1': [
      { id: 'sess-1', deviceName: 'Samsung Galaxy A13', deviceType: 'Android', location: 'São Paulo, SP', lastActive: NOW(), isCurrent: true },
      { id: 'sess-2', deviceName: 'Chrome - Windows', deviceType: 'Web', location: 'São Paulo, SP', lastActive: d(2), isCurrent: false },
      { id: 'sess-3', deviceName: 'iPhone 14', deviceType: 'iOS', location: 'Rio de Janeiro, RJ', lastActive: dDays(3), isCurrent: false },
    ],
  }
}

// ─── Security Activity by User ──────────────────────────────────────────────
export function buildSeedSecurityActivity() {
  return {
    '1': [
      { id: 'sec-1', descricao: 'Login realizado com sucesso', dispositivo: 'Samsung Galaxy A13', data: NOW(), tipo: 'login' },
      { id: 'sec-2', descricao: 'Senha alterada', dispositivo: 'Chrome - Windows', data: d(24), tipo: 'password_change' },
      { id: 'sec-3', descricao: 'Biometria ativada', dispositivo: 'Samsung Galaxy A13', data: dDays(5), tipo: 'biometric' },
      { id: 'sec-4', descricao: 'Sessão encerrada remotamente', dispositivo: 'iPhone 14', data: dDays(7), tipo: 'session_terminate' },
      { id: 'sec-5', descricao: 'Tentativa de login com senha incorreta', dispositivo: 'Desconhecido', data: dDays(10), tipo: 'failed_login' },
    ],
  }
}

// ─── Partners (26) — at least 2 per category ────────────────────────────────
export const SEED_PARTNERS = [
  // restaurante (3)
  { id: 'p1', name: 'IKD Restaurante', category: 'restaurante', address: 'Av. Paulista, 1578 — Bela Vista, SP', distance: '0.2 km', rating: 4.5, acceptedBenefits: ['refeicao'], discount: '10% no almoço', isOpen: true, lat: -23.564, lng: -46.651, description: 'Restaurante japonês com buffet por quilo no almoço.', phone: '(11) 3253-1578', hours: 'Seg–Sex 11h–15h, 18h–22h | Sáb–Dom 12h–22h' },
  { id: 'p9', name: 'iFood Restaurante Parceiro', category: 'restaurante', address: 'Av. Brigadeiro Luís Antônio, 500', distance: '1.5 km', rating: 4.3, acceptedBenefits: ['refeicao','flexivel'], discount: 'Frete grátis', isOpen: true, lat: -23.576, lng: -46.658, description: 'Culinária contemporânea brasileira.', phone: '(11) 3253-0500', hours: 'Seg–Sex 11h–22h | Sáb–Dom 12h–22h' },
  { id: 'p14', name: 'Restaurante Madero', category: 'restaurante', address: 'R. Oscar Freire, 700 — Jardins, SP', distance: '1.8 km', rating: 4.6, acceptedBenefits: ['refeicao','flexivel'], discount: null, isOpen: false, lat: -23.563, lng: -46.669, description: 'Hambúrgueres artesanais e pratos autorais.', phone: '(11) 3062-0700', hours: 'Seg–Sex 12h–23h | Sáb–Dom 12h–00h' },

  // farmacia (3)
  { id: 'p2', name: 'Drogaria Raia', category: 'farmacia', address: 'R. Augusta, 723 — Consolação, SP', distance: '0.5 km', rating: 4.2, acceptedBenefits: ['saude','flexivel'], discount: null, isOpen: true, lat: -23.561, lng: -46.657, description: 'Farmácia com manipulação e convênio médico.', phone: '(11) 3214-0723', hours: 'Todos os dias 07h–22h' },
  { id: 'p3', name: 'Pão de Açúcar', category: 'supermercado', address: 'Av. Paulista, 2064 — Jardim Paulista, SP', distance: '0.8 km', rating: 4.3, acceptedBenefits: ['alimentacao','flexivel'], discount: '5% em produtos selecionados', isOpen: true, lat: -23.558, lng: -46.662, description: 'Supermercado premium com hortifruti orgânico e padaria.', phone: '(11) 3064-2064', hours: 'Todos os dias 07h–23h' },
  { id: 'p4', name: 'Smart Fit', category: 'academia', address: 'Av. Paulista, 807 — Bela Vista, SP', distance: '0.4 km', rating: 4.1, acceptedBenefits: ['saude','flexivel'], discount: 'Matrícula grátis', isOpen: true, lat: -23.570, lng: -46.648, description: 'Academia com musculação, cardio e aulas coletivas.', phone: '(11) 4000-0807', hours: 'Seg–Sex 06h–23h | Sáb–Dom 08h–20h' },
  { id: 'p5', name: 'Cinemark Paulista', category: 'cinema', address: 'Al. Santos, 1000 — Jardim Paulista, SP', distance: '1.1 km', rating: 4.4, acceptedBenefits: ['cultura','flexivel'], discount: '50% na 2ª entrada', isOpen: true, lat: -23.575, lng: -46.670, description: 'Multiplex com salas 3D e XD. Estacionamento no local.', phone: '(11) 3266-1000', hours: 'Todos os dias 12h–23h' },
  { id: 'p6', name: 'Posto Ipiranga', category: 'posto', address: 'R. da Consolação, 222 — Consolação, SP', distance: '0.6 km', rating: 4.0, acceptedBenefits: ['flexivel','transporte'], discount: null, isOpen: true, lat: -23.567, lng: -46.655, description: 'Posto com loja de conveniência am/pm 24h.', phone: '(11) 3214-0222', hours: 'Todos os dias 24h' },
  { id: 'p7', name: 'Livraria Cultura', category: 'livraria', address: 'Av. Paulista, 2073 — Consolação, SP', distance: '0.9 km', rating: 4.6, acceptedBenefits: ['cultura','flexivel'], discount: '10% em livros', isOpen: true, lat: -23.556, lng: -46.664, description: 'Maior livraria da Av. Paulista com cafeteria interna.', phone: '(11) 3170-4033', hours: 'Seg–Sáb 09h–22h | Dom 11h–20h' },
  { id: 'p8', name: 'Bob\'s Paulista', category: 'lanchonete', address: 'Av. Paulista, 1106 — Bela Vista, SP', distance: '0.3 km', rating: 3.9, acceptedBenefits: ['refeicao','alimentacao','flexivel'], discount: 'Combo especial', isOpen: true, lat: -23.565, lng: -46.652, description: 'Fast food clássico com hambúrgueres e milkshakes.', phone: '(11) 3253-1106', hours: 'Todos os dias 10h–23h' },
  { id: 'p9', name: 'iFood Restaurante Parceiro', category: 'restaurante', address: 'Av. Brigadeiro Luís Antônio, 500', distance: '1.5 km', rating: 4.3, acceptedBenefits: ['refeicao','flexivel'], discount: 'Frete grátis', isOpen: true, lat: -23.576, lng: -46.658, description: 'Culinária contemporânea brasileira.', phone: '(11) 3253-0500', hours: 'Seg–Sex 11h–22h | Sáb–Dom 12h–22h' },
  { id: 'p10', name: 'Clínica Einstein Paulista', category: 'saude', address: 'Av. Paulista, 1000 — Bela Vista, SP', distance: '0.7 km', rating: 4.8, acceptedBenefits: ['saude'], discount: null, isOpen: true, lat: -23.568, lng: -46.650, description: 'Unidade ambulatorial do Hospital Israelita Albert Einstein.', phone: '(11) 4000-1000', hours: 'Seg–Sex 07h–19h' },
  { id: 'p11', name: 'Alura Cursos', category: 'educacao', address: 'R. Vergueiro, 3185 — Vila Mariana, SP', distance: '3.2 km', rating: 4.7, acceptedBenefits: ['educacao','cultura','flexivel'], discount: '30% corporativo', isOpen: true, lat: -23.588, lng: -46.636, description: 'Plataforma de cursos de tecnologia com mais de 1.000 cursos.', phone: '(11) 4003-0900', hours: 'Online 24h' },
  { id: 'p12', name: 'Localiza Rent a Car', category: 'transporte', address: 'Av. Paulista, 1499 — Bela Vista, SP', distance: '0.6 km', rating: 4.0, acceptedBenefits: ['transporte','flexivel'], discount: '15% em diárias', isOpen: true, lat: -23.563, lng: -46.654, description: 'Locadora de veículos com frota diversificada.', phone: '(11) 3048-1499', hours: 'Seg–Sex 07h–21h | Sáb 08h–17h' },
  { id: 'p13', name: 'Kalunga Papelaria', category: 'papelaria', address: 'R. Augusta, 1050 — Consolação, SP', distance: '0.9 km', rating: 4.1, acceptedBenefits: ['homeoffice','flexivel'], discount: null, isOpen: false, lat: -23.555, lng: -46.660, description: 'Papelaria e informática para escritório e home office.', phone: '(11) 3214-1050', hours: 'Seg–Sex 08h–18h | Sáb 09h–14h' },
]

// ─── Approvals (5) ──────────────────────────────────────────────────────────
export function buildSeedApprovals() {
  return [
    { id: 'appr-001', type: 'balance_request', status: 'pendente', requesterName: 'João Pedro Costa', requesterEmail: 'joao.costa@empresa.com', amount: 500.00, description: 'Pedido de saldo adicional — carteira Refeição', createdAt: dDays(1), decidedAt: null, decidedBy: null, rejectionReason: null },
    { id: 'appr-002', type: 'reimbursement', status: 'pendente', requesterName: 'Fernanda Rocha Barbosa', requesterEmail: 'fernanda.rocha@empresa.com', amount: 89.90, description: 'Reembolso de consulta médica particular', createdAt: dDays(2), decidedAt: null, decidedBy: null, rejectionReason: null },
    { id: 'appr-003', type: 'advance', status: 'aprovado', requesterName: 'Carlos Mendes Ribeiro', requesterEmail: 'carlos.mendes@empresa.com', amount: 800.00, description: 'Adiantamento para viagem de negócios SP-RJ', createdAt: dDays(5), decidedAt: dDays(4), decidedBy: 'Diretor Financeiro', rejectionReason: null },
    { id: 'appr-004', type: 'expense_report', status: 'reprovado', requesterName: 'Ana Souza Lima', requesterEmail: 'ana.lima@empresa.com', amount: 245.30, description: 'Relatório de despesas — Sprint Review Fevereiro', createdAt: dDays(8), decidedAt: dDays(7), decidedBy: 'Gerente de Projetos', rejectionReason: 'Comprovantes faltando' },
    { id: 'appr-005', type: 'balance_request', status: 'pendente', requesterName: 'Thiago Nascimento', requesterEmail: 'thiago.nasc@empresa.com', amount: 200.00, description: 'Pedido de saldo — carteira Saúde', createdAt: dDays(3), decidedAt: null, decidedBy: null, rejectionReason: null },
  ]
}

// ─── Disputes (5) ───────────────────────────────────────────────────────────
export function buildSeedDisputes() {
  return [
    { id: 'disp-001', transactionId: 'tx002', description: 'Viagem cancelada mas débito persistiu', amount: 18.70, merchantName: 'Uber', status: 'em_analise', date: dDays(2), events: [{ date: dDays(2), description: 'Contestação aberta', status: 'aberta' }, { date: dDays(1), description: 'Em análise pelo time financeiro', status: 'em_analise' }] },
    { id: 'disp-002', transactionId: 'tx005', description: 'Cobrança duplicada na farmácia', amount: 64.50, merchantName: 'iFood', status: 'aberta', date: dDays(7), events: [{ date: dDays(7), description: 'Contestação aberta', status: 'aberta' }] },
    { id: 'disp-003', transactionId: 'tx006', description: 'Valor cobrado diferente do informado', amount: 120.00, merchantName: 'Posto Shell', status: 'negada', date: dDays(14), events: [{ date: dDays(14), description: 'Contestação aberta', status: 'aberta' }, { date: dDays(12), description: 'Em análise', status: 'em_analise' }, { date: dDays(10), description: 'Contestação negada — transação válida', status: 'negada' }] },
    { id: 'disp-004', transactionId: 'tx007', description: 'Produto não recebido', amount: 89.90, merchantName: 'Amazon', status: 'em_analise', date: dDays(5), events: [{ date: dDays(5), description: 'Contestação aberta', status: 'aberta' }, { date: dDays(3), description: 'Aguardando documentos do estabelecimento', status: 'em_analise' }] },
    { id: 'disp-005', transactionId: 'tx009', description: 'Cobrança após cancelamento de plano', amount: 99.90, merchantName: 'Smart Fit', status: 'resolvida', date: dDays(20), events: [{ date: dDays(20), description: 'Contestação aberta', status: 'aberta' }, { date: dDays(18), description: 'Em análise', status: 'em_analise' }, { date: dDays(15), description: 'Estorno aprovado — R$ 99,90', status: 'resolvida' }] },
  ]
}

// ─── Reimbursements (5) ─────────────────────────────────────────────────────
export function buildSeedReimbursements() {
  return [
    { id: 'reimb-001', category: 'Saúde', amount: 89.90, date: dDays(3), description: 'Consulta médica particular', status: 'aguardando', receiptUrl: null, resolvedAt: null },
    { id: 'reimb-002', category: 'Home Office', amount: 350.00, date: dDays(8), description: 'Cadeira ergonômica home office', status: 'em_analise', receiptUrl: 'https://mock.origami.com.br/receipts/reimb-002.pdf', resolvedAt: null },
    { id: 'reimb-003', category: 'Alimentação', amount: 42.50, date: dDays(15), description: 'Kit lanche reunião remota', status: 'aprovado', receiptUrl: 'https://mock.origami.com.br/receipts/reimb-003.pdf', resolvedAt: dDays(13) },
    { id: 'reimb-004', category: 'Educação', amount: 120.00, date: dDays(20), description: 'Livro técnico — Clean Code', status: 'pago', receiptUrl: 'https://mock.origami.com.br/receipts/reimb-004.pdf', resolvedAt: dDays(18) },
    { id: 'reimb-005', category: 'Saúde', amount: 75.00, date: dDays(30), description: 'Óculos de grau', status: 'rejeitado', receiptUrl: null, resolvedAt: dDays(28) },
    // All categories coverage with receipt URLs
    { id: 'reimb-006', category: 'Transporte', amount: 156.00, date: dDays(5), description: 'Passagem aérea SP-RJ reunião cliente', status: 'aprovado', receiptUrl: 'https://mock.origami.com.br/receipts/reimb-006.pdf', resolvedAt: dDays(3) },
    { id: 'reimb-007', category: 'Outros', amount: 89.00, date: dDays(12), description: 'Material de apresentação para evento', status: 'aguardando', receiptUrl: 'https://mock.origami.com.br/receipts/reimb-007.pdf', resolvedAt: null },
  ]
}

// ─── Balance Requests (5) ───────────────────────────────────────────────────
export function buildSeedBalanceRequests() {
  return [
    { id: 'br-001', walletId: 'w3', amount: 500.00, justificativa: 'Início de mês — saldo insuficiente', status: 'aguardando', createdAt: dDays(1), updatedAt: null, approvedBy: null, rejectionReason: null },
    { id: 'br-002', walletId: 'w6', amount: 200.00, justificativa: 'Procedimento cirúrgico emergencial', status: 'aprovado', createdAt: dDays(5), updatedAt: dDays(4), approvedBy: 'Gerente RH', rejectionReason: null },
    { id: 'br-003', walletId: 'w4', amount: 100.00, justificativa: 'Semana de viagens a trabalho SP→RJ', status: 'rejeitado', createdAt: dDays(10), updatedAt: dDays(9), approvedBy: 'Diretor Financeiro', rejectionReason: 'Saldo dentro do limite mensal — não se aplica política de exceção' },
    { id: 'br-004', walletId: 'w1', amount: 300.00, justificativa: 'Evento corporativo — alimentação extra', status: 'aguardando', createdAt: dDays(2), updatedAt: null, approvedBy: null, rejectionReason: null },
    { id: 'br-005', walletId: 'w5', amount: 150.00, justificativa: 'Ingressos para evento cultural da equipe', status: 'aprovado', createdAt: dDays(7), updatedAt: dDays(6), approvedBy: 'Coordenador de Cultura', rejectionReason: null },
  ]
}

// ─── Expenses (4 seed) ──────────────────────────────────────────────────────
export function buildSeedExpenses() {
  return [
    { id: 'exp-001', description: 'Almoço com cliente', amount: 89.90, date: dDays(2), category: 'refeicao', receiptUrl: null, lat: -23.564, lng: -46.651, merchant: 'IKD Restaurante' },
    { id: 'exp-002', description: 'Uber reunião matriz', amount: 32.50, date: dDays(3), category: 'transporte', receiptUrl: null, lat: null, lng: null, merchant: 'Uber' },
    { id: 'exp-003', description: 'Material escritório', amount: 45.00, date: dDays(5), category: 'outros', receiptUrl: 'https://mock.origami.com.br/receipts/exp-003.pdf', lat: null, lng: null, merchant: 'Kalunga' },
    { id: 'exp-004', description: 'Jantar equipe sprint', amount: 280.00, date: dDays(7), category: 'refeicao', receiptUrl: null, lat: -23.575, lng: -46.668, merchant: 'Restaurante Madero' },
    // All categories + receipt URL + lat/lng coverage
    { id: 'exp-005', description: 'Consulta oftalmologista', amount: 250.00, date: dDays(4), category: 'saude', receiptUrl: 'https://mock.origami.com.br/receipts/exp-005.pdf', lat: -23.568, lng: -46.650, merchant: 'Clínica Einstein' },
    { id: 'exp-006', description: 'Curso Figma avançado', amount: 149.90, date: dDays(6), category: 'educacao', receiptUrl: 'https://mock.origami.com.br/receipts/exp-006.pdf', lat: null, lng: null, merchant: 'Alura' },
    { id: 'exp-007', description: 'Cadeira ergonômica', amount: 850.00, date: dDays(10), category: 'homeoffice', receiptUrl: 'https://mock.origami.com.br/receipts/exp-007.pdf', lat: -23.564, lng: -46.651, merchant: 'Kalunga' },
    { id: 'exp-008', description: 'Supermercado compras semana', amount: 312.40, date: dDays(1), category: 'alimentacao', receiptUrl: 'https://mock.origami.com.br/receipts/exp-008.pdf', lat: -23.558, lng: -46.662, merchant: 'Pão de Açúcar' },
    { id: 'exp-009', description: 'Uber ida e volta reunião', amount: 47.20, date: dDays(3), category: 'transporte', receiptUrl: null, lat: -23.570, lng: -46.648, merchant: 'Uber' },
  ]
}

// ─── Advances (5) ───────────────────────────────────────────────────────────
export function buildSeedAdvances() {
  return [
    { id: 'adv-001', amount: 800.00, reason: 'Viagem de negócios SP-RJ (hotel + passagem)', status: 'aprovado', requestedAt: dDays(5), resolvedAt: dDays(4), approverNote: 'Aprovado. Apresentar comprovantes em até 5 dias.' },
    { id: 'adv-002', amount: 200.00, reason: 'Material de escritório home office', status: 'pendente', requestedAt: dDays(1), resolvedAt: null, approverNote: null },
    { id: 'adv-003', amount: 1500.00, reason: 'Equipamento — notebook para trabalho remoto', status: 'negado', requestedAt: dDays(10), resolvedAt: dDays(9), approverNote: 'Negado. Política de TI cobre apenas periféricos.' },
    { id: 'adv-004', amount: 350.00, reason: 'Hospedagem conferência tech', status: 'pendente', requestedAt: dDays(2), resolvedAt: null, approverNote: null },
    { id: 'adv-005', amount: 500.00, reason: 'Aluguel carro para visita a clientes', status: 'aprovado', requestedAt: dDays(12), resolvedAt: dDays(11), approverNote: 'Aprovado conforme política de viagens.' },
  ]
}

// ─── Reports (3) ────────────────────────────────────────────────────────────
export function buildSeedReports() {
  return [
    { id: 'rep-001', title: 'Viagem SP-RJ Março', period: '2026-03', totalAmount: 1122.40, expenseCount: 3, status: 'aprovado', createdAt: dDays(10), submittedAt: dDays(9), expenseIds: ['exp-001','exp-002','exp-003'] },
    { id: 'rep-002', title: 'Sprint Review Fevereiro', period: '2026-02', totalAmount: 325.30, expenseCount: 2, status: 'reprovado', createdAt: dDays(20), submittedAt: dDays(19), expenseIds: ['exp-004'] },
    { id: 'rep-003', title: 'Material Home Office Jan', period: '2026-01', totalAmount: 895.00, expenseCount: 2, status: 'rascunho', createdAt: dDays(2), submittedAt: null, expenseIds: ['exp-003','exp-007'] },
  ]
}

// ─── Vouchers: Available (5) + Purchased (5) ────────────────────────────────
export function buildSeedAvailableVouchers() {
  return [
    { id: 'vou-001', merchantName: 'iFood', description: 'R$ 30 em pedidos acima de R$ 50', faceValue: 30.00, salePrice: 22.00, category: 'alimentacao', logoUrl: null, expiresAt: dFuture(30), status: 'available', code: null },
    { id: 'vou-002', merchantName: 'Cinemark', description: 'Ingresso 2D qualquer sessão', faceValue: 35.00, salePrice: 25.00, category: 'entretenimento', logoUrl: null, expiresAt: dFuture(15), status: 'available', code: null },
    { id: 'vou-003', merchantName: 'Drogaria Raia', description: '20% OFF em vitaminas e suplementos', faceValue: 50.00, salePrice: 40.00, category: 'saude', logoUrl: null, expiresAt: dFuture(7), status: 'available', code: null },
    { id: 'vou-004', merchantName: 'Uber', description: 'R$ 20 em créditos de viagem', faceValue: 20.00, salePrice: 15.00, category: 'transporte', logoUrl: null, expiresAt: dFuture(10), status: 'available', code: null },
    { id: 'vou-005', merchantName: 'Amazon', description: 'R$ 50 em compras acima de R$ 150', faceValue: 50.00, salePrice: 35.00, category: 'compras', logoUrl: null, expiresAt: dFuture(20), status: 'available', code: null },
    { id: 'vou-006', merchantName: 'Spotify', description: '3 meses Premium por R$ 9,90', faceValue: 59.70, salePrice: 9.90, category: 'entretenimento', logoUrl: null, expiresAt: dFuture(14), status: 'available', code: null },
    { id: 'vou-007', merchantName: 'Smart Fit', description: '1 mês grátis de academia', faceValue: 99.90, salePrice: 0.00, category: 'saude', logoUrl: null, expiresAt: dFuture(21), status: 'available', code: null },
    { id: 'vou-008', merchantName: 'Livraria Cultura', description: 'R$ 40 em livros', faceValue: 40.00, salePrice: 28.00, category: 'cultura', logoUrl: null, expiresAt: dFuture(25), status: 'available', code: null },
    { id: 'vou-009', merchantName: '99', description: 'R$ 15 em corridas', faceValue: 15.00, salePrice: 10.00, category: 'transporte', logoUrl: null, expiresAt: dFuture(12), status: 'available', code: null },
    { id: 'vou-010', merchantName: 'Rappi', description: 'Frete grátis em 5 pedidos', faceValue: 25.00, salePrice: 12.00, category: 'alimentacao', logoUrl: null, expiresAt: dFuture(18), status: 'available', code: null },
  ]
}

export function buildSeedMyVouchers() {
  return [
    { id: 'vou-my-001', merchantName: 'Rappi', description: '15% OFF no primeiro pedido', faceValue: 40.00, salePrice: 0.00, category: 'alimentacao', logoUrl: null, expiresAt: dFuture(5), status: 'purchased', code: 'RAPPI15MOCK' },
    { id: 'vou-my-002', merchantName: 'iFood', description: 'R$ 30 em pedidos acima de R$ 50', faceValue: 30.00, salePrice: 22.00, category: 'alimentacao', logoUrl: null, expiresAt: dFuture(20), status: 'purchased', code: 'IFOOD30-XK9M2' },
    { id: 'vou-my-003', merchantName: 'Cinemark', description: 'Ingresso 2D qualquer sessão', faceValue: 35.00, salePrice: 25.00, category: 'entretenimento', logoUrl: null, expiresAt: dDays(5), status: 'expired', code: 'CINE-EXPIRED-001' },
    { id: 'vou-my-004', merchantName: 'Smart Fit', description: '1 mês grátis de academia', faceValue: 99.90, salePrice: 0.00, category: 'saude', logoUrl: null, expiresAt: dFuture(15), status: 'purchased', code: 'SMARTFIT-FREE-2026' },
  ]
}

// ─── Next Deposits by User ──────────────────────────────────────────────────
export function buildSeedNextDeposits() {
  return {
    '1': [
      { walletId: 'w1', amount: 500.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Flexível ACT 2026' },
      { walletId: 'w3', amount: 600.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Refeição/Alimentação' },
      { walletId: 'w4', amount: 400.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Transporte' },
      { walletId: 'w5', amount: 200.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Cultura' },
      { walletId: 'w6', amount: 500.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Saúde' },
    ],
    '2': [
      { walletId: 'w1', amount: 600.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Refeição' },
      { walletId: 'w2', amount: 400.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Flexível' },
      { walletId: 'w3', amount: 300.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Saúde e Bem-estar' },
    ],
    '3': [
      { walletId: 'w1', amount: 700.00, scheduledDate: dFuture(7).substring(0, 10), description: 'Crédito mensal — Alimentação' },
      { walletId: 'w2', amount: 300.00, scheduledDate: dFuture(7).substring(0, 10), description: 'Crédito mensal — Transporte' },
    ],
    '7': [
      { walletId: 'w1', amount: 400.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Alimentação Estágio' },
      { walletId: 'w2', amount: 200.00, scheduledDate: dFuture(5).substring(0, 10), description: 'Crédito mensal — Transporte Estágio' },
    ],
    '11': [
      { walletId: 'w1', amount: 400.00, scheduledDate: dFuture(3).substring(0, 10), description: 'Crédito mensal — Flexível' },
      { walletId: 'w2', amount: 500.00, scheduledDate: dFuture(3).substring(0, 10), description: 'Crédito mensal — Refeição' },
      { walletId: 'w3', amount: 250.00, scheduledDate: dFuture(3).substring(0, 10), description: 'Crédito mensal — Transporte' },
    ],
    '12': [],
  }
}

// ─── Card Deliveries ────────────────────────────────────────────────────────
export function buildSeedCardDeliveries() {
  return {
    'c1': {
      cardId: 'c1',
      status: 'delivered',
      carrier: 'Correios',
      trackingCode: 'BR123456789BR',
      estimatedDate: dDays(5).substring(0, 10),
      deliveryAddress: 'Rua das Flores, 123 — São Paulo, SP',
      events: [
        { description: 'Objeto postado', date: dDays(10), location: 'Barueri, SP' },
        { description: 'Em trânsito para a cidade de destino', date: dDays(8), location: 'São Paulo, SP' },
        { description: 'Objeto saiu para entrega ao destinatário', date: dDays(6), location: 'São Paulo, SP' },
        { description: 'Objeto entregue ao destinatário', date: dDays(5), location: 'São Paulo, SP' },
      ],
    },
    'c4': {
      cardId: 'c4',
      status: 'in_transit',
      carrier: 'Correios',
      trackingCode: 'BR987654321BR',
      estimatedDate: dFuture(3).substring(0, 10),
      deliveryAddress: 'Rua das Flores, 123 — São Paulo, SP',
      events: [
        { description: 'Objeto postado', date: dDays(2), location: 'Barueri, SP' },
        { description: 'Em trânsito para a cidade de destino', date: dDays(1), location: 'Campinas, SP' },
      ],
    },
    'c5': {
      cardId: 'c5',
      status: 'processing',
      carrier: 'Correios',
      trackingCode: '',
      estimatedDate: dFuture(10).substring(0, 10),
      deliveryAddress: 'Rua das Flores, 123 — São Paulo, SP',
      events: [],
    },
  }
}

// ─── KYC Results by User ────────────────────────────────────────────────────
export function buildSeedKycResults() {
  return {
    '1': {
      id: 'kyc-001',
      status: 'approved',
      cpfValid: true,
      documentValid: true,
      certifaceScore: 0.95,
      rejectionReason: null,
      submittedAt: dDays(30),
      reviewedAt: dDays(29),
    },
    '4': {
      id: 'kyc-004',
      status: 'notStarted',
      cpfValid: null,
      documentValid: null,
      certifaceScore: null,
      rejectionReason: null,
      submittedAt: null,
      reviewedAt: null,
    },
    '7': {
      id: 'kyc-007',
      status: 'inProgress',
      cpfValid: true,
      documentValid: false,
      certifaceScore: null,
      rejectionReason: null,
      submittedAt: dDays(3),
      reviewedAt: null,
    },
    '9': {
      id: 'kyc-009',
      status: 'rejected',
      cpfValid: true,
      documentValid: false,
      certifaceScore: 0.42,
      rejectionReason: 'Documento ilegível',
      submittedAt: dDays(14),
      reviewedAt: dDays(12),
    },
    '10': {
      id: 'kyc-010',
      status: 'notStarted',
      cpfValid: null,
      documentValid: null,
      certifaceScore: null,
      rejectionReason: null,
      submittedAt: null,
      reviewedAt: null,
    },
    '11': {
      id: 'kyc-011',
      status: 'underReview',
      cpfValid: true,
      documentValid: true,
      certifaceScore: 0.82,
      rejectionReason: null,
      submittedAt: dDays(5),
      reviewedAt: null,
    },
  }
}

// ─── Geofence Zones (5) ─────────────────────────────────────────────────────
export const SEED_GEOFENCE_ZONES = [
  { id: 'gz-001', name: 'Av. Paulista — Gympass', description: 'Zona de desconto parceiro Gympass', latitude: -23.5646, longitude: -46.6527, radiusMeters: 300, isActive: true, partnerId: 'p4', type: 'partner' },
  { id: 'gz-002', name: 'Origami Office', description: 'Escritório principal Origami', latitude: -23.5630, longitude: -46.6543, radiusMeters: 100, isActive: true, partnerId: null, type: 'office' },
  { id: 'gz-003', name: 'Mercado Livre Hub', description: 'Hub de parceiros ML', latitude: -23.5489, longitude: -46.6388, radiusMeters: 200, isActive: true, partnerId: null, type: 'partner' },
  { id: 'gz-004', name: 'Aeroporto Congonhas', description: 'Check-in automático viagens', latitude: -23.6271, longitude: -46.6559, radiusMeters: 500, isActive: false, partnerId: null, type: 'airport' },
  { id: 'gz-005', name: 'Shopping Ibirapuera', description: 'Parceiros no shopping', latitude: -23.5897, longitude: -46.6612, radiusMeters: 250, isActive: true, partnerId: null, type: 'mall' },
  { id: 'gz-006', name: 'Zona Restrita — CPD', description: 'Área restrita do centro de processamento de dados', latitude: -23.5550, longitude: -46.6400, radiusMeters: 50, isActive: true, partnerId: null, type: 'restricted' },
  { id: 'gz-007', name: 'Estação Consolação', description: 'Zona de trânsito — metrô Consolação', latitude: -23.5567, longitude: -46.6604, radiusMeters: 150, isActive: true, partnerId: null, type: 'transit' },
]

// ─── Digital Wallet Cards (3) ───────────────────────────────────────────────
export const SEED_DIGITAL_WALLET_CARDS = [
  { cardId: 'c1', cardLast4: '4625', cardBrand: 'visa', cardNome: 'LUCAS OLIVEIRA', provider: 'google_pay', isProvisioned: true, tokenId: 'tok-gp-001' },
  { cardId: 'c2', cardLast4: '9501', cardBrand: 'mastercard', cardNome: 'LUCAS OLIVEIRA', provider: 'samsung_pay', isProvisioned: false, tokenId: null },
  { cardId: 'c3', cardLast4: '2210', cardBrand: 'elo', cardNome: 'LUCAS OLIVEIRA', provider: 'google_pay', isProvisioned: true, tokenId: 'tok-gp-002' },
]

// ─── Static data (banners, FAQs, external benefits, rewards, sessions, security) ─
export { BANNERS, FAQS, EXTERNAL_BENEFITS, REWARDS_SUMMARY, SP_TRANS_CARDS } from './data/static.js'
export { SENSITIVE_DATA } from './data/cards.js'
export { FAVORITE_PARTNER_IDS } from './data/partners.js'
