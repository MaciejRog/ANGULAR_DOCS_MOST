import { Component, Directive, ElementRef, forwardRef, input } from '@angular/core';

@Component({
  selector: 'app-directive-b',
  template: `
    <div>ELEMENT_1 BEZ</div>
    <hr />
    <!-- 
		 poniżej Angular trzowy incjancję dyrektywy dla tego elementu
		 i wstrzykuje zależność 'ELementRef' jako <div> 
		-->
    <div appHighlightA>ELEMENT_2 Z dyrketywą A</div>
    <hr />
    <div appHighlightB>ELEMENT_3 Z dyrketywą B</div>
    <hr />
    <!-- 
		aby przekazać wartości do dyrektywy musi ona mieć pola 'input'
		-->
    <div appHighlightC="green" leaveColor="violet">ELEMENT_3a Z dyrketywą C</div>
    <div [appHighlightC]="enterColor" [leaveColor]="leaveColor">ELEMENT_3b Z dyrketywą C</div>
    <hr />
    <hr />
    <hr />
    <div ngNonBindable>
      <div appHighlightC="green" leaveColor="violet">ELEMENT_4a NgNonBindable {{ 1 + 1 }}</div>
      <!-- 
				UWAGA
				poniższe z uwagi na property binding ZWRCI BŁAD 
			-->
      <!-- <div [appHighlightC]="enterColor" [leaveColor]="leaveColor">
        ELEMENT_4b NgNonBindable {{ 1 + 1 }}
      </div> -->
    </div>
  `,
  imports: [
    forwardRef(() => HighlightDirectiveA),
    forwardRef(() => HighlightDirectiveB),
    forwardRef(() => HighlightDirectiveC),
  ],
})
export class DirectiveB {
  /*

  */
  enterColor = 'cyan';
  leaveColor = 'purple';
}

// ###############################
// ############################### PRZYKŁAD DYREKTYWY ATRYBUTOWEJ KROK PO KROKU
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
aby utworzyć dyrektywę stosujemy dekorator 
@Directive
wymaga wyłącznie pola 'selector'
*/
@Directive({
  selector: '[appHighlightA]',
})
export class HighlightDirectiveA {
  /*
	UWAGA WAŻNA
		w celu operowania na elemencie który dostał naszą dyrektywę (host DOM) 
		musimy dodać zależność 'ElementRef' - DEPENDENCY INJECTION

		możemy ją dodać w:
			konstruktorze 			-> constructor(private elementRef: ElementRef<HTMLElement>) {}
			wstrzyknąć do pola	-> elementRef = inject(ElementRef<HTMLElement>);
	*/

  // elementRef = inject(ElementRef<HTMLElement>);

  constructor(private elementRef: ElementRef<HTMLElement>) {
    /*
		UWAGA
			co ciekawe możemy od razu działać na elemencie w konstruktorze 
			nie musi to być 'ngAfterViewInit'
		*/
    this.elementRef.nativeElement.style.backgroundColor = 'red';
  }
}

// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Directive({
  selector: '[appHighlightB]',
  /*
	można dodać atrybuty/eventy ogólnie BINDING
	do elementu 'elementRef' poprzez pole 'host' czyli dla
	elementu który dostał naszą dyrektywę (host DOM) 
	*/
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirectiveB {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  onMouseEnter = () => {
    this.setBackgroundColor('blue');
  };

  onMouseLeave = () => {
    this.setBackgroundColor('transparent');
  };

  setBackgroundColor = (color: string = '') => {
    this.elementRef.nativeElement.style.backgroundColor = color;
  };
}

// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Directive({
  selector: '[appHighlightC]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirectiveC {
  /*
	możemy też przekazać wartości do naszej dyrektywy

	UWAGA:
		jeśli chcemy móc przekazać wartość jako 'appHighlightC="green"'
		to nazwa naszego 'inputu' musi się pokrywać z selektorem dyrektywy !!!!
		ale możemy mieć więcej inputów i wtedy trzebe juz do nich przekazywac 
		wartość jak do normalnych inputów w komponencie (dodać atrybut/property)

	<div 
		appHighlightC="green" leaveColor="violet"									<- wartości jako string
	>
	<div 
		[appHighlightC]="enterColor" [leaveColor]="leaveColor"		<- wartości jako binding
	>
	*/
  appHighlightC = input.required<string>();
  leaveColor = input<string>();

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  onMouseEnter = () => {
    this.setBackgroundColor(this.appHighlightC());
  };

  onMouseLeave = () => {
    this.setBackgroundColor(this.leaveColor());
  };

  setBackgroundColor = (color: string = '') => {
    this.elementRef.nativeElement.style.backgroundColor = color;
  };
}

// ###############################
// ############################### NgNonBindable
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
NgNonBindable
		specjalna dyrektywa w Angualar, która mówi
		nie wykonuj dla dzieci tego elemntu żądnego:
		interpolation, directives, binding 
		sam elemnt na którym jest na dyrektywy może mieć działające dyrektywy

		wszystko co jest dzieckiem tagu <div id="przyklad"
		będzie traktowane jako zwykły tekst
		

		<div id="przyklad" ngNonBindable>
      <div appHighlightC="green" leaveColor="violet">ELEMENT_4a NgNonBindable {{ 1 + 1 }}</div>
			<!-- 
				UWAGA
				poniższe z uwagi na property binding ZWRCI BŁAD 
			-->
      <!-- <div [appHighlightC]="enterColor" [leaveColor]="leaveColor">
        ELEMENT_4b NgNonBindable {{ 1 + 1 }}
      </div> -->
    </div>
*/
