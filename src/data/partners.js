// Espelho do MockPartnerRepository — parceiros próximos à Av. Paulista

export const ALL_PARTNERS = [
  { id: 'p1',  name: 'IKD Restaurante',     category: 'restaurante',  address: 'Av. Paulista, 1578 — Bela Vista, SP',        distance: '0.2 km', rating: 4.5, acceptedBenefits: ['refeicao'],             discount: '10% no almoço',       isOpen: true,  lat: -23.564, lng: -46.651, description: 'Restaurante japonês com buffet por quilo no almoço.', phone: '(11) 3253-1578', hours: 'Seg–Sex 11h–15h, 18h–22h | Sáb–Dom 12h–22h' },
  { id: 'p2',  name: 'Drogaria Raia',        category: 'farmacia',     address: 'R. Augusta, 723 — Consolação, SP',            distance: '0.5 km', rating: 4.2, acceptedBenefits: ['saude','flexivel'],     discount: null,                  isOpen: true,  lat: -23.561, lng: -46.657, description: 'Farmácia com manipulação e convênio médico.', phone: '(11) 3214-0723', hours: 'Todos os dias 07h–22h' },
  { id: 'p3',  name: 'Pão de Açúcar',        category: 'supermercado', address: 'Av. Paulista, 2064 — Jardim Paulista, SP',     distance: '0.8 km', rating: 4.3, acceptedBenefits: ['alimentacao','flexivel'],discount: '5% em produtos selecionados', isOpen: true, lat: -23.558, lng: -46.662, description: 'Supermercado premium com hortifruti orgânico e padaria.', phone: '(11) 3064-2064', hours: 'Todos os dias 07h–23h' },
  { id: 'p4',  name: 'Smart Fit',             category: 'academia',     address: 'Av. Paulista, 807 — Bela Vista, SP',          distance: '0.4 km', rating: 4.1, acceptedBenefits: ['saude','flexivel'],     discount: 'Matrícula grátis',    isOpen: true,  lat: -23.570, lng: -46.648, description: 'Academia com musculação, cardio e aulas coletivas.', phone: '(11) 4000-0807', hours: 'Seg–Sex 06h–23h | Sáb–Dom 08h–20h' },
  { id: 'p5',  name: 'Cinemark Paulista',     category: 'cinema',       address: 'Al. Santos, 1000 — Jardim Paulista, SP',      distance: '1.1 km', rating: 4.4, acceptedBenefits: ['cultura','flexivel'],    discount: '50% na 2ª entrada',   isOpen: true,  lat: -23.575, lng: -46.670, description: 'Multiplex com salas 3D e XD. Estacionamento no local.', phone: '(11) 3266-1000', hours: 'Todos os dias 12h–23h' },
  { id: 'p6',  name: 'Posto Ipiranga',        category: 'posto',        address: 'R. da Consolação, 222 — Consolação, SP',      distance: '0.6 km', rating: 4.0, acceptedBenefits: ['flexivel','transporte'], discount: null,                  isOpen: true,  lat: -23.567, lng: -46.655, description: 'Posto com loja de conveniência am/pm 24h.', phone: '(11) 3214-0222', hours: 'Todos os dias 24h' },
  { id: 'p7',  name: 'Livraria Cultura',      category: 'livraria',     address: 'Av. Paulista, 2073 — Consolação, SP',         distance: '0.9 km', rating: 4.6, acceptedBenefits: ['cultura','flexivel'],    discount: '10% em livros',       isOpen: true,  lat: -23.556, lng: -46.664, description: 'Maior livraria da Av. Paulista com cafeteria interna.', phone: '(11) 3170-4033', hours: 'Seg–Sáb 09h–22h | Dom 11h–20h' },
  { id: 'p8',  name: 'Bob\'s Paulista',       category: 'lanchonete',   address: 'Av. Paulista, 1106 — Bela Vista, SP',         distance: '0.3 km', rating: 3.9, acceptedBenefits: ['refeicao','alimentacao','flexivel'], discount: 'Combo especial',  isOpen: true,  lat: -23.565, lng: -46.652, description: 'Fast food clássico com hambúrgueres e milkshakes.', phone: '(11) 3253-1106', hours: 'Todos os dias 10h–23h' },
  { id: 'p9',  name: 'iFood Restaurante Parceiro', category: 'restaurante', address: 'Av. Brigadeiro Luís Antônio, 500', distance: '1.5 km', rating: 4.3, acceptedBenefits: ['refeicao','flexivel'], discount: 'Frete grátis',       isOpen: true,  lat: -23.576, lng: -46.658, description: 'Culinária contemporânea brasileira.', phone: '(11) 3253-0500', hours: 'Seg–Sex 11h–22h | Sáb–Dom 12h–22h' },
  { id: 'p10', name: 'Clínica Einstein Paulista', category: 'saude',    address: 'Av. Paulista, 1000 — Bela Vista, SP',         distance: '0.7 km', rating: 4.8, acceptedBenefits: ['saude'],                discount: null,                  isOpen: true,  lat: -23.568, lng: -46.650, description: 'Unidade ambulatorial do Hospital Israelita Albert Einstein.', phone: '(11) 4000-1000', hours: 'Seg–Sex 07h–19h' },
  { id: 'p11', name: 'Alura Cursos',             category: 'educacao',  address: 'R. Vergueiro, 3185 — Vila Mariana, SP',        distance: '3.2 km', rating: 4.7, acceptedBenefits: ['educacao','cultura','flexivel'], discount: '30% corporativo', isOpen: true,  lat: -23.588, lng: -46.636, description: 'Plataforma de cursos de tecnologia com mais de 1.000 cursos.', phone: '(11) 4003-0900', hours: 'Online 24h' },
  { id: 'p12', name: 'Localiza Rent a Car',      category: 'transporte', address: 'Av. Paulista, 1499 — Bela Vista, SP',         distance: '0.6 km', rating: 4.0, acceptedBenefits: ['transporte','flexivel'],  discount: '15% em diárias',      isOpen: true,  lat: -23.563, lng: -46.654, description: 'Locadora de veículos com frota diversificada.', phone: '(11) 3048-1499', hours: 'Seg–Sex 07h–21h | Sáb 08h–17h' },
  { id: 'p13', name: 'Kalunga Papelaria',        category: 'papelaria', address: 'R. Augusta, 1050 — Consolação, SP',            distance: '0.9 km', rating: 4.1, acceptedBenefits: ['homeoffice','flexivel'],  discount: null,                  isOpen: false, lat: -23.555, lng: -46.660, description: 'Papelaria e informática para escritório e home office.', phone: '(11) 3214-1050', hours: 'Seg–Sex 08h–18h | Sáb 09h–14h' },
]

export const FAVORITE_PARTNER_IDS = ['p1', 'p4']

export function getPartners({ category, benefit } = {}) {
  return ALL_PARTNERS.filter(p => {
    if (category && p.category !== category) return false
    if (benefit && !p.acceptedBenefits.includes(benefit)) return false
    return true
  })
}

export function getPartnerById(id) {
  return ALL_PARTNERS.find(p => p.id === id) ?? null
}

export function getFavoritePartners() {
  return ALL_PARTNERS.filter(p => FAVORITE_PARTNER_IDS.includes(p.id))
}
