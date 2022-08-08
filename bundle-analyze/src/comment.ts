import { getPersonalAccessTokenHandler, WebApi } from "azure-devops-node-api";
import { IGitApi } from "azure-devops-node-api/GitApi";
import {
  Comment as IComment,
  GitPullRequestCommentThread,
} from "azure-devops-node-api/interfaces/GitInterfaces";
import { debug } from "azure-pipelines-task-lib";
import { variables } from "./utils/userInputs";

export class Comment {
  private serverURL: string;
  private PAT: string;
  private client: ReturnType<typeof this.initClient>;

  constructor() {
    this.PAT = variables.Env.Params.PAT;
    this.serverURL = variables.Env.System.ServerURL;

    //initialize and connect to vss server
    this.init();
  }

  private init() {
    if (!this.PAT || !this.serverURL) throw new Error("Faild in initialize");
    const vm = this.initClient(this.PAT, this.serverURL)!;
    if (vm) this.client = vm;
  }

  private async initClient(pat: string, serverUrl: string) {
    debug(`PAT- ${pat}`);
    debug(`ServerUrl- ${serverUrl}`);
    try {
      if (!pat || !serverUrl) return;

      const handler = getPersonalAccessTokenHandler(pat);
      const connection = new WebApi(serverUrl, handler);
      await connection.connect();

      return connection.getGitApi();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  private async createNewThread(
    pullReqId: number,
    repoId: string,
    markdown: GitPullRequestCommentThread
  ) {
    (await this.client)
      ?.createThread(markdown, repoId, pullReqId)
      .then(() => {
        debug("created new thread");
      })
      .catch((e) => {
        throw e;
      });
  }

  private async updateExistingThread(
    pullReqId: number,
    repoId: string,
    markdown: GitPullRequestCommentThread,
    threadId: number
  ) {
    (await this.client)
      ?.updateThread(markdown, repoId, pullReqId, threadId)
      .then(() => debug("----updated comment----"))
      .catch((e) => {
        throw e;
      });
  }

  private async getAllThreads(pullReqId: number, repoId: string) {
    return await this.client
      ?.then(async (vm) => {
        if (!vm?.getThreads) return;
        console.log(repoId, pullReqId);
        return await vm.getThreads(repoId, pullReqId, "bookshelf");
      })
      .then((res) => res)
      .catch((e) => {
        throw e;
      });
  }

  private isThreadEmpty(comments: IComment[]) {
    return Boolean(comments.filter((c) => c.isDeleted).length);
  }

  async createComment(markdown: string) {
    const pullReqId = Number(variables.Env.System.PullRequestId);
    const repoId = variables.Env.Params.RepositoryId;

    debug("----creating comment----");
    try {
      if (!(pullReqId && typeof pullReqId === "number")) {
        throw new Error("PullReqId not found");
      }

      debug(`pullReqId--${pullReqId}\n`);
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
      debug(`AllThreads length - ${allThreads?.length}\n`);

      if (allThreads?.length === 0)
        await this.createNewThread(pullReqId, repoId, commentPayload);

      for (const thread of allThreads) {
        if (
          thread.comments &&
          thread.properties["bundle-analysis"] &&
          thread.id &&
          !this.isThreadEmpty(thread.comments) &&
          thread.comments[0].id
        ) {
          delete commentPayload.properties;

          await this.updateExistingThread(
            pullReqId,
            repoId,
            commentPayload,
            thread.id
          );
        } else {
          debug(`Creating new thread`);
          await this.createNewThread(pullReqId, repoId, commentPayload);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
