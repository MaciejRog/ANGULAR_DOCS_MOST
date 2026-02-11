import { CommonModule } from '@angular/common';
import { Component, Directive, forwardRef, input, model } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-temp-j',
  template: `
    <app-temp-j-child-a />
    <app-temp-j-child-c />
  `,
  imports: [forwardRef(() => TempJChildA), forwardRef(() => TempJChildC)],
})
export class TempJ {
  /*	
	zmienne wewątrz szablonów
	*/
}

// ###############################
// ############################### lokalna zmienna szablonu '@let'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-j-child-a',
  template: `
    <!-- BŁAD -> próba dostępu przed deklaracją -->
    <!-- <p>LET_1 = {{ name }}</p> -->

    @let name = user.name;
    <div>
      @let greeting = 'Hello, ' + name;
    </div>
    @let data = data$ | async;
    @let pi = 3.14159;
    @let coordinates = { x: 50, y: 100 };
    @let longExpression =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
      'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
      'Ut enim ad minim veniam...';

    <p>LET_1 = {{ name }}</p>
    <p>LET_2 = {{ greeting }}</p>
    <p>LET_3 = {{ data }}</p>
    <p>LET_4 = {{ pi }}</p>
    <p>LET_5 = {{ coordinates | json }}</p>
    <p>LET_6 = {{ longExpression }}</p>

    @if (true) {
      @let name2 = 'ANTYLOPA';
      <p>LET_7 = {{ name2 }}</p>
    }
    <!-- 
			Błąd - zasięg blokowy  
		 	zmienna 'name2' jest w bloku if, poza nim nie ma dostępu
		-->
    <!-- <p>LET_7 = {{ name2 }}</p> -->
    <hr />
    <app-temp-j-child-b [inputName]="name" />
  `,
  imports: [CommonModule, forwardRef(() => TempJChildB)],
})
export class TempJChildA {
  /*
  poprzez '@let' możemy utworzyć lokalną zmienną w szablonie
	CIEKAWOSTKA Wcześniej musieliśmy „oszukiwać” framework, 
							używając np. *ngIf="... as variable". 
	
	Zmienna pozwalają na:
			- Skrócenie długich ścieżek do danych
			- Praca z async pipe (Koniec z "hackowaniem" ngIf)
						@let products = products$ | async;
						@let isLoading = products === null;
						@if (isLoading) {
							<p>Ładowanie produktów...</p>
						} @else {
							//...
						}

	WAŻNE:
			- 1 zmienna				1 blok '@let' pozwala na definicję 1 zmiennej
												nie można utworzyć wielu w 1 '@let;
			- Zasięg (Scope)	Zmienna jest dostępna w view (w bloku), 
												w którym została zdefiniowana 
			- Read-only				Nie możesz zmienić wartości 
												zachowuje sie jak const
			- Reaktywność			Jeśli dane wejściowe (np. user.name) się zmienią, 
												Angular automatycznie przeliczy wartość @let.
			- Podnoszenie 		NIE możesz użyć zmiennej @let zanim ją zadeklarujesz w pliku HTML.
				(Hoisting)


	*/

  user = {
    name: 'Aga',
  };
  data$ = new BehaviorSubject('');
}

// ###############################

@Component({
  selector: 'app-temp-j-child-b',
  template: `
    <!-- 
		 BŁAD - bezpośredni dostęp zwróci błąd
		 jest to inny view i nie ma wiedzy o zmiennych innego szablonu
	  -->
    <!-- <p>LET_1 = {{ name }}</p> -->
    <p>input = {{ inputName() }}</p>
  `,
})
export class TempJChildB {
  /*

	*/
  inputName = model<string>('init val');
}

// ###############################
// ############################### Template Reference Variables
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV zmienne referencyjne szablonu

@Component({
  selector: 'app-temp-j-child-c',
  template: `
    <input #phone placeholder="+48 123 456 789" />
    <p>phone.placeholder = {{ phone.placeholder }}</p>
    <!-- <p>html element REF = {{ phone | json }}</p> -->

    <hr />
    <app-temp-j-child-c-player #player></app-temp-j-child-c-player>
    <div class="controls">
      <button (click)="player.play()">Start</button>
      <button (click)="player.pause()">Stop</button>
    </div>
    <!-- <p>component REF = {{ player | json }}</p> -->

    <hr />
    <ng-template #myTemplate> Szablon fragment</ng-template>
    <!-- <p>template REF = {{ myTemplate | json }}</p> -->

    <hr />
    <div #directiveRef="TempJDir" TempJDir>Dyrektywa</div>
    <!--
			<p>directive REF = {{ directiveRef | json }}</p> 
			Dyrketywa musi mieć w dekoratorze, pole 'exportAs':
					exportAs: 'TempJDir'
			BEZ TEGO NIE MOŻNA PRZYPISAĆ SIĘ zmienną_szablonową do dyrektywy
		-->
  `,
  imports: [
    forwardRef(() => TempJChildCPlayer),
    forwardRef(() => TempJChildCDirective),
    CommonModule,
  ],
})
export class TempJChildC {
  /*
	Template Reference Variables
	zmienne referencyjne szablonu

	@let 		-> przechowuje wartości 'string' 'number' 'object' itp, 
	#				-> zmienne z hasztagiem przechowują obiekty dla:
								- elementów html  'ElementRef'
								- komponentów/dyrektyw (instacja klasy komponentu/dyrektywy)
								- szablonów <ng-template> jako 'TemplateRef'

				 #phone -> to cały obiekt dla elementu html 'input'
	<input #phone placeholder="+48 123 456 789" />
	<p>phone.placeholder = {{ phone.placeholder }}</p>
				
														#player -> to cały obiekt dla komponentu TempJChildCPlayer
	<app-temp-j-child-c-player #player></app-temp-j-child-c-player>
	<div class="controls">
		<button (click)="player.play()">Start</button>
		<button (click)="player.pause()">Stop</button>
	</div>`,


	O czym warto pamiętać?
    - Zasięg (Scope): 	dostępna w obrębie całego szablonu. 
												Możesz ją zdefiniować na dole pliku, a użyć na samej górze.
    - Unikalność: 			nie używać tej samej nazwy dla dwóch różnych referencji 
												w jednym komponencie.
    - Case Sensitivity: #myInput i #myinput to dwie różne zmienne.
    - Wartość: 					Jeśli nie dopiszesz nic po znaku równości (np. #item), 
												referencją będzie element DOM lub komponent. 
												Jeśli dopiszesz (np. #item="ngForm"), 
												referencją będzie konkretna dyrektywa.
	*/
}

@Component({
  selector: 'app-temp-j-child-c-player',
  template: ``,
})
export class TempJChildCPlayer {
  /*
   */

  play = () => {
    console.warn(`TempJChildCPlayer | PLAY`);
  };
  pause = () => {
    console.warn(`TempJChildCPlayer | PAUSE`);
  };
}

@Directive({ selector: '[TempJDir]', exportAs: 'TempJDir' })
export class TempJChildCDirective {
  //...
}
