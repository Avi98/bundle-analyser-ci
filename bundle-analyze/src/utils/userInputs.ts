import tl from "azure-pipelines-task-lib";

require("dotenv").config();

console.log({ tl });

export const isDev = process.env.NODE_ENV === "development";
export const variables = {
  //----env
  Env: {
    //----params
    Params: {
      SourceDirectory: getVariable("build.sourcesDirectory")!,
      BuildDirectory: tl.getInput("buildDir"),
      StaticBuildPath: tl.getInput("staticFilePath"),
      RepositoryId: isDev
        ? process.env.REPOSITORY_ID!
        : getVariable("Build.Repository.ID"),
      PAT: isDev ? process.env.PAT : tl.getInput("PAT"),
    },
    Agent: {
      JobStatus: getVariable("AGENT_JOB_STATUS"),
      Name: getVariable("AGENT_NAME"),
      TempDir: isDev ? process.env.temDir! : getVariable("AGENT_TEMPDIRECTORY"),
    },
    System: {
      AccessToken: getVariable("SYSTEM_ACCESSTOKEN"),
      DefinitionName: getVariable("SYSTEM_DEFINITIONNAME"),
      TeamFoundationServerUri: getVariable("SYSTEM_TEAMFOUNDATIONSERVERURI"),
      TeamProject: getVariable("SYSTEM_TEAMPROJECT"),
      SourceDir: getVariable("BUILD_SOURCE_DIRECTORY"),
      ServerURL: isDev
        ? process.env.SERVER_URL!
        : getVariable("System.TeamFoundationCollectionUri")!,
      PullRequestId: isDev
        ? process.env.PULL_REQUEST_ID!
        : getVariable("System.PullRequest.PullRequestId"),
    },

    //---- debug
    Debug: {
      Pat: getVariable("DEBUG_PAT"),
    },
  },
};

function getVariable(name: string) {
  const v = tl.getVariable(name);

  if (!v) return "";

  return v;
}
