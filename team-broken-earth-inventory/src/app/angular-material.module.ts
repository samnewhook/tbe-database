import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule } from "@angular/material";
import { MatExpansionModule } from "@angular/material/expansion";

import { NgModule } from "@angular/core";

@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule
    ]
})
export class AngularMaterialModule {}