"use server";
import { Code } from "@/db/schema";
import { actionClient } from "@/lib/server-action";
import { CodeRepository } from "@/repository/code-repository";
import { TextRepository } from "@/repository/text-repository";
import { textSchema } from "@/schemas/text-schema";
import { nanoid } from "nanoid";

export const createText = actionClient
  .schema(textSchema)
  .action(async ({ parsedInput }) => {
    console.log(parsedInput);
    // Generate a 4 digit code
    try {
      if (!parsedInput.length) throw new Error("No text provided");
      let newCode: string;
      let code: Code | null = null;
      do {
        newCode = nanoid(4);
        code = await CodeRepository.find(newCode);
      } while (code);

      code = await CodeRepository.create(newCode);
      // Loop over parsedInput and create a new text for each item
      parsedInput.forEach(async (text) => {
        await TextRepository.create(text, code.id);
      });

      console.log(code);
      return { success: true, code: newCode };
    } catch (error) {
      console.log("Server action error!", error);
      return { success: false, code: null };
    }
  });
