export interface Product {
  id: number
  name: string
  price: number
  image: string
  images: string[]
  category: string
  subcategory?: string
  style?: string[]
  color?: string[]
  isNew: boolean
  isBestseller: boolean
  discountPercent?: number
  rating?: number
  ratingCount?: number
  collectionId?: number | null
  sellIndividually?: boolean
  description: string
  inGameImages?: string[]
  specs?: { label: string; value: string }[]
  createdAt?: string
}

export const categories = [
  { value: 'todos', label: 'Todos os produtos' },
  { value: 'acessorios', label: 'Acessorios' },
  { value: 'roupas', label: 'Roupas' },
  { value: 'cabelos', label: 'Cabelos (Virtuais)' },
  { value: 'conjuntos', label: 'Conjuntos' },
  { value: 'outros', label: 'Outros' },
]

export const styles = [
  { value: 'gotica', label: 'Gotica' },
  { value: 'soft', label: 'Soft' },
  { value: 'neon', label: 'Neon' },
  { value: 'street', label: 'Street' },
  { value: 'y2k', label: 'Y2K' },
  { value: 'grunge', label: 'Grunge' },
]

export const colors = [
  { value: 'rosa', hex: '#ff2d95' },
  { value: 'roxo', hex: '#b347d9' },
  { value: 'preto', hex: '#1a1a1a' },
  { value: 'branco', hex: '#f0f0f0' },
  { value: 'vermelho', hex: '#ff4444' },
  { value: 'azul', hex: '#4488ff' },
  { value: 'verde', hex: '#44ff88' },
  { value: 'amarelo', hex: '#ffdd44' },
  { value: 'laranja', hex: '#ff8844' },
  { value: 'cinza', hex: '#888888' },
]

