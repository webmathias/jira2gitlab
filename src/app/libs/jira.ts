import {Connection} from './util';
import {Config} from './config';
import {GitIssue} from "./gitlab";
/**
 * Created by mathias on 12/9/17.
 */


export interface JiraIssue {
  name: string;
  description: string;
  type: string;
  key: string;
  status: string;
  android: boolean;
  ios: boolean;
  versao: string;
  syncAndroid: GitIssue;
  syncIOS: GitIssue;
}
export module Jira {
  export function listMilestone() {
    return new Promise<[any]>((resolve, reject) => {
      const url = {
        host: Config.jiraHost,
        port: 443,
        path: Config.jiraBaseURL + Config.jiraBoard + '/sprint/',
        headers: {
          'Authorization': 'Basic ' + btoa(Config.jiraUser + ':' + Config.jiraPassword)
        }
      };
      Connection.get(url)
        .then((data: any) => {
          return resolve(data.values);
        })
        .catch((err) => {

          return reject(err);
        });
    });
  }

  // /rest/api/2/issue/{issueIdOrKey}/comment
  export function addComment(idIssue, comment) {

      const url = {
        host: Config.jiraHost,
        port: 443,
        path: '/rest/api/2/issue/' + idIssue + '/comment',
        headers: {
          'Authorization': 'Basic ' + btoa(Config.jiraUser + ':' + Config.jiraPassword),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        agent: false
      };
      const json = {
        body: comment
      };
      console.log(url);
      console.log(json);
      return Connection.post(url, json);

  }

  export function findMilestone(name, projectId) {
    return new Promise((resolve, reject) => {
      const url = {
        host: Config.jiraHost,
        port: 443,
        path: Config.jiraBaseURL + Config.jiraBoard + '/sprint/',
        headers: {
          'Authorization': 'Basic ' + btoa(Config.jiraUser + ':' + Config.jiraPassword)
        }
      };
      Connection.get(url)
        .then((data: any) => {

          for (const i of data.values) {
            if (i.name === name) {
              resolve(i);
              return;
            }
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });

  }

  export function getIssues(sprint: number, start = 0) {
    return new Promise<Array<JiraIssue>>((resolve, reject) => {
      const url = {
        host: Config.jiraHost,
        port: 443,
        path: Config.jiraBaseURL + Config.jiraBoard + '/sprint/' + sprint + '/issue?startAt=' + start,
        headers: {
          'Authorization': 'Basic ' + btoa(Config.jiraUser + ':' + Config.jiraPassword)
        }
      };
      Connection.get(url, Config.jiraAuthHeader())
        .then((data) => {
          const issues: Array<JiraIssue> = new Array<JiraIssue>();

          for (const v of data['issues']) {
            const item = v;
            const fields = item.fields;
            const status = fields.status ? fields.status.name : ''; // Label
            const type = fields.issuetype ? fields.issuetype.name : ''; // Label
            const key = item.key; // Label
            const name = fields.summary; // Label
            const description = fields.description; // Label
            let android = false;
            let ios = false;
            for (const i of item.fields['components']) {
              if (i.name.toLowerCase() === 'ios') {
                ios = true;
              }
              if (i.name.toLowerCase() === 'android') {
                android = true;
              }
            }
            const versao = item.fields.epic ? item.fields.epic.name : '';

            const issue = {
              'name': name,
              'description': description,
              'type': type,
              'key': key,
              'status': status,
              'android': android,
              'ios': ios,
              'versao': versao,
              'syncAndroid': null,
              'syncIOS': null,
            };
            issues.push(issue);
          }
          if (data['maxResults'] < data['total'] - start) {
            getIssues(sprint, start + data['maxResults']).then((data1: [JiraIssue]) => {
              for (const i of data1) {
                issues.push(i);
              }
              resolve(issues);

            });
          } else {
            resolve(issues);
          }

        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
