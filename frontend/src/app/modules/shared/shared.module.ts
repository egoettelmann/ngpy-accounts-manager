import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

@NgModule({
    imports: SharedModule.MODULE_LIST,
    exports: SharedModule.MODULE_LIST
})
export class SharedModule {

    static MODULE_LIST = [
        CommonModule,
        TranslateModule,
        Ng2AutoCompleteModule,
        FormsModule
    ];

}
