import { Component, EventEmitter, forwardRef, Output } from '@angular/core';

@Component({
  selector: 'app-comp-e-old',
  imports: [forwardRef(() => CompEOld_DecoratorOutput)],
  template: `
    <!--  -->
    <CompEOld_DecoratorOutput />
    <br />
    <hr />
  `,
})
export class CompEOld {
  /*
   */
}

// ###############################
// ############################### stare podejście do 'outputów' jeszcze przed sygnałami
// ############################### dekorator @Output
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompEOld_DecoratorOutput',
  imports: [
    forwardRef(() => CompEOld_DecoratorOutputBase),
    forwardRef(() => CompEOld_ConstructorOutputs),
  ],
  template: `
    <div>
      <p>CompEOld_DecoratorOutput</p>
      <br />

      <!--  -->
      <CompEOld_DecoratorOutputBase
        (baseEventA)="handleBaseEventA($event)"
        (aliasBaseEventB)="handleBaseEventB($event)"
      />
      <br />
      <hr />

      <!--  -->
      <CompEOld_ConstructorOutputs (constructorEvent)="handleConstructorEvent($event)" />
      <br />
      <hr />
    </div>
  `,
})
export class CompEOld_DecoratorOutput {
  /*
   */
  handleBaseEventA = (event: any) => {
    console.log('handle base event A | event =', event);
  };

  handleBaseEventB = (event: number) => {
    console.log('handle base event B | event =', event);
  };

  handleConstructorEvent = (event: string) => {
    console.log('handle constructor event | event =', event);
  };
}

@Component({
  selector: 'CompEOld_DecoratorOutputBase',
  imports: [],
  template: `
    <div>
      <p>CompEOld_DecoratorOutputBase</p>
      <br />

      <div>
        <button (click)="emitBaseEventA()">emit_base_event_A</button>
        <button (click)="emitBaseEventB()">emit_base_event_B</button>
      </div>
    </div>
  `,
})
export class CompEOld_DecoratorOutputBase {
  /*
  dekorator '@Output()' analogiczny w działaniu jak sygnał 'output()'
  */
  @Output()
  baseEventA = new EventEmitter();
  emitBaseEventA = () => {
    this.baseEventA.emit(); // taka emisja wyśle 'undefined'
  };

  @Output('aliasBaseEventB')
  baseEventB = new EventEmitter<number>();
  emitBaseEventB = () => {
    this.baseEventB.emit(123);
  };
}

// ###############################
// ############################### Outputy możemy też definiować z poziomu dekoratora komponentu
// ############################### constructor outputs
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompEOld_ConstructorOutputs',
  imports: [],
  template: `
    <div>
      <p>CompEOld_ConstructorOutputs</p>
      <br />

      <div>
        <button (click)="emitConstructorEvent()">emit_constructor_event</button>
      </div>
    </div>
  `,
  outputs: ['constructorEvent'],
})
export class CompEOld_ConstructorOutputs {
  /*
  outputy możemy też zdefiniować wewnątrz dekoratora komponentu:
  outputs: ['constructorEvent'],       <- definiuje event 'constructorEvent'

  pozwala to na pominięcie dekoratora '@Output()'
  */
  constructorEvent = new EventEmitter<string>();
  emitConstructorEvent = () => {
    this.constructorEvent.emit('Aga');
  };
}
