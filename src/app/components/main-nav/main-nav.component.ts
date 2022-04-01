import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.sass']
})
export class MainNavComponent implements OnInit {

  listDisabled: boolean = false;
  workoutDisabled: boolean = false;

  @Output() userOpen: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onUserClick() {
    this.userOpen.emit(null);
  }

}
