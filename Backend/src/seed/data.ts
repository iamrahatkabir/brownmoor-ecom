/**
 * The demo catalogue, in one place.
 *
 * Both `seed` and `seed:clear` read from this file, so anything added here is
 * automatically created by one and removed by the other. That is what makes
 * the demo data safe to install and safe to throw away — there is no second
 * list to keep in sync.
 *
 * Prices are in whole Taka here and converted to poisha on write.
 */

/**
 * Demo uploads are named with this prefix so `seed:clear` can find them again
 * without a marker field on the Media collection.
 *
 * Lives here, in the module with no side effects, rather than in run.ts —
 * importing run.ts executes the seed, so clear.ts must never reach into it.
 */
export const imageName = (slug: string): string => `demo-${slug}.png`

export type CategorySpec = {
  parent: null | string
  slug: string
  title: string
}

export type VariantSpec = {
  compareAt: null | number
  option: string
  price: number
  stock: number
}

export type ProductSpec = {
  care?: string
  categories: string[]
  colour: string
  compareAt?: null | number
  featured?: boolean
  price?: number
  shortDescription: string
  slug: string
  specs: Array<{ label: string; value: string }>
  stock?: number
  title: string
  variantType?: string
  variants?: VariantSpec[]
}

export const CATEGORIES: CategorySpec[] = [
  { parent: null, slug: 'cookware', title: 'Cookware' },
  { parent: 'cookware', slug: 'saucepans', title: 'Saucepans' },
  { parent: 'cookware', slug: 'frying-pans', title: 'Frying Pans' },
  { parent: 'cookware', slug: 'pressure-cookers', title: 'Pressure Cookers' },
  { parent: 'cookware', slug: 'woks-and-karai', title: 'Woks & Karai' },
  { parent: null, slug: 'bakeware', title: 'Bakeware' },
  { parent: 'bakeware', slug: 'tins-and-trays', title: 'Tins & Trays' },
  { parent: 'bakeware', slug: 'moulds', title: 'Moulds' },
  { parent: null, slug: 'cutlery', title: 'Cutlery' },
  { parent: 'cutlery', slug: 'knives', title: 'Knives' },
  { parent: 'cutlery', slug: 'chopping-boards', title: 'Chopping Boards' },
  { parent: null, slug: 'tableware', title: 'Tableware' },
  { parent: 'tableware', slug: 'dinner-sets', title: 'Dinner Sets' },
  { parent: null, slug: 'storage', title: 'Storage' },
]

/**
 * Two variant types rather than one catch-all "Size": a pressure cooker is
 * chosen by litres and a pan by diameter, and mixing them in a single option
 * list would let staff pick "5L" for a frying pan.
 */
export const VARIANT_TYPES = [
  {
    label: 'Size',
    name: 'size',
    options: ['16cm', '18cm', '20cm', '22cm', '24cm', '26cm', '28cm', '30cm'],
  },
  { label: 'Capacity', name: 'capacity', options: ['3 litre', '5 litre', '7 litre'] },
]

