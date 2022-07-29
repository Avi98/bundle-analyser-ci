require("dotenv").config();

import { getInput, getVariable } from "azure-pipelines-task-lib";

export const isDev = process.env.NODE_ENV === "development";

export const variables = {
  //----env
  Env: {
    //----params
    Params: {
      SourceDirectory: getNonNullVariable("build.sourcesDirectory")!,
      BuildDirectory: getUserInput("buildDir"),
      StaticBuildPath: getUserInput("staticFilePath"),
      RepositoryId: getNonNullVariable("Build.Repository.ID"),
      PAT: getUserInput("pat"),
    },
    Agent: {
      JobStatus: getNonNullVariable("AGENT_JOB_STATUS"),
      Name: getNonNullVariable("AGENT_NAME"),
      TempDir: getNonNullVariable("AGENT_TEMPDIRECTORY"),
    },
    System: {
      AccessToken: getNonNullVariable("SYSTEM_ACCESSTOKEN"),
      DefinitionName: getNonNullVariable("SYSTEM_DEFINITIONNAME"),
      TeamFoundationServerUri: getNonNullVariable(
        "System.TeamFoundationCollectionUri"
      ),
      TeamProject: getNonNullVariable("System.teamProject"),
      SourceDir: getNonNullVariable("BUILD_SOURCE_DIRECTORY"),
      ServerURL: getNonNullVariable("System.TeamFoundationCollectionUri")!,
      PullRequestId: getNonNullVariable("System.PullRequest.PullRequestId")!,
    },

    //---- debug
    Debug: {
      Pat: getNonNullVariable("DEBUG_PAT"),
    },
  },
};

function getNonNullVariable(name: string) {
  if (isDev) {
    const envStr = name.replace(/\./g, "_").toUpperCase()!;
    return process.env[envStr]!;
  }
  const v = getVariable(name);

  if (!v) return "";

  return v;
}

function getUserInput(inputString: string): string {
  if (isDev) {
    const envString = `INPUT_${inputString.toUpperCase()}`;
    return process.env[envString]!;
  }
  return getInput(inputString)!;
}
