import * as path from "path";
import tl from "azure-pipelines-task-lib";
import { variables } from "./utils/userInputs";
import { sourceMapRunner } from "./build-analyer/sourceMapRunner";

console.log("main---->");
// const buildDir = variables.Env.Params.BuildDirectory;
// console.log({ buildDir });

main();
/**
 * 1. get build dir path
 *  2. npm install source-map-explorer
 * if install then get
 * 3. iterate over the json and find all the path and nested path
 * 4. generate table for all the report.
 * 5. create a azure comment and send it on PR.
 */
async function main() {
  try {
    const buildDir = variables.Env.Params.BuildDirectory;
    const staticFilePattern = variables.Env.Params.StaticBuildPath;
    console.log("build", buildDir);
    console.log("build", buildDir);

    if (!buildDir || !staticFilePattern) throw new Error("buildDir or ");

    const staticFilesPath = path.join(buildDir, staticFilePattern);
    await sourceMapRunner(staticFilesPath);
  } catch (e) {
    tl.debug("failed");
    tl.setResult(tl.TaskResult.Failed, e.message);
  }
}
