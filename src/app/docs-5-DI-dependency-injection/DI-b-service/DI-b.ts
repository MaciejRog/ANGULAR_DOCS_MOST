import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, Injectable } from '@angular/core';

@Component({
  selector: 'app-DI-b',
  template: ` <app-DI-b-child-a />`,
  imports: [forwardRef(() => DIBChildA)],
})
export class DIB {
  /*
	SERVIS/USŁUGA -> kod wielokrotnego użytku, który można udostępniać w całej 
			aplikacji. Zazwyczaj obsługują one pobieranie danych, logikę biznesową 
			lub inne funkcje, do których wiele komponentów potrzebuje dostępu.

	Tworzenie servisu CLI:
			ng generate service CUSTOM_NAME

	servis musi mieć dekorator '@Injectable()'

	*/
}

// ###############################
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
TWORZENIE SERVISU
	@Injectable								<- aby utworzyć service stosujemy dekorator
	{ providedIn: 'root' }		<- dostęp do servisu z każdego miejsca aplikacji

UWAGA jest to ZALECANE
@Injectable({ providedIn: 'root' }) 
		Tworzy pojedynczą instancję (singleton) dla całej aplikacji
		Udostępnia ją wszędzie (instancję)
		Włącza treeshaking, na build dodane do kodu JS, tylko gdy jest wykorzystane


„providedIn: root” obejmuje 99% przypadków użycia
są też wyspecjalizowane scenariusze:
	-	Instancje specyficzne dla komponentów 
					komponenty potrzebują swojej własnej instancji servisu
	-	Konfiguracja ręczna
					dla servisów wymagających konfiguracji w czasie wykonywania / runtime config
	-	Dostawcy fabryk 
					dynamiczne tworzenia servisów w oparciu o warunki runtime
	-	Dostawcy wartości
					dostarczanie obiektów konfiguracyjnych lub stałych


*/
@Injectable({ providedIn: 'root' })
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }
  getData(): string[] {
    return [...this.data];
  }
}

@Component({
  selector: 'app-DI-b-child-a',
  template: `
    <div>
      <p>DATA = {{ dataStore.getData().toString() }}</p>
      <button (click)="dataStore.addData('More data')">DODAJ</button>
    </div>
  `,
})
export class DIBChildA {
  /*
   */
  dataStore = inject(BasicDataStore);
}
