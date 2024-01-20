import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminReportComponent } from './admin-report/admin-report.component';
import { AdminUserlistComponent } from './admin-userlist/admin-userlist.component';

const routes: Routes = [
  {path: "admin-main", component: AdminMainComponent},
  {path: "admin-report", component: AdminReportComponent},
  {path: "admin-userlist", component: AdminUserlistComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
