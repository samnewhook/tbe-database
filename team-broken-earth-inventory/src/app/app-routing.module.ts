import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemCreateComponent } from './items/item-create/item-create.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', component: ItemListComponent },
    { path: 'create', component: ItemCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:itemId', component: ItemCreateComponent, canActivate: [AuthGuard] },
    { path: "auth", loadChildren: "./auth/auth.module#AuthModule"}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}