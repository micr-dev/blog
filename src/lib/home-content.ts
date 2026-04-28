import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

/** Absolute path to the home-page ASCII art source file. */
const HOME_ASCII_PATH = path.join(
  process.cwd(),
  "content",
  "home",
  "ascii.txt",
);

/**
 * Read and cache the ASCII art displayed on the home page.
 * @returns UTF-8 text content rendered in the home hero block.
 */
export const getHomeAscii = cache(async () => {
  return fs.readFile(HOME_ASCII_PATH, "utf8");
});
