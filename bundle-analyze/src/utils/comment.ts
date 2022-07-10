import { getPersonalAccessTokenHandler, WebApi } from "azure-devops-node-api";
import { IGitApi } from "azure-devops-node-api/GitApi";
import { GitPullRequestCommentThread } from "azure-devops-node-api/interfaces/GitInterfaces";
import { debug } from "azure-pipelines-task-lib";
import { variables } from "../utils/userInputs";

export class Comment {
  #serverURL: string | undefined;
  #PAT: string | undefined;
  #client: null | Promise<IGitApi>;

  constructor() {
    this.#client = this.initClient()!;
    this.#PAT = variables.Env.Params.PAT;
    this.#serverURL = variables.Env.System.ServerURL;
  }

  private initClient() {
    const pat = this.#PAT;
    const serverUrl = this.#serverURL;
    if (!pat || !serverUrl) return;

    const handler = getPersonalAccessTokenHandler(pat);
    const connection = new WebApi(serverUrl, handler);

    debug("----connection established----");
    return connection.getGitApi();
  }

  private async createNewThread(
    pullReqId: number,
    repoId: string,
    markdown: GitPullRequestCommentThread
  ) {
    (await this.#client)
      ?.createThread(markdown, repoId, pullReqId)
      .catch(() => {
        throw new Error("New comment thread not created");
      });
  }

  private async updateExistingThread(
    pullReqId: number,
    repoId: string,
    markdown: GitPullRequestCommentThread,
    threadId: number
  ) {
    (await this.#client)
      ?.updateThread(markdown, repoId, pullReqId, threadId)
      .then(() => debug("----updated comment----"))
      .catch((e) => {
        throw e;
      });
  }

  private async getAllThreads(pullReqId: number, repoId: string) {
    return this.#client?.then(
      async ({ getThreads }) => await getThreads(repoId, pullReqId)
    );
  }

  async createComment(markdown: string) {
    const pullReqId = variables.Env.System.PullRequestId;
    const repoId = variables.Env.Params.RepositoryId;
    debug("----creating comment----");

    try {
      if (!(pullReqId && typeof pullReqId === "number")) return;

      const commentPayload = <GitPullRequestCommentThread>{
        comments: [
          {
            content: markdown,
          },
        ],
        properties: {
          "bundle-analysis": true,
        },
      };
      const allThreads = await this.getAllThreads(pullReqId, repoId);
      if (!allThreads) return;
      if (allThreads?.length === 0)
        await this.createNewThread(pullReqId, repoId, commentPayload);

      for (const thread of allThreads) {
        if (thread.properties["bundle-analysis"] && thread.id) {
          await this.updateExistingThread(
            pullReqId,
            repoId,
            commentPayload,
            thread.id
          );
        } else {
          await this.createNewThread(pullReqId, repoId, commentPayload);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
