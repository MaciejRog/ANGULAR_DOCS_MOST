import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomPipeA } from './pipe-a';

@Component({
  selector: 'app-temp-f',
  template: `
    <div>
      <!-- 
				PIPE 'uppercase'
				ustawia wszystkie litery na WIELKIE
			-->
      <p>PIPE 'uppercase' = {{ zmienna1 | uppercase }}</p>

      <!-- 
				PIPE 'lowercase'
				ustawia wszystkie litery na małe
			-->
      <p>PIPE 'lowercase' = {{ zmienna1 | lowercase }}</p>

      <!-- 
				PIPE 'titlecase'
				ustawi pierwsze litery słów na wielkie resztę na małe
			-->
      <p>PIPE 'titlecase' = {{ zmienna1 | titlecase }}</p>

      <!-- 
				PIPE 'slice'
				wycina ARRAY i STRING, w miejscach 	od : do
				z 'agusia_R' -> po 'slice: 1 : 3' -> jest 'gu'	(indeks 1,2 w stringu)
			-->
      <p>PIPE 'slice' = {{ zmienna1 | slice: 1 : 3 }}</p>

      <!--
				wykonanie od lewej do prawej, więc:
					- najpierw 'lowercase' 
					- wynik powyższczego trafi do 'uppercase'
			-->
      <p>łącznie pipów = {{ zmienna1 | lowercase | uppercase }}</p>

      <!-- 
				PIPE 'date'
				ustawia datę na określony format
				po : można ustawić wymagane argumenty
			-->
      <p>PIPE 'date' = {{ zmienna2 | date: 'dd/MM/yyyy' }}</p>

      <!-- 
				PIPE 'currency'
				do określania walut,
				po : można ustawić wymagane argumenty
						- 'EUR' 		-> kod waluty
						- 'symbol' 	-> sposób wyświetlania 
						- '1.0-2' 	-> zaokrąglenie
														1 -> min liczba miejsc przed przecinkiem
														0 -> min liczba miejsc po przecinku
														2 -> max liczba miejsc po przecinku
			-->
      <p>PIPE 'currency' = {{ zmienna3 | currency: 'EUR' : 'symbol' : '1.0-2' }}</p>

      <!-- 
				PIPE 'number'
				do zaokrąglenia liczb
						1 -> min liczba miejsc przed przecinkiem
						0 -> min liczba miejsc po przecinku
						2 -> max liczba miejsc po przecinku
			-->
      <p>PIPE 'number' = {{ zmienna3 | number: '1.0-2' }}</p>

      <!-- 
				PIPE 'percent'
				zamiana liczby na procent
			-->
      <p>PIPE 'percent' = {{ zmienna3 | percent }}</p>

      <!-- 
				PIPE 'json'
				Pokazuje obiekt jako tekst JSON.stringify
			-->
      <p>PIPE 'json' = {{ zmienna4 | json }}</p>

      <!-- 
				PIPE 'keyvalue'
				zamienia 'Object' i 'Map' na Array [key-value]
				umożlwia np: użycie @for na obiekcie
						@for (item of object | keyvalue; track item.key) {
							<div>{{ item.key }}:{{ item.value }}</div>
						}
			-->
      <p>PIPE 'keyvalue' = {{ zmienna4 | keyvalue | json }}</p>

      <!-- 
				PIPE 'async'
				Automatycznie odbiera dane z Observable lub Promise
			-->
      <p>PIPE 'async' = {{ zmienna5$ | async }}</p>

      <!-- 
				PIPE 'i18nSelect'
							zmienna6 = 'AGA';			<- określa KEY (klucz)
							zmienna6_ALL = {			<- 2 argument to obiekt z wartościami dla kluczy
								AGA: 'AGUSIA',
								MAC: 'MACIEK',
							};
			-->
      <p>PIPE 'i18nSelect' = {{ zmienna6 | i18nSelect: zmienna6_ALL_SELECT }}</p>

      <!-- 
				PIPE 'i18nPlural'
							zmienna6.length 							-> 3
							zmienna6_ALL_PLURAL = {
								'=3': 'Trzy !',							-> dla 3 zwróci TO
							};
			-->
      <p>PIPE 'i18nPlural' = {{ zmienna6.length | i18nPlural: zmienna6_ALL_PLURAL }}</p>
    </div>
    <hr />
    <app-temp-f-child-a />
  `,
  imports: [
    // UpperCasePipe,
    // LowerCasePipe,
    // DatePipe,
    // CurrencyPipe,
    // DecimalPipe,
    // JsonPipe,
    // AsyncPipe,
    CommonModule,
    forwardRef(() => TempfChildA),
  ],
})
export class Tempf {
  /*
	PIPES, informacje ogólne
	do stosowania musimy zaimportować osobny pipe lub cały 'CommonModule'

	Pipe to narzędzie w szablonie, które przyjmuje dane wejściowe, przekształca je 
	i wyświetla wynik, nie zmieniając oryginalnej zmiennej w klasie TypeScript.

	Argumenty:
		-	zawsze jest min 1 -> i jest to zmienna, na której pipe jest wykonany:
			{{ zmienna1 | lowercase }}		-> tutaj 'zmienna1'
		- może być więcej argumentów, podanych po 'pipe' po znaku ':'
			{{ zmienna3 | currency: 'EUR' : 'symbol' : '1.0-2' }}
			 				tutaj argumenty to:
							- zmienna3
							- 'EUR'
							- 'symbol'
							- '1.0-2' 

	CHAING - łączenie wielu pipów
		wykonanie od lewej do prawej, więc dla '{{ zmienna1 | lowercase | uppercase }}'
					- najpierw 'lowercase' 
					- wynik powyższczego (pipe 'lowercase') trafi do 'uppercase'
					- do szablonu ostatecznie trafi wartość zwrócona przez ostatni pipe
		
	ZALETY I ZASTOSOWANIE:
		- Czystość kodu: klasa .ts trzyma logikę biznesową, a formatowanie zostawiasz szablonowi.
			brak funkjci pomocnicznych 'formatDate'
		- Reaktywność: Jeśli zmienna się zmieni, Pipe automatycznie przeliczy wynik
		- Wydajność: Domyślnie Pipes są "Pure"
			uruchamiają się gdy zmieni się wartość (prymitywne) lub referencja

	UWAGA:
		Najpotężniejszy jest 'async'. Pozwala zapomnieć o ręcznym używaniu .subscribe() 
		i sprzątaniu (odsubskrybowaniu) w komponentach

	KOLEJNOŚĆ WYKONYWANIA:
			- przy `(), +, -, *, /, %, &&, ||, ??`
							operator pipe '|' wykona się PO !!!
							np:	{{ zm1 + zm2 | pipeName }}
									najpierw 	-> zm1 + zm2  ->  wynik
									potem 	 	-> wynik | pipeName
			- przy `?`
							operator pipe '|' wykona się PRZED !!!
							WARTO opakować w nawiasy 
							np:	{{ zm1 ? zm1 : zm2 | pipeName }}
									najpierw 	-> zm2 | pipeName -> wynik
									potem 	 	-> zm1 ? zm1 : wynik
							{{ (zm1 ? zm1 : zm2) | pipeName }}
							 		dlatego warto to w nawiasy zamknąć
									najpierw 	-> (zm1 ? zm1 : zm2) -> wynik
									potem 	 	-> wynik | pipeName
	*/

  zmienna1 = 'agusia_R';
  zmienna2 = new Date();
  zmienna3 = 500.12312;
  zmienna4 = { name: 'aga', age: 30 };
  zmienna5$ = new BehaviorSubject('rxjs_observable');

  zmienna6 = 'AGA';
  zmienna6_ALL_SELECT = {
    AGA: 'AGUSIA',
    MAC: 'MACIEK',
  };
  zmienna6_ALL_PLURAL = {
    '=3': 'Trzy !',
  };
}

// ###############################
// ############################### Custom PIPE
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-f-child-a',
  template: ` <p>{{ zmienna1 | customPipeA: 'sufix' }}</p> `,
  imports: [CustomPipeA],
})
export class TempfChildA {
  /*

  */
  zmienna1 = 'Aga jest kochana';
}
