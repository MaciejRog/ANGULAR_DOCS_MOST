import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-directive-a',
  template: `
    <!-- 
	 	DYREKTYWY ATRYBUTOWE
		-->
    <div [ngClass]="'specjalna-klasa'">ELEMENT</div>
    <div [ngClass]="{ active: true, 'text-danger': true }">ELEMENT</div>
    <div
      [ngStyle]="{
        'background-color': 'green',
      }"
    >
      ELEMENT
    </div>
  `,
  imports: [CommonModule],
})
export class DirectiveA {
  /*
	komenda w CLI do tworzenia dyrektyw:
			ng generate directive highlight


	RODZAJE DYREKTYW:
			komponenty		-> tak komponenty, to dyrektywy, które mają szablon HTML
			atrybutowy		-> modyfikują wygląd lub zachowanie komponentu
			strukturalne 	-> modyfikują DOM (dodają, modyfikują, usuwają elementy itp)


	WBUDOWANE DYREKTYWY ATRYBUTOWE:
		- NgClass				-> steruje przypisanymi do komponentu klasami CSS
											1) [ngClass]="'specjalna-klasa'"
													przyjmuje string
											2) [ngClass]="{ active: true, 'text-danger': true }"
													przyjmuje obiekt, gdzie:
														klucz 			-> nazwa klasy CSS
														wartość 		-> bool (true/false) czy dodać daną klasę

		- NgStyle				-> steruje obiektem 'style' inline stylami elementu
										[ngStyle]="{
											'background-color': 'green',
										}"
										przyjmuje obiekt, gdzie:	
											klucz 	-> style css
											wartość -> wartość dla stylu w kluczu
										UWAGA dla pojedyńczych styli zalecane:
													[style.color]="red"
		- NgModel				-> do obsługi 2-way data binding do elementów formularza


	UWAGA do hostowania wielu strukturalnych dyrektyw zalecane jest stosowanie 
	<ng-container>


	
	NgNonBindable
				specjalna dyrektywa w Angualar, która mówi
				nie wykonuj dla dzieci tego elemntu żadnego:
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
}
