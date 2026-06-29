import { extractRefugioReplayFromHtml } from "@/lib/refugio-replay";

const jobIdPattern = /^[a-f0-9]{12}$/i;

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId")?.trim() ?? "";

  if (!jobIdPattern.test(jobId)) {
    return jsonError("Expected a 12-character REFUGIO job ID.", 400);
  }

  const replayUrl = `https://refugio-hackathon-nine.vercel.app/replays/${jobId}`;
  const response = await fetch(replayUrl, {
    cache: "force-cache",
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    return jsonError(`REFUGIO returned ${response.status} for job ${jobId}.`, 502);
  }

  try {
    const replay = extractRefugioReplayFromHtml(await response.text());
    const headers = new Headers({
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    });

    if (url.searchParams.get("download") === "1") {
      headers.set(
        "Content-Disposition",
        `attachment; filename="refugio-replay-${jobId}.json"`,
      );
    }

    return Response.json(replay, { headers });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Could not parse the REFUGIO replay.";

    return jsonError(message, 502);
  }
}
