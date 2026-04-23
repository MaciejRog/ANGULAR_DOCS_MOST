import { Component, ElementRef, forwardRef, inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-comp-j',
  imports: [forwardRef(() => CompJ_ElementRef), forwardRef(() => CompJ_Renderer2)],
  template: `
    <!--  -->
    <CompJ_ElementRef />
    <br />
    <hr />

    <!--  -->
    <CompJ_Renderer2 />
    <br />
    <hr />
  `,
})
export class CompJ {
  /*
	DOM API stosujemy gdy chcemy ręcznie manipulować DOM HOSTA, np:
  - ręcznie ustawić 'focus' 
  - pomierzyć geometrię komponentu 'getBoundingClientRect'
  - korzystać z MutationObserver, ResizeObserver, IntersectionObserver.
	*/
}

// ###############################
// ############################### manipulowanie dom za pomocą DI z 'ElementRef'
// ############################### inject(ElementRef<HTMLElement>);
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompJ_ElementRef',
  imports: [],
  template: `
    <div>
      <div>CompJ_ElementRef</div>
      <br />
    </div>
  `,
})
export class CompJ_ElementRef {
  /*
  ElementRef -> klasa do opakowania natywnych obiektów DOM
  możemy go wstrzyknąć w DI 'inject(ElementRef<HTMLElement>)' daje nam dostęp do OBIEKTU DOM HOSTA
  */
  constructor() {
    const elementRef = inject(ElementRef<HTMLElement>);
    console.log('ElementRef | = ', elementRef);

    (elementRef.nativeElement as HTMLElement).style.display = `block`;
    (elementRef.nativeElement as HTMLElement).style.border = `1px solid red`;
  }
}

// ###############################
// ############################### manipulowanie dom za pomocą Renderer2
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompJ_Renderer2',
  imports: [],
  template: `
    <div>
      <div>CompJ_Renderer2</div>
      <br />
    </div>
  `,
})
export class CompJ_Renderer2 {
  /*
  Renderer2 – lepsze i nowsze podejście do manipulowania DOM 
  Pozwala na manipulację w DOM przy SSR (server-side-rendering)
  np: setStyle, addClass, setAttribute i listen.

  Renderer2 to pośrednik między kodem, a przeglądarką. 
      Zamiast  "przeglądarko, zmień kolor tego elementu!", 
      mówisz: "Rendererze, czy mógłbyś ustawić ten styl?".
  Dzięki temu aplikacja jest:
      Bezpieczniejsza (chroni przed niektórymi atakami XSS).
      Uniwersalna (zadziała na serwerze i w Web Workerach)

  kolejność, w jakiej próbować manipulować elementem
  - 1) bindowanie ([class], [style], [attr]).
  - 2) Renderer2.
  - 3) jeśli nic nie dziąła to 'ElementRef.nativeElement'
    (np. pomiar wymiarów offsetWidth lub wywołanie focus()).
  */
  constructor() {
    const elementRef = inject(ElementRef<HTMLElement>);
    const renderer2 = inject(Renderer2);
    console.log('Renderer2 | = ', renderer2);

    renderer2.setStyle(elementRef.nativeElement, 'background-color', 'skyblue');
    renderer2.listen('window', 'resize', (event) => {
      console.log('Zmieniono rozmiar okna!', event);
    });
  }
}
