import { z } from 'zod';
import { categories } from './store-rules.ts';
import type { CategoryId } from './types.ts';

// Validation shared by browser forms and the API, so both enforce exactly the same rules.

const categoryIds = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];

// Trim and lowercase before checking the format, so " Asha@Example.com " is accepted and stored consistently.
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(80),
  email: emailSchema,
  password: z.string().min(8, 'Use at least 8 characters').max(200),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password').max(200),
  asAdmin: z.boolean().optional(),
});

export const shippingSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter the recipient’s full name').max(80),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{4}\s?\d{5}$/, 'Enter a valid 10-digit mobile number'),
  address: z.string().trim().min(5, 'Enter your house number and street').max(200),
  city: z.string().trim().min(2, 'Enter your city').max(60),
  state: z.string().trim().min(2, 'Enter your state').max(60),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit PIN code'),
});

export const upiIdPattern = /^[\w.-]{2,}@[a-zA-Z]{2,}$/;

/** What the browser sends to place an order. Prices are never trusted from the client. */
export const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        size: z.string().max(20).optional(),
        color: z.string().max(40),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, 'Your bag is empty')
    .max(50),
  shipping: shippingSchema,
  payment: z.discriminatedUnion('method', [
    z.object({ method: z.literal('card'), cardLast4: z.string().regex(/^\d{4}$/) }),
    z.object({ method: z.literal('upi'), upiId: z.string().trim().regex(upiIdPattern, 'Enter a valid UPI ID') }),
    z.object({ method: z.literal('cod') }),
  ]),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

const imagePath = z.string().regex(/^\/(uploads|images)\/[\w\-./]+$/, 'Invalid image');
const price = z.number({ error: 'Enter an amount in rupees' }).int('Use whole rupees').positive('Must be more than 0').max(10_000_000);
const stock = z.number({ error: 'Enter a quantity' }).int('Use a whole number').min(0, 'Cannot be negative').max(100_000);

export const productInputSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter a product name').max(120),
    brand: z.string().trim().min(1, 'Enter a brand').max(60),
    category: z.enum(categoryIds, 'Choose a category'),
    gender: z.enum(['men', 'women', 'unisex']),
    price,
    originalPrice: price.nullable(),
    stock,
    sizes: z.array(z.string().trim().min(1).max(20)).max(20),
    colors: z
      .array(
        z.object({
          name: z.string().trim().min(1, 'Enter a colour name').max(40),
          hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Pick a colour'),
        }),
      )
      .min(1, 'Add at least one colour')
      .max(12),
    images: z.array(imagePath).min(1, 'Add at least one photo').max(10, 'Up to 10 photos'),
    description: z.string().trim().min(10, 'Write at least a sentence').max(2000),
    details: z.array(z.string().trim().min(1).max(200)).max(20),
    isNew: z.boolean(),
    isBestseller: z.boolean(),
  })
  .refine((p) => p.originalPrice === null || p.originalPrice > p.price, {
    path: ['originalPrice'],
    message: 'Original price must be higher than the selling price',
  });

export type ProductInput = z.infer<typeof productInputSchema>;

/** Quick edits from the admin product list. */
export const productPatchSchema = z
  .object({ price, originalPrice: price.nullable(), stock })
  .partial()
  .refine((p) => Object.keys(p).length > 0, 'Nothing to update');

export const orderStatusSchema = z.object({ status: z.enum(['pending', 'delivered']) });
