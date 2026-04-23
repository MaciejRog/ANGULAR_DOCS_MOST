import { Component, output, signal, forwardRef, input } from '@angular/core';

@Component({
  selector: 'app-comp-n',
  imports: [
    forwardRef(() => CompNChildA), //
  ],
  template: `
    <!--  -->
    <app-comp-n-child-a />
    <br />
    <hr />
  `,
})
export class CompN {}

// ###############################
// ############################### odpowiedź na pytanie: jak wyeksportować kod z Angulara do innego frameworku?
// ############################### ANGULAR ELEMENTS
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-n-child-a',
  template: ` <div>
    <p>ANGULAR ELEMENT</p>
    <p>angular input | poleName = {{ poleName() }}</p>
    <p>eksport Event | 'eventOutput' <button (click)="emitEvent()">EMIT EVENT</button></p>
  </div>`,
  styles: `
    :host {
      display: block;
    }
  `,
  host: {
    '[attr.custom]': '"ABC"',
  },
})
export class CompNChildA {
  /*
	ANGULAR ELEMENTS 
	to możliwość exportu komponentu Angulara do natywnego HTML + JS
	np komponent Angularowy można użyć w czystym HTML_JS lub React.js
	
 	Angular Elements pakuje komponent jako Custom Element (część standardu Web Components). 
	będzie działał w każdej przeglądarce i w każdym frameworku 
	jako zwykły tag HTML, np. 	<moj-kalkulator></moj-kalkulator>.

	Angular Elements "opakuje" komponent Angularowy i udostępnia jako standardowy element HTML.
			Inputs komponentu stają się właściwościami/atrybutami tagu HTML.
			Outputs komponentu stają się standardowymi zdarzeniami DOM (Custom Events).
	
	
	poleName = input(), 
	odpowiadający mu element niestandardowy definiuje atrybut 
		'pole-name'

	eventOutput = output<number>();
	odpowiadający mu element niestandardowy definiuje 'CustomEvent'
	 'eventOutput' a np: 111 emitowane będize w polu 'detail'


	ABY KORZYSTAĆ Z KOMPONENTU 
	TO W PLIKU 'main.ts'

			import { createApplication } from '@angular/platform-browser';
			import { createCustomElement } from '@angular/elements';
			import { CompNChildA } from './app/docs-2-components/comp-n-custom-element/comp-n';

			// 1. Tworzymy instancję aplikacji (bez renderowania root componentu)
			createApplication({ providers: [] }).then((appRef) => {
				// 2. Tworzymy Custom Element z komponentu Angularowego
				const compN = createCustomElement(CompNChildA, {
					injector: appRef.injector,
				});

				// 3. Rejestrujemy go w przeglądarce pod wybraną nazwą
				customElements.define('custom-comp-n', compN);
			});

	I BUDUJEMY PLIKI
			npm run build
	
	WYEKSPORTOWANE PLIKI 'js' i 'css' ZAWIERAJA custom-element
			<!doctype html>
			<html lang="en" data-beasties-container>
				<head>
					<meta charset="utf-8" />
					<title>DocsMost</title>
					<base href="/" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" type="image/x-icon" href="favicon.ico" />
					<link rel="stylesheet" href="styles-5INURTSO.css" />
					<script src="main-EO5GHKFC.js" defer></script>
				</head>
				<body>
				
					<custom-comp-n pole-name="1123" />

					<script>
						const element = document.querySelector('custom-comp-n');
						element.addEventListener('eventOutput', (e) => {
							console.log(`EVENT 'eventOutput' e = `, e.detail);
						});
					</script>

				</body>
			</html>
	*/

  poleName = input<number>(11);

  eventOutput = output<number>();
  emitEvent() {
    this.eventOutput.emit(111);
  }
}