export const products: Product[] = [
  {
    id: 1,
    name: 'Cabelo Dreamcore',
    price: 15.90,
    image: '/products/cabelo-dreamcore.jpg',
    images: ['/products/cabelo-dreamcore.jpg', '/products/cabelo-dreamcore-2.jpg'],
    category: 'cabelos',
    style: ['soft', 'y2k'],
    color: ['rosa', 'preto'],
    isNew: true,
    isBestseller: true,
    description: 'Cabelo longo com mechas rosas e pretas, estilo dreamcore perfeito para quem ama um visual delicado mas com atitude.',
    inGameImages: ['/ingame/cabelo-dreamcore-1.jpg', '/ingame/cabelo-dreamcore-2.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~12.000' },
    ],
  },
  {
    id: 2,
    name: 'Top Dark Lace',
    price: 29.90,
    image: '/products/top-dark-lace.jpg',
    images: ['/products/top-dark-lace.jpg', '/products/top-dark-lace-2.jpg'],
    category: 'roupas',
    subcategory: 'tops',
    style: ['gotica', 'grunge'],
    color: ['preto'],
    isNew: true,
    isBestseller: false,
    description: 'Top de renda preta com detalhes em correntes. Look perfeito para as noites no servidor.',
    inGameImages: ['/ingame/top-dark-lace-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~8.000' },
    ],
  },
  {
    id: 3,
    name: 'Calca Cargo Chains',
    price: 49.90,
    image: '/products/calca-cargo-chains.jpg',
    images: ['/products/calca-cargo-chains.jpg'],
    category: 'roupas',
    subcategory: 'calcas',
    style: ['street', 'grunge'],
    color: ['preto'],
    isNew: true,
    isBestseller: true,
    description: 'Calca cargo preta com correntes e bolsos laterais. Estilo streetwear com atitude.',
    inGameImages: ['/ingame/calca-cargo-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~10.000' },
    ],
  },
  {
    id: 4,
    name: 'Headset Cat Neon',
    price: 19.90,
    image: '/products/headset-cat-neon.jpg',
    images: ['/products/headset-cat-neon.jpg'],
    category: 'acessorios',
    style: ['neon', 'y2k'],
    color: ['rosa', 'preto'],
    isNew: true,
    isBestseller: false,
    description: 'Headset com orelhas de gato e luz neon rosa. O acessorio perfeito para completar seu setup.',
    inGameImages: ['/ingame/headset-cat-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~5.000' },
    ],
  },
  {
    id: 5,
    name: 'Jaqueta Oversize Moon',
    price: 69.90,
    image: '/products/jaqueta-oversize-moon.jpg',
    images: ['/products/jaqueta-oversize-moon.jpg', '/products/jaqueta-oversize-moon-2.jpg'],
    category: 'roupas',
    subcategory: 'jaquetas',
    style: ['street', 'grunge'],
    color: ['preto', 'branco'],
    isNew: false,
    isBestseller: true,
    description: 'Jaqueta oversized com estampa de lua e estrelas. Confortavel e estilosa para qualquer ocasiao.',
    inGameImages: ['/ingame/jaqueta-moon-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~14.000' },
    ],
  },
  {
    id: 6,
    name: 'Saia Punk X',
    price: 24.90,
    image: '/products/saia-punk-x.jpg',
    images: ['/products/saia-punk-x.jpg'],
    category: 'roupas',
    subcategory: 'saias',
    style: ['gotica', 'grunge'],
    color: ['preto'],
    isNew: false,
    isBestseller: false,
    description: 'Saia curta estilo punk com correntes e spikes. Para quem nao tem medo de ousar.',
    inGameImages: ['/ingame/saia-punk-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~7.000' },
    ],
  },
  {
    id: 7,
    name: 'Cabelo Galaxy Waves',
    price: 15.90,
    image: '/products/cabelo-galaxy-waves.jpg',
    images: ['/products/cabelo-galaxy-waves.jpg', '/products/cabelo-galaxy-waves-2.jpg'],
    category: 'cabelos',
    style: ['neon', 'y2k'],
    color: ['roxo', 'azul'],
    isNew: true,
    isBestseller: true,
    description: 'Cabelo ondulado com tons de galaxia roxo e azul. Brilhe como as estrelas no FiveM.',
    inGameImages: ['/ingame/cabelo-galaxy-1.jpg', '/ingame/cabelo-galaxy-2.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~13.000' },
    ],
  },
  {
    id: 8,
    name: 'Oculos Starry',
    price: 12.90,
    image: '/products/oculos-starry.jpg',
    images: ['/products/oculos-starry.jpg'],
    category: 'acessorios',
    style: ['y2k', 'soft'],
    color: ['rosa'],
    isNew: false,
    isBestseller: false,
    description: 'Oculos de estrela rosa com brilho. O toque final para qualquer look.',
    inGameImages: ['/ingame/oculos-starry-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~2.000' },
    ],
  },
  {
    id: 9,
    name: 'Conjunto Rebel Girl',
    price: 89.90,
    image: '/products/conjunto-rebel-girl.jpg',
    images: ['/products/conjunto-rebel-girl.jpg', '/products/conjunto-rebel-girl-2.jpg'],
    category: 'conjuntos',
    style: ['gotica', 'grunge'],
    color: ['preto', 'rosa'],
    isNew: false,
    isBestseller: true,
    description: 'Conjunto completo com top, saia e acessorios. Look rebelde pronto para usar.',
    inGameImages: ['/ingame/conjunto-rebel-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~25.000' },
    ],
  },
  {
    id: 10,
    name: 'Mochila Kawaii Dark',
    price: 39.90,
    image: '/products/mochila-kawaii-dark.jpg',
    images: ['/products/mochila-kawaii-dark.jpg'],
    category: 'acessorios',
    style: ['soft', 'y2k'],
    color: ['preto', 'rosa'],
    isNew: false,
    isBestseller: false,
    description: 'Mochila estilo kawaii com detalhes dark. Perfeita para carregar seus itens com estilo.',
    inGameImages: ['/ingame/mochila-kawaii-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~9.000' },
    ],
  },
  {
    id: 11,
    name: 'Meias Arrastao Love',
    price: 16.90,
    image: '/products/meias-arrastao-love.jpg',
    images: ['/products/meias-arrastao-love.jpg'],
    category: 'roupas',
    subcategory: 'meias',
    style: ['gotica', 'grunge'],
    color: ['preto'],
    isNew: false,
    isBestseller: false,
    description: 'Meias de arrastao com detalhes de coracao. O detalhe que faltava no seu look.',
    inGameImages: ['/ingame/meias-arrastao-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~4.000' },
    ],
  },
  {
    id: 12,
    name: 'Colar Spiked Heart',
    price: 14.90,
    image: '/products/colar-spiked-heart.jpg',
    images: ['/products/colar-spiked-heart.jpg'],
    category: 'acessorios',
    style: ['gotica', 'grunge'],
    color: ['prata'],
    isNew: false,
    isBestseller: false,
    description: 'Colar com pingente de coracao e spikes. Acessorio ousado para completar seu visual.',
    inGameImages: ['/ingame/colar-spiked-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~3.000' },
    ],
  },
  {
    id: 13,
    name: 'Cabelo Half & Half',
    price: 15.90,
    image: '/products/cabelo-half-half.jpg',
    images: ['/products/cabelo-half-half.jpg', '/products/cabelo-half-half-2.jpg'],
    category: 'cabelos',
    style: ['y2k', 'neon'],
    color: ['preto', 'branco'],
    isNew: true,
    isBestseller: true,
    description: 'Cabelo com metade preto e metade branco. Visual marcante e cheio de personalidade.',
    inGameImages: ['/ingame/cabelo-half-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~11.000' },
    ],
  },
  {
    id: 14,
    name: 'Cropped Flame',
    price: 27.90,
    image: '/products/cropped-flame.jpg',
    images: ['/products/cropped-flame.jpg'],
    category: 'roupas',
    subcategory: 'tops',
    style: ['street', 'grunge'],
    color: ['preto', 'rosa'],
    isNew: false,
    isBestseller: false,
    description: 'Cropped preto com estampa de chamas rosas. Quente como o seu estilo.',
    inGameImages: ['/ingame/cropped-flame-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~6.000' },
    ],
  },
  {
    id: 15,
    name: 'Bone Broken Heart',
    price: 18.90,
    image: '/products/bone-broken-heart.jpg',
    images: ['/products/bone-broken-heart.jpg'],
    category: 'acessorios',
    style: ['street', 'grunge'],
    color: ['preto', 'rosa'],
    isNew: false,
    isBestseller: false,
    description: 'Bone preto com bordado de coracao partido. Estilo streetwear atemporal.',
    inGameImages: ['/ingame/bone-broken-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~5.000' },
    ],
  },
  {
    id: 16,
    name: 'Pulseira Chain Punk',
    price: 13.90,
    image: '/products/pulseira-chain-punk.jpg',
    images: ['/products/pulseira-chain-punk.jpg'],
    category: 'acessorios',
    style: ['gotica', 'grunge'],
    color: ['prata'],
    isNew: false,
    isBestseller: false,
    description: 'Pulseira de corrente estilo punk com spikes. Detalhe que faz toda a diferenca.',
    inGameImages: ['/ingame/pulseira-chain-1.jpg'],
    specs: [
      { label: 'Compatibilidade', value: 'FiveM / GTA V' },
      { label: 'Formato', value: '.ydd / .ytd' },
      { label: 'Poligonos', value: '~2.500' },
    ],
  },
]

