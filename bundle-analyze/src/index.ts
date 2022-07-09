require("dotenv").config();

import * as path from "path";
import { variables } from "./utils/userInputs";
import { sourceMapRunner } from "./build-analyer/sourceMapRunner";
import { debug, setResult, TaskResult } from "azure-pipelines-task-lib";

main();
/**
 * 1. get build dir path 👍
 * 2. npm install source-map-explorer 👍
 * if install then get 👍
 * 3. read csv data 👍
 * 4. generate table for all the report.
 * 5. create a azure comment and send it on PR.
 * 6. publish on azure
 * 8. create a README.md file
 */

console.log({ build: variables.Env.Params.BuildDirectory });
async function main() {
  try {
    const buildDir = variables.Env.Params.BuildDirectory;
    const staticFilePattern = variables.Env.Params.StaticBuildPath;
    console.log("build", buildDir);

    if (!buildDir || !staticFilePattern)
      throw new Error("buildDir or StaticFilePattern not found ");

    const staticFilesPath = path.join(buildDir, staticFilePattern);
    await sourceMapRunner(staticFilesPath);
  } catch (e) {
    debug("failed");
    console.error(e);
    setResult(TaskResult.Failed, e.message);
  }
}
