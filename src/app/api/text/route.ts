// app/api/text/route.ts
import { CodeRepository } from "@/repository/code-repository";
import { TextRepository } from "@/repository/text-repository";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type ResponseData<T> = {
  message: string;
  data: T | null;
  success: boolean;
  errorTitle?: "CODE_EXPIRED" | "INVALID_CODE" | "NO_TEXTS_FOUND";
};

export async function GET(request: NextRequest) {
  // Extract the `code` query parameter
  const code = request.nextUrl.searchParams.get("code");
  let responseData: ResponseData<{ texts: string[]; expiresAt: Date }>;
  // Validate the `code` parameter
  if (!code) {
    responseData = {
      message: "Missing 'code' query parameter",
      success: false,
      data: null,
      errorTitle: "INVALID_CODE",
    };
    return NextResponse.json(responseData, { status: 404 });
  }
  const codeData = await CodeRepository.find(code);
  if (!codeData) {
    responseData = {
      message: "Code not found",
      success: false,
      data: null,
      errorTitle: "INVALID_CODE",
    };
    return NextResponse.json(responseData, { status: 400 });
  }
  if (codeData.expiresAt < new Date()) {
    responseData = {
      message: "Code expired",
      success: false,
      data: null,
      errorTitle: "CODE_EXPIRED",
    };
    return NextResponse.json(responseData, { status: 400 });
  }

  // Process the request (e.g., fetch data, perform logic, etc.)
  const texts = await TextRepository.findMany(codeData.id);
  if (!texts.length) {
    responseData = {
      message: "No texts found",
      success: false,
      data: null,
      errorTitle: "NO_TEXTS_FOUND",
    };
    return NextResponse.json(responseData, { status: 400 });
  }
  responseData = {
    message: "Success!",
    data: {
      texts: texts.map((text) => text.content),
      expiresAt: codeData.expiresAt,
    },
    success: true,
  };

  // Return the response
  return NextResponse.json(responseData, { status: 200 });
}
