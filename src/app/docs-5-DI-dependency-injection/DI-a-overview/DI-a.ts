import { Component, Injectable, forwardRef, inject } from '@angular/core';

@Component({
  selector: 'app-DI-a',
  template: ` <app-DI-a-child-a />`,
  imports: [forwardRef(() => DIAChildA)],
})
export class DIA {
  /*
	Dependency injection (DI)
	Wstrzykiwanie zależności (Dependency injection - DI) to wzorzec projektowy 
	służący do organizowania i udostępniania kodu w obrębie aplikacji.
	wiele miejsc korzysta z kodu z innego (centralnego miejsca)

	Zależność to dowolny obiekt, wartość, funkcja lub usługa/service, której 
	klasa potrzebuje do działania, ale której sama nie tworzy.
	
	dwa sposoby interakcji z systemem wstrzykiwania zależności:
		- Kod może dostarczać lub udostępniać wartości.
		- Kod może wstrzykiwać lub żądać tych wartości jako zależności.
	
	Typowe DI objemuje:
		- Wartości 					konfiguracyjne: Stałe środowiska, adresy URL API itp.
		- Fabryki: 					Funkcje tworzące obiekty lub wartości
		- Usługi/service: 	Klasy zapewniające wspólną funkcjonalność, logikę biznesową lub stan

	
	USŁUGA / SERVICE - to klasa TypeScript z atrybutem @Injectable
			@Injectable pozwala na jej wstrzykiwanie jako zależności
			Usługi to najpopularniejszy sposób udostępniania danych i funkcjonalności w aplikacji.
			STOSOWANE DO:
				- pobierania i odbierania danych z serwera (np: HTTP)
				- zarządzania stanem aplikacji
				- Uwierzytelnianie i autoryzacja
				- Logowanie i obsługa błędów
				- Obsługa i wysyłka zdarzeń (wzorzec obserwatora)
				- Funkcje użytkowe: np: formatowanie danych, walidacja lub obliczenia
	
	"injection context"/ „kontekst wstrzykiwania” -> opisuje miejsca w kodzie, w 
	których można wywołać funkcję inject. 



	*/
}

// ###############################
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
TWORZENIE SERVISU
	@Injectable								<- aby utworzyć service stosujemy dekorator
	{ providedIn: 'root' }		<- dostęp do servisu z każdego miejsca aplikacji
*/
@Injectable({ providedIn: 'root' })
export class AnalyticsLogger {
  track(value: string) {
    console.log('Analytics event logged:', value);
  }
}

@Component({
  selector: 'app-DI-a-child-a',
  template: `<p>DI A - child A</p>
    <button (click)="handleClickA()">Wywołaj 'inject'</button>
    <button (click)="handleClickB()">Wywołaj 'constructor'</button>`,
})
export class DIAChildA {
  /*
	Zależności można wstrzykiwać podczas konstruowania komponentu, dyrektywy lub usługi. 
	Wywołanie funkcji wstrzykiwania może pojawić się w konstruktorze lub inicjatorze pola. 

	są 2 metody na DI:
		- metoda 'inject'
		- argument konstruktora
  */

  loggerA = inject(AnalyticsLogger);
  // loggerA: AnalyticsLogger;												// do inject w konstruktorze

  constructor(private loggerB: AnalyticsLogger) {
    // this.loggerA = inject(AnalyticsLogger);				// inject też możliwy w konstrukotrze
  }

  handleClickA = () => {
    this.loggerA.track('DZIALA Z `inject`');
  };

  handleClickB = () => {
    this.loggerB.track('DZIALA Z `constructor`');
  };
}
