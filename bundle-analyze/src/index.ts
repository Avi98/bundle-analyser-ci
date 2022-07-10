require("dotenv").config();

import * as path from "path";
import { variables } from "./utils/userInputs";
import { sourceMapRunner } from "./sourceMapRunner";
import { debug, setResult, TaskResult } from "azure-pipelines-task-lib";
import { getMarkdownFromJson } from "./reportGenrator/getMarkdown";

main();
/**
 * 1. get build dir path 👍
 * 2. npm install source-map-explorer 👍
 * if install then get 👍
 * 3. read json data 👍
 * 4. generate table for all the report. 👍
 * 5. create a  comment thread and send it on PR. 👍
 * 6. publish on azure
 * 8. create a README.md file
 */

async function main() {
  try {
    const buildDir = variables.Env.Params.BuildDirectory;
    const staticFilePattern = variables.Env.Params.StaticBuildPath;

    if (!buildDir || !staticFilePattern)
      throw new Error("buildDir or StaticFilePattern not found ");

    const staticFilesPath = path.join(buildDir, staticFilePattern);

    await sourceMapRunner(staticFilesPath)
      .then((response: any) => response.results)
      .then((result) => getMarkdownFromJson(result))
      .then((html) => {
        //create comment
        console.log(html);
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    debug("failed");
    console.error(e);
    setResult(TaskResult.Failed, e.message);
  }
}
