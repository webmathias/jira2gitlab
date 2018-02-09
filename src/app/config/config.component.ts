import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Config} from '../libs/config';

declare const window;
const electron = window.require('electron');
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {

  jiraUser: any;
  jiraPassword: any;
  gitToken: any;

  constructor(public dialogRef: MatDialogRef<ConfigComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.jiraPassword = Config.jiraPassword;
    this.gitToken = Config.gitToken;
    this.jiraUser = Config.jiraUser;
  }

  confirm(jiraUser: any, jiraPassword: any, gitToken: any) {
    Config.jiraPassword = jiraPassword;
    Config.gitToken = gitToken;
    Config.jiraUser = jiraUser;
    const b = electron.ipcRenderer.sendSync('saveConfig', Config);
    this.dialogRef.close();

  }
}
