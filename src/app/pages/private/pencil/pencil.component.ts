import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import MediumEditor from 'medium-editor';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent implements OnInit {
  name = 'Angular';
  @ViewChild('container') container: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const element = this.container.nativeElement;
    const editor = new MediumEditor(element);
  }
}
