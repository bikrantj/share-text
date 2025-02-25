import { db } from "@/db";
import { texts } from "@/db/schema";
import { eq } from "drizzle-orm";

export class TextRepository {
  static async create(content: string, codeId: number) {
    const res = await db.insert(texts).values({ codeId, content }).returning();
    return res[0];
  }

  static async findMany(codeId: number) {
    const res = await db.select().from(texts).where(eq(texts.codeId, codeId));
    return res;
  }
}
