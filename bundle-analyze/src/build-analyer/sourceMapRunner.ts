import { tool, which } from "azure-pipelines-task-lib";

const SOURCE_MAP_EXP = "source-map-explorer";
const DEFAULT_OUTPUT_FORMATE = "--json";

export async function sourceMapRunner(buildPath: string) {
  const hasSourceMapExp = which(SOURCE_MAP_EXP);
  if (!hasSourceMapExp) {
    await installSourceMap();
  }
  return runSourceMap(buildPath);
}

async function installSourceMap() {
  return tool(which("npm", true))
    .arg("install")
    .arg("-g")
    .arg(SOURCE_MAP_EXP)
    .exec({ silent: true })
    .catch((e: Error) => {
      throw e;
    });
}

function runSourceMap(buildPath: string) {
  const source = tool(which(SOURCE_MAP_EXP, true))
    .arg(buildPath)
    .arg(DEFAULT_OUTPUT_FORMATE)
    .execSync({ silent: true });

  let res: any;
  let rej: any;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  if (!source)
    rej(
      `${DEFAULT_OUTPUT_FORMATE} didn't generated while running ${SOURCE_MAP_EXP}`
    );
  res(source);
  return promise;
}
