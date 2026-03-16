import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

const HOME_ASCII_PATH = path.join(
  process.cwd(),
  "content",
  "home",
  "ascii.txt",
);

export const getHomeAscii = cache(async () => {
  return fs.readFile(HOME_ASCII_PATH, "utf8");
});
