import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import { ItemsService } from '../items.service';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent {
  enteredItemInfo = '';
  enteredItemTitle = '';

  constructor(public itemsService: ItemsService) {}

  onAddItem(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.itemsService.addItem(form.value.title, form.value.content);
    form.resetForm();
  }
}
