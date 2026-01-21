import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-signal-d',
  imports: [],
  template: `
    <div class="wrapper">
      <p>effects</p>
      <button (click)="increment()">UPDATE count trigger effect</button>
    </div>
  `,
  styles: `
    .wrapper {
      margin: 16px;
    }

    p {
      margin: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalD {
  /*
	Effects (efekty) operacje, które uruchamiają się gdy zmieni się wartość 
			jednego lub większej liczby sygnałów użytych wewnątrz nich.

	Efekty pozwalają na wykonywanie tzw. "skutków ubocznych" (side effects), 
			czyli akcji, które wychodzą poza czyste zarządzanie stanem danych.
			np synchronizacja z API itp...
	
	Efekt zawsze uruchamia się przynajmniej 1 raz (zaraz po utworzeniu)
	efekty powinny być używane rzadko. 
	Nie należy ich używać do ustawiania innych sygnałów, może to prowadzić do błędów 

	Dobre zastosowania dla efektów:
			Effects are best for syncing signal state to imperative, non-signal APIs.
			Logowanie danych do celów analitycznych lub debugowania.
			Synchronizacja z DOM: np. rysowanie na elemencie <canvas>, inicjalizacja bibliotek zewnętrznych (jak wykresy Chart.js), które nie są reaktywne.
			Zapisywanie w pamięci przeglądarki: np. automatyczne zapisywanie stanu do localStorage.
			Niestandardowe zachowania: np. wyzwalanie animacji w odpowiedzi na stan.
	*/

  count = signal(0);

  constructor() {
    // Rejestracja efektu:
    // 			- konstruktor
    //			- pole klasy
    //			- ręczne przekazanie Incjetora
    effect(() => {
      // wywołanie asynchroniczne podczas 'change detection'
      console.warn(`Aktualna wartość licznika to: ${this.count()}`);
    });

    effect((cleanup) => {
      const timer = setTimeout(() => {
        console.warn(`cleanup effect start`);
      });

      cleanup(() => {
        clearTimeout(timer);
        console.warn(`cleanup effect end`);
      });
    });
  }

  increment() {
    this.count.update((c) => c + 1);
  }
}
