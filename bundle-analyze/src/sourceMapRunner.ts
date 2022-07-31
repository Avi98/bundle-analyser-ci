import { tool, which } from "azure-pipelines-task-lib";
import { exec, spawn, spawnSync } from "child_process";
import { stderr } from "process";

require("dotenv").config();
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
  console.log({ buildPath });
  const sourceMap = spawn(SOURCE_MAP_EXP, [buildPath, DEFAULT_OUTPUT_FORMATE]);

  let res: any;
  let rej: any;
  let result: Buffer[] | [] = [];

  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  sourceMap.on("exit", (code) => {
    if (code === 1) {
      console.error("\nError occurred in " + SOURCE_MAP_EXP + "\n");
    } else {
      if (result && result?.length !== 0) {
        res(Buffer.concat(result).toString("utf8"));
        console.log("Completed Reading code");
      }
      rej("\nError in Buffer concat\n");
    }
  });

  sourceMap.on("error", (e) => console.log("e", e));

  sourceMap.stdout.on("data", (data) => {
    //@ts-expect-error
    result?.push(Buffer.from(data));
  });

  sourceMap.stderr.on("error", (error) => {
    rej(error);
  });

  return promise;
}
