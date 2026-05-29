export const CATEGORIES = [
  { key: 'all', label: 'All products', description: 'Curated storefront essentials' },
  { key: 'audio', label: 'Audio', description: 'Sound engineered for focus and travel' },
  { key: 'workspace', label: 'Workspace', description: 'Tools that sharpen the desk setup' },
  { key: 'travel', label: 'Travel', description: 'Carry-friendly gear for movement' },
  { key: 'apparel', label: 'Apparel', description: 'Soft layers for daily wear' },
]

export const PRODUCTS = [
  {
    id: 'aurora-headphones',
    slug: 'aurora-headphones',
    name: 'Aurora Headphones',
    brand: 'Northstar',
    category: 'audio',
    price: 149,
    rating: 4.9,
    reviewCount: 328,
    badge: 'Best seller',
    featured: true,
    summary: 'Adaptive noise canceling headphones tuned for long sessions and commutes.',
    description:
      'Aurora combines spatial audio, all-day comfort, and a fast-charge battery so the product feels premium without adding bulk.',
    features: ['40-hour battery', 'Spatial audio', 'USB-C fast charge'],
    specs: [
      { label: 'Driver size', value: '40 mm' },
      { label: 'Battery life', value: '40 hours' },
      { label: 'Weight', value: '245 g' },
    ],
    accent: 'linear-gradient(135deg, #7c8cff, #34d7c8)',
  },
  {
    id: 'orbit-speaker',
    slug: 'orbit-speaker',
    name: 'Orbit Speaker',
    brand: 'Signal',
    category: 'audio',
    price: 89,
    rating: 4.8,
    reviewCount: 192,
    badge: 'New',
    featured: true,
    summary: 'A compact speaker with deep bass and a durable carry loop.',
    description:
      'Orbit is designed for shared spaces with a rich low end, a weather-resistant shell, and seamless Bluetooth pairing.',
    features: ['Water resistant', '12-hour playback', 'Stereo pair mode'],
    specs: [
      { label: 'Playback', value: '12 hours' },
      { label: 'Ingress', value: 'IPX7' },
      { label: 'Range', value: '30 ft' },
    ],
    accent: 'linear-gradient(135deg, #ffb347, #ff6b81)',
  },
  {
    id: 'grid-desk-mat',
    slug: 'grid-desk-mat',
    name: 'Grid Desk Mat',
    brand: 'Layout',
    category: 'workspace',
    price: 34,
    rating: 4.7,
    reviewCount: 85,
    badge: 'Desk upgrade',
    featured: true,
    summary: 'Large-format desk mat with stitched edges and a low-glare surface.',
    description:
      'The Grid Desk Mat keeps mouse movement smooth and creates a visual anchor for focused work without overpowering the desk.',
    features: ['Micro-texture finish', 'Anti-slip base', 'Easy-clean fabric'],
    specs: [
      { label: 'Size', value: '900 x 400 mm' },
      { label: 'Material', value: 'Poly weave' },
      { label: 'Thickness', value: '3 mm' },
    ],
    accent: 'linear-gradient(135deg, #34d7c8, #7c8cff)',
  },
  {
    id: 'flux-lamp',
    slug: 'flux-lamp',
    name: 'Flux Lamp',
    brand: 'Arc',
    category: 'workspace',
    price: 72,
    rating: 4.9,
    reviewCount: 143,
    badge: 'Editor pick',
    featured: false,
    summary: 'Dimmable task lamp with warm-to-cool light presets.',
    description:
      'Flux keeps a desk lit with adjustable color temperatures, a slim footprint, and touch controls that feel immediate.',
    features: ['Three light modes', 'Touch dimming', 'USB power'],
    specs: [
      { label: 'Lumens', value: '800' },
      { label: 'Modes', value: '3 presets' },
      { label: 'Material', value: 'Aluminum' },
    ],
    accent: 'linear-gradient(135deg, #f59e0b, #ff6b81)',
  },
  {
    id: 'kinetic-bag',
    slug: 'kinetic-bag',
    name: 'Kinetic Bag',
    brand: 'Transit',
    category: 'travel',
    price: 118,
    rating: 4.8,
    reviewCount: 71,
    badge: 'Travel ready',
    featured: true,
    summary: 'Structured carry bag with protective pockets and weatherproof fabric.',
    description:
      'Kinetic is built to keep gear organized with a padded laptop sleeve, quick-access storage, and a resilient shell.',
    features: ['Padded laptop slot', 'Quick-access pocket', 'Weatherproof shell'],
    specs: [
      { label: 'Capacity', value: '24 L' },
      { label: 'Laptop', value: '16 in' },
      { label: 'Weight', value: '0.9 kg' },
    ],
    accent: 'linear-gradient(135deg, #0f172a, #34d7c8)',
  },
  {
    id: 'atlas-jacket',
    slug: 'atlas-jacket',
    name: 'Atlas Jacket',
    brand: 'Fieldline',
    category: 'apparel',
    price: 164,
    rating: 4.7,
    reviewCount: 54,
    badge: 'Limited drop',
    featured: false,
    summary: 'Light shell jacket with a clean silhouette and packable insulation.',
    description:
      'Atlas brings weather resistance and minimal tailoring together, making it easy to layer across changing seasons.',
    features: ['Packable layer', 'Water resistant', 'Hidden chest pocket'],
    specs: [
      { label: 'Shell', value: 'Recycled nylon' },
      { label: 'Fit', value: 'Relaxed' },
      { label: 'Season', value: '3-season' },
    ],
    accent: 'linear-gradient(135deg, #64748b, #7c8cff)',
  },
]

export function getProductBySlug(slug) {
  return PRODUCTS.find((product) => product.slug === slug)
}

export function getProductById(productId) {
  return PRODUCTS.find((product) => product.id === productId)
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
