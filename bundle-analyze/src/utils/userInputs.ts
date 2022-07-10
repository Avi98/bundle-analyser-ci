import { getInput, getVariable } from "azure-pipelines-task-lib";

require("dotenv").config();

export const isDev = process.env.NODE_ENV === "development";
export const variables = {
  //----env
  Env: {
    //----params
    Params: {
      SourceDirectory: getNonNullVariable("build.sourcesDirectory")!,
      BuildDirectory: getInput("buildDir"),
      StaticBuildPath: getInput("staticFilePath"),
      RepositoryId: isDev
        ? process.env.REPOSITORY_ID!
        : getNonNullVariable("Build.Repository.ID"),
      PAT: isDev ? process.env.PAT : getInput("PAT"),
    },
    Agent: {
      JobStatus: getNonNullVariable("AGENT_JOB_STATUS"),
      Name: getNonNullVariable("AGENT_NAME"),
      TempDir: isDev
        ? process.env.temDir!
        : getNonNullVariable("AGENT_TEMPDIRECTORY"),
    },
    System: {
      AccessToken: getNonNullVariable("SYSTEM_ACCESSTOKEN"),
      DefinitionName: getNonNullVariable("SYSTEM_DEFINITIONNAME"),
      TeamFoundationServerUri: getNonNullVariable(
        "SYSTEM_TEAMFOUNDATIONSERVERURI"
      ),
      TeamProject: getNonNullVariable("SYSTEM_TEAMPROJECT"),
      SourceDir: getNonNullVariable("BUILD_SOURCE_DIRECTORY"),
      ServerURL: isDev
        ? process.env.SERVER_URL!
        : getNonNullVariable("System.TeamFoundationCollectionUri")!,
      PullRequestId: isDev
        ? process.env.PULL_REQUEST_ID!
        : Number(getNonNullVariable("System.PullRequest.PullRequestId")),
    },

    //---- debug
    Debug: {
      Pat: getNonNullVariable("DEBUG_PAT"),
    },
  },
};

function getNonNullVariable(name: string) {
  const v = getVariable(name);

  if (!v) return "";

  return v;
}
