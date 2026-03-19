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
