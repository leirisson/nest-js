import { z } from 'zod'


export const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8, 'No mino de caracteres devem ser 8.')
})

export type CreacAccountDTO = z.infer<typeof createAccountBodySchema>