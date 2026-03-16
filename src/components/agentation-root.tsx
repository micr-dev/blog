"use client";

import { Agentation } from "agentation";

const agentationEndpoint =
  process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT ?? "/api/agentation";

export function AgentationRoot() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <Agentation endpoint={agentationEndpoint} />;
}
