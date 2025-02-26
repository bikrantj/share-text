import { ResponseData } from "@/app/api/text/route";
import { getBaseUrl } from "@/lib/utils";
import { cache } from "react";

export const getTexts = cache(async (code: string) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/text?code=${code}`);
  const data = (await res.json()) as ResponseData<{
    texts: string[];
    expiresAt: Date;
  }>;
  return data;
});
