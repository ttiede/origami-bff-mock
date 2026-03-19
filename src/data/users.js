// Espelho do MockAuthRepository — todos os 12 usuários
// CPF / senha / estado iguais ao app

export const USERS = [
  {
    id: '1', nome: 'Lucas Oliveira Silva', cpf: '61151275131',
    email: 'lucas.silva@techsolutions.com.br', telefone: '(11) 99876-5432',
    empresa: 'Tech Solutions Ltda', departamento: 'Tecnologia',
    cargo: 'Desenvolvedor Senior', senha: 'Origami1',
    primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0,
  },
  {
    id: '2', nome: 'Maria Santos Ferreira', cpf: '72253325031',
    email: 'maria.ferreira@industriaabc.com.br', telefone: '(21) 98765-4321',
    empresa: 'Indústria ABC S.A.', departamento: 'Recursos Humanos',
    cargo: 'Gerente de RH', senha: 'Origami2!',
    primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0,
  },
  {
    id: '3', nome: 'João Pedro Costa', cpf: '85310785043',
    email: 'joao.costa@comercioxyz.com.br', telefone: '(31) 97654-3210',
    empresa: 'Comércio XYZ Ltda', departamento: 'Financeiro',
    cargo: 'Analista Financeiro', senha: 'Origami3!',
    primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0,
  },
  {
    id: '4', nome: 'Carlos Eduardo Mendes', cpf: '71965103561',
    email: 'carlos.mendes@techsolutions.com.br', telefone: '(11) 96543-2109',
    empresa: 'Tech Solutions Ltda', departamento: 'Produto',
    cargo: 'Product Manager', senha: null, // PRIMEIRO ACESSO
    primeiroAcesso: true, bloqueioDefinitivo: false, tentativasFalhas: 0,
  },
  {
    id: '5', nome: 'Ana Carolina Lima', cpf: '80587310057',
    email: 'ana.lima@industriaabc.com.br', telefone: '(21) 95432-1098',
    empresa: 'Indústria ABC S.A.', departamento: 'Marketing',
    cargo: 'Coordenadora de Marketing', senha: 'Origami5!',
    primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 2,
  },
  {
    id: '6', nome: 'Roberto Almeida', cpf: '76127261066',
    email: 'roberto.almeida@comercioxyz.com.br', telefone: '(31) 94321-0987',
    empresa: 'Comércio XYZ Ltda', departamento: 'Logística',
    cargo: 'Gerente de Logística', senha: 'Origami6!',
    primeiroAcesso: false, bloqueioDefinitivo: true, tentativasFalhas: 0,
  },
  {
    id: '7', nome: 'Fernanda Rocha Barbosa', cpf: '66392332154',
    email: 'fernanda.barbosa@startupnovaera.com.br', telefone: '(11) 93210-9876',
    empresa: 'Startup Nova Era', departamento: 'Desenvolvimento',
    cargo: 'Estagiária de Desenvolvimento', senha: 'Origami7!',
    primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0,
  },
  {
    id: '8', nome: 'Diego Nascimento Santos', cpf: '46881973659',
    email: 'diego.santos@megacorp.com.br', telefone: '(11) 92109-8765',
    empresa: 'MegaCorp International', departamento: 'Diretoria Executiva',
    cargo: 'Diretor de Operações', senha: 'Origami8!',
    primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 0,
  },
  {
    id: '9', nome: 'Patrícia Vieira Duarte', cpf: '99356327254',
    email: 'patricia.duarte@consultoriadelta.com.br', telefone: '(21) 91098-7654',
    empresa: 'Consultoria Delta', departamento: 'Jurídico',
    cargo: 'Advogada Sênior', senha: 'Origami9!',
    primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 4,
    bloqueioAte: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '10', nome: 'Thiago Martins Ribeiro', cpf: '95181756085',
    email: 'thiago.ribeiro@remotetech.com.br', telefone: '(48) 90987-6543',
    empresa: 'RemoteTech LTDA', departamento: 'Infraestrutura',
    cargo: 'Engenheiro DevOps', senha: null, // PRIMEIRO ACESSO
    primeiroAcesso: true, bloqueioDefinitivo: false, tentativasFalhas: 0,
  },
  {
    id: '11', nome: 'Juliana Campos Neto', cpf: '48063581776',
    email: 'juliana.neto@varejoexpress.com.br', telefone: '(19) 98765-1234',
    empresa: 'Varejo Express', departamento: 'Vendas',
    cargo: 'Supervisora de Vendas', senha: 'Origami11!',
    primeiroAcesso: false, bloqueioDefinitivo: false, tentativasFalhas: 1,
  },
  {
    id: '12', nome: 'Rafael Souza Pereira', cpf: '83970523214',
    email: 'rafael.pereira@comercioxyz.com.br', telefone: '(31) 97654-0987',
    empresa: 'Comércio XYZ Ltda', departamento: 'Comercial',
    cargo: 'Ex-Vendedor (Desligado)', senha: 'Origami12!',
    primeiroAcesso: false, bloqueioDefinitivo: true, tentativasFalhas: 0,
  },
]

export function findUserByCpf(cpf) {
  const clean = cpf.replace(/\D/g, '')
  return USERS.find(u => u.cpf === clean) ?? null
}

export function findUserById(id) {
  return USERS.find(u => u.id === String(id)) ?? USERS[0]
}
