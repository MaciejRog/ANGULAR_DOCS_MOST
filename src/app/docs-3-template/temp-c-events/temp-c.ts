import { Component, forwardRef, Injectable, ListenerOptions, signal } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

@Component({
  selector: 'app-temp-c',
  template: `
    <app-temp-c-child-a />
    <app-temp-c-child-b />
    <!-- <app-temp-c-child-c /> -->
  `,
  imports: [
    forwardRef(() => TempCChildA),
    forwardRef(() => TempCChildB),
    // forwardRef(() => TempCChildC),
  ],
})
export class TempC {
  /*
   */
}

// ###############################
// ############################### NATYWNE EVENTY
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-c-child-a',
  template: `
    <button (click)="handleEvent()">EVENT_1</button>
    <button (click)="handleEvent2($event)">EVENT_2</button>
    <input
      type="text"
      (keydown)="handleEvent3($event)"
      (keyup.enter)="handleEvent3a($event)"
      (keyup.shift.enter)="handleEvent3b($event)"
      (keydown.code.AltRight.ShiftLeft)="handleEvent3c($event)"
    />
  `,
})
export class TempCChildA {
  /*
	bindowanie evnetów (dodawanie listenerów)
	w szablonie poprzez znaki '()'	np: 
			(click)="handleEvent()"
			(click)="handleEvent2($event)"				<-- dodatkowe przekazanie obiektu '$event'
			(keyup.enter)="handleEvent3($event)"	<-- UWAGA CIEKAWE - tylko dla KEYBOARD eventów
			
						OKREŚLNIE 'key' po kropce
																		event został dodany tylko an przycisk z key 'enter'
								(keyup.shift.enter)	w tym na kombinacje klawiszy np: 'shift' + 'enter'
																		MOZLIWE DLA:
																			alt, control, meta, shift.

						OKREŚLENIE 'code' po kropce
								(keydown.code.alt.shiftleft)	definiujemy jaki 'code' przycisków 

			(mousedown.right)="menuAlternatywne()"

	*/

  handleEvent = () => {
    console.log('WYWOŁANIE_1');
  };

  handleEvent2 = (event: PointerEvent) => {
    event.preventDefault(); // 	<- standardowy prevent
    event.stopPropagation(); //	<- standardowa propagacja
    console.log('WYWOŁANIE_2 | event = ', event);
  };

  handleEvent3 = (event: KeyboardEvent) => {
    console.log('event KEY  = ', event.key);
    console.log('event CODE = ', event.code);
  };
  handleEvent3a = (event: Event) => {
    console.log('WYWOŁANIE_3a | event = ', event);
  };
  handleEvent3b = (event: Event) => {
    console.log('WYWOŁANIE_3b | event = ', event);
  };
  handleEvent3c = (event: Event) => {
    console.log('WYWOŁANIE_3c | event = ', event);
  };
}

// ###############################
// ############################### GLOBALNE EVENTY
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-c-child-b',
  template: ` <div (window:keydown.escape)="change()">{{ text() }}</div>`,
  styles: `
    div {
      width: 200px;
      height: 200px;
      background-color: rgba(50, 50, 50, 0.5);
    }
  `,
  host: {
    '(window:myCostomEvent)': 'onCustomEvent($event)',
    '(window:click)': 'onWindowClick()',
    '(document:click)': 'onDocumentClick()',
    '(body:click)': 'onBodyClick()',
  },
})
export class TempCChildB {
  /*
	za pomocą skłądni 'cel:event' można przypisać obsługę eventu na globalny event !!!

	są 3 możliwe cele na które można tak nadać event listenera:
	'window', 'document', 'body'
   */
  text = signal('AGA');
  change = () => {
    console.warn('wywołane na `window:keydown.escape`');
    this.text.update((prev) => prev + '_1');
    window.dispatchEvent(new CustomEvent('myCostomEvent', { detail: '123' }));
  };

  onCustomEvent = (event: Event) => {
    console.warn('window MY_COSTOM_EVENT | event = ', event as CustomEvent);
  };
  onWindowClick = () => {
    console.warn('window click');
  };
  onDocumentClick = () => {
    console.warn('document click');
  };
  onBodyClick = () => {
    console.warn('body click');
  };
}

// ###############################
// ############################### CUSTOM EVENTS 'EVENT_MANAGER_PLUGINS'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Injectable()
export class TempCChildC extends EventManagerPlugin {
  /*
	Angular ma centralny system zarządzania zdarzeniami (EventManager). 
	na (click), Angular pyta wtyczki: "Kto potrafi obsłużyć 'click'?". 
	Wtyczki sprawdzają nazwę zdarzenia i ta, która pierwsza powie "Ja!", przejmuje kontrolę.

	BY STWORZYĆ 'custom event plugin' 
	musimy rozszerzyć klasę 'EventManagerPlugin'
	wraz z konstruktorem
		constructor() {
			super(document);
		}
	i nadpisać 2 metody:
		- supports
		- addEventListener

   */
  constructor() {
    super(document);
  }

  override supports(eventName: string): boolean {
    if (eventName === 'debounce') {
      return true;
    }
    return false;
  }
  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function,
    options?: ListenerOptions,
  ): Function {
    return () => {
      // Parse the event: e.g., "debounce.500"
      const [method, delay = 300] = eventName.split('.');

      // reszta magii w dokumentacji
      // https://angular.dev/guide/templates/event-listeners#implementing-event-plugin
    };
  }
}
