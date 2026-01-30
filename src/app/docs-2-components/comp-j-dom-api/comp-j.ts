import { Component, ElementRef, forwardRef, inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-comp-j',
  template: `<app-comp-j-child />`,
  imports: [forwardRef(() => CompJChild)],
})
export class CompJ {}

// ###############################
// ############################### DOM API
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-j-child',
  template: `<div>COMP_J_CHILD</div>`,
  styles: `
    :host {
      display: block;
    }

    div {
      width: 120px;
      height: 60px;
    }
  `,
})
export class CompJChild {
  /*
	DOM API

	stosujemy gdy:
		- ręczne ustawienie 'focus'
		- pomiar geometrii 'getBoundingClientRect'
		- obserwujemy MutationObserver, ResizeObserver, IntersectionObserver.
	
	*/
  constructor() {
    /*
		inject(ElementRef)
		wstrzykujemy 'ElementRef' i to daje nam dostęp do OBIEKTU DOM HOSTA!!!
		ElementRef -> klasa do opakowania natywnych obiektów DOM
		*/
    const elementRef = inject(ElementRef<HTMLElement>);
    console.log('nativeElement = ', elementRef.nativeElement);
    (elementRef.nativeElement as HTMLElement).style.border = `1px solid red`;

    /*
		Renderer2 – lepsze i nowsze podejście do manipulowanie DOM 
				Pozwala na bezpieczne operowanie w środowiskach bez klasycznego DOM-u (np. przy Server-Side Renderingu).
				setStyle, addClass, setAttribute i listen.

		pośrednik (abstrakcja) między Twoim kodem a przeglądarką. 
				Zamiast  "przeglądarko, zmień kolor tego elementu!", 
				mówisz: "Rendererze, czy mógłbyś łaskawie ustawić ten styl?".
		Dzięki temu Twoja aplikacja jest:
				Bezpieczniejsza (chroni przed niektórymi atakami XSS).
				Uniwersalna (zadziała na serwerze i w Web Workerach)

		Renderer2 jest super, pamiętaj o hierarchii ważności w Angularze:
   			- Najpierw spróbuj Bindowania ([class], [style], [attr]).
    		- Jeśli to nie wystarczy, użyj Renderer2.
    		- Z nativeElement korzystaj tylko w sytuacjach bez wyjścia 
					(np. pomiar wymiarów offsetWidth lub wywołanie focus()).
     */
    const renderer = inject(Renderer2);
    console.log('renderer = ', renderer);

    renderer.setStyle(elementRef.nativeElement, 'background-color', 'skyblue');
    renderer.listen('window', 'resize', (event) => {
      console.log('Zmieniono rozmiar okna!', event);
    });
  }
}
