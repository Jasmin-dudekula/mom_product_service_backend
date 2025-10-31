import * as z from "zod";
export const subcategory=z.object({
    name:z.string(),
    img:z.string().optional(),
    category: z.string(),
})
export type subcategoryInput=z.infer<typeof subcategory>