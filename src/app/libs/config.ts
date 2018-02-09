export module Config {
  export const jiraHost = '';
  export let jiraUser = '';
  export let jiraPassword = '';
  export const jiraBaseURL = '/rest/agile/1.0/board/';
  export const jiraBoard = 97;

  export function jiraFullURL() {
    return 'https://' + jiraHost + jiraBaseURL + jiraBoard;
  }

  export function jiraAuthHeader() {
    return window.btoa(encodeURIComponent(jiraUser) + ':' + jiraPassword);
  }

  export const gitHost = '';
  export let gitToken = '';
  export const gitBaseURL = '/api/v4';

  export function gitFullURL() {
    return 'https://' + gitHost + gitBaseURL + '';
  }

  export function gitAuth() {
    return '?private_token=' + gitToken + '&per_page=100';
  }

}
