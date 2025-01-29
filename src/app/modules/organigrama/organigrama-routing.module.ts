import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficoComponent } from '../../components/organigrama/grafico/grafico.component';

const routes: Routes = [
  { path: 'grafico', component: GraficoComponent }, // Ruta para /grafico
  { path: 'organigrama', component: GraficoComponent }, // Ruta para /organigrama
  { path: '', redirectTo: '/grafico', pathMatch: 'full' } // Redirección por defecto a /grafico
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganigramaRoutingModule { }
