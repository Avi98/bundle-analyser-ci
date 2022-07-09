import { tool, which } from "azure-pipelines-task-lib";

const SOURCE_MAP_EXP = "source-map-explorer";
const DEFAULT_OUTPUT_FORMATE = "csv";

export async function sourceMapRunner(buildPath: string) {
  const hasSourceMapExp = which(SOURCE_MAP_EXP);
  if (!hasSourceMapExp) {
    await installSourceMap();
  }
  return await runSourceMap(buildPath).then((csvReport) => {
    console.log("csvReport", csvReport);
  });
}

async function installSourceMap() {
  await tool(which("npm", true))
    .arg("install")
    .arg("-g")
    .arg(SOURCE_MAP_EXP)
    .exec()
    .catch((e: Error) => {
      throw e;
    });
}

async function runSourceMap(buildPath: string) {
  return await tool(which(SOURCE_MAP_EXP, true))
    .arg(buildPath)
    .arg(DEFAULT_OUTPUT_FORMATE);
}
