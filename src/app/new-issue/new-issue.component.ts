import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatFormFieldControl} from '@angular/material';
import {GitLab} from '../libs/gitlab';
import {Jira} from "../libs/jira";
import {Config} from '../libs/config'

@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.css']
})
export class NewIssueComponent {
  title: string;
  projectID: number;
  description: string;
  milestone: any;
  label: any;
  jiraID: string;
  gitIssue: any;

  constructor(public dialogRef: MatDialogRef<NewIssueComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.projectID = data.projectID;
    this.title = data.title;
    this.label = data.label;
    this.description = ' # Jira Description\n';
    this.description += data.description;
    this.description += '\n\n\n';
    this.description += '# Jira\n';
    this.description += ' - [' + data.id + '](https://' + Config.jiraBaseURL + '/browse/' + data.id + ')\n';
    this.description += ' - Type: ' + data.type + '\n';
    this.description += ' - Version: ' + data.versao + '\n';

    this.milestone = data.milestone;
    this.jiraID = data.id;
  }

  async confirmJira() {
    const jiraissue: any = await Jira.addComment(this.jiraID, 'Git: ' + this.gitIssue.iid);
    this.dialogRef.close(this.gitIssue);
  }

  async confirm() {
    const issue = {
      id: this.projectID,
      title: this.title,
      labels: this.label,
      description: this.description,
      milestone_id: this.milestone.id
    };

    const gitissue: any = await GitLab.addIssue(issue, this.projectID);
    this.gitIssue = gitissue;

  }

}
