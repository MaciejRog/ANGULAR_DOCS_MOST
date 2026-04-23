import { Component, output, forwardRef, OutputRefSubscription } from '@angular/core';

@Component({
  selector: 'app-comp-e',
  imports: [forwardRef(() => CompE_Output)],
  template: `
    <!--  -->
    <CompE_Output />
    <br />
    <hr />
  `,
})
export class CompE {
  /*
	
  */
}

// ###############################
// ############################### zdarzenia 'event' wysyłane przez komponent do nasłuchu przez rodziców
// ############################### sygnał 'output()'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompE_Output',
  imports: [forwardRef(() => CompE_OutputBase), forwardRef(() => CompE_OutputSubscribe)],
  template: `
    <div>
      <p>CompE_Output</p>
      <br />

      <!--  -->
      <CompE_OutputBase
        (baseEventA)="handleBaseEventA($event)"
        (baseEventB)="handleBaseEventB($event)"
        (aliasbaseEventC)="handleBaseEventC($event)"
      />
      <br />

      <!--  -->
      <CompE_OutputSubscribe />
      <br />
    </div>
  `,
})
export class CompE_Output {
  /*
   */

  handleBaseEventA = (arg: void) => {
    console.log(`handle base event A | arg = `, arg); // arg === undefined
  };
  handleBaseEventB = (arg: number) => {
    console.log(`handle base event B | arg = `, arg);
  };
  handleBaseEventC = (arg: string) => {
    console.log(`handle base event C | arg = `, arg);
  };
}

@Component({
  selector: 'CompE_OutputBase',
  imports: [],
  template: `
    <div>
      <p>CompE_OutputBase</p>
      <br />

      <div>
        <button (click)="handleEmitEventA()">emit_event_A</button>
        <button (click)="handleEmitEventB()">emit_event_B</button>
        <button (click)="handleEmitEventC()">emit_event_C</button>
      </div>
    </div>
  `,
})
export class CompE_OutputBase {
  /*
  output()
  to 'custom event' zdarzenie utworzone samemu trochę jak 'window.dispatchEvent(new CustomEvent("ABC"))'

	wlaściwości 'output():
  - brak bąbelkowania (nie popaguję w góre DOM)
  - w nazwach 'output()' stosować cameCase i uważać bo są 'case sensitive'
  - podlegają dziedziczeniu
  - do używania w Komponentach i Dyrektywach
  - domyślnie emitują typ void
  - uważać na kolizję nazw z atrybutami DOM

  <CompE_OutputBase
    (baseEventA)="handleBaseEventA($event)"         <- nasłuchuje 'baseEventA', $event to emitowana wartość domylnie 'undefined'
                                                       wywołanie 'this.baseEventA.emit()' powoduje dispatch zdarzenia
                                                       i uruchomienie 'handleBaseEventA($event)'
    (baseEventB)="handleBaseEventB($event)"
    (aliasbaseEventC)="handleBaseEventC($event)"    <- nasłuchujemy na nazwę eventu podaną w 'alias'
  />
  */
  /*
  domyślnie typ jest 'OutputEmitterRef<void>'
  czyli emisja 'this.baseEventA.emit();' -> dostarczy to listenera wartość 'undefined'
  */
  baseEventA = output();
  /*
  'output()' jest generyczny i można nadać mu typ 'OutputEmitterRef<number>'
  czyli emisja 'this.baseEventB.emit(11);' -> dostarczy to listenera wartość number 11
  generycznie możemy określić każdy typ, i przesłać dowolną wartośc podobne do 'customEvent.detail'
  */
  baseEventB = output<number>();
  /*
  konfiguracja - unikać stosowania
  'output()' przyjmuje obiekt konfiguracji, gdzie możemy określić jego 'alias'
  */
  baseEventC = output<string>({ alias: 'aliasbaseEventC' });

  handleEmitEventA = () => {
    console.log('emisja A');
    this.baseEventA.emit();
  };
  handleEmitEventB = () => {
    console.log('emisja B');
    this.baseEventB.emit(11);
  };
  handleEmitEventC = () => {
    console.log('emisja C');
    this.baseEventC.emit('Aga');
  };
}

// ###############################
// ############################### nasłuchiwanie i odłączenia nasłuchu na 'output()'
// ############################### 'output()' subscribe
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompE_OutputSubscribe',
  imports: [],
  template: `
    <div>
      <p>CompE_OutputSubscribe</p>
      <br />

      <div>
        <button (click)="handleEmit()">emit_event_subscribe</button>
        <button (click)="handleSubscribe()">add_subscription</button>
        <button (click)="handleUnsubscribe()">remove_subscription</button>
      </div>
    </div>
  `,
})
export class CompE_OutputSubscribe {
  /*
  subskrybcja na 'output()'

	UWAGA
	angular automatycznie sam czyści sybskrypcje z 'output()' przy niszczeniu komponentu, ale
	można ręcznie zasubskrybować 'output()'
  metoda 'subscribe' zwraca referencję, na której możemy ręcznie wywołać metodę 'unsubscribe'
	użyteczne przy dynamicznym tworzeniu komponentów
	*/
  subscribeEvent = output<string>();
  handleEmit = () => {
    console.log('CompE_OutputSubscribe | emisja subscribeEvent');
    this.subscribeEvent.emit('Maciek');
  };

  subscribeEventRef: OutputRefSubscription | undefined = undefined;
  handleSubscribe = () => {
    this.subscribeEventRef = this.subscribeEvent.subscribe((event) => {
      console.log(`CompE_OutputSubscribe | custom subscribe | event = `, event);
    });
  };
  handleUnsubscribe = () => {
    this.subscribeEventRef?.unsubscribe();
  };
}
