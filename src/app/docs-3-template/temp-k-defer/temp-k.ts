import { Component, signal } from '@angular/core';
import { TempKChild } from './temp-k-child';
import { TempKChild2 } from './temp-k-child-2';

@Component({
  selector: 'app-temp-k',
  template: `
    @defer {
      <app-temp-k-child />
    }
    <hr />

    @defer {
      <app-temp-k-child />
    } @loading {
      <p>Ładowanie komponentu...</p>
    } @placeholder {
      <div class="skeleton">Miejsce na komponent</div>
    } @error {
      <p>Nie udało się załadować</p>
    }
    <hr />

    @defer {
      <app-temp-k-child-2 />
    } @loading (minimum 2s) {
      <p>Ładowanie komponentu...</p>
    } @placeholder (minimum 500ms) {
      <div class="skeleton">Miejsce na komponent - placeholder</div>
    } @error {
      <p>Nie udało się załadować</p>
    }
    <hr />

    @defer (on viewport) {
      <app-temp-k-child />
    } @loading {
      <p>Ładowanie komponentu...</p>
    } @placeholder {
      <div class="skeleton">Miejsce na komponent</div>
    } @error {
      <p>Nie udało się załadować</p>
    }
    <hr />

    @defer (when customWhen()) {
      <app-temp-k-child />
    } @loading {
      <p>Ładowanie komponentu...</p>
    } @placeholder {
      <div class="skeleton">Miejsce na komponent</div>
    } @error {
      <p>Nie udało się załadować</p>
    }
    <hr />
    <button (click)="handleLoadWhen()">LOAD WHEN</button>
  `,
  imports: [TempKChild, TempKChild2],
})
export class TempK {
  /*
	@defer – pozwala odroczyć ładowanie części komponentów do momentu, gdy będą potrzebne.
	angular automatycznie wycina zawartość @defer do osobnego pliku JS.
	ZMNIEJSZA ROZMIAR PLIKU INICJALNE po build
	DZIAŁA NA:
		- komponenty
		- dyrektywy
		- pipy
		- CSS komponentu
	WEWNATRZ @defer

	UWAGA	
			- @defer działa z elementami 'standalone: true'. 
				dla tych 'standalone: false' i tak zostaną pobrane 'eagerly' zachłanie 
			- komponent, który opóźniamy nie może być użyty gdzieś poza @defer
				jeśli jest lub jest pobrany przez 'ViewChild' to i tak będzie 'eagerly' zachłanie 
	

	@defer {														// PODSTAWA 
		<app-temp-k-child />							// komponent, którego ładowanie opóźniamy
	}																		// trafi do 'chunk' przy buildzie 


	@defer {														
		<app-temp-k-child />							
	} @loading {												// wyświetlana na ładowanie komponentu
	 																		// UWAGA. OPCJONALNIE ->  @loading (after 1s; minimum 2s)
																			// 		minimum  -> min czas wyświetlenia dla 'loading'
																			// 		after		 -> ile czekać od chwili rozpoczącia ładowania
																			//								by pokazać 'loading'
																			//								Jeśli właściwy komponent załaduje się szybciej
																			// 								niż ten czas, w ogóle nie pokazuj bloku @loading
		<p>Ładowanie komponentu...</p>		// treść '@loading'
	} @placeholder {										// wyświetlana gdy nie ma komponentu z '@defer'
	 																		// dokładniej to się jeszcze nie zaczęło
																			// UWAGA OPCJONALNIE ->  @placeholder (minimum 500ms) 
																			//		minimum -> min czas wyświetlenia dla 'placeholder'
		<div class="skeleton">						// treść '@placeholder'
			Miejsce na komponent						// treść '@placeholder'
		</div>														// treść '@placeholder'
	} @error {													// wyświetlane przy błedzie ładowania
		<p>Nie udało się załadować</p>		// treść '@error'
	}


	TRIGGER (zdarzenie / wyzwalacz) -> MOŻEMY OKREŚLIĆ KIEDY KOMPONENT MA SIĘ ZACZAĆ ŁADOWAĆ, przez:
			- 'on'		-> zdarzenia systemowe
				wyzwalacze 'on':
					Wyzwalacz						Kiedy zadziała?											Idealny dla...
					--------------------------------------------------------------------------------------
					idle (domyślny)			Gdy przeglądarka skończy 						Elementów pod spodem strony.
															główne zadania i „odpoczywa”.
					immediate						od razu gdy przeglądrla skończy
															ładować 'non-deafer content'
					viewport						Gdy użytkownik przewinie stronę 		Ciężkich sekcji na dole strony.
															i element pojawi się w widoku.
															korzysta z IntersectionObserver
															obserwuje '@placeholder'
															lub REF !
					hover								Gdy użytkownik najedzie myszką 			Tooltipów, menu podręcznych.
															na placeholder.
															też mozna podać REF elemntu
															którego powyższe ma wywołać TRIGGER
					interaction					Gdy użytkownik kliknie w 						Formularzy edycji, popupów.
															placeholder lub naciśnie klawisz.
															'click' 'keydown'
															też mozna podać REF elemntu
															którego powyższe ma wywołać TRIGGER
					timer(5s)						Po upływie konkretnego czasu.				Reklam lub komunikatów.
				UWAGA
					prefetch on idle -> pobierz kod wcześniej, 
															gdy 
															przeglądarka będzie miała wolną chwilę
			- 'when'	-> własna logika (dla BOOL true / false)
										na true zaczyna się pobieranie i nie można go przerwać 

	UWAGA:
			MOŻNA ŁACZYĆ WIELE TRIGGEROW, odzielając je od siebie ';' 		
			np: @defer (on viewport; prefetch on idle) 
	
										
	@defer (on viewport) {											// wykona się na zdarzenie systemowe 'viewport'
		<app-temp-k-child />							 				// czyli gdy element pojawi się na ekranie
	} 

	UWAGA - 'prefetch'
			@defer (on viewport; prefetch on idle) {		// pokaż element gdy pojawi się na ekranie
				<app-comments />													// ale pobierz go wcześniej na zdarzenie 'idle'
			} @placeholder {														// czyli gdy przeglądarka będzie wolna
				<div>Przewiń niżej</div>
			}

	
	@defer (when customWhen()) {								// element pojawi się gdy 
		<app-temp-k-child />											// customWhen() zwróci 'true'
	}				



	UWAGA
		ROZBUDOWA '@defer (on viewport)'

		1. zastosowanie REF (template referance value)
				<div #greeting>Hello!</div>						// REF '#greeting'
				@defer (on viewport(greeting)) {			// przekazany REF jako parametr
					<greetings-cmp />
				}
		2. customizacja IntersectionObservera
				{
					trigger: greeting, 			- jaki obiekt ma wywołać zdarzenie
					rootMargin: '100px', 		- margines dla tego elementu
					threshold: 0.5					- ile elementu ma sie pojawić
				}

				<div #greeting>Hello!</div>
				@defer (on viewport({trigger: greeting, rootMargin: '100px', threshold: 0.5})) {
					<greetings-cmp />
				}

				@defer (on viewport({rootMargin: '100px', threshold: 0.5})) {
					<greetings-cmp />
				} @placeholder {
					<div>Implied trigger</div>
				}

		
	UWAGA
		1.	@defer działa też z NgMoudle elementami (takimi 'standalone: false')
				tylko dla nich nie zachowuje 'lazy-loadingu'
		2. 	Lokalne działanie aplikacji:
				Gdy aktywny jest Hot Module Replacement (HMR), wszystkie fragmenty bloku @defer 
				są pobierane z wyprzedzeniem (eager), nadpisując wszelkie skonfigurowane wyzwalacze. 
				Aby przywrócić standardowe działanie wyzwalacza, należy wyłączyć HMR, 
				obsługując aplikację z flagą --no-hmr.
				(INACZEJ -> jeśli już jakiś @defer się wykonał to będzie wykonany
				chyba, że sami np: przeładujemy stronę w przeglądarce)
		3.  unikać zagnieżdżania '@defer' w '@defer', a jeśli już musimy
				to upewnic się, że maja inne warunki aktywacji (TRIGGERY)

	*/
  customWhen = signal(false);
  handleLoadWhen = () => {
    this.customWhen.set(true);
  };
}
