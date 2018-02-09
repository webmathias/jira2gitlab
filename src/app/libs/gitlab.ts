import {Connection} from './util';
import {Config} from './config';
/**
 * Created by mathias on 12/6/17.
 */

export interface GitAuthor {
  state: string;
  id: number;
  name: string;
  avatar_url: string;
  username: string;
}
export interface GitIssue {

  state: string;
  description: string;
  author: GitAuthor;
  milestone: {
    project_id: number,
    description: string,
    state: string,
    iid: number,
    title: string,
    id: number
  };
  project_id: number;
  assignees: [GitAuthor];
  assignee: GitAuthor;
  updated_at: string;
  closed_at: string;
  id: number;
  title: string;
  created_at: string;
  iid: number;
  labels: [any];
  user_notes_count: number;
  due_date: string;
  web_url: string;
  time_stats: {
    time_estimate: number,
    total_time_spent: number,
    human_time_estimate: number,
    human_total_time_spent: number
  };
  confidential: boolean;
  discussion_locked: boolean;

}

export module GitLab {

  export function listMilestone(projectId: Number) {
    return new Promise<any>((resolve, reject) => {
      const url = Config.gitFullURL() + '/projects/' + projectId + '/milestones' + Config.gitAuth() + '&state=active';
      Connection.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  export function findMilestone(projectId: Number, name: string) {
    return new Promise<any>((resolve, reject) => {
      const url = Config.gitFullURL() + '/projects/' + projectId + '/milestones' + Config.gitAuth() + '&state=active';
      Connection.get(url)
        .then((data) => {
          for (const i in data) {
            if (data[i].title === name) {
              resolve(data[i]);
              return;
            }
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });

  }

  export function addIssue(issue: any, projectId: number) {


      const options = {
        hostname: Config.gitHost,
        port: 443,
        path: Config.gitBaseURL + '/projects/' + projectId + '/issues',
        headers: {
          'Content-Type': 'application/json',
          'Private-Token': Config.gitToken
        },
        agent: false
      };
      return Connection.post(options, issue);

  }

  export function getIssues(projectId: Number, sprintName: string) {
    return new Promise((resolve, reject) => {
      const url = Config.gitFullURL() + '/projects/' + projectId + '/issues' + Config.gitAuth()
        + '&milestone=' + encodeURIComponent(sprintName);
      Connection.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}


