import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: SharedModule.MODULE_LIST,
    exports: SharedModule.MODULE_LIST
})
export class SharedModule {

    static MODULE_LIST = [
        CommonModule
    ];

}
