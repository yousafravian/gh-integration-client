import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export interface IRepository {
  repoName: string;
  commits: RestEndpointMethodTypes['repos']['listCommits']['response']['data']
  pulls: RestEndpointMethodTypes['pulls']['list']['response']['data'];
  issues: RestEndpointMethodTypes['issues']['listForRepo']['response']['data'];
}

export interface IGithubIntegration {
  userId: string; // GitHub User ID
  username: string; // GitHub Username
  token: string; // Access Token
  connectedAt?: Date;
  lastSync?: Date;
  organizations?: Array<{
    organization: string,
    repositories: Array<IRepository>,
  }>;
}
