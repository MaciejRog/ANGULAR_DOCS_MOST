import { Component, EventEmitter, forwardRef, Output } from '@angular/core';

@Component({
  selector: 'app-comp-e-old',
  template: `
    <p>@output DEKORATOR</p>
    <app-comp-e-old-child (eventA)="handleEventA()" (alias)="handleEventB($event)" />
    <app-comp-e-old-decor (outA)="handleOutA($event)" />
  `,
  imports: [forwardRef(() => CompEOldChild), forwardRef(() => CompEOldDecor)],
})
export class CompEOld {
  /*
	@output dekorator 
	zalecane nowe podejście sygnałowe z 'output()'
  */
  handleEventA = () => {
    console.warn(`hanle event A`);
  };
  handleEventB = (event: number) => {
    console.warn(`hanle event B | event = `, event);
  };

  handleOutA = (event: number) => {
    console.warn(`hanle decorator OUT A | event = `, event);
  };
}

// ###############################
// ############################### @output
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-e-old-child',
  template: ` <button (click)="emitA()">Emit A</button><button (click)="emitB()">Emit B</button> `,
})
export class CompEOldChild {
  /*
   */
  @Output() eventA = new EventEmitter<void>();
  emitA = () => {
    this.eventA.emit();
  };

  @Output('alias') eventB = new EventEmitter<number>();
  emitB = () => {
    this.eventB.emit(123);
  };
}

// ###############################
// ############################### Decorator output
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'app-comp-e-old-decor',
  template: `<button (click)="emitA()">Out A emit</button>`,
  outputs: ['outA'],
})
export class CompEOldDecor {
  outA = new EventEmitter<number>();
  emitA = () => {
    this.outA.emit(123);
  };
}
