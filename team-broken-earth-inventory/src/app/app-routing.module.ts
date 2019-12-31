import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemCreateComponent } from './items/item-create/item-create.component';

const routes: Routes = [
    { path: '', component: ItemListComponent },
    { path: 'create', component: ItemCreateComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}