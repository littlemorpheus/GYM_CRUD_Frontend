import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemRetrievalService } from 'services/item-retrieval.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.sass']
})
export class ItemListComponent implements OnInit {
  _ITEM: any;
  itemList: any[] = [];

  current_item: string = '';

  constructor(
    route: ActivatedRoute,
    reterieval: ItemRetrievalService
    ) {
    route.params.subscribe(val => {
      this._ITEM = val;
      this.itemList = ['ITEM A', 'ITEM B', 'ITEM C', 'ITEM D', 'ITEM E'];
      reterieval.getAll(this._ITEM.item, 'name')?.subscribe(val => {
        this.itemList = val
      })
    })
   }

  ngOnInit(): void {
  }

  onclick(item: string) {
    if (this.current_item == item){
      this.current_item = ''
      //setTimeout(() => {this.current_item = ''}, 1000);
      return
    }
    this.current_item = item;
    console.log(this.current_item)
  }

  addItem(): void {

  }
  delItem(): void {

  }

  output(msg: string){
    console.log(msg)
  }

}
