import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
declare const window;
declare const Vivus;
const electron = window.require('electron');
import {GitIssue, GitLab} from './libs/gitlab';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {Jira} from './libs/jira';
import {Config} from './libs/config';
import {ConfigComponent} from './config/config.component';
import {ErrorComponent} from './error/error.component';
import {animate, AnimationBuilder, style} from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jiramilestones: [any];
  gitiosMilesones: [any];
  gitandroidMilesones: [any];
  jiramilestone: any;
  gitiosmilestone: any;
  gitandroidmilestone: any;
  readyconfig = false;
  title = 'app';
  gitIssues: Array<GitIssue>;
  @ViewChild('logo') logo: ElementRef;
  @ViewChild('svg_logo') svg_logo: ElementRef;
  @ViewChild('svg_4') svg_4: ElementRef;
  @ViewChild('svg_v') svg_v: ElementRef;
  @ViewChild('svg_i') svg_i: ElementRef;
  @ViewChild('svg_s') svg_s: ElementRef;
  @ViewChild('svg_ii') svg_ii: ElementRef;
  @ViewChild('svg_o') svg_o: ElementRef;
  @ViewChild('svg_n') svg_n: ElementRef;
  @ViewChild('polaroid') polaroid: ElementRef;

  config() {
    this.readyconfig = false;
    const dialogRef = this.dialog.open(ConfigComponent, {
      width: '600px',
      data: {
        xx: 'xx'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.readyconfig = true;
      this.updateData();
    });
  }

  confirm(jiraUser: any, jiraPassword: any, gitToken: any) {
    Config.jiraPassword = jiraPassword;
    Config.gitToken = gitToken;
    Config.jiraUser = jiraUser;
    const b = electron.ipcRenderer.sendSync('saveConfig', Config);
    this.readyconfig = true;
    this.updateData();

  }

  configIsReady() {
    return this.readyconfig && Config.gitToken && Config.jiraUser && Config.jiraPassword;
  }

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public dialog: MatDialog, private _builder: AnimationBuilder) {
    iconRegistry.addSvgIcon('android', sanitizer.bypassSecurityTrustResourceUrl('assets/static/ic_android_black_24px.svg'));
    iconRegistry.addSvgIcon('apple', sanitizer.bypassSecurityTrustResourceUrl('assets/static/ic_phone_iphone_black_24px.svg'));
    iconRegistry.addSvgIcon('config', sanitizer.bypassSecurityTrustResourceUrl('assets/static/ic_settings_black_24px.svg'));
  }

  updateData() {
    if (!this.configIsReady()) {
      return;
    }

    Promise.all([Jira.listMilestone(), GitLab.listMilestone(32), GitLab.listMilestone(31)]).then((data) => {
      this.jiramilestones = data[0];
      this.gitiosMilesones = data[1];
      this.gitandroidMilesones = data[2];
    }).catch((err) => {
      console.log('error', err);
      this.readyconfig = false;
      const dialogRef = this.dialog.open(ErrorComponent, {
        width: '600px',
        data: {
          title: 'Erro on request',
          message: err
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.config();

      });
    });
  }

  ngOnInit() {




    const ret = electron.ipcRenderer.sendSync('loadConfig');
    Config.gitToken = ret.gitToken;
    Config.jiraUser = ret.jiraUser;
    Config.jiraPassword = ret.jiraPassword;

  }

  ngAfterViewInit() {

    new Vivus(this.logo.nativeElement, {
      duration: 150,
      type: 'sync',
      animTimingFunction: Vivus.EASE_IN,
      pathTimingFunction: Vivus.EASE_IN
    }, () => {
      console.log('terminou');
      // this.svg_logo.nativeElement.setAttribute('fill', '#39d4f6');
      // const a = 'translate(' + (Math.random() * 100) + 'px,' + (Math.random() * 100) + 'px)';
      // console.log(a);
      const animation = this._builder.build([
          animate(500, style({
              fill: '#39d4f6',
              stroke: '#FFFFFF'
            })
          )
        ])
      ;
      const player = animation.create(this.svg_logo.nativeElement);
      player.play();
      const animation1 = this._builder.build([
        animate(600, style({
            fill: '#1c155b',
            stroke: '#FFFFFF'
          })
        )
      ]);
      animation1.create(this.svg_4.nativeElement).play();
      animation1.create(this.svg_v.nativeElement).play();
      animation1.create(this.svg_i.nativeElement).play();
      animation1.create(this.svg_s.nativeElement).play();
      animation1.create(this.svg_ii.nativeElement).play();
      animation1.create(this.svg_o.nativeElement).play();
      animation1.create(this.svg_n.nativeElement).play();
      setTimeout(() => {
        this.readyconfig = true;
        this.updateData();

      }, 1000);
    });


  }


  gitIssuesUpdated(value: Array<GitIssue>) {
    this.gitIssues = value;
  }
}

