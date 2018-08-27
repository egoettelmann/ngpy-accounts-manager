import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnChanges {

  @Input() value: any;
  @Input() options: any[];
  @Input() valueAttribute = 'id';
  @Input() labelAttribute = 'name';

  @Output() onSelect = new EventEmitter<any>();
  @Output() onCreate = new EventEmitter<string>();

  public ngModel: any;
  public ngOptions: any[];

  private selectedModel: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value
      && this.value
      && this.value.hasOwnProperty(this.valueAttribute)
      && this.options
    ) {
      const filteredOptions = this.options
        .filter(o => o[this.valueAttribute] === this.value[this.valueAttribute])
        .slice();
      if (filteredOptions && filteredOptions.length > 0) {
        this.ngModel = filteredOptions[0][this.labelAttribute];
      }
    }
  }

  onChange(inputText) {
    if (inputText) {
      this.ngOptions = this.options.filter(o => {
        const regExp = new RegExp(inputText, 'i');
        return regExp.test(o[this.labelAttribute]);
      }).slice();
    } else {
      this.ngOptions = undefined;
    }
  }

  isSelected(opt: any) {
    return (
      this.selectedModel
      && this.selectedModel.hasOwnProperty(this.valueAttribute)
      && this.selectedModel[this.valueAttribute] === opt[this.valueAttribute]
    );
  }

  select(event: KeyboardEvent) {
    switch (event.code) {
      case 'Enter':
      case 'Tab':
        this.validate();
        break;
      case 'ArrowDown':
        this.selectNext();
        break;
      case 'ArrowUp':
        this.selectPrevious();
        break;
      default:
        this.selectedModel = undefined;
    }
  }

  validate() {
    if (this.selectedModel) {
      this.onSelect.emit(this.selectedModel);
    } else {
      this.onCreate.emit(this.ngModel);
    }
    this.ngOptions = undefined;
  }

  selectClick(model: any) {
    this.selectedModel = model;
    this.ngModel = this.selectedModel[this.labelAttribute];
    this.validate();
  }

  selectNext() {
    const currentIndex = this.findCurrentIndex();
    if (this.ngOptions.length > currentIndex + 1) {
      this.selectedModel = this.ngOptions[currentIndex + 1];
      this.ngModel = this.selectedModel[this.labelAttribute];
    }
  }

  selectPrevious() {
    const currentIndex = this.findCurrentIndex();
    if (currentIndex > 0
      && this.ngOptions.length > currentIndex - 1
    ) {
      this.selectedModel = this.ngOptions[currentIndex - 1];
      this.ngModel = this.selectedModel[this.labelAttribute];
    }
  }

  onFocusOut() {
    setTimeout(() => {
      this.ngOptions = undefined;
    });
  }

  private findCurrentIndex(): number {
    if (this.selectedModel
      && this.ngOptions
      && this.ngOptions.length > 0
    ) {
      for (let i = 0; i < this.ngOptions.length; i++) {
        if (this.ngOptions[i][this.valueAttribute] === this.selectedModel[this.valueAttribute]) {
          return i;
        }
      }
    }
    return -1;
  }

}
