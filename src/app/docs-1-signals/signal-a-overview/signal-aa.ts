import {
  assertNotInReactiveContext,
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  untracked,
} from '@angular/core';

/*
kontekst reaktywny (reactive context) to specjalny stan środowiska uruchomieniowego, 
w którym Angular aktywnie „nasłuchuje”, jakie sygnały są odczytywane


Producent vs Konsument
    Producent (Producer): Sygnał, który ma wartość (np. writableSignal, computed, input). 
													Gdy jego wartość się zmienia, powiadamia on swoich konsumentów.
    Konsument (Consumer): Kod uruchamiany w kontekście reaktywnym, który odczytuje sygnały. 
													Zostaje on „oznaczony” jako zależny od konkretnych producentów.

kontekst reaktywny (reactive context) automatycznie na:
    wykonywanie effect, afterRenderEffect callback.
    obliczanie computed signal.
    obliczanie linkedSignal.
    obliczanie a resource's params or loader function.
    Rendering a component template (including bindings in the host property).
jeśli któryś z powyższych się zmieni to kod, który ich nasłuchuje zareaguje

													*/

@Component({
  selector: 'app-signal-aa',
  imports: [],
  template: `
    <div class="wrapper">
      <p>assertNotInReactiveContext</p>
      <p>assertNotInReactiveContext = {{ doubleCount() }}</p>
      <button (click)="saveToDatabase('Ala')">OK | execute funcs without signal</button>
      <button (click)="updateCount()">BŁĄD | update assertNotInReactiveContext signal</button>
    </div>

    <div class="wrapper">
      <p>untracked</p>
      <p>untracked = {{ computedValue1() }}</p>
      <button (click)="updateSignal1()">wartość śledzona wywoła update</button>
      <button (click)="updateSignal2()">wartość nieśledzona nie wywoła updateu</button>
    </div>

    <div class="wrapper">
      <p>equal singal parametr {{ computedSignal3() }}</p>
      <button (click)="updateSignal3a()">updateSignal3a</button>
      <button (click)="updateSignal3b()">updateSignal3b</button>
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
export class SignalAA {
  /*
	assertNotInReactiveContext
			Dosłownie: „Upewnij się, że NIE jesteśmy w kontekście reaktywnym”
			Jest to wewnętrzne zabezpieczenie Angulara, które:
			sprawdza, czy dana funkcja nie została wywołana wewnątrz computed, effect itp.
			jeśli tak się stanie → Angular zgłasza błąd
			Dlaczego? Bo niektóre operacje nie powinny być reaktywne.
	*/
  saveToDatabase(data: any) {
    console.log(`assertNotInReactiveContext 2a`);
    assertNotInReactiveContext(
      this.saveToDatabase,
      'Nie powinno odbywać się w kontekście reaktywnym.',
    );
    console.log(`assertNotInReactiveContext 2b | data = `, data); // <-- ta linia już się nie wykona, gdy zmieni się count
  }
  count = signal(0);
  doubleCount = computed(() => {
    console.log(`assertNotInReactiveContext 1`);
    const value = this.count() * 2;
    try {
      this.saveToDatabase(value); // Tutaj zostanie rzucony błąd
    } catch (exc) {
      console.error(`assertNotInReactiveContext ERROR | exc = `, exc);
    }
    console.log(`assertNotInReactiveContext 3`);
    return value;
  });
  updateCount = () => {
    this.count.update((prev) => prev + 1);
  };

  /*
	untracked „nie śledź tej zależności”
			„Przeczytaj wartość signala, ale NIE zapamiętuj, że od niego zależę”
			Czyli:
			wartość zostanie odczytana, ale zmiany tej wartości nie wywołają reakcji
	*/
  signalValue1 = signal(1);
  signalValue2 = signal(2);
  computedValue1 = computed(() => {
    console.log(`UPDATE untract value`);
    const val1 = this.signalValue1();
    const val2 = untracked(() => {
      const untrackedVal2 = this.signalValue2();
      return untrackedVal2;
    });
    console.log(`UNTRACKED | val1 = ${val1}, val2 = ${val2}`);
    return `1 = ${val1} | 2 = ${val2}`;
  });
  updateSignal1 = () => {
    this.signalValue1.update((prev) => prev + 1);
  };
  updateSignal2 = () => {
    this.signalValue2.update((prev) => prev + 1);
  };

  /*
  jako 2 argument signal może przyjąć obiekt z konfiguracją, w tym funkcję do sprawdzenia czy zaszedł updatewartości
      signal(initValue, { equal: () => {} )
  */
  signalValue3 = signal(['test'], {
    equal: (prevVal, newVal) => {
      if (newVal[0] === prevVal[0]) {
        return true; // wysyła update na true
      } else {
        return false;
      }
    },
  });
  computedSignal3 = computed(() => {
    console.warn(`Przeliczenie computed value 3 `);
    // tylko gdy zmieni się wartość 1 elementu tablicy !!!
    return this.signalValue3();
  });
  updateSignal3a = () => {
    this.signalValue3.set(['test']);
  };
  updateSignal3b = () => {
    this.signalValue3.set(['test1']);
  };

  /*
  do sprawdzenia czy jesteśmy w sygnale jest:
    -  isSignal 
    -  isWritableSignal
  
  const count = signal(0);
  const doubled = computed(() => count() * 2);
  isSignal(count);            // true
  isSignal(42);               // false
  isWritableSignal(count);    // true
  isWritableSignal(doubled);  // false
  */
}
