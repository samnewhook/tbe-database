import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemCreateComponent } from './items/item-create/item-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
    { path: '', component: ItemListComponent },
    { path: 'create', component: ItemCreateComponent },
    { path: 'edit/:itemId', component: ItemCreateComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}