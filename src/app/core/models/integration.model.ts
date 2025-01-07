import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type Commits = RestEndpointMethodTypes['repos']['listCommits']['response']['data']
export type Pulls = RestEndpointMethodTypes['pulls']['list']['response']['data'];
export type Issues = RestEndpointMethodTypes['issues']['listForRepo']['response']['data'];
export type Orgs = RestEndpointMethodTypes['orgs']['listForAuthenticatedUser']['response']['data'];
export type Repos = RestEndpointMethodTypes['repos']['listForOrg']['response']['data'];



export interface IGithubIntegration {
  userId: string; // GitHub User ID
  username: string; // GitHub Username
  token: string; // Access Token
  connectedAt?: Date;
  lastSync?: Date;
}
