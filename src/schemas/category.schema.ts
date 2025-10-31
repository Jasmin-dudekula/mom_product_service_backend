import { z } from "zod";

export const category = z.object({
  name: z.string(),
});

export type CategoryInput = z.infer<typeof category>;