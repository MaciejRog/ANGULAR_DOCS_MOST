import {
  afterRenderEffect,
  Component,
  effect,
  inject,
  Injector,
  signal,
  forwardRef,
} from '@angular/core';

@Component({
  selector: 'app-signal-d',
  imports: [
    forwardRef(() => SignalD_Effect),
    forwardRef(() => SignalD_AfterRenderEffect),
    forwardRef(() => SignalD_InjectEffect),
  ],
  template: `
    <SignalD_Effect />
    <br />
    <hr />
    <!--  -->
    <SignalD_AfterRenderEffect />
    <br />
    <hr />
    <!--  -->
    <SignalD_InjectEffect />
    <br />
    <hr />
  `,
})
export class SignalD {
  // ###############################
  // ############################### SIDE EFFECT  ogólne informacja
  // ###############################
  // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
  /*
	Effects (efekty) 
    -   operacje, które uruchamiają się gdy zmieni się wartość, którego z sygnałów użytych wewnątrz nich.
    -   pozwalają na wykonywanie tzw. "skutków ubocznych" (side effects), 
			  czyli akcji, które wychodzą poza czyste zarządzanie stanem danych.
			  np synchronizacja z API itp...
    -   celem jest uruchomienie kodu nie reaktywnego na zmianę wartości reaktywnej 
        Bardzo podobne do 'computed' lub 'linkedSignal', ale nie zwracają wartości
    -   zawsze uruchamia się przynajmniej 1 raz (zaraz po utworzeniu)
    -   Nie używać ich do ustawiania wartości sygnałów, może to prowadzić do błędów 
        powiązanych z change detection
    -   efekty deklarować tam gdzie jest dostęp do 'inject' najlepiej w konstruktorach Komponentów / Dyrektyw
    -   Angular sam wywołuje cleanup (sprząta po efekcie), chwila zależy od kontekstu utworzenia efektu:
        - view effect | gdy niszczymy komponent
        - root effect | gdy niszczymy CAŁA APLIKACJĘ
    -   UWAGA | Dobre zastosowania dla efektów:
        - synchronizacja z zewnętrzym API / bibliotekami
        - Logowanie danych do celów analitycznych lub debugowania.
        - Synchronizacja z DOM: np. rysowanie na elemencie <canvas>, 
        - inicjalizacja bibliotek zewnętrznych (jak wykresy Chart.js), które nie są reaktywne.
        - Zapisywanie w pamięci przeglądarki: np. automatyczne zapisywanie stanu do localStorage.
        - Niestandardowe zachowania: np. wyzwalanie animacji w odpowiedzi na stan.
	*/
}

// ###############################
// ############################### SIDE EFFECT przed update'm w DOM
// ############################### effect
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalD_Effect',
  template: `
    <div>
      <p>count = {{ this.count() }}</p>
      <div>
        <button (click)="updateCount()">update_count</button>
      </div>
    </div>
  `,
})
export class SignalD_Effect {
  /*
  effect()              ->  Działa zanim Angular zaktualizuje DOM (stary dom w chwili aktualizacji)
  afterRenderEffect     ->  Działa już po updatcie DOM (nowy DOM) [tylko CLIENT-SIDE]
  */

  count = signal(0);

  constructor() {
    /*
    wewnątrz efektu przekazujemy funkcję, która ma się uruchomić na zmianę odczytanych w niej sygnałów
    poniżej zmiana wartości sygnału 'count' wywoła efekty
    wywołanie asynchroniczne podczas przebiegu 'change detection'
    */
    effect(() => {
      const currentCount = this.count();
      console.warn(`Aktualna wartość licznika to: ${currentCount}`);
    });

    /*
    Efekt można przypisać do zmiennej, instancja EffectRef

    Efekt z czyszczeniem 
    cleanup pozwala posprzątać po efekcje, idealne do:
      - usunięcia/przerwania Timeout / Interval
      - unsubscribe
      - przerwania rządań HTTP
    cleanup wykonuje się:
      - przed ponownym wykonaniem efektu np: na zmianę wartości sygnału
      - na nieszczenie efektu
    */
    const effectRefVal = effect((cleanup) => {
      const currentCount = this.count();
      console.warn(`cleanup effect start 1`);

      const timer = setTimeout(() => {
        console.warn(`cleanup effect start 2`);
        // jeśli poniższe 'effectRefVal.destroy();' jest wykonywane to powyższy console się nie wykonana
        // bo po 2s wykona się 'cleanup' a w nim 'clearTimeout(timer);'
      }, 3000);

      cleanup(() => {
        clearTimeout(timer);
        console.warn(`cleanup effect end`);
      });
    });

    /*
    instancja EffectRef
    pozwala na ręczne zniszczenie efektu poprzez metodę 'destroy'
    */
    setTimeout(() => {
      console.warn(`Effect destroy`);
      effectRefVal.destroy();
    }, 2000);
  }

  updateCount() {
    this.count.update((c) => c + 1);
  }
}

// ###############################
// ############################### SIDE EFFECT po update'cie w DOM
// ############################### afterRenderEffect
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalD_AfterRenderEffect',
  template: `
    <div>
      <p id="effect-id"></p>
      <p>count = {{ this.count() }}</p>
      <div>
        <button (click)="updateCount()">update_count</button>
      </div>
    </div>
  `,
})
export class SignalD_AfterRenderEffect {
  /*
  effect()              ->  Działa zanim Angular zaktualizuje DOM (stary dom w chwili aktualizacji)
  afterRenderEffect     ->  Działa już po updatcie DOM (nowy DOM) [tylko CLIENT-SIDE]

  UWAGA
    zamiast 'afterRenderEffect', preferować API:
    - ResizeObserver, 
    - MutationObserver, 
    - IntersectionObserver
  */
  count = signal(0);

