import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganigramaRoutingModule } from './organigrama-routing.module';
import { ShareModule } from '../share/share.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrganigramaRoutingModule,
    ShareModule, // Import the ShareModule here instead of in the AppModule
  ]

})
export class OrganigramaModule { }
