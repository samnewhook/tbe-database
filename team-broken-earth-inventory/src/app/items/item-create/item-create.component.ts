import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ItemsService } from '../items.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Item } from '../item.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {
  enteredItemInfo = '';
  enteredItemTitle = '';
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private itemId: string;
  item: Item;
  imagePreview: string;

  constructor(public itemsService: ItemsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('itemId')) {
        this.mode = 'edit';
        this.itemId = paramMap.get('itemId');
        this.isLoading = true;
        this.itemsService.getItem(this.itemId).subscribe(itemData => {
          this.isLoading = false;
          this.item = {
            id: itemData._id, 
            title: itemData.title, 
            content: itemData.content, 
            imagePath: itemData.imagePath
          };
          this.form.setValue({
            title: this.item.title, 
            content: this.item.content,
            image: this.item.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.itemId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    }

  onSaveItem() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.itemsService.addItem(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.itemsService.updateItem(
        this.itemId, 
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }
}
