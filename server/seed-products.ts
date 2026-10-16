import type { Product } from '../shared/types.ts';

// Demo catalog loaded into the database on first start. Photos come from the dummyjson.com demo API;
// replace them and this data with your own inventory (or manage products in /admin) before going live.
export const seedProducts: Product[] = [
  {
    "id": 1,
    "slug": "floral-print-maxi-gown",
    "name": "Floral Print Maxi Gown",
    "brand": "Elegance Collection",
    "category": "gowns",
    "gender": "women",
    "price": 5999,
    "originalPrice": 7999,
    "rating": 4.6,
    "reviewCount": 142,
    "stock": 25,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Black Floral",
        "hex": "#1f2937"
      }
    ],
    "images": [
      "/images/products/floral-print-maxi-gown/1.webp",
      "/images/products/floral-print-maxi-gown/2.webp",
      "/images/products/floral-print-maxi-gown/3.webp",
      "/images/products/floral-print-maxi-gown/4.webp"
    ],
    "description": "A dramatic floor-length gown with a bold floral print on a deep black base. The fitted bodice and flowing skirt make it a statement piece for evening events.",
    "details": [
      "Polyester satin blend",
      "Fitted bodice, flared skirt",
      "Concealed back zip",
      "Dry clean only"
    ],
    "isBestseller": true,
    "createdAt": "2026-06-01"
  },
  {
    "id": 2,
    "slug": "blue-check-oxford-shirt",
    "name": "Blue Check Oxford Shirt",
    "brand": "Fashion Trends",
    "category": "shirts",
    "gender": "men",
    "price": 1499,
    "originalPrice": 1999,
    "rating": 4.3,
    "reviewCount": 214,
    "stock": 38,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Blue Check",
        "hex": "#4a6fa5"
      }
    ],
    "images": [
      "/images/products/blue-check-oxford-shirt/1.webp",
      "/images/products/blue-check-oxford-shirt/2.webp",
      "/images/products/blue-check-oxford-shirt/3.webp",
      "/images/products/blue-check-oxford-shirt/4.webp"
    ],
    "description": "A crisp everyday shirt in a classic blue-and-white gingham check. Cut from soft brushed cotton with a button-down collar, it works with chinos for the office or denim at the weekend.",
    "details": [
      "100% brushed cotton",
      "Regular fit",
      "Button-down collar",
      "Machine wash cold"
    ],
    "createdAt": "2026-06-12"
  },
  {
    "id": 3,
    "slug": "future-rider-trainers",
    "name": "Future Rider Trainers",
    "brand": "Puma",
    "category": "sneakers",
    "gender": "men",
    "price": 7499,
    "rating": 4.9,
    "reviewCount": 388,
    "stock": 90,
    "sizes": [
      "UK 6",
      "UK 7",
      "UK 8",
      "UK 9",
      "UK 10",
      "UK 11"
    ],
    "colors": [
      {
        "name": "Multicolour",
        "hex": "#1d4ed8"
      }
    ],
    "images": [
      "/images/products/future-rider-trainers/1.webp",
      "/images/products/future-rider-trainers/2.webp",
      "/images/products/future-rider-trainers/3.webp",
      "/images/products/future-rider-trainers/4.webp"
    ],
    "description": "Retro-inspired running trainers with a bold colour-block upper and a lightweight, cushioned sole for all-day comfort.",
    "details": [
      "Nylon and suede upper",
      "Lightweight foam midsole",
      "Rubber outsole",
      "Wipe clean"
    ],
    "isBestseller": true,
    "createdAt": "2026-07-08"
  },
  {
    "id": 4,
    "slug": "tan-leather-hobo-bag",
    "name": "Tan Leather Hobo Bag",
    "brand": "Heshe",
    "category": "bags",
    "gender": "women",
    "price": 7999,
    "originalPrice": 9999,
    "rating": 4.8,
    "reviewCount": 154,
    "stock": 99,
    "sizes": [],
    "colors": [
      {
        "name": "Tan",
        "hex": "#a0522d"
      }
    ],
    "images": [
      "/images/products/tan-leather-hobo-bag/1.webp",
      "/images/products/tan-leather-hobo-bag/2.webp",
      "/images/products/tan-leather-hobo-bag/3.webp"
    ],
    "description": "A slouchy hobo bag in soft tan leather that only gets better with age. Carry it by hand or over the shoulder.",
    "details": [
      "Genuine leather",
      "Zip closure",
      "Interior zip pocket",
      "W 34 × H 30 × D 12 cm"
    ],
    "isBestseller": true,
    "createdAt": "2026-05-22"
  },
  {
    "id": 5,
    "slug": "polka-dot-bow-dress",
    "name": "Polka Dot Bow Dress",
    "brand": "Fashion Trends",
    "category": "dresses",
    "gender": "women",
    "price": 2499,
    "rating": 4.8,
    "reviewCount": 176,
    "stock": 6,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Ivory Dot",
        "hex": "#f1ede4"
      }
    ],
    "images": [
      "/images/products/polka-dot-bow-dress/1.webp",
      "/images/products/polka-dot-bow-dress/2.webp",
      "/images/products/polka-dot-bow-dress/3.webp",
      "/images/products/polka-dot-bow-dress/4.webp"
    ],
    "description": "A sweet fit-and-flare dress in ivory with delicate polka dots, finished with a bow at the waist. Perfect for brunches and garden parties.",
    "details": [
      "Cotton poplin",
      "Fit-and-flare silhouette",
      "Tie bow at the waist",
      "Machine wash cold"
    ],
    "isBestseller": true,
    "createdAt": "2026-07-18"
  },
  {
    "id": 6,
    "slug": "browline-sunglasses",
    "name": "Browline Sunglasses",
    "brand": "Fashion Shades",
    "category": "sunglasses",
    "gender": "unisex",
    "price": 1299,
    "rating": 4.5,
    "reviewCount": 187,
    "stock": 60,
    "sizes": [],
    "colors": [
      {
        "name": "Tortoise",
        "hex": "#5b3a1e"
      }
    ],
    "images": [
      "/images/products/browline-sunglasses/1.webp",
      "/images/products/browline-sunglasses/2.webp",
      "/images/products/browline-sunglasses/3.webp"
    ],
    "description": "Retro browline frames with a tortoiseshell top bar and green-tinted lenses. A timeless shape that suits most faces.",
    "details": [
      "Acetate and metal frame",
      "UV400 protection",
      "Green tinted lenses",
      "Includes case and cleaning cloth"
    ],
    "createdAt": "2026-06-05"
  },
  {
    "id": 7,
    "slug": "air-jordan-1-high-red-and-black",
    "name": "Air Jordan 1 High Red & Black",
    "brand": "Nike",
    "category": "sneakers",
    "gender": "men",
    "price": 12999,
    "rating": 4.8,
    "reviewCount": 512,
    "stock": 7,
    "sizes": [
      "UK 6",
      "UK 7",
      "UK 8",
      "UK 9",
      "UK 10",
      "UK 11"
    ],
    "colors": [
      {
        "name": "Red / Black",
        "hex": "#dc2626"
      }
    ],
    "images": [
      "/images/products/air-jordan-1-high-red-and-black/1.webp",
      "/images/products/air-jordan-1-high-red-and-black/2.webp",
      "/images/products/air-jordan-1-high-red-and-black/3.webp",
      "/images/products/air-jordan-1-high-red-and-black/4.webp"
    ],
    "description": "The iconic high-top basketball silhouette in a classic red, black and white colourway, with a padded collar and cushioned sole.",
    "details": [
      "Leather upper",
      "Rubber cupsole",
      "Padded high-top collar",
      "Wipe clean"
    ],
    "isBestseller": true,
    "createdAt": "2026-05-10"
  },
  {
    "id": 8,
    "slug": "palm-print-summer-maxi-dress",
    "name": "Palm Print Summer Maxi Dress",
    "brand": "Fashion Trends",
    "category": "dresses",
    "gender": "women",
    "price": 1499,
    "rating": 4.8,
    "reviewCount": 263,
    "stock": 43,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Black & White",
        "hex": "#374151"
      }
    ],
    "images": [
      "/images/products/palm-print-summer-maxi-dress/1.webp",
      "/images/products/palm-print-summer-maxi-dress/2.webp",
      "/images/products/palm-print-summer-maxi-dress/3.webp",
      "/images/products/palm-print-summer-maxi-dress/4.webp"
    ],
    "description": "A floaty maxi dress with a monochrome palm-leaf print, cold-shoulder ruffles and a relaxed silhouette made for holidays.",
    "details": [
      "100% rayon",
      "Relaxed fit",
      "Ruffled cold-shoulder neckline",
      "Hand wash"
    ],
    "isBestseller": true,
    "createdAt": "2026-06-08"
  },
  {
    "id": 9,
    "slug": "strappy-heeled-sandals",
    "name": "Strappy Heeled Sandals",
    "brand": "Calvin Klein",
    "category": "heels",
    "gender": "women",
    "price": 5499,
    "rating": 4.9,
    "reviewCount": 221,
    "stock": 93,
    "sizes": [
      "UK 3",
      "UK 4",
      "UK 5",
      "UK 6",
      "UK 7",
      "UK 8"
    ],
    "colors": [
      {
        "name": "Black",
        "hex": "#1f2937"
      }
    ],
    "images": [
      "/images/products/strappy-heeled-sandals/1.webp",
      "/images/products/strappy-heeled-sandals/2.webp",
      "/images/products/strappy-heeled-sandals/3.webp",
      "/images/products/strappy-heeled-sandals/4.webp"
    ],
    "description": "Sculptural heeled sandals with wide black straps and a slim heel. Minimal, modern and comfortable enough to dance in.",
    "details": [
      "Leather straps",
      "90 mm heel",
      "Padded footbed",
      "Wipe clean"
    ],
    "isBestseller": true,
    "createdAt": "2026-06-25"
  },
  {
    "id": 10,
    "slug": "red-buffalo-check-flannel",
    "name": "Red Buffalo Check Flannel",
    "brand": "Classic Wear",
    "category": "shirts",
    "gender": "men",
    "price": 1799,
    "originalPrice": 2299,
    "rating": 4.5,
    "reviewCount": 332,
    "stock": 82,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Red / Black",
        "hex": "#b91c1c"
      }
    ],
    "images": [
      "/images/products/red-buffalo-check-flannel/1.webp",
      "/images/products/red-buffalo-check-flannel/2.webp",
      "/images/products/red-buffalo-check-flannel/3.webp",
      "/images/products/red-buffalo-check-flannel/4.webp"
    ],
    "description": "A cosy flannel shirt in a classic red-and-black buffalo check. Wear it buttoned up, or open over a tee as an overshirt.",
    "details": [
      "100% cotton flannel",
      "Regular fit",
      "Two chest pockets",
      "Machine wash cold"
    ],
    "isBestseller": true,
    "createdAt": "2026-05-20"
  },
  {
    "id": 11,
    "slug": "blue-floral-skater-dress",
    "name": "Blue Floral Skater Dress",
    "brand": "Fashionista",
    "category": "dresses",
    "gender": "women",
    "price": 1999,
    "originalPrice": 2499,
    "rating": 4.2,
    "reviewCount": 119,
    "stock": 52,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Blue Floral",
        "hex": "#60a5fa"
      }
    ],
    "images": [
      "/images/products/blue-floral-skater-dress/1.webp",
      "/images/products/blue-floral-skater-dress/2.webp",
      "/images/products/blue-floral-skater-dress/3.webp",
      "/images/products/blue-floral-skater-dress/4.webp"
    ],
    "description": "A playful sleeveless skater dress with a blue floral print and a full, twirl-ready skirt.",
    "details": [
      "Cotton blend",
      "Fitted waist, flared skirt",
      "Back zip",
      "Machine wash cold"
    ],
    "createdAt": "2026-07-25"
  },
  {
    "id": 12,
    "slug": "navy-structured-tote",
    "name": "Navy Structured Tote",
    "brand": "Fashionista",
    "category": "bags",
    "gender": "women",
    "price": 2999,
    "rating": 4.2,
    "reviewCount": 67,
    "stock": 76,
    "sizes": [],
    "colors": [
      {
        "name": "Navy",
        "hex": "#1e3a8a"
      }
    ],
    "images": [
      "/images/products/navy-structured-tote/1.webp",
      "/images/products/navy-structured-tote/2.webp",
      "/images/products/navy-structured-tote/3.webp"
    ],
    "description": "A roomy structured tote in deep navy with sturdy top handles, big enough for a laptop and everything else.",
    "details": [
      "Faux leather",
      "Top zip closure",
      "Interior zip and slip pockets",
      "W 38 × H 28 × D 14 cm"
    ],
    "createdAt": "2026-06-18"
  },
  {
    "id": 13,
    "slug": "black-strapless-maxi-gown",
    "name": "Black Strapless Maxi Gown",
    "brand": "Elegance Collection",
    "category": "gowns",
    "gender": "women",
    "price": 3999,
    "originalPrice": 4999,
    "rating": 4.7,
    "reviewCount": 205,
    "stock": 33,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Black",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/black-strapless-maxi-gown/1.webp",
      "/images/products/black-strapless-maxi-gown/2.webp",
      "/images/products/black-strapless-maxi-gown/3.webp",
      "/images/products/black-strapless-maxi-gown/4.webp"
    ],
    "description": "A timeless strapless gown in deep black with a structured bodice and a sweeping full-length skirt.",
    "details": [
      "Crepe with satin lining",
      "Structured strapless bodice",
      "Back zip closure",
      "Dry clean only"
    ],
    "isBestseller": true,
    "createdAt": "2026-05-28"
  },
  {
    "id": 14,
    "slug": "arrow-low-top-sneakers-white-and-red",
    "name": "Arrow Low-Top Sneakers White & Red",
    "brand": "Off-White",
    "category": "sneakers",
    "gender": "men",
    "price": 9999,
    "rating": 4.7,
    "reviewCount": 143,
    "stock": 17,
    "sizes": [
      "UK 6",
      "UK 7",
      "UK 8",
      "UK 9",
      "UK 10",
      "UK 11"
    ],
    "colors": [
      {
        "name": "White / Red",
        "hex": "#ef4444"
      }
    ],
    "images": [
      "/images/products/arrow-low-top-sneakers-white-and-red/1.webp",
      "/images/products/arrow-low-top-sneakers-white-and-red/2.webp",
      "/images/products/arrow-low-top-sneakers-white-and-red/3.webp",
      "/images/products/arrow-low-top-sneakers-white-and-red/4.webp"
    ],
    "description": "Chunky low-top sneakers in white leather with red arrow detailing and a contrast heel tab.",
    "details": [
      "Leather upper",
      "Rubber cupsole",
      "Lace-up closure",
      "Wipe clean"
    ],
    "createdAt": "2026-08-20"
  },
  {
    "id": 15,
    "slug": "metallic-gold-pointed-pumps",
    "name": "Metallic Gold Pointed Pumps",
    "brand": "Fashion Diva",
    "category": "heels",
    "gender": "women",
    "price": 2999,
    "originalPrice": 3999,
    "rating": 4.2,
    "reviewCount": 76,
    "stock": 88,
    "sizes": [
      "UK 3",
      "UK 4",
      "UK 5",
      "UK 6",
      "UK 7",
      "UK 8"
    ],
    "colors": [
      {
        "name": "Gold",
        "hex": "#d4a24c"
      }
    ],
    "images": [
      "/images/products/metallic-gold-pointed-pumps/1.webp",
      "/images/products/metallic-gold-pointed-pumps/2.webp",
      "/images/products/metallic-gold-pointed-pumps/3.webp",
      "/images/products/metallic-gold-pointed-pumps/4.webp"
    ],
    "description": "Party-ready pumps in a champagne-gold metallic finish, with a pointed toe and a sleek stiletto heel.",
    "details": [
      "Metallic synthetic upper",
      "100 mm stiletto heel",
      "Cushioned insole",
      "Wipe clean"
    ],
    "isNew": true,
    "createdAt": "2026-09-18"
  },
  {
    "id": 16,
    "slug": "green-tartan-casual-shirt",
    "name": "Green Tartan Casual Shirt",
    "brand": "Urban Chic",
    "category": "shirts",
    "gender": "men",
    "price": 1599,
    "rating": 4.2,
    "reviewCount": 128,
    "stock": 95,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Green Check",
        "hex": "#3f7d5c"
      }
    ],
    "images": [
      "/images/products/green-tartan-casual-shirt/1.webp",
      "/images/products/green-tartan-casual-shirt/2.webp",
      "/images/products/green-tartan-casual-shirt/3.webp",
      "/images/products/green-tartan-casual-shirt/4.webp"
    ],
    "description": "A soft cotton shirt in a muted green tartan check. Easy to layer, and smart enough for dinner out.",
    "details": [
      "100% cotton twill",
      "Slim fit",
      "Spread collar",
      "Machine wash cold"
    ],
    "createdAt": "2026-08-05"
  },
  {
    "id": 17,
    "slug": "linen-button-front-midi-dress",
    "name": "Linen Button-Front Midi Dress",
    "brand": "Casual Comfort",
    "category": "dresses",
    "gender": "women",
    "price": 2299,
    "rating": 4,
    "reviewCount": 47,
    "stock": 55,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Stone",
        "hex": "#d6d3c4"
      }
    ],
    "images": [
      "/images/products/linen-button-front-midi-dress/1.webp",
      "/images/products/linen-button-front-midi-dress/2.webp",
      "/images/products/linen-button-front-midi-dress/3.webp",
      "/images/products/linen-button-front-midi-dress/4.webp"
    ],
    "description": "A minimal sleeveless midi dress in breathable linen, with a full button front and a gently tailored fit.",
    "details": [
      "55% linen, 45% cotton",
      "Regular fit",
      "Full button front",
      "Machine wash cold, line dry"
    ],
    "createdAt": "2026-08-12"
  },
  {
    "id": 18,
    "slug": "gradient-aviator-sunglasses",
    "name": "Gradient Aviator Sunglasses",
    "brand": "Fashion Shades",
    "category": "sunglasses",
    "gender": "unisex",
    "price": 1199,
    "originalPrice": 1599,
    "rating": 4.2,
    "reviewCount": 143,
    "stock": 1,
    "sizes": [],
    "colors": [
      {
        "name": "Silver",
        "hex": "#9ca3af"
      }
    ],
    "images": [
      "/images/products/gradient-aviator-sunglasses/1.webp",
      "/images/products/gradient-aviator-sunglasses/2.webp",
      "/images/products/gradient-aviator-sunglasses/3.webp"
    ],
    "description": "Classic metal aviators with blue-gradient lenses and adjustable nose pads.",
    "details": [
      "Metal frame",
      "UV400 protection",
      "Gradient lenses",
      "Includes case and cleaning cloth"
    ],
    "createdAt": "2026-07-15"
  },
  {
    "id": 19,
    "slug": "aorus-graphic-t-shirt",
    "name": "Aorus Graphic T-Shirt",
    "brand": "Gigabyte",
    "category": "shirts",
    "gender": "men",
    "price": 899,
    "rating": 4,
    "reviewCount": 96,
    "stock": 90,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "White",
        "hex": "#f5f5f5"
      }
    ],
    "images": [
      "/images/products/aorus-graphic-t-shirt/1.webp",
      "/images/products/aorus-graphic-t-shirt/2.webp",
      "/images/products/aorus-graphic-t-shirt/3.webp",
      "/images/products/aorus-graphic-t-shirt/4.webp"
    ],
    "description": "A relaxed crew-neck tee with a bold front graphic. Heavyweight cotton jersey keeps its shape wash after wash.",
    "details": [
      "100% cotton jersey, 180 GSM",
      "Relaxed fit",
      "Ribbed crew neck",
      "Machine wash cold, inside out"
    ],
    "isNew": true,
    "createdAt": "2026-09-10"
  },
  {
    "id": 20,
    "slug": "scarlet-satin-evening-gown",
    "name": "Scarlet Satin Evening Gown",
    "brand": "Fashion Diva",
    "category": "gowns",
    "gender": "women",
    "price": 4499,
    "rating": 4.4,
    "reviewCount": 58,
    "stock": 30,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Scarlet",
        "hex": "#dc2626"
      }
    ],
    "images": [
      "/images/products/scarlet-satin-evening-gown/1.webp",
      "/images/products/scarlet-satin-evening-gown/2.webp",
      "/images/products/scarlet-satin-evening-gown/3.webp",
      "/images/products/scarlet-satin-evening-gown/4.webp"
    ],
    "description": "A floor-length satin gown in vivid scarlet with a sweetheart neckline and a softly gathered skirt. Made for weddings, galas and every occasion that deserves an entrance.",
    "details": [
      "Satin with inner lining",
      "Sweetheart neckline",
      "Concealed back zip",
      "Dry clean only"
    ],
    "isNew": true,
    "createdAt": "2026-09-15"
  },
  {
    "id": 21,
    "slug": "black-top-handle-satchel",
    "name": "Black Top-Handle Satchel",
    "brand": "Elegance Collection",
    "category": "bags",
    "gender": "women",
    "price": 3499,
    "rating": 4.4,
    "reviewCount": 109,
    "stock": 11,
    "sizes": [],
    "colors": [
      {
        "name": "Black",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/black-top-handle-satchel/1.webp",
      "/images/products/black-top-handle-satchel/2.webp",
      "/images/products/black-top-handle-satchel/3.webp"
    ],
    "description": "A polished satchel in black with a sturdy top handle and a detachable strap. Structured, sleek and office-ready.",
    "details": [
      "Pebbled faux leather",
      "Top zip closure",
      "Detachable shoulder strap",
      "W 30 × H 24 × D 13 cm"
    ],
    "createdAt": "2026-08-10"
  },
  {
    "id": 22,
    "slug": "baseball-cleats-white-and-green",
    "name": "Baseball Cleats White & Green",
    "brand": "Nike",
    "category": "sneakers",
    "gender": "men",
    "price": 6999,
    "originalPrice": 8499,
    "rating": 4.1,
    "reviewCount": 64,
    "stock": 12,
    "sizes": [
      "UK 6",
      "UK 7",
      "UK 8",
      "UK 9",
      "UK 10",
      "UK 11"
    ],
    "colors": [
      {
        "name": "White / Green",
        "hex": "#166534"
      }
    ],
    "images": [
      "/images/products/baseball-cleats-white-and-green/1.webp",
      "/images/products/baseball-cleats-white-and-green/2.webp",
      "/images/products/baseball-cleats-white-and-green/3.webp",
      "/images/products/baseball-cleats-white-and-green/4.webp"
    ],
    "description": "Mid-top baseball cleats with a supportive ankle strap and moulded studs for grip on the diamond.",
    "details": [
      "Synthetic upper",
      "Moulded cleat outsole",
      "Hook-and-loop ankle strap",
      "Wipe clean"
    ],
    "createdAt": "2026-06-15"
  },
  {
    "id": 23,
    "slug": "tartan-bow-party-dress",
    "name": "Tartan Bow Party Dress",
    "brand": "Elegance Collection",
    "category": "dresses",
    "gender": "women",
    "price": 2199,
    "rating": 4.4,
    "reviewCount": 88,
    "stock": 73,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Black & White Check",
        "hex": "#4b5563"
      }
    ],
    "images": [
      "/images/products/tartan-bow-party-dress/1.webp",
      "/images/products/tartan-bow-party-dress/2.webp",
      "/images/products/tartan-bow-party-dress/3.webp",
      "/images/products/tartan-bow-party-dress/4.webp"
    ],
    "description": "A classic black-and-white tartan party dress with a full skirt and a satin bow at the waist.",
    "details": [
      "Polyester check with satin trim",
      "Fit-and-flare silhouette",
      "Back zip",
      "Machine wash cold"
    ],
    "isNew": true,
    "createdAt": "2026-09-12"
  },
  {
    "id": 24,
    "slug": "black-pointed-toe-heels",
    "name": "Black Pointed-Toe Heels",
    "brand": "Pampi",
    "category": "heels",
    "gender": "women",
    "price": 1899,
    "rating": 4.1,
    "reviewCount": 53,
    "stock": 49,
    "sizes": [
      "UK 3",
      "UK 4",
      "UK 5",
      "UK 6",
      "UK 7",
      "UK 8"
    ],
    "colors": [
      {
        "name": "Black",
        "hex": "#0f0f0f"
      }
    ],
    "images": [
      "/images/products/black-pointed-toe-heels/1.webp",
      "/images/products/black-pointed-toe-heels/2.webp",
      "/images/products/black-pointed-toe-heels/3.webp",
      "/images/products/black-pointed-toe-heels/4.webp"
    ],
    "description": "Elegant pointed-toe heels in matte black with a comfortable mid-height stiletto.",
    "details": [
      "Faux suede upper",
      "85 mm heel",
      "Cushioned insole",
      "Brush clean"
    ],
    "createdAt": "2026-07-30"
  },
  {
    "id": 25,
    "slug": "green-mirror-aviators",
    "name": "Green Mirror Aviators",
    "brand": "Fashion Shades",
    "category": "sunglasses",
    "gender": "unisex",
    "price": 1499,
    "rating": 4.6,
    "reviewCount": 97,
    "stock": 24,
    "sizes": [],
    "colors": [
      {
        "name": "Sea Green",
        "hex": "#34d399"
      }
    ],
    "images": [
      "/images/products/green-mirror-aviators/1.webp",
      "/images/products/green-mirror-aviators/2.webp",
      "/images/products/green-mirror-aviators/3.webp"
    ],
    "description": "Lightweight aviators with sea-green mirrored lenses for a bold, summery look.",
    "details": [
      "Metal frame",
      "UV400 protection",
      "Mirrored lenses",
      "Includes case and cleaning cloth"
    ],
    "createdAt": "2026-08-18"
  },
  {
    "id": 26,
    "slug": "sage-tiered-mini-dress",
    "name": "Sage Tiered Mini Dress",
    "brand": "Fashion Diva",
    "category": "dresses",
    "gender": "women",
    "price": 1799,
    "originalPrice": 2599,
    "rating": 4.3,
    "reviewCount": 71,
    "stock": 22,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Sage",
        "hex": "#7fa99b"
      }
    ],
    "images": [
      "/images/products/sage-tiered-mini-dress/1.webp",
      "/images/products/sage-tiered-mini-dress/2.webp",
      "/images/products/sage-tiered-mini-dress/3.webp",
      "/images/products/sage-tiered-mini-dress/4.webp"
    ],
    "description": "A strapless mini dress in soft sage green with a layered, tiered skirt that adds movement with every step.",
    "details": [
      "Georgette with lining",
      "Strapless with inner grip tape",
      "Tiered skirt",
      "Hand wash"
    ],
    "isNew": true,
    "createdAt": "2026-09-05"
  },
  {
    "id": 27,
    "slug": "sky-blue-saffiano-tote",
    "name": "Sky Blue Saffiano Tote",
    "brand": "Prada",
    "category": "bags",
    "gender": "women",
    "price": 34999,
    "rating": 4.5,
    "reviewCount": 38,
    "stock": 75,
    "sizes": [],
    "colors": [
      {
        "name": "Sky Blue",
        "hex": "#7dd3fc"
      }
    ],
    "images": [
      "/images/products/sky-blue-saffiano-tote/1.webp",
      "/images/products/sky-blue-saffiano-tote/2.webp",
      "/images/products/sky-blue-saffiano-tote/3.webp"
    ],
    "description": "A luxurious structured tote in sky-blue saffiano leather with rolled handles and a detachable shoulder strap.",
    "details": [
      "Saffiano leather",
      "Detachable shoulder strap",
      "Fabric lining with interior pockets",
      "W 33 × H 24 × D 15 cm"
    ],
    "createdAt": "2026-07-12"
  },
  {
    "id": 28,
    "slug": "arrow-court-sneakers-white",
    "name": "Arrow Court Sneakers White",
    "brand": "Off-White",
    "category": "sneakers",
    "gender": "men",
    "price": 8999,
    "originalPrice": 10999,
    "rating": 4.6,
    "reviewCount": 97,
    "stock": 62,
    "sizes": [
      "UK 6",
      "UK 7",
      "UK 8",
      "UK 9",
      "UK 10",
      "UK 11"
    ],
    "colors": [
      {
        "name": "White",
        "hex": "#f5f5f5"
      }
    ],
    "images": [
      "/images/products/arrow-court-sneakers-white/1.webp",
      "/images/products/arrow-court-sneakers-white/2.webp",
      "/images/products/arrow-court-sneakers-white/3.webp",
      "/images/products/arrow-court-sneakers-white/4.webp"
    ],
    "description": "Clean white court sneakers with tonal arrow panels and a red heel accent. Easy to pair with everything.",
    "details": [
      "Leather upper",
      "Rubber cupsole",
      "Lace-up closure",
      "Wipe clean"
    ],
    "isNew": true,
    "createdAt": "2026-09-08"
  },
  {
    "id": 29,
    "slug": "tropical-print-resort-shirt",
    "name": "Tropical Print Resort Shirt",
    "brand": "Casual Comfort",
    "category": "shirts",
    "gender": "men",
    "price": 1299,
    "rating": 4.1,
    "reviewCount": 87,
    "stock": 2,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "Blue Tropical",
        "hex": "#2563eb"
      }
    ],
    "images": [
      "/images/products/tropical-print-resort-shirt/1.webp",
      "/images/products/tropical-print-resort-shirt/2.webp",
      "/images/products/tropical-print-resort-shirt/3.webp",
      "/images/products/tropical-print-resort-shirt/4.webp"
    ],
    "description": "A breezy short-sleeve shirt covered in a blue tropical leaf print. Lightweight viscose drapes well and keeps you cool on hot days.",
    "details": [
      "100% viscose",
      "Relaxed fit",
      "Camp collar",
      "Hand wash or gentle cycle"
    ],
    "createdAt": "2026-07-02"
  },
  {
    "id": 30,
    "slug": "classic-black-stiletto-pumps",
    "name": "Classic Black Stiletto Pumps",
    "brand": "Comfort Trends",
    "category": "heels",
    "gender": "women",
    "price": 1499,
    "rating": 4,
    "reviewCount": 58,
    "stock": 3,
    "sizes": [
      "UK 3",
      "UK 4",
      "UK 5",
      "UK 6",
      "UK 7",
      "UK 8"
    ],
    "colors": [
      {
        "name": "Black",
        "hex": "#111111"
      }
    ],
    "images": [
      "/images/products/classic-black-stiletto-pumps/1.webp",
      "/images/products/classic-black-stiletto-pumps/2.webp",
      "/images/products/classic-black-stiletto-pumps/3.webp",
      "/images/products/classic-black-stiletto-pumps/4.webp"
    ],
    "description": "Pointed-toe stiletto pumps in glossy black. The versatile heel for office days and evenings out.",
    "details": [
      "Patent synthetic upper",
      "100 mm stiletto heel",
      "Cushioned insole",
      "Wipe clean"
    ],
    "createdAt": "2026-05-15"
  },
  {
    "id": 31,
    "slug": "pixel-party-glasses",
    "name": "Pixel Party Glasses",
    "brand": "Fashion Fun",
    "category": "sunglasses",
    "gender": "unisex",
    "price": 499,
    "rating": 3.9,
    "reviewCount": 211,
    "stock": 86,
    "sizes": [],
    "colors": [
      {
        "name": "Black / Pink",
        "hex": "#ec4899"
      }
    ],
    "images": [
      "/images/products/pixel-party-glasses/1.webp",
      "/images/products/pixel-party-glasses/2.webp",
      "/images/products/pixel-party-glasses/3.webp"
    ],
    "description": "Novelty pixel-art glasses for parties, photo booths and making an entrance. Not intended for sun protection.",
    "details": [
      "Plastic frame",
      "Tinted pixel lenses",
      "One size fits most",
      "Wipe clean"
    ],
    "createdAt": "2026-07-05"
  },
  {
    "id": 32,
    "slug": "maroon-long-sleeve-midi-dress",
    "name": "Maroon Long-Sleeve Midi Dress",
    "brand": "Urban Chic",
    "category": "dresses",
    "gender": "women",
    "price": 3299,
    "rating": 4.5,
    "reviewCount": 64,
    "stock": 0,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "Maroon",
        "hex": "#7f1d1d"
      }
    ],
    "images": [
      "/images/products/maroon-long-sleeve-midi-dress/1.webp",
      "/images/products/maroon-long-sleeve-midi-dress/2.webp",
      "/images/products/maroon-long-sleeve-midi-dress/3.webp",
      "/images/products/maroon-long-sleeve-midi-dress/4.webp"
    ],
    "description": "A sleek column dress in rich maroon with contrast long sleeves. The clean, straight cut is effortlessly elegant from desk to dinner.",
    "details": [
      "Stretch crepe",
      "Straight fit",
      "Contrast long sleeves",
      "Dry clean recommended"
    ],
    "createdAt": "2026-06-20"
  },
  {
    "id": 33,
    "slug": "white-faux-leather-backpack",
    "name": "White Faux Leather Backpack",
    "brand": "Urban Chic",
    "category": "bags",
    "gender": "women",
    "price": 2499,
    "originalPrice": 3299,
    "rating": 4,
    "reviewCount": 82,
    "stock": 39,
    "sizes": [],
    "colors": [
      {
        "name": "White",
        "hex": "#f5f5f4"
      }
    ],
    "images": [
      "/images/products/white-faux-leather-backpack/1.webp",
      "/images/products/white-faux-leather-backpack/2.webp",
      "/images/products/white-faux-leather-backpack/3.webp"
    ],
    "description": "A compact backpack in clean white faux leather with a drawstring top and flap closure. Stylish and hands-free.",
    "details": [
      "Faux leather",
      "Drawstring and flap closure",
      "Adjustable straps",
      "W 26 × H 32 × D 12 cm"
    ],
    "isNew": true,
    "createdAt": "2026-09-02"
  },
  {
    "id": 34,
    "slug": "red-patent-stilettos",
    "name": "Red Patent Stilettos",
    "brand": "Fashion Express",
    "category": "heels",
    "gender": "women",
    "price": 2199,
    "rating": 4.3,
    "reviewCount": 91,
    "stock": 7,
    "sizes": [
      "UK 3",
      "UK 4",
      "UK 5",
      "UK 6",
      "UK 7",
      "UK 8"
    ],
    "colors": [
      {
        "name": "Red",
        "hex": "#dc2626"
      }
    ],
    "images": [
      "/images/products/red-patent-stilettos/1.webp",
      "/images/products/red-patent-stilettos/2.webp",
      "/images/products/red-patent-stilettos/3.webp",
      "/images/products/red-patent-stilettos/4.webp"
    ],
    "description": "Statement stilettos in high-shine red patent. Add instant colour to a little black dress or a tailored suit.",
    "details": [
      "Patent synthetic upper",
      "100 mm stiletto heel",
      "Cushioned insole",
      "Wipe clean"
    ],
    "createdAt": "2026-08-01"
  },
  {
    "id": 35,
    "slug": "clear-frame-oversized-glasses",
    "name": "Clear Frame Oversized Glasses",
    "brand": "Fashion Shades",
    "category": "sunglasses",
    "gender": "unisex",
    "price": 999,
    "rating": 4,
    "reviewCount": 44,
    "stock": 27,
    "sizes": [],
    "colors": [
      {
        "name": "Clear",
        "hex": "#e5e7eb"
      }
    ],
    "images": [
      "/images/products/clear-frame-oversized-glasses/1.webp",
      "/images/products/clear-frame-oversized-glasses/2.webp",
      "/images/products/clear-frame-oversized-glasses/3.webp"
    ],
    "description": "Oversized square frames in crystal-clear acetate with gold rivets. A fashion-forward finishing touch.",
    "details": [
      "Acetate frame",
      "UV400 protection",
      "Clear lenses",
      "Includes case and cleaning cloth"
    ],
    "isNew": true,
    "createdAt": "2026-09-20"
  }
];
