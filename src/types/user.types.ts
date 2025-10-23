import { email, z } from 'zod';

export const userSchemaTypes = z.object({
    name: z
        .string()
        .min(3, { error: 'Name must be at least 3 characters long' })
        .max(50, { error: 'Name cannot exceed 50 characters' }),

    email: z.email({ error: 'Please provide a valid email address' }),

    password: z
        .string()
        .min(8, { error: 'Password must be at least 8 characters long' }),

    preferences: z
        .array(z.string())
        .default([]),
});
export type userType = z.infer<typeof userSchemaTypes>;
export const loginVaildationTypes = z.object({
    email: z.email({ error: 'Provide a Vaild email Address' }),
    password: z.string().min(8, { error: 'Password must be at least 8 characters long' }),
})

