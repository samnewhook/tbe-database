import { Component } from '@angular/core';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html'
})
export class ItemCreateComponent {
  enteredValue = '';
  newItem = 'NO CONTENT';

  onAddItem() {
    this.newItem = this.enteredValue;
  }
}
