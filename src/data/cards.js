// Espelho do MockCardRepository — cartões por usuário

export const CARDS_BY_USER = {
  '1': [
    { id: 'c1', tipo: 'fisico',   status: 'ativo',     bandeira: 'visa',       ultimosDigitos: '4625', nomePortador: 'LUCAS O SILVA',      validade: '12/28', carteirasVinculadas: ['Flexível ACT 2026','Refeição/Alimentação','Benefício Flexível'], contactless: true  },
    { id: 'c2', tipo: 'virtual',  status: 'ativo',     bandeira: 'mastercard', ultimosDigitos: '9501', nomePortador: 'LUCAS O SILVA',      validade: '11/30', carteirasVinculadas: ['Transporte','Cultura'], contactless: false },
    { id: 'c3', tipo: 'virtual',  status: 'ativo',     bandeira: 'elo',        ultimosDigitos: '2210', nomePortador: 'LUCAS O SILVA',      validade: '03/28', carteirasVinculadas: ['Saúde'], contactless: false },
  ],
  '2': [
    { id: 'c1', tipo: 'fisico',   status: 'ativo',     bandeira: 'mastercard', ultimosDigitos: '7821', nomePortador: 'MARIA S FERREIRA',   validade: '08/27', carteirasVinculadas: ['Refeição','Flexível','Saúde e Bem-estar'], contactless: true  },
    { id: 'c2', tipo: 'virtual',  status: 'ativo',     bandeira: 'visa',       ultimosDigitos: '5533', nomePortador: 'MARIA S FERREIRA',   validade: '05/29', carteirasVinculadas: ['Flexível'], contactless: false },
  ],
  '3': [
    { id: 'c1', tipo: 'fisico',   status: 'ativo',     bandeira: 'elo',        ultimosDigitos: '3456', nomePortador: 'JOAO P COSTA',       validade: '10/27', carteirasVinculadas: ['Alimentação','Transporte'], contactless: true },
  ],
  '4': [
    { id: 'c1', tipo: 'fisico',   status: 'pendente',  bandeira: 'visa',       ultimosDigitos: '8890', nomePortador: 'CARLOS E MENDES',    validade: '02/29', carteirasVinculadas: ['Flexível Tech','Refeição','Transporte'], contactless: true  },
    { id: 'c2', tipo: 'virtual',  status: 'ativo',     bandeira: 'mastercard', ultimosDigitos: '1122', nomePortador: 'CARLOS E MENDES',    validade: '02/29', carteirasVinculadas: ['Cultura','Educação'], contactless: false },
  ],
  '5': [
    { id: 'c1', tipo: 'virtual',  status: 'ativo',     bandeira: 'visa',       ultimosDigitos: '9012', nomePortador: 'ANA C LIMA',         validade: '07/28', carteirasVinculadas: ['Flexível Premium'], contactless: false },
  ],
  '6': [
    { id: 'c1', tipo: 'fisico',   status: 'ativo',     bandeira: 'visa',       ultimosDigitos: '5678', nomePortador: 'ROBERTO ALMEIDA',    validade: '01/28', carteirasVinculadas: ['Refeição','Transporte'], contactless: true  },
    { id: 'c2', tipo: 'fisico',   status: 'bloqueado', bandeira: 'mastercard', ultimosDigitos: '1234', nomePortador: 'ROBERTO ALMEIDA',    validade: '09/26', carteirasVinculadas: ['Saúde'], contactless: true  },
    { id: 'c3', tipo: 'virtual',  status: 'ativo',     bandeira: 'elo',        ultimosDigitos: '6677', nomePortador: 'ROBERTO ALMEIDA',    validade: '04/29', carteirasVinculadas: ['Home Office'], contactless: false },
  ],
  '7': [
    { id: 'c1', tipo: 'fisico',   status: 'ativo',     bandeira: 'elo',        ultimosDigitos: '4401', nomePortador: 'FERNANDA R BARBOSA', validade: '06/28', carteirasVinculadas: ['Alimentação Estágio','Transporte Estágio'], contactless: false },
  ],
  '8': [
    { id: 'c1', tipo: 'fisico',   status: 'ativo',     bandeira: 'visa',       ultimosDigitos: '9900', nomePortador: 'DIEGO N SANTOS',     validade: '12/29', carteirasVinculadas: ['Alimentação Premium','Refeição Executiva','Transporte Executivo','Educação Continuada','Home Office Premium'], contactless: true  },
    { id: 'c2', tipo: 'fisico',   status: 'ativo',     bandeira: 'mastercard', ultimosDigitos: '3311', nomePortador: 'DIEGO N SANTOS',     validade: '12/29', carteirasVinculadas: ['Saúde & Bem-estar','Cultura & Lazer'], contactless: true  },
    { id: 'c3', tipo: 'virtual',  status: 'ativo',     bandeira: 'visa',       ultimosDigitos: '7700', nomePortador: 'DIEGO N SANTOS',     validade: '06/30', carteirasVinculadas: ['Educação Continuada','Home Office Premium'], contactless: false },
    { id: 'c4', tipo: 'virtual',  status: 'ativo',     bandeira: 'elo',        ultimosDigitos: '5500', nomePortador: 'DIEGO N SANTOS',     validade: '06/30', carteirasVinculadas: ['Cultura & Lazer'], contactless: false },
  ],
  '9': [
    { id: 'c1', tipo: 'fisico',   status: 'bloqueado', bandeira: 'mastercard', ultimosDigitos: '6688', nomePortador: 'PATRICIA V DUARTE',  validade: '03/28', carteirasVinculadas: ['Refeição','Flexível Jurídico','Saúde'], contactless: true  },
    { id: 'c2', tipo: 'virtual',  status: 'ativo',     bandeira: 'visa',       ultimosDigitos: '2299', nomePortador: 'PATRICIA V DUARTE',  validade: '09/29', carteirasVinculadas: ['Flexível Jurídico'], contactless: false },
  ],
  '10': [
    { id: 'c1', tipo: 'fisico',   status: 'pendente',  bandeira: 'visa',       ultimosDigitos: '1155', nomePortador: 'THIAGO M RIBEIRO',   validade: '04/29', carteirasVinculadas: ['Alimentação','Flexível RemoteTech'], contactless: true  },
    { id: 'c2', tipo: 'virtual',  status: 'pendente',  bandeira: 'mastercard', ultimosDigitos: '3366', nomePortador: 'THIAGO M RIBEIRO',   validade: '04/29', carteirasVinculadas: ['Home Office Integral','Educação Tech'], contactless: false },
  ],
  '11': [
    { id: 'c1', tipo: 'fisico',   status: 'ativo',     bandeira: 'visa',       ultimosDigitos: '2277', nomePortador: 'JULIANA C NETO',     validade: '11/27', carteirasVinculadas: ['Flexível','Refeição','Transporte'], contactless: true  },
    { id: 'c2', tipo: 'virtual',  status: 'bloqueado', bandeira: 'elo',        ultimosDigitos: '8833', nomePortador: 'JULIANA C NETO',     validade: '05/28', carteirasVinculadas: ['Flexível'], contactless: false },
  ],
  '12': [
    { id: 'c1', tipo: 'fisico',   status: 'cancelado', bandeira: 'visa',       ultimosDigitos: '8844', nomePortador: 'RAFAEL S PEREIRA',   validade: '09/26', carteirasVinculadas: ['Alimentação','Refeição','Transporte'], contactless: true  },
    { id: 'c2', tipo: 'virtual',  status: 'cancelado', bandeira: 'mastercard', ultimosDigitos: '6622', nomePortador: 'RAFAEL S PEREIRA',   validade: '09/26', carteirasVinculadas: ['Alimentação'], contactless: false },
  ],
}

export const SENSITIVE_DATA = {
  'c1': { numeroCompleto: '4539 1234 5678 4625', cvv: '412' },
  'c2': { numeroCompleto: '5412 8765 4321 7891', cvv: '293' },
  'c3': { numeroCompleto: '6062 9999 1111 2233', cvv: '847' },
  'c4': { numeroCompleto: '4716 0000 5555 7744', cvv: '531' },
  'c5': { numeroCompleto: '5234 6789 0123 3388', cvv: '674' },
  'c6': { numeroCompleto: '6504 3210 9876 5566', cvv: '918' },
  'c7': { numeroCompleto: '4929 5555 7777 9922', cvv: '305' },
}

export function getCards(userId) {
  return CARDS_BY_USER[String(userId)] ?? CARDS_BY_USER['1']
}

export function getCardById(userId, cardId) {
  const cards = getCards(userId)
  return cards.find(c => c.id === cardId) ?? cards[0]
}
