import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, forwardRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-temp-e',
  template: ` <app-temp-e-child-a />
    <app-temp-e-child-b />
    <app-temp-e-child-c />`,
  imports: [
    forwardRef(() => TempEChildA),
    forwardRef(() => TempEChildB),
    forwardRef(() => TempEChildC),
  ],
})
export class TempE {
  /*
   */
}

// ###############################
// ############################### @IF -> warunkowy SHOW - HIDE
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-e-child-a',
  template: `
    @if (a > b) {
      {{ a }} is greater than {{ b }}
    } @else if (b > a) {
      {{ a }} is less than {{ b }}
    } @else {
      {{ a }} is equal to {{ b }}
    }
    @if (user$ | async; as user) {
      <p>{{ user.name }}</p>
    } @else {
      <p>Ładowanie danych użytkownika...</p>
    }
  `,
  imports: [AsyncPipe],
})
export class TempEChildA {
  /*
	INSTRUKCJA '@if', '@else if', '@else'
	pozwala pisać kod warunkowego renderowania w szablonie tak jakbyśmy pisali w TS/JS

	UWAGA
			za pomocą słowa 'as' możemy przypisać wynik operacji do zmiennej
			której potem mozemy użyć wewnątrz bloków np: 
				- @if (user$ | async; as user) //...
				-	@if (user.profile.settings.startDate; as startDate) {
						{{ startDate }}
					}

	NOWE vs STARE
		Funkcja					Stary sposób (*ngIf)											Nowy sposób (@if)
	-----------------------------------------------------------------------------------
	Podstawa				<div *ngIf="cond">...</div>								@if (cond) { ... }
	Else						*ngIf="cond; else template"	... } 				@else { ... }
	Else If					(Brak bezpośredniego wsparcia)	... } 		@else if (cond) { ... }
	Importy					Wymaga CommonModule / NgIf								Nie wymaga niczego
		
	NOWE DZIAŁA TEŻ SZYBCIEJ -> poprawia performance
	*/
  a = 1;
  b = 2;
  user$ = new BehaviorSubject({ name: 'Aga' });
}

// ###############################
// ############################### @SWITCH -> warunkowy SHOW - HIDE
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-e-child-b',
  template: `
    @switch (status) {
      @case ('nowe') {
        <p>NOWE</p>
      }
      @case ('wyslane_1')
			@case ('wyslane_2')  {
        <p>WYSŁANE</p>
      }
      @default {
        <p>INNE_WARTOŚCI</p>
      }
    }
  `,
  imports: [],
})
export class TempEChildB {
  /*
	INSTRUKCJA '@switch'
		@switch (status) {						// względem zmiennej 'status'
      @case ('nowe') {						// gdy ma wartość 'nowe' wyświetl to niżej
        <p>NOWE</p>
      }
      @case ('wyslane') {
        <p>WYSŁANE</p>
      }
      @default {									// gdy żaden z 'case' nie pasuje wyświetl to
        <p>INNE_WARTOŚCI</p>
      }
    }

	UWAGA
			- brak 'break' lub 'return' -> jak wpadniemy do 'case' to juz do następnych nie
			- sprawdzenie przez '===' typy muszą się zgadzać 

	drabina '@else if' VS '@switch' -> czemu '@switch' lepszy?:
    Czytelniejszy: widzisz, że cała logika wokół jednej zmiennej.
    Szybszy: Angular optymalizuje to porównanie pod maską.
    Bezpieczniejszy: Nie musisz powtarzać nazwy zmiennej w każdym warunku, 
											co ogranicza ryzyko literówki.
  
	
	Cecha									Stary sposób (*ngSwitch)								Nowy sposób (@switch)
	---------------------------------------------------------------------------------------
	Tagi							atrybutu [ngSwitch], *ngSwitchCase				bezpośrednio  @switch, @case
	Importy						import CommonModule												Brak importu
	Wydajność					Średnia (analiza dyrektyw)								DOBRA (natywna obsługa)
	

	*/
  status = 'nowe';
}

// ###############################
// ############################### @FOR -> powtarzanie elementów
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-e-child-c',
  template: `
    <ul>
      @for (task of tasks; track task.id; let i = $index) {
        <li>
          <span>{{ task.name }}</span>
          <span> | index = {{ i }} </span>
          <span> | count = {{ $count }} </span>
          <span> | first = {{ $first }} </span>
          <span> | last = {{ $last }} </span>
          <span> | even = {{ $even }} </span>
          <span> | odd = {{ $odd }} </span>
        </li>
      } @empty {
        <li>lista jest pusta</li>
      }
    </ul>
  `,
  imports: [],
})
export class TempEChildC {
  /*
	INSTRUKCJA '@for'
	składnia @for do powtarzania elementów
	 		@for (task of tasks; track task.id) {
        <li>{{ task.name }}</li>
      } 
	tasks -> tablica (dowolny 'Iterable', ale najlepiej 'Array')
	task	-> obiekt w tablicy
	track -> obowiązkowe wskazanie unikalnej wartości (najlepiej id)
						działą jak 'key' w React'cie 
						sprawia, że na update tablicy aktualizowany jest tylko DOM 
						elementów, które się zmieniły, a nie każdy element tablicy
						UWAGA, w ustateczności
							(track item) lub (track $index), ale jest to odradzane !!

	INSTRUKCJA '@empty'
	Dodatkowo można dopisać tóż po '@for'
			@for (task of tasks; track task.id) {
        <li>{{ task.name }}</li>
      } @empty {
        <li>lista jest pusta</li>
      }
	empty -> sprawdza czy tablica posiada min. 1 element 
						gdy nie to wyświetli sie jako taki 'placeholder' lub '@else if'
	
	Zmienne pomocnicze (Context Variables)
			Zmienna		Opis
			-------------------
			$index		Aktualny numer elementu (liczony od 0).
			$count		Całkowita liczba elementów w kolekcji.
			$first		Prawda (true), jeśli to pierwszy element.
			$last			Prawda (true), jeśli to ostatni element.
			$even			Prawda (true), jeśli indeks jest parzysty.			2,4,6 ...
			$odd			Prawda (true), jeśli indeks jest nieparzysty. 	1,3,5 ...
																				można przypisać do zmiennych
			@for (user of users; track user.id; let i = $index, total = $count) //...
	

	laczego @for jest lepszy niż *ngFor?
    Szybkość: 	- sprawdzanie zmian w @for jest szybszy niż w starej dyrektywie. *ngFor
    Czytelność: - Składnia bardziej przypomina "czysty" JavaScript.
    Brak "śmieci" w HTML: - Nie potrzebujesz już CommonModule 
									ani importowania NgFor w każdym komponencie.
    Wymuszony track: Zapobiega wąskim gardłom wydajnościowym
	*/
  tasks = [
    {
      id: 1,
      name: 'zadanie 1',
    },
    {
      id: 2,
      name: 'zadanie 2',
    },
    {
      id: 3,
      name: 'zadanie 3',
    },
  ];
}
