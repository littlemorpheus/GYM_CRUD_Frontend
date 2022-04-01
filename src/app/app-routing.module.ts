import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { WorkoutComponent } from './pages/workout/workout.component';

const routes: Routes = [
  //{path: '', redirectTo: '/workout', pathMatch: 'full'},
  {path: 'workout', component: WorkoutComponent},//UserEntry, child:login
  {path: 'list/:item', component: ItemListComponent},
  //{path: '**', redirectTo: '/workout'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
