import { db } from "@/db";
import { codes } from "@/db/schema";
import { getExpiryDate } from "@/lib/utils";
import { eq } from "drizzle-orm";

const EXPIRES_IN = Number(process.env.CODE_EXPIRES_IN!);

export class CodeRepository {
  static async create(code: string) {
    const expiryDate = getExpiryDate(EXPIRES_IN);

    const res = await db
      .insert(codes)
      .values({ code, expiresAt: expiryDate })
      .returning();
    return res[0];
  }

  static async find(code: string) {
    const res = await db.select().from(codes).where(eq(codes.code, code));
    if (res[0]) return res[0];
    return null;
  }

  static async delete(code: string) {
    await db.delete(codes).where(eq(codes.code, code));
  }
}
