import { tool, which } from "azure-pipelines-task-lib";
import { spawn } from "child_process";
require("dotenv");

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
  //@TODO: remove it before pushing
  const b = "'/Users/avinash/work/agent-dashboard/build/static/js/*.js'";

  const sourceMap = spawn(SOURCE_MAP_EXP, [b, DEFAULT_OUTPUT_FORMATE]);

  let res: any;
  let rej: any;
  let result: Buffer[] | [] = [];

  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  sourceMap.on("error", (error) => rej(error));
  sourceMap.on("exit", (code) => {
    if (code === 1) {
      rej("\nError occurred in" + SOURCE_MAP_EXP + "\n");
    } else {
      if (result && result?.length !== 0)
        res(Buffer.concat(result).toString("utf8"));
      rej("\nError in Buffer concat\n");
    }
  });

  sourceMap.stdout.on("data", (data) => {
    //@ts-expect-error
    result?.push(Buffer.from(data));
  });

  if (!sourceMap || !sourceMap.stdout) {
    rej(
      `${DEFAULT_OUTPUT_FORMATE} didn't generated while running ${SOURCE_MAP_EXP}`
    );
  }

  return promise;
}
