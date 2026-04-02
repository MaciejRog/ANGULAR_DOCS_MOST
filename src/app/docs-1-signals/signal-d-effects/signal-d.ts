import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-signal-d',
  imports: [],
  template: `
    <div class="wrapper">
      <p id="effect-id">effects</p>
      <button (click)="increment()">UPDATE count trigger effect</button>
      <button (click)="runEffect()">runEffect</button>
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

  UWAGA!!!!
	Cel efketu to -> uruchom kod nie reaktywny na zmianę wartości reaktywnej 
  
  effect()              ->  Działa zanim Angular zaktualizuje DOM (stary dom w chwili aktualizacji)
  afterRenderEffect     ->  Działa już po updatcie DOM  (nowy DOM) [tylko CLIENT-SIDE]

  UWAGA!!! zamiast 'afterRenderEffect'
    preferować API:  ResizeObserver, MutationObserver, IntersectionObserver

	Efekt zawsze uruchamia się przynajmniej 1 raz (zaraz po utworzeniu)
	efekty powinny być używane rzadko. 
	Nie należy ich używać do ustawiania innych sygnałów, może to prowadzić do błędów 
  są powiązane z change detection process.
  Angular sam wywołuje cleanup (sprząta po efekcie), chwila zależy od kontekstu utworzenia efektu:
    - view effect | gdy niszczymy komponent
    - root effect | gdy niszczymy CAŁA APLIKACJĘ

	Dobre zastosowania dla efektów:
			- synchronizacja z zewnętrzym API / bibliotekami
			- Logowanie danych do celów analitycznych lub debugowania.
			- Synchronizacja z DOM: np. rysowanie na elemencie <canvas>, 
      - inicjalizacja bibliotek zewnętrznych (jak wykresy Chart.js), które nie są reaktywne.
			- Zapisywanie w pamięci przeglądarki: np. automatyczne zapisywanie stanu do localStorage.
			- Niestandardowe zachowania: np. wyzwalanie animacji w odpowiedzi na stan.
  
  Efekt można wykorzystać gdy mmay dostęp do funkcji 'inject'
    - konstrukotry w klasach, dyrektywach, servisach
    - poza konstrukotrem trzeba przekazać incjector
          private injector = inject(Injector);
          initializeLogging(): void {
            effect(
              () => {},
              {injector: this.injector},
            );
          }
	*/

  count = signal(0);
  constructor() {
    // ###############################
    // ############################### effect
    // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    effect(() => {
      const currentCount = this.count();
      // wywołanie asynchroniczne podczas przebiegu 'change detection'
      console.warn(`Aktualna wartość licznika to: ${currentCount}`);
    });

    const effectRefVal = effect((cleanup) => {
      console.warn(`cleanup effect start 1`);
      const timer = setTimeout(() => {
        console.warn(`cleanup effect start 2`);
        // z uwagi na to, że po 2 sekundach efekt jest niszczony
        // a w cleanup czyszczony jest timeout
        // to ten console.warn się nigdy nie wykona
      }, 3000);

      cleanup(() => {
        // wywołana na:
        // - wywołanie ponowne efektu
        // - niszczenie efektu
        clearTimeout(timer);
        console.warn(`cleanup effect end`);
      });
    });
    setTimeout(() => {
      // mozna ręcznie wywołać destory
      console.warn(`Effect destroy`);
      effectRefVal.destroy();
    }, 2000);

    // ###############################
    // ############################### afterRenderEffect
    // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    let domElement: HTMLParagraphElement | null = null;
    afterRenderEffect({
      // modyfikację DOM wpływają na performance dlatego Anuglar
      // wydzielił 4 fazy by go poprawić (poniżej w kolejności ich wykonania)
      earlyRead: (clean) => {
        // 1) by czytać z DOM, przed 'write'
        domElement = document.querySelector('#effect-id');
        console.log(`afterRenderEffect earlyRead`);

        clean(() => {
          console.log(`afterRenderEffect earlyRead clean`);
        });

        return domElement;
      },
      write: (prevValue, clean) => {
        // 2) możem zmienić DOM, ale NIE CZYTAĆ z niego
        if (domElement) {
          domElement.textContent += '1';
        }
        // prevValue -> earlyRead !
        console.log(`afterRenderEffect write | prevValue = `, prevValue());
        clean(() => {
          console.log(`afterRenderEffect write clean`);
        });

        return domElement;
      },
      mixedReadWrite: (prevValue, clean) => {
        // 3) najlepiej unikać jak ognia !!!
        //  domyślan jak nie ma faz
        // prevValue -> write !
        console.log(`afterRenderEffect mixedReadWrite | prevValue = `, prevValue());
        clean(() => {
          console.log(`afterRenderEffect mixedReadWrite clean`);
        });

        return domElement;
      },
      read: (prevValue, clean) => {
        // 4) czytanie z dom, NIGDY ZAPIS
        domElement = document.querySelector('#effect-id');
        // prevValue -> mixedReadWrite !
        console.log(`afterRenderEffect read | prevValue = `, prevValue());
        clean(() => {
          console.log(`afterRenderEffect read clean`);
        });
      },
    });

    afterRenderEffect(() => {
      // bez określenia faz, domyślnie kod uruchomi się w 'mixedReadWrite'
      const element = document.querySelector('#effect-id');
      if (element) {
        element.textContent += '1';
      }
    });
  }
  increment() {
    this.count.update((c) => c + 1);
  }

  private injector = inject(Injector);
  runEffect = () => {
    effect(
      () => {
        console.warn(`Injector effect`);
      },
      {
        injector: this.injector,
      },
    );
  };
}
