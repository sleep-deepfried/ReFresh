import { NextResponse } from "next/server";

export type ApiErrorBody = {
  success: false;
  error: { code: string; message: string };
};

export type ApiSuccessBody<T> = {
  success: true;
  data: T;
};

export function jsonError(status: number, code: string, message: string) {
  const body: ApiErrorBody = {
    success: false,
    error: { code, message },
  };
  return NextResponse.json(body, { status });
}

export function jsonSuccess<T>(data: T, status = 200) {
  const body: ApiSuccessBody<T> = { success: true, data };
  return NextResponse.json(body, { status });
}
