import { Component, output, forwardRef } from '@angular/core';

@Component({
  selector: 'app-comp-e',
  template: `
    <p>output() SIGNAL</p>
    <app-comp-e-child
      (eventOutputA)="handleEventA()"
      (eventOutputB)="handleEventB($event)"
      (nowaNazwaOutputC)="handleEventC($event)"
    />
  `,
  imports: [forwardRef(() => CompEChild)],
})
export class CompE {
  /*
	
  */
  handleEventA = () => {
    console.warn(`handleEventA `);
  };

  handleEventB = (event: number) => {
    console.warn(`handleEventB | event = `, event);
  };

  handleEventC = (event: string) => {
    console.warn(`handleEventC | event = `, event);
  };
}

// ###############################
// ############################### output()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-e-child',
  template: `<button (click)="emitEventA()">EVENT A - emit</button>
    <button (click)="emitEventB()">EVENT B - emit</button>
    <button (click)="emitEventC()">EVENT C - emit</button>
    <button (click)="addB()">Ręczne B DODAJ</button>`,
})
export class CompEChild {
  /*
	output -> to 'custom events' zdarzenia utworzone samemu trochę jak 'window.dispatchEvent(new CustomEvent("ABC"))'

	wlaściwości:
		- brak bąbelkowania (nie popaguję w góre DOM). NO BUBBLE UP
		- case-sensitive 
		- stosować cameCase
		- dziedziczone przez komponentu dzieci
		- funkcja 'output()' do używania tylko w Komponentach i Dyrektywach
		- domyślnie emisja typu void
		- unikać nazw kolidujących z DOM i prefixów

	<app-comp-e-child 
		(eventOutputA)="handleEventA()" 		// nasłuchujemy event listenera na ten event 
	/> 																		// wywoła się na emisję

	this.eventOutputA.emit();							// wywołanie 'emit' spowoduję emisję eventu
  */
  eventOutputA = output<void>();
  emitEventA() {
    this.eventOutputA.emit();
  }

  /*
	Output może też przesyłać wartości (wszystki tęz obiekty) trochę jak customEvent.detail

	<app-comp-e-child 
		(eventOutputB)="handleEventB($event)" 						// odbiór wartość dzięki zmiennej '$event'
	/>
 	handleEventB = (event: number) => {									// w przypadku 'output()' event ma typ taki jak emitowana zmienna
    console.warn(`handleEventB | event = `, event);		// czyli tutaj number dokładniej 111
  };
	*/
  eventOutputB = output<number>();
  emitEventB() {
    this.eventOutputB.emit(111);
  }

  /*
	mażna inaczej nazwać output dzięki 'alias' ogólnie UNIKAĆ
	*/
  eventOutputC = output<string>({ alias: 'nowaNazwaOutputC' });
  emitEventC() {
    this.eventOutputC.emit('asdfasd');
  }

  /*
	UWAGA
		angular automatycznie sam czyście sybskrypcje z 'output()' przy niszczeniu komponentów z 'subscribe'

	można ręcznie zasubskrybować event = zwraca REF, na którym mozna ręcznie wywołac 'unsubscribe'
	użyteczne przy dynamicznym tworzeniu komponentów
	*/
  addB = () => {
    const eventOutputBSubscribeRef = this.eventOutputB.subscribe((event) => {
      console.warn(`RĘCZNE subscrive | event = `, event);
      eventOutputBSubscribeRef.unsubscribe();
    });
  };
}