  constructor() {
    let domElement: HTMLParagraphElement | null = null;

    /*
    modyfikację DOM wpływają na performance
    dlatego Anuglar, wydzielił 4 fazy wewnątrze 'afterRenderEffect' by go poprawić,
    w kolejności ich wykonania, te fazy to:
    - earlyRead                     - można czytać z DOM bez zapisu
    - write                         - można zapisywać do DOM bez czytania
    - mixedReadWrite [DOMYŚLNA]     - można czytać z DOM i zapisywać do DOM
    - read                          - można czytać z DOM bez zapisu
    */
    afterRenderEffect({
      // 1) można czytać z DOM bez zapisu
      earlyRead: (clean) => {
        /*
        UWAGA !!!
        odczytuję wartość sygnału 'count' tylko w faze 'earlyRead'
        i zmiana jego wartości powoduje wywołanie wyłącznie funkcji w tej fazie !!!!
        */
        const countValue = this.count();
        domElement = document.querySelector('#effect-id');
        console.log(`## afterRenderEffect 1 | earlyRead`);
        clean(() => {
          console.log(`## afterRenderEffect 1 | earlyRead clean`);
        });

        /*
        UWAGA !!!
        wartość zwracana przez fazy ma znaczenie
        przy zwróceniu identycznej wartości jak ostatnio następna faza nie jest wykonywana!
        jeśli natomiast coś sie zmieni np: zwrócona będzie nowa referencja to następne fazy też się wykonają 
        */
        // return domElement;
        return {
          element: domElement,
        };
      },
      // 2) można zapisywać do DOM bez czytania
      write: (prevValue, clean) => {
        /*
        prevValue -> to wartość zwrócona w return 'earlyRead' -> czyli 'domElement' 
        */
        if (domElement) {
          domElement.textContent += '1';
        }
        console.log(`## afterRenderEffect 2 | write | prevValue = `, prevValue());
        clean(() => {
          console.log(`## afterRenderEffect 2 | write clean`);
        });
        return {
          element: domElement,
        };
      },
      // 3) DOMYŚLNA można czytać z DOM i zapisywać do DOM
      // mixedReadWrite: (prevValue, clean) => {
      //   /*
      //   JEŚLI MOŻNA TO UNIKAĆ STOSOWANIA 'mixedReadWrite' bo pogarsza performance
      //   prevValue -> to wartość zwrócona w return 'write'
      //   */
      //   console.log(`## afterRenderEffect 3 | mixedReadWrite | prevValue = `, prevValue());
      //   clean(() => {
      //     console.log(`## afterRenderEffect 3 | mixedReadWrite clean`);
      //   });
      //   return domElement;
      // },
      // 4) można czytać z DOM bez zapisu
      read: (prevValue, clean) => {
        /*
        prevValue -> to wartość zwrócona w return 'mixedReadWrite' 
                     o ile taka faza została zdefiniowana,
                     tutaj jest pominięta, więc wartość 'prevValue' jest taka
                     jak zwrócona przez 'write'
        */
        domElement = document.querySelector('#effect-id');
        console.log(`## afterRenderEffect 4 | read | prevValue = `, prevValue());
        clean(() => {
          console.log(`## afterRenderEffect 4 | read clean`);
        });
      },
    });

    /*
    bez przekazania obiektu z podziałem na fazy {read: ..., write: ...}
    tylko samej funkcji do 'afterRenderEffect'
    cały kod w niej przekazany uruchomi się w fazie 'mixedReadWrite'
    */
    afterRenderEffect((clean) => {
      console.log(`## afterRenderEffect DEFAULT | mixedReadWrite `);
      const currentCount = this.count();
      const element = document.querySelector('#effect-id');
      if (element) {
        element.textContent += '1';
      }
      clean(() => {
        console.log(`## afterRenderEffect DEFAULT clean | mixedReadWrite`);
      });
    });
  }

  updateCount() {
    this.count.update((c) => c + 1);
  }
}

// ###############################
// ############################### DEKLARACJA efektu poza konstruktorem
// ############################### injector effect
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalD_InjectEffect',
  template: `
    <div>
      <p>count = {{ this.count() }}</p>
      <div>
        <button (click)="updateCount()">update_count</button>
        <button (click)="runEffect()">run_injector_effect</button>
      </div>
    </div>
  `,
})
export class SignalD_InjectEffect {
  /*
  Efekt można deklarować gdy mamy dostęp do funkcji 'inject', czyli:
  - konstruktory w klasach, dyrektywach, servisach
  - poza konstrukotrem, poprzez przekazanie 'Injector'
  */
  count = signal(0);
  private injector = inject(Injector);

  runEffect = () => {
    /*
    deklaracja efektu w postaci metody

    UWAGA
    efekt będzie działał i reagował na zmianę wartości sygnału  'count'
    dopiero gdy zostanie zarejestrowany, czyli metoda 'runEffect' zostanie wywołana!!!
    */
    effect(
      () => {
        const currentCount = this.count();
        console.warn(`***** injector_effect | count = `, currentCount);
      },
      {
        injector: this.injector,
      },
    );
  };

  updateCount() {
    this.count.update((c) => c + 1);
  }
}
