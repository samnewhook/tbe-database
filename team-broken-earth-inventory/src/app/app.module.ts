import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemCreateComponent } from './items/item-create/item-create.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderComponent } from './header/header.component'
import { ItemListComponent } from './items/item-list/item-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemCreateComponent,
    HeaderComponent,
    ItemListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
