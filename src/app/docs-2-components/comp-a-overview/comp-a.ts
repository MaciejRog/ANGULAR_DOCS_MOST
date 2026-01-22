import { ChangeDetectionStrategy, Component } from '@angular/core';

/*
Component to klasa, z dekoratorem - obiekt w nim to metadane
wymagane są 2:
	- selector 
	- template LUb templateUrl (opis HTML)
reszta jest opcjonalna 
*/
@Component({
  // selector -> za jego pomocą można osadzić komponent w innym
  selector: 'app-comp-a',
  // import to lista komponentow, dyrektyw i pipeow użytych w komponencie
  // w import moga byc tylko 'standalone' komponentu inne musza byc w modulach ngModule
  imports: [],
  // templateUrl: './comp-a.html',
  template: ` <div>To dziala</div> `,
  // domyślnie style odnoszą się tylko do danego komponentu
  // styleUrl: './comp-a.css',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompA {
  /*
	Angular tworzy instancję komponentu dla każdego pasującego elementu HTML

	komponent w strukturze HTML wygląda następująco:
	<app-comp-a>				// HOST
		<div>							// VIEW
			To dziala				// VIEW
		</div>						// VIEW
	</app-comp-a>				// HOST


	HOST komponentu (odpowiednik w DOM):
	Element DOM, który pasuje do selektora komponentu
				document.querySelector('app-comp-a')
	*/
}
