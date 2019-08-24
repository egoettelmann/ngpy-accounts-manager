import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

/**
 * The autocomplete component
 */
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnChanges {

  /**
   * The unique id
   */
  @Input() uuid: string;

  /**
   * The current value
   */
  @Input() value: any;

  /**
   * The available options
   */
  @Input() options: any[];

  /**
   * The value attribute
   */
  @Input() valueAttribute = 'id';

  /**
   * The label attribute
   */
  @Input() labelAttribute = 'name';

  /**
   * Triggered when an item gets selected
   */
  @Output() onSelect = new EventEmitter<any>();

  /**
   * Triggered when a new element is created
   */
  @Output() onCreate = new EventEmitter<string>();

  /**
   * The model bound to the control
   */
  public ngModel: any;

  /**
   * The available options
   */
  public ngOptions: any[];

  /**
   * The currently selected model
   */
  private selectedModel: any;

  /**
   * Triggered for any input changes.
   *
   * @param changes the input changes
   */
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

  /**
   * Triggered on each control change.
   *
   * @param inputText the input
   */
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

  /**
   * Checks if an option is selected.
   *
   * @param opt the option to check
   */
  isSelected(opt: any) {
    return (
      this.selectedModel
      && this.selectedModel.hasOwnProperty(this.valueAttribute)
      && this.selectedModel[this.valueAttribute] === opt[this.valueAttribute]
    );
  }

  /**
   * Handles all keyboard events on the control.
   *
   * @param event the keyboard event
   */
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

  /**
   * Validates the selection
   */
  validate() {
    if (this.selectedModel) {
      this.onSelect.emit(this.selectedModel);
    } else {
      this.onCreate.emit(this.ngModel);
    }
    this.ngOptions = undefined;
  }

  /**
   * Selects through click.
   *
   * @param model the model to select
   */
  selectClick(model: any) {
    this.selectedModel = model;
    this.ngModel = this.selectedModel[this.labelAttribute];
    this.validate();
  }

  /**
   * Selects the next element
   */
  selectNext() {
    const currentIndex = this.findCurrentIndex();
    if (this.ngOptions.length > currentIndex + 1) {
      this.selectedModel = this.ngOptions[currentIndex + 1];
      this.ngModel = this.selectedModel[this.labelAttribute];
    }
  }

  /**
   * Selects the previous element
   */
  selectPrevious() {
    const currentIndex = this.findCurrentIndex();
    if (currentIndex > 0
      && this.ngOptions.length > currentIndex - 1
    ) {
      this.selectedModel = this.ngOptions[currentIndex - 1];
      this.ngModel = this.selectedModel[this.labelAttribute];
    }
  }

  /**
   * Handles the focus out event on the input
   */
  onFocusOut() {
    setTimeout(() => {
      this.ngOptions = undefined;
    });
  }

  /**
   * Finds the index of the currently selected item
   */
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
