import { z } from "zod";

export const textSchema = z.array(z.string().min(1));
