import { NextRequest, NextResponse } from "next/server";

export type ExtractedScanImage = { base64: string; mimeType: string };

const MAX_BYTES = 12 * 1024 * 1024;

/**
 * Reads multipart `image` field, validates type/size, returns base64 or error JSON response.
 */
export async function extractScanImageFromRequest(
  req: NextRequest
): Promise<ExtractedScanImage | NextResponse> {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Expected multipart form data" },
      },
      { status: 400 }
    );
  }

  const file = formData.get("image");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Missing image field" },
      },
      { status: 400 }
    );
  }

  const mimeType = file.type?.trim() || "image/jpeg";
  if (!mimeType.startsWith("image/")) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "File must be an image" },
      },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Empty image" },
      },
      { status: 400 }
    );
  }

  if (buf.length > MAX_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Image too large" },
      },
      { status: 400 }
    );
  }

  return { base64: buf.toString("base64"), mimeType };
}
