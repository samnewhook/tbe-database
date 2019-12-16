import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemCreateComponent } from './items/item-create/item-create.component';
import {  FormsModule  } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ItemCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
