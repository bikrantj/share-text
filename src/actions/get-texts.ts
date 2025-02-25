"use server";
import { actionClient } from "@/lib/server-action";
import { CodeRepository } from "@/repository/code-repository";
import { TextRepository } from "@/repository/text-repository";
import { z } from "zod";
const GetTextSchema = z.object({
  code: z.string().min(1).max(4),
});
export const getTexts = actionClient
  .schema(GetTextSchema)
  .action(async ({ parsedInput }) => {
    const code = parsedInput.code;
    const codeData = await CodeRepository.find(code);
    if (!codeData) return null;
    const texts = await TextRepository.findMany(codeData.id);
    return texts;
  });
