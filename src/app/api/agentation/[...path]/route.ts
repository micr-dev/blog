import type { NextRequest } from "next/server";

const upstreamOrigin =
  process.env.AGENTATION_UPSTREAM_ORIGIN ?? "http://127.0.0.1:4747";

function buildUpstreamUrl(request: NextRequest, path: string[]) {
  const upstreamUrl = new URL(`${upstreamOrigin}/${path.join("/")}`);
  upstreamUrl.search = new URL(request.url).search;
  return upstreamUrl;
}

function copyRequestHeaders(request: NextRequest) {
  const headers = new Headers();

  for (const [key, value] of request.headers.entries()) {
    if (key === "host" || key === "connection" || key === "content-length") {
      continue;
    }

    headers.set(key, value);
  }

  return headers;
}

function copyResponseHeaders(response: Response) {
  const headers = new Headers(response.headers);

  headers.delete("content-length");
  headers.delete("content-encoding");

  return headers;
}

async function forward(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  const { path = [] } = await params;
  const upstreamUrl = buildUpstreamUrl(request, path);
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.text() : undefined;

  const response = await fetch(upstreamUrl, {
    method: request.method,
    headers: copyRequestHeaders(request),
    body,
    redirect: "manual",
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: copyResponseHeaders(response),
  });
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
export const OPTIONS = forward;
