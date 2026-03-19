// Espelho do MockWalletRepository — carteiras por usuário
const NOW = new Date().toISOString()

export const WALLETS_BY_USER = {
  '1': [ // Lucas — 6 carteiras (power user)
    { id: 'w1', nome: 'Flexível ACT 2026', tipo: 'flexivel', saldo: 111.85, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Pode ser usado de acordo com as regras de uso da sua empresa em lojas físicas e virtuais e para compra em parceiros.', gastoSugeridoPorDia: 7.00, regrasDeUso: ['Alimentação','Conveniência','Farmácia','Livraria','Combustível'] },
    { id: 'w2', nome: 'Benefício Flexível',  tipo: 'flexivel', saldo: 320.00, limiteDisponivel: 800.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício flexível para uso em diversos estabelecimentos conforme regras da empresa.', gastoSugeridoPorDia: 10.00, regrasDeUso: ['Alimentação','Refeição','Transporte','Cultura'] },
    { id: 'w3', nome: 'Refeição/Alimentação', tipo: 'refeicao', saldo: 445.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Carteira exclusiva para refeição e alimentação em restaurantes, lanchonetes e supermercados.', gastoSugeridoPorDia: 20.00, regrasDeUso: ['Restaurantes','Lanchonetes','Supermercados','Padarias'] },
    { id: 'w4', nome: 'Transporte',           tipo: 'transporte', saldo: 280.00, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Carteira para transporte público e mobilidade urbana.', gastoSugeridoPorDia: 15.00, regrasDeUso: ['Ônibus','Metrô','Uber','99','Combustível'] },
    { id: 'w5', nome: 'Cultura',              tipo: 'cultura', saldo: 150.00, limiteDisponivel: 200.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício cultural para livros, cinema, teatro e eventos.', gastoSugeridoPorDia: 5.00, regrasDeUso: ['Livrarias','Cinema','Teatro','Shows','Streaming'] },
    { id: 'w6', nome: 'Saúde',                tipo: 'saude', saldo: 430.75, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício para cuidados com saúde e bem-estar.', gastoSugeridoPorDia: 14.00, regrasDeUso: ['Farmácias','Consultas','Exames','Academia'] },
  ],
  '2': [ // Maria — 3 carteiras
    { id: 'w1', nome: 'Refeição',         tipo: 'refeicao',  saldo: 380.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Carteira de refeição para uso em restaurantes e lanchonetes.', gastoSugeridoPorDia: 25.00, regrasDeUso: ['Restaurantes','Lanchonetes','Padarias','Cafeterias'] },
    { id: 'w2', nome: 'Flexível',          tipo: 'flexivel',  saldo: 250.00, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício flexível multifuncional conforme política da Indústria ABC.', gastoSugeridoPorDia: 8.00, regrasDeUso: ['Supermercados','Farmácias','Combustível','Conveniência'] },
    { id: 'w3', nome: 'Saúde e Bem-estar', tipo: 'saude',     saldo: 175.50, limiteDisponivel: 300.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício para farmácias, consultas e academia.', gastoSugeridoPorDia: 6.00, regrasDeUso: ['Farmácias','Consultas','Academia','Ótica'] },
  ],
  '3': [ // João — 2 carteiras
    { id: 'w1', nome: 'Alimentação', tipo: 'alimentacao', saldo: 520.00, limiteDisponivel: 700.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Carteira de alimentação para supermercados e hortifrútis.', gastoSugeridoPorDia: 18.00, regrasDeUso: ['Supermercados','Hortifrúti','Mercearias','Atacadistas'] },
    { id: 'w2', nome: 'Transporte',  tipo: 'transporte',  saldo: 180.00, limiteDisponivel: 300.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-transporte para deslocamento diário.', gastoSugeridoPorDia: 12.00, regrasDeUso: ['Ônibus','Metrô','Bilhete Único','Combustível'] },
  ],
  '4': [ // Carlos — 5 carteiras (primeiro acesso, saldo cheio)
    { id: 'w1', nome: 'Flexível Tech', tipo: 'flexivel',    saldo: 500.00, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício flexível da Tech Solutions para uso amplo.', gastoSugeridoPorDia: 16.00, regrasDeUso: ['Alimentação','Farmácia','Combustível','Conveniência','Livraria'] },
    { id: 'w2', nome: 'Refeição',      tipo: 'refeicao',    saldo: 600.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-refeição para restaurantes e lanchonetes.', gastoSugeridoPorDia: 30.00, regrasDeUso: ['Restaurantes','Lanchonetes','Padarias','Delivery'] },
    { id: 'w3', nome: 'Transporte',    tipo: 'transporte',  saldo: 400.00, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-transporte para mobilidade.', gastoSugeridoPorDia: 20.00, regrasDeUso: ['Uber','99','Metrô','Ônibus','Combustível'] },
    { id: 'w4', nome: 'Cultura',       tipo: 'cultura',     saldo: 200.00, limiteDisponivel: 200.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício cultural da Tech Solutions.', gastoSugeridoPorDia: 5.00, regrasDeUso: ['Livrarias','Cinema','Teatro','Streaming','Cursos'] },
    { id: 'w5', nome: 'Educação',      tipo: 'educacao',    saldo: 350.00, limiteDisponivel: 350.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício educacional para cursos e certificações.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Cursos online','Certificações','Idiomas','Livros técnicos'] },
  ],
  '5': [ // Ana — 1 carteira
    { id: 'w1', nome: 'Flexível Premium', tipo: 'flexivel', saldo: 680.00, limiteDisponivel: 800.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Carteira única flexível da Indústria ABC — uso amplo conforme política corporativa.', gastoSugeridoPorDia: 22.00, regrasDeUso: ['Alimentação','Refeição','Farmácia','Combustível','Transporte','Cultura'] },
  ],
  '6': [ // Roberto — 4 carteiras
    { id: 'w1', nome: 'Refeição',    tipo: 'refeicao',   saldo: 290.00, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-refeição Comércio XYZ.', gastoSugeridoPorDia: 25.00, regrasDeUso: ['Restaurantes','Lanchonetes','Delivery'] },
    { id: 'w2', nome: 'Transporte',  tipo: 'transporte', saldo: 150.00, limiteDisponivel: 350.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-transporte para deslocamento.', gastoSugeridoPorDia: 15.00, regrasDeUso: ['Ônibus','Metrô','Combustível'] },
    { id: 'w3', nome: 'Saúde',       tipo: 'saude',      saldo: 420.00, limiteDisponivel: 450.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício saúde para farmácias e consultas.', gastoSugeridoPorDia: 10.00, regrasDeUso: ['Farmácias','Consultas','Exames','Ótica'] },
    { id: 'w4', nome: 'Home Office', tipo: 'homeoffice', saldo: 200.00, limiteDisponivel: 300.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício home office para equipamentos e mobiliário.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Papelaria','Informática','Mobiliário','Ergonomia'] },
  ],
  '7': [ // Fernanda — 2 carteiras (saldo baixo, estagiária)
    { id: 'w1', nome: 'Alimentação Estágio', tipo: 'alimentacao', saldo: 23.50, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-alimentação de estágio.', gastoSugeridoPorDia: 12.00, regrasDeUso: ['Lanchonetes','Supermercados','Padarias'] },
    { id: 'w2', nome: 'Transporte Estágio',  tipo: 'transporte',  saldo: 8.20,  limiteDisponivel: 200.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-transporte de estágio.', gastoSugeridoPorDia: 8.00, regrasDeUso: ['Ônibus','Metrô','Bilhete Único'] },
  ],
  '8': [ // Diego — 7 carteiras (diretor, premium)
    { id: 'w1', nome: 'Alimentação Premium',    tipo: 'alimentacao', saldo: 1200.00, limiteDisponivel: 1500.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício alimentação premium executivo.', gastoSugeridoPorDia: 40.00, regrasDeUso: ['Restaurantes premium','Delivery','Supermercados'] },
    { id: 'w2', nome: 'Refeição Executiva',      tipo: 'refeicao',    saldo: 900.00,  limiteDisponivel: 1200.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-refeição executivo.', gastoSugeridoPorDia: 30.00, regrasDeUso: ['Restaurantes','Delivery premium'] },
    { id: 'w3', nome: 'Transporte Executivo',    tipo: 'transporte',  saldo: 600.00,  limiteDisponivel: 800.00,  ativo: true, ultimaAtualizacao: NOW, descricao: 'Transporte executivo ampliado.', gastoSugeridoPorDia: 25.00, regrasDeUso: ['Uber','Táxi','Combustível','Estacionamento'] },
    { id: 'w4', nome: 'Educação Continuada',     tipo: 'educacao',    saldo: 2000.00, limiteDisponivel: 3000.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'MBA, cursos executivos, certificações.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['MBA','Cursos executivos','Certificações internacionais'] },
    { id: 'w5', nome: 'Home Office Premium',     tipo: 'homeoffice',  saldo: 1500.00, limiteDisponivel: 2000.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Equipamentos e setup de alto nível.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Eletrônicos','Mobiliário ergonômico','Internet'] },
    { id: 'w6', nome: 'Saúde & Bem-estar',       tipo: 'saude',       saldo: 800.00,  limiteDisponivel: 1000.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Plano saúde complementar, academia, wellbeing.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Academia','Consultas','Psicologia','Spa'] },
    { id: 'w7', nome: 'Cultura & Lazer',         tipo: 'cultura',     saldo: 500.00,  limiteDisponivel: 600.00,  ativo: true, ultimaAtualizacao: NOW, descricao: 'Cinema, teatro, streaming, livros.', gastoSugeridoPorDia: 10.00, regrasDeUso: ['Cinema','Teatro','Streaming','Shows','Livros'] },
  ],
  '9': [ // Patrícia — 3 carteiras
    { id: 'w1', nome: 'Refeição',          tipo: 'refeicao', saldo: 320.00, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-refeição Consultoria Delta.', gastoSugeridoPorDia: 20.00, regrasDeUso: ['Restaurantes','Lanchonetes'] },
    { id: 'w2', nome: 'Flexível Jurídico', tipo: 'flexivel', saldo: 450.00, limiteDisponivel: 600.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Flexível para uso conforme política jurídica.', gastoSugeridoPorDia: 15.00, regrasDeUso: ['Livraria jurídica','Cursos OAB','Conveniência'] },
    { id: 'w3', nome: 'Saúde',             tipo: 'saude',    saldo: 280.00, limiteDisponivel: 350.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício saúde.', gastoSugeridoPorDia: 9.00, regrasDeUso: ['Farmácias','Consultas','Exames'] },
  ],
  '10': [ // Thiago — 4 carteiras (remoto, saldo cheio)
    { id: 'w1', nome: 'Alimentação',             tipo: 'alimentacao', saldo: 700.00, limiteDisponivel: 700.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Alimentação para trabalho remoto.', gastoSugeridoPorDia: 20.00, regrasDeUso: ['Supermercados','Delivery','Restaurantes'] },
    { id: 'w2', nome: 'Home Office Integral',     tipo: 'homeoffice',  saldo: 2000.00,limiteDisponivel: 2000.00,ativo: true, ultimaAtualizacao: NOW, descricao: 'Setup completo de home office.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['Eletrônicos','Internet','Mobiliário'] },
    { id: 'w3', nome: 'Educação Tech',            tipo: 'educacao',    saldo: 1500.00,limiteDisponivel: 1500.00,ativo: true, ultimaAtualizacao: NOW, descricao: 'Certificações e cursos de tecnologia.', gastoSugeridoPorDia: 0.00, regrasDeUso: ['AWS','Google Cloud','Cursos técnicos','Certificações'] },
    { id: 'w4', nome: 'Flexível RemoteTech',      tipo: 'flexivel',    saldo: 400.00, limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício flexível para colaboradores remotos.', gastoSugeridoPorDia: 12.00, regrasDeUso: ['Combustível','Conveniência','Farmácia'] },
  ],
  '11': [ // Juliana — 3 carteiras (saldo crítico)
    { id: 'w1', nome: 'Flexível',   tipo: 'flexivel',   saldo: 12.30,  limiteDisponivel: 400.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Benefício flexível Varejo Express.', gastoSugeridoPorDia: 12.00, regrasDeUso: ['Alimentação','Farmácia','Conveniência'] },
    { id: 'w2', nome: 'Refeição',   tipo: 'refeicao',   saldo: 189.90, limiteDisponivel: 500.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-refeição para restaurantes.', gastoSugeridoPorDia: 18.00, regrasDeUso: ['Restaurantes','Lanchonetes'] },
    { id: 'w3', nome: 'Transporte', tipo: 'transporte', saldo: 3.50,   limiteDisponivel: 250.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Vale-transporte.', gastoSugeridoPorDia: 10.00, regrasDeUso: ['Ônibus','Metrô','Bilhete Único'] },
  ],
  '12': [ // Rafael — 3 carteiras (zeradas/inativas, desligado)
    { id: 'w1', nome: 'Alimentação', tipo: 'alimentacao', saldo: 0.00, limiteDisponivel: 0.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Encerrado.', gastoSugeridoPorDia: 0.00, regrasDeUso: [] },
    { id: 'w2', nome: 'Refeição',    tipo: 'refeicao',    saldo: 0.00, limiteDisponivel: 0.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Encerrado.', gastoSugeridoPorDia: 0.00, regrasDeUso: [] },
    { id: 'w3', nome: 'Transporte',  tipo: 'transporte',  saldo: 0.00, limiteDisponivel: 0.00, ativo: true, ultimaAtualizacao: NOW, descricao: 'Encerrado.', gastoSugeridoPorDia: 0.00, regrasDeUso: [] },
  ],
}

export function getWallets(userId) {
  return WALLETS_BY_USER[String(userId)] ?? WALLETS_BY_USER['1']
}
