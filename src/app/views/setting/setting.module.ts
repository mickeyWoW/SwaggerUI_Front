import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GroupPermissionsComponent } from "./group-permissions/group-permissions.component";
import { WareshouseComponent } from "./wareshouse/wareshouse.component";
import { CatergoryComponent } from "./catergory/catergory.component";
import { BrandComponent } from "./brand/brand.component";
import { CurrencyComponent } from "./currency/currency.component";
import { UnitComponent } from "./unit/unit.component";
import { BackupComponent } from "./backup/backup.component";
import { SettingRoutingModule } from "./setting-routing.module";
import { SystemSettingComponent } from "./system-setting/system-setting.component";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedDirectivesModule } from "src/app/shared/directives/shared-directives.module";
import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [
    GroupPermissionsComponent,
    WareshouseComponent,
    CatergoryComponent,
    BrandComponent,
    CurrencyComponent,
    UnitComponent,
    BackupComponent,
    SystemSettingComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    DataTablesModule,
  ],
})
export class SettingModule {}