export const collections = [
  {
    id: 1,
    name: 'Dark Cute',
    subtitle: 'Doce por fora, misteriosa por dentro.',
    image: '/collections/dark-cute.jpg',
    color: '#ff2d95',
  },
  {
    id: 2,
    name: 'Neon Rebel',
    subtitle: 'Para quem brilha e quebra regras.',
    image: '/collections/neon-rebel.jpg',
    color: '#b347d9',
  },
  {
    id: 3,
    name: 'Soft Chaos',
    subtitle: 'Caos leve, mente criativa.',
    image: '/collections/soft-chaos.jpg',
    color: '#ff85c0',
  },
  {
    id: 4,
    name: 'Girl Boss',
    subtitle: 'Confiante, ousada e dona do seu caminho.',
    image: '/collections/girl-boss.jpg',
    color: '#ff4da6',
  },
]

export const reviews = [
  {
    id: 1,
    name: '@babychaos',
    avatar: '/avatars/avatar1.jpg',
    rating: 5,
    text: 'Amei demais! A entrega foi super rapida no Discord e o item e perfeito, exatamente como o da foto',
  },
  {
    id: 2,
    name: '@lil.misfit',
    avatar: '/avatars/avatar2.jpg',
    rating: 5,
    text: 'Perfeitooo! Atendimento incrivel e muito atencioso. Ja virei cliente fiel',
  },
  {
    id: 3,
    name: '@rebelz',
    avatar: '/avatars/avatar3.jpg',
    rating: 5,
    text: 'Simplesmente impecavel! Qualidade absurda e o suporte me ajudou com tudo. Recomendo demais!',
  },
  {
    id: 4,
    name: '@darkqueen',
    avatar: '/avatars/avatar4.jpg',
    rating: 5,
    text: 'Os cabelos sao lindos demais! Ja comprei 3 e pretendo comprar todos. Entrega imediata!',
  },
  {
    id: 5,
    name: '@neonvibe',
    avatar: '/avatars/avatar5.jpg',
    rating: 5,
    text: 'Melhor loja de mods do FiveM! Qualidade top e preco justo. Super recomendo!',
  },
]

export const heroSlides = [
  {
    id: 1,
    title: 'SEU ESTILO.',
    title2: 'SUA ATITUDE.',
    title3: 'SUA ESSENCIA.',
    subtitle: 'Pecas exclusivas para quem nao nasceu para ser comum.',
    cta: 'CONHECER COLECOES',
    image: '/hero/slide1.jpg',
  },
  {
    id: 2,
    title: 'CABELOS.',
    title2: 'ROUPAS.',
    title3: 'ATITUDE.',
    subtitle: 'Tudo que voce precisa para brilhar no FiveM.',
    cta: 'VER PRODUTOS',
    image: '/hero/slide2.jpg',
  },
  {
    id: 3,
    title: 'NOVIDADES.',
    title2: 'TODA SEMANA.',
    title3: 'NAO PERCA.',
    subtitle: 'Fique por dentro dos lancamentos exclusivos da Quantic.',
    cta: 'VER LANCAMENTOS',
    image: '/hero/slide3.jpg',
  },
]

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
}