export const PRODUCTS: ProductSpec[] = [
  {
    care: 'Dishwasher safe, though hand washing keeps the exterior brighter.',
    categories: ['cookware', 'saucepans'],
    colour: '#3f4b3b',
    featured: true,
    shortDescription:
      'Three bonded layers for even heat, with a cool-touch handle and a pouring rim.',
    slug: 'tri-ply-stainless-steel-saucepan',
    specs: [
      { label: 'Material', value: 'Tri-ply stainless steel' },
      { label: 'Induction safe', value: 'Yes' },
      { label: 'Dishwasher safe', value: 'Yes' },
    ],
    title: 'Tri-Ply Stainless Steel Saucepan',
    variantType: 'size',
    variants: [
      { compareAt: 2900, option: '16cm', price: 2450, stock: 24 },
      { compareAt: 3600, option: '20cm', price: 3100, stock: 18 },
      { compareAt: null, option: '24cm', price: 3850, stock: 11 },
    ],
  },
  {
    categories: ['cookware', 'saucepans'],
    colour: '#5b6b63',
    price: 1150,
    shortDescription: 'Small enough for one cup of tea, heavy enough not to scorch it.',
    slug: 'non-stick-milk-pan',
    specs: [
      { label: 'Material', value: 'Non-stick aluminium' },
      { label: 'Capacity', value: '800 ml' },
    ],
    stock: 46,
    title: 'Non-Stick Milk Pan',
  },
  {
    categories: ['cookware', 'frying-pans'],
    colour: '#2f3336',
    featured: true,
    shortDescription: 'Hard anodised and scratch resistant, for daily high-heat cooking.',
    slug: 'hard-anodised-frying-pan',
    specs: [
      { label: 'Material', value: 'Hard anodised aluminium' },
      { label: 'Induction safe', value: 'Yes' },
    ],
    title: 'Hard Anodised Frying Pan',
    variantType: 'size',
    variants: [
      { compareAt: 2600, option: '24cm', price: 2200, stock: 20 },
      { compareAt: null, option: '28cm', price: 2800, stock: 14 },
    ],
  },
  {
    care: 'Dry immediately after washing and wipe with a little oil.',
    categories: ['cookware', 'frying-pans'],
    colour: '#40352c',
    compareAt: 3900,
    price: 3400,
    shortDescription: 'Pre-seasoned cast iron that improves with every use.',
    slug: 'cast-iron-skillet',
    specs: [
      { label: 'Material', value: 'Cast iron' },
      { label: 'Diameter', value: '26 cm' },
      { label: 'Oven safe', value: 'Yes' },
    ],
    stock: 9,
    title: 'Cast Iron Skillet',
  },
  {
    categories: ['cookware', 'pressure-cookers'],
    colour: '#4a4a52',
    shortDescription: 'Everyday pressure cooking with a locking lid and safety valve.',
    slug: 'aluminium-pressure-cooker',
    specs: [
      { label: 'Material', value: 'Anodised aluminium' },
      { label: 'Safety valve', value: 'Yes' },
    ],
    title: 'Aluminium Pressure Cooker',
    variantType: 'capacity',
    variants: [
      { compareAt: 3400, option: '3 litre', price: 2900, stock: 15 },
      { compareAt: null, option: '5 litre', price: 3600, stock: 12 },
      { compareAt: null, option: '7 litre', price: 4300, stock: 6 },
    ],
  },
  {
    categories: ['cookware', 'pressure-cookers'],
    colour: '#6a7078',
    price: 5200,
    shortDescription: 'Induction-ready stainless steel with a sandwich base.',
    slug: 'stainless-steel-pressure-cooker',
    specs: [
      { label: 'Material', value: 'Stainless steel' },
      { label: 'Capacity', value: '5 litre' },
    ],
    stock: 7,
    title: 'Stainless Steel Pressure Cooker',
  },
  {
    care: 'Season lightly after each wash to keep the patina.',
    categories: ['cookware', 'woks-and-karai'],
    colour: '#33302b',
    featured: true,
    price: 2650,
    shortDescription: 'Thin carbon steel that heats fast and holds a hard sear.',
    slug: 'carbon-steel-wok',
    specs: [
      { label: 'Material', value: 'Carbon steel' },
      { label: 'Diameter', value: '32 cm' },
    ],
    stock: 17,
    title: 'Carbon Steel Wok',
  },
  {
    categories: ['cookware', 'woks-and-karai'],
    colour: '#4c443c',
    shortDescription: 'Deep non-stick karai for curries and frying alike.',
    slug: 'non-stick-karai',
    specs: [
      { label: 'Material', value: 'Non-stick aluminium' },
      { label: 'Lid included', value: 'Yes' },
    ],
    title: 'Non-Stick Karai',
    variantType: 'size',
    variants: [
      { compareAt: null, option: '26cm', price: 1950, stock: 28 },
      { compareAt: 2800, option: '30cm', price: 2400, stock: 19 },
    ],
  },
  {
    categories: ['bakeware', 'tins-and-trays'],
    colour: '#4a4a52',
    compareAt: 1600,
    price: 1250,
    shortDescription: 'Non-stick carbon steel with a rolled edge that resists warping.',
    slug: 'carbon-steel-loaf-tin',
    specs: [
      { label: 'Material', value: 'Carbon steel' },
      { label: 'Capacity', value: '900 g loaf' },
    ],
    stock: 33,
    title: 'Carbon Steel Loaf Tin',
  },
  {
    categories: ['bakeware', 'tins-and-trays'],
    colour: '#585048',
    shortDescription: 'Leak-resistant springform with a loose base for clean release.',
    slug: 'springform-cake-tin',
    specs: [
      { label: 'Material', value: 'Non-stick steel' },
      { label: 'Base', value: 'Removable' },
    ],
    title: 'Springform Cake Tin',
    variantType: 'size',
    variants: [
      { compareAt: null, option: '18cm', price: 1400, stock: 22 },
      { compareAt: 2100, option: '22cm', price: 1750, stock: 16 },
    ],
  },
  {
    categories: ['bakeware', 'moulds'],
    colour: '#6b5b73',
    price: 850,
    shortDescription: 'Flexible silicone that releases without greasing.',
    slug: 'silicone-muffin-mould',
    specs: [
      { label: 'Material', value: 'Food-grade silicone' },
      { label: 'Cups', value: '12' },
    ],
    stock: 54,
    title: 'Silicone Muffin Mould',
  },
  {
    care: 'Hand wash and dry immediately. Never leave to soak.',
    categories: ['cutlery', 'knives'],
    colour: '#2b2f33',
    compareAt: 7900,
    featured: true,
    price: 6800,
    shortDescription: 'Layered steel with a hand-finished edge and a balanced bolster.',
    slug: 'damascus-chefs-knife',
    specs: [
      { label: 'Blade', value: 'Damascus steel, 20 cm' },
      { label: 'Handle', value: 'Stabilised wood' },
    ],
    stock: 5,
    title: "Damascus Chef's Knife",
  },
  {
    categories: ['cutlery', 'knives'],
    colour: '#565c62',
    price: 3200,
    shortDescription: 'Five knives and a block, covering everything a home kitchen needs.',
    slug: 'stainless-steel-knife-set',
    specs: [
      { label: 'Pieces', value: '5 knives + block' },
      { label: 'Blade', value: 'Stainless steel' },
    ],
    stock: 13,
    title: 'Stainless Steel Knife Set',
  },
  {
    care: 'Hand wash only. Oil monthly to stop the grain drying out.',
    categories: ['cutlery', 'chopping-boards'],
    colour: '#6b4f2a',
    price: 1850,
    shortDescription: 'End-grain acacia that stays kind to knife edges.',
    slug: 'acacia-wood-chopping-board',
    specs: [
      { label: 'Material', value: 'Solid acacia' },
      { label: 'Dimensions', value: '38 × 25 × 3 cm' },
    ],
    stock: 40,
    title: 'Acacia Wood Chopping Board',
  },
  {
    categories: ['cutlery', 'chopping-boards'],
    colour: '#8a7048',
    price: 1450,
    shortDescription: 'Three bamboo boards, so raw and cooked never share a surface.',
    slug: 'bamboo-chopping-board-set',
    specs: [
      { label: 'Material', value: 'Bamboo' },
      { label: 'Pieces', value: '3' },
    ],
    stock: 31,
    title: 'Bamboo Chopping Board Set',
  },
  {
    categories: ['tableware', 'dinner-sets'],
    colour: '#7d8a91',
    compareAt: 8900,
    featured: true,
    price: 7500,
    shortDescription: 'Eighteen pieces of chip-resistant porcelain, service for six.',
    slug: 'porcelain-dinner-set',
    specs: [
      { label: 'Material', value: 'Porcelain' },
      { label: 'Pieces', value: '18' },
      { label: 'Microwave safe', value: 'Yes' },
    ],
    stock: 8,
    title: 'Porcelain Dinner Set',
  },
  {
    categories: ['storage'],
    colour: '#5f6b70',
    price: 2100,
    shortDescription: 'Borosilicate glass with airtight clip lids, oven to fridge.',
    slug: 'airtight-glass-container-set',
    specs: [
      { label: 'Material', value: 'Borosilicate glass' },
      { label: 'Pieces', value: '5' },
    ],
    stock: 26,
    title: 'Airtight Glass Container Set',
  },
]

/** Copy for the editable home-page global, so the demo homepage reads properly. */
export const HOME_PAGE = {
  ctaLabel: 'Shop cookware',
  ctaLink: '/category/cookware',
  featuredHeading: 'Featured Products',
  featuredIntro:
    'A short edit of the pieces we reach for most — chosen for how they perform after a hundred meals, not the first one.',
  heading: 'Built for everyday cooking',
  heroColour: '#1c1f1d',
  subheading:
    'Cookware, cutlery and tableware chosen to last. Cash on delivery anywhere in Bangladesh.',
}
