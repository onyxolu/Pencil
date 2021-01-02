import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { tap, switchMap, debounceTime } from 'rxjs/operators';
import MediumEditor from 'medium-editor';
import { AuthService } from 'src/app/services/auth.service';
import { PencilService } from '../../../services/pencil.service';
import { User } from '../../model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent implements OnInit {
  isReady: boolean;
  isNewUser: boolean = false;
  user: User;
  pens: any;
  penDocId: any;
  isLoading: boolean;
  model: any;
  modelChanged: Subject<string> = new Subject<string>();
  @ViewChild('container') container: ElementRef;

  mathJaxObject;

  constructor(
    private pencilService: PencilService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.userdata;
    const isNewUser = this.user.isNewUser;
    if (isNewUser) {
      this.createPen();
      this.isNewUser = true;
    } else this.getPenData();

    this.modelChanged
      .pipe(
        debounceTime(2000),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>
          this.pencilService.updatePenData(this.penDocId, value).then((res) => {
            this.isLoading = false;
            this.renderMath();
          })
        )
      )
      .subscribe((model) => {
        this.model = model;
      });
    this.loadMathConfig();
    this.renderMath();
  }

  ngOnDestroy() {
    this.modelChanged.unsubscribe();
  }

  ngAfterViewInit() {
    const element = this.container.nativeElement;
    const editor = new MediumEditor(element);

    editor.subscribe('editableInput', (event, editable) => {
      const change = document.getElementsByClassName('medium-editor-element')[0]
        .innerHTML;
      let text = change.replace(/\$.*?\$/g, 'meow');
      console.log(text);
      this.modelChanged.next(change);
    });
  }

  getPenData() {
    this.pencilService.getPenData().subscribe((res) => {
      this.pens = res;
      this.getCurrentUserData();
    });
  }

  getCurrentUserData() {
    if (this.isReady) {
      return;
    }
    const allPencils = this.pens;
    for (let i = 0; i < allPencils.length; i++) {
      const pen = allPencils[i].payload.doc;
      if (pen.data().userId == this.user.id) {
        this.penDocId = pen.id;
        document.getElementsByClassName(
          'medium-editor-element'
        )[0].innerHTML = pen.data().penData;
        this.isReady = true;
      }
    }
  }

  createPen() {
    const penData = {
      userId: this.user.id,
      penData: '',
      lastModified: new Date(),
    };
    this.pencilService.createPenData(penData).then((res) => {});
  }

  renderMath() {
    this.mathJaxObject = this.pencilService.nativeGlobal()['MathJax'];
    //setInterval(()=>{},1)
    let angObj = this;
    setTimeout(() => {
      console.log('1234');
      angObj.mathJaxObject.Hub.Queue(
        ['Typeset', angObj.mathJaxObject.Hub],
        'container'
      );
    }, 1000);
  }

  loadMathConfig() {
    console.log('load config');

    this.mathJaxObject = this.pencilService.nativeGlobal()['MathJax'];
    this.mathJaxObject.Hub.Config({
      showMathMenu: false,
      tex2jax: {
        inlineMath: [['$', '$']],
      },
      menuSettings: { zoom: 'Double-Click', zscale: '150%' },
      CommonHTML: { linebreaks: { automatic: true } },
      'HTML-CSS': { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } },
    });
  }
}
