require("dotenv").config();

import * as path from "path";
import { debug, setResult, TaskResult } from "azure-pipelines-task-lib";
import { isDev, variables } from "./utils/userInputs";
import { sourceMapRunner } from "./sourceMapRunner";
import { Comment } from "./utils/comment";
import { getMarkdownFromJson } from "./reportGenrator/getMarkdown";

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

const buildDir = variables.Env.Params.BuildDirectory;
const staticFilePattern = !isDev
  ? variables.Env.Params.StaticBuildPath
  : "/static/js/*.js";

const staticFilesPath = path.join(buildDir, staticFilePattern);

console.log({ version: "0.0.15" });

sourceMapRunner(staticFilesPath)
  .then((res: any) => JSON.parse(res))
  .then((result) => {
    return getMarkdownFromJson(result.results);
  })
  .then(async (html) => {
    const comment = new Comment();
    await comment.createComment(html);
  })
  .catch((e) => {
    debug("failed");
    console.error(e);
    setResult(TaskResult.Failed, e.message);
  });
