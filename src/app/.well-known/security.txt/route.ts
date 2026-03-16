const securityText = `Contact: mailto:contact@micr.dev
Expires: 2027-03-16T00:00:00.000Z
Preferred-Languages: en
Canonical: https://blog.micr.dev/.well-known/security.txt
Policy: https://blog.micr.dev/
`;

export function GET() {
  return new Response(securityText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
