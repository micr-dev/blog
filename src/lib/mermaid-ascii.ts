type MermaidEdge = {
  from: string;
  to: string;
  label?: string;
};

/** Clean a label by stripping surrounding quotes and normalizing whitespace. */
function cleanLabel(value: string) {
  return value
    .trim()
    .replace(/^["'`]/, "")
    .replace(/["'`]$/, "")
    .replace(/\s+/g, " ");
}

/**
 * Parse a single flowchart node token (e.g. `A["Label"]`, `B(Circle)`)
 * into its ID and display label. Returns `null` for unrecognized tokens.
 */
function parseFlowNode(token: string) {
  const trimmed = token.trim();
  const patterns = [
    /^([A-Za-z0-9_:-]+)\(\[([^\]]+)\]\)$/,
    /^([A-Za-z0-9_:-]+)\["([^"]+)"\]$/,
    /^([A-Za-z0-9_:-]+)\[([^\]]+)\]$/,
    /^([A-Za-z0-9_:-]+)\(([^)]+)\)$/,
    /^([A-Za-z0-9_:-]+)\{([^}]+)\}$/,
    /^([A-Za-z0-9_:-]+)$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);

    if (!match) {
      continue;
    }

    const [, id, rawLabel] = match;
    return {
      id,
      label: cleanLabel(rawLabel ?? id),
      explicitLabel: typeof rawLabel === "string",
    };
  }

  return null;
}

/**
 * Render a Mermaid flowchart diagram as an ASCII text representation.
 * Parses node declarations and edge definitions, then formats edges
 * as `[Label A] -> [Label B]` (with optional edge labels).
 */
function renderFlowchartAscii(code: string) {
  const lines = code
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("%%"));

  if (lines.length === 0) {
    return null;
  }

  const header = lines[0].match(/^(flowchart|graph)\s+([A-Z]{2})$/i);
  const direction = header?.[2]?.toUpperCase() ?? "TD";
  const labels = new Map<string, string>();
  const edges: MermaidEdge[] = [];

  for (const line of lines.slice(1)) {
    const match = line.match(
      /^(.*?)\s*(?:--\s*"([^"]+)"\s*-->|-->|==>|-.->|---)\s*(.*)$/,
    );

    if (!match) {
      continue;
    }

    const [, left, edgeLabel, right] = match;
    const from = parseFlowNode(left);
    const to = parseFlowNode(right);

    if (!from || !to) {
      continue;
    }

    if (from.explicitLabel || !labels.has(from.id)) {
      labels.set(from.id, from.label);
    }

    if (to.explicitLabel || !labels.has(to.id)) {
      labels.set(to.id, to.label);
    }
    edges.push({
      from: from.id,
      to: to.id,
      label: edgeLabel ? cleanLabel(edgeLabel) : undefined,
    });
  }

  if (edges.length === 0) {
    return null;
  }

  return [
    `Flowchart (${direction})`,
    ...edges.map((edge) => {
      const from = labels.get(edge.from) ?? edge.from;
      const to = labels.get(edge.to) ?? edge.to;
      const label = edge.label ? ` (${edge.label})` : "";

      return `[${from}] ->${label} [${to}]`;
    }),
  ].join("\n");
}

/**
 * Render a Mermaid sequence diagram as an ASCII text representation.
 * Extracts participants, messages, and notes into a flat text format.
 */
function renderSequenceAscii(code: string) {
  const lines = code
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("%%"));

  if (lines.length === 0 || lines[0] !== "sequenceDiagram") {
    return null;
  }

  const participants = new Map<string, string>();
  const output: string[] = ["Sequence"];

  for (const line of lines.slice(1)) {
    const participant = line.match(/^participant\s+([A-Za-z0-9_:-]+)\s+as\s+(.+)$/);

    if (participant) {
      participants.set(participant[1], cleanLabel(participant[2]));
      continue;
    }

    const note = line.match(/^Note\s+over\s+([A-Za-z0-9_:,&\s\-]+)\s*:\s*(.+)$/);

    if (note) {
      const target = note[1]
        .split(",")
        .map((item) => participants.get(item.trim()) ?? item.trim())
        .join(", ");
      output.push(`Note over ${target}: ${cleanLabel(note[2])}`);
      continue;
    }

    const message = line.match(
      /^([A-Za-z0-9_:-]+)\s*(?:-->>|->>|-->|->)\s*([A-Za-z0-9_:-]+)\s*:\s*(.+)$/,
    );

    if (!message) {
      continue;
    }

    const from = participants.get(message[1]) ?? message[1];
    const to = participants.get(message[2]) ?? message[2];
    output.push(`${from} -> ${to}: ${cleanLabel(message[3])}`);
  }

  return output.length > 1 ? output.join("\n") : null;
}

/**
 * Auto-detect a Mermaid diagram type (flowchart or sequence) and render
 * it as a plain-text ASCII representation. Returns `null` for unsupported types.
 */
export function renderMermaidAscii(code: string) {
  const trimmed = code.trim();

  if (trimmed.startsWith("sequenceDiagram")) {
    return renderSequenceAscii(trimmed);
  }

  if (/^(flowchart|graph)\s+/im.test(trimmed)) {
    return renderFlowchartAscii(trimmed);
  }

  return null;
}
