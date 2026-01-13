// @/constants/navLinks.ts

export interface NavLink {
  id: number
  label: string
  href: string
  description: string
}

export const NAV_LINKS: NavLink[] = [
  { 
    id: 1, 
    label: 'Home', 
    href: './',
    description: 'The sixth element welcomes you. Mirai treats you to contemporary luxury through world-class amenities and a premium lifestyle.'
  },
  { 
    id: 2, 
    label: 'Amenities', 
    href: './amenities',
    description: 'Discover the curated amenities at Mirai, each of which is designed for your comfort and wellness with the purpose of elevating your lifestyle.'
  },
  { 
    id: 3, 
    label: 'Location', 
    href: 'https://azure-baboon-302476.hostingersite.com/mirai_/locations.html',
    description: 'Rising at the heart of Financial District, Mirai places you at the pinnacle of opportunity through locational advantage.'
  },
  { 
    id: 4, 
    label: 'Map', 
    href: './Maps',
    description: "Explore the detailed layout of our community with interactive maps that show you just how close you are to the city's soul."
  },
  { 
    id: 5, 
    label: 'Life @ MIRAI', 
    href: './Life@Mirai',
    description: 'Envision your life at the exclusive Mirai where every day is filled with meaningful interactions and each night ends with limitless indulgence.'
  },
  { 
    id: 6, 
    label: 'Contact Us', 
    href: '#footer',
    description: 'Reach out to us to have your queries answered and schedule a private viewing.'
  }
]
