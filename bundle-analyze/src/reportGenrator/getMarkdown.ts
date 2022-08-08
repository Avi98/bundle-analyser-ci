import { formatBytes } from "./utils";
import table from "markdown-table";

export function getMarkdownFromJson(report: Record<string, any>[]) {
  const result = report.reduce(
    (acc: string[][], pr) => {
      return [...acc, [pr.bundleName, formatBytes(pr.totalBytes)]];
    },
    [["File/chunk Name", "size"]]
  );

  return table(result);
}
