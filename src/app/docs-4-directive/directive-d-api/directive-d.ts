import { Component, Directive, effect, ElementRef, forwardRef, input } from '@angular/core';
import { HighlightDirectiveA, HighlightDirectiveC } from '../directive-b-attribute/directive-b';

@Component({
  selector: 'app-directive-d',
  template: `
    <app-directive-d-child-a />
    <hr />
    <app-directive-d-child-b appHighlightC="red" leave="green" />
    <hr />
    <app-directive-d-child-c />
  `,
  imports: [
    forwardRef(() => DirectiveDChildA),
    forwardRef(() => DirectiveDChildB),
    forwardRef(() => DirectiveDChildC),
  ],
})
export class DirectiveD {
  /*
  Directive Composition API
      pozwala na nakładanie dyrektyw na komponent (lub inną dyrektywę) 
      bezpośrednio w jego klasie TypeScript (w dekoratorze @Component), 
      a nie w szablonie HTML (czyli na instancji klasy)
      Tylko w samej klasie (dla wszystkich instancji)
  
  Pozwala to na wyodrębnienie RESUABLE elementów (np zachowań itp...)

  UWAGA:
    dyrektywy można dodać tylko statycznie
    nie można dodać ich dynamicznie
  
  UWAGA:
    Dyrektywy używane w hostDirectives nie mogą określać wartości standalone: ​​false.


  CYKL ŻYCIA
      Dyrektywy hosta przechodzą przez ten sam cykl życia, co komponenty i 
      dyrektywy używane bezpośrednio w szablonie. 
      Jednak dyrektywy hosta zawsze wykonują swój konstruktor, 
      haki cyklu życia i powiązania przed 
      komponentem lub dyrektywą, do której są stosowane.

  KOLEJNOŚĆ WYKONAYWANIA:
      @Component({
        selector: 'admin-menu',
        template: 'admin-menu.html',
        hostDirectives: [MenuBehavior],
      })
      export class AdminMenu {}
      ----
      vvvv
      1. MenuBehavior     utworzenie instancji            najbardziej zagnieżdżone
      2. AdminMenu        utworzenie instancji
      3. MenuBehavior     otrzyma 'inputy' (ngOnInit)
      4. AdminMenu        otrzyma 'inputy' (ngOnInit)
      5. MenuBehavior     dodaje host bindings
      6. AdminMenu        dodaje host bindings

  UWAGA
    jeśli komponent i dyrektywa której ten komponent używają mają wspólną dyrektywę w 
    hostDirectives, to pierwszeństwo w DI (dependency incjection) ma komponent
  */
}

// ###############################
// ############################### hostDirectives w DEKORATORZE KOMPONENTU
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-directive-d-child-a',
  template: `<div>CHILD A</div>`,
  // można dodać DYREKTYWY
  // bezpośrednio na hosta
  // i każda instancja będzie miała tą dyrektywę
  hostDirectives: [HighlightDirectiveA],
  styles: `
    :host {
      display: block;
    }
  `,
})
export class DirectiveDChildA {
  /*

  */
}

@Component({
  selector: 'app-directive-d-child-b',
  template: `<div>CHILD B</div>`,
  hostDirectives: [
    // jeśli dyrektywa ma inputy / outputy
    // to definiujemy ją w dekoratorze jako obiekt
    // i teraz host przyjmuje inputy
    //        <app-directive-d-child-b appHighlightC="red" leave="green" />
    // można też zdefiniować alias dla inputa 'leaveColor: leave'
    //                                         teraz input ma nazwę 'leave'

    {
      directive: HighlightDirectiveC,
      inputs: ['appHighlightC', 'leaveColor: leave'],
      outputs: [],
    },
  ],
  styles: `
    :host {
      display: block;
    }
  `,
})
export class DirectiveDChildB {
  /*

  */
}

// ###############################
// ############################### hostDirectives w DEKORATORZE DYREKTYW
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-directive-d-child-c',
  template: `<div dirDA appHighlightC="red" leaveColor="blue" borderColor="purple">CHILD C</div>`,
  imports: [forwardRef(() => DirectiveDA)],
})
export class DirectiveDChildC {
  /*

  */
}

@Directive({
  selector: '[dirDA]',
  // pole 'hostDirectives' można dodawać też do innych DYREKTYW
  hostDirectives: [
    {
      directive: HighlightDirectiveC,
      inputs: ['appHighlightC', 'leaveColor'],
      outputs: [],
    },
  ],
})
export class DirectiveDA {
  /*
  zastosowanie dyrektywy
      <div 
        dirDA               
        appHighlightC="red" 
        leaveColor="blue" 
        borderColor="purple"
      >CHILD C</div>
  dyrektywa teraz przyjmuej wszystki inputy wraz z tymi z 'hostDirectives'
  i współdzieli logikę, funkjconalność i zachowanie 2 dyrektyw:
      1) HighlightDirectiveC
      2) DirectiveDA
  */

  borderColor = input.required<string>();

  constructor(private elementRef: ElementRef<HTMLElement>) {
    effect(() => {
      const borderColor = this.borderColor();
      this.elementRef.nativeElement.style.border = `6px solid ${borderColor}`;
    });
  }
}
