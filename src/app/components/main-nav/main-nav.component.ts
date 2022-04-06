import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClientService } from 'services/client.service';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.sass']
})
export class MainNavComponent implements OnInit {

  listDisabled: boolean = false;
  workoutDisabled: boolean = false;

  user: Object | null = null;
  name: string = 'Guest';

  @Output() userOpen: EventEmitter<any> = new EventEmitter();

  constructor(
    private client: ClientService
  ) { }

  ngOnInit(): void {
    this.client.getInfo().subscribe(
      data => {
        console.log("Get Info")
        this.user = data
        console.log(data)
        if('nickname' in data) this.name = data['nickname']
        console.log(data)
      }
    )
  }

  onUserClick() {
    this.userOpen.emit(null);
  }

}
