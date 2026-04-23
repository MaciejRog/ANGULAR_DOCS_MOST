import {
  assertNotInReactiveContext,
  Component,
  computed,
  forwardRef,
  signal,
  untracked,
} from '@angular/core';

@Component({
  selector: 'app-signal-aa',
  imports: [
    forwardRef(() => SignalAA_ReactiveContext),
    forwardRef(() => SignalAA_AssertNotInReactiveContext),
    forwardRef(() => SignalAA_Untracked),
    forwardRef(() => SignalAA_SignalConfigEqual),
    forwardRef(() => SignalAA_SignalCheck),
  ],
  template: `
    <SignalAA_ReactiveContext />
    <br />
    <hr />
    <SignalAA_AssertNotInReactiveContext />
    <br />
    <hr />
    <SignalAA_Untracked />
    <br />
    <hr />
    <SignalAA_SignalConfigEqual />
    <br />
    <hr />
    <SignalAA_SignalCheck />
  `,
})
export class SignalAA {}

// ###############################
// ############################### ReactiveContext - kontekst reaktywny
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalAA_ReactiveContext',
  template: ``,
})
export class SignalAA_ReactiveContext {
  /*
  kontekst reaktywny (reactive context) 
  to stan, w którym Angular aktywnie „nasłuchuje”, jakie sygnały są odczytywane
  jeśli któryś z syngałów się zmieni to kod, który ich nasłuchuje zareaguje

  kontekst reaktywny (reactive context) automatycznie na:
      wykonywanie     effect, afterRenderEffect callback.
      obliczanie      computed signal.
      obliczanie      linkedSignal.
      obliczanie      resource's params or loader function.
      renderowanie    component template (including bindings in the host property).

  Producent vs Konsument
      Producent (Producer): ma wartość (np. writableSignal, computed, input). 
                            Gdy jego wartość się zmienia, powiadamia on swoich konsumentów.
      Konsument (Consumer): odczytuje sygnały i 'oznacza' od których zależy
                            (czyli zapisuje producentów, na zmianę których ma się uruchomić)
                            uruchamiany w kontekście reaktywnym
*/
}

// ###############################
// ############################### NIE POZWOL wywołać w kontekście reaktywnym
// ############################### assertNotInReactiveContext()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalAA_AssertNotInReactiveContext',
  template: ` <div>
    <p>assertNotInReactiveContext = {{ doubleCount() }}</p>
    <div>
      <button (click)="saveToDatabase('Ala')">OK | sama funkcja</button>
      <button (click)="updateCount()">BŁĄD | funkcja w computed</button>
    </div>
  </div>`,
})
export class SignalAA_AssertNotInReactiveContext {
  /*
	assertNotInReactiveContext -> „Upewnij się, że NIE jesteśmy w kontekście reaktywnym”

  sprawdza, czy dana funkcja nie została wywołana wewnątrz computed, effect itp. (kontekstu reaktywnego)
  jeśli tak się stanie → Angular zgłasza błąd

  Dlaczego? Bo niektóre operacje nie powinny być reaktywne.
	*/

  count = signal(0);
  updateCount = () => {
    this.count.update((prev) => prev + 1);
  };

  doubleCount = computed(() => {
    console.log(`ASSERT_NOT | assertNotInReactiveContext 1`);
    const value = this.count() * 2;
    try {
      /*
      próbujemy wywołac funkcję 'saveToDatabase'
      która jest zabezpieczona przed wywołaniem w kontekście reaktywnym
      więc zwróci nam błąd, który możemy obsłużyć
      */
      this.saveToDatabase(value); // Tutaj zostanie rzucony błąd
    } catch (exc) {
      console.log(`ASSERT_NOT | assertNotInReactiveContext ERROR | exc = `, exc);
    }
    console.log(`ASSERT_NOT | assertNotInReactiveContext 3`);
    return value;
  });

  saveToDatabase(data: any) {
    console.log(`ASSERT_NOT | assertNotInReactiveContext 2a`);
    /*
    poprzez 'assertNotInReactiveContext' 
    blokujemy możliwość dalszego wykonania się funkcji w kontekście reaktywnym
    */
    assertNotInReactiveContext(
      this.saveToDatabase,
      'Nie powinno odbywać się w kontekście reaktywnym.',
    );
    // poniższa  linia nie wykona się w obliczeniach w 'computed'
    console.log(`ASSERT_NOT | assertNotInReactiveContext 2b | data = `, data);
  }
}

// ###############################
// ############################### WYŁACZENIE ŚLEDZENIA zmian wartości sygnału
// ############################### untracked()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalAA_Untracked',
  template: `<div>
    <p>untracked = {{ computedValue1() }}</p>
    <div>
      <button (click)="updateSignal1()">sygnal śledzony update</button>
      <button (click)="updateSignal2()">sygnal nie-śledzony update<</button>
    </div>
  </div>`,
})
export class SignalAA_Untracked {
  /*
	untracked „nie śledź tej zależności”
	
  tj: „Przeczytaj wartość signala, ale NIE zapamiętuj, że od niego zależę”
	wartość zostanie odczytana, ale zmiana tej wartości nie wywoła reakcji
	*/
  signalValue1 = signal(1);
  updateSignal1 = () => {
    this.signalValue1.update((prev) => prev + 1);
  };

  signalValue2 = signal(2);
  updateSignal2 = () => {
    this.signalValue2.update((prev) => prev + 1);
  };

  computedValue1 = computed(() => {
    console.log(`UNTRACKED | computed`);
    const val1 = this.signalValue1();
    /*
    untracked przyjmuje funkcje, która zwraca wartość
    w niej możemy odczytać sygnały, których następna zmiana wartość nie spowoduje 
    ponownego wyliczenia wartości 'computed'

    więc tutaj zmiana:
      - signalValue1 -> UPDATE 'computed' (oraz odczyta wartość jaką ma 'signalValue2')
      - signalValue2 -> BRAK UPDATU 'computed'
    */
    const val2 = untracked(() => {
      const untrackedVal2 = this.signalValue2();
      return untrackedVal2;
    });
    return `1 = ${val1} | 2 = ${val2}`;
  });
}

// ###############################
// ############################### KONFIGURACJA SYGNAŁOW
// ############################### signal() config 'equal'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalAA_SignalConfigEqual',
  template: `<div>
    <p>equal singal parametr {{ computedSignal3() }}</p>
    <div>
      <button (click)="updateSignal3a()">updateSignal3a</button>
      <button (click)="updateSignal3b()">updateSignal3b</button>
    </div>
  </div>`,
})
export class SignalAA_SignalConfigEqual {
  /*
  jako 2 argument signal przyjmuje obiekt konfiguracji

  w tym funkcję 'equal' do sprawdzenia czy nastąpiła zmiana wartości
  na zmianę sygnał informuje o tym swoich 'konsumentów' - czyli inne sygnały,
  które nasłuchują jego zmiany wartości
  */
  signalValue3 = signal(['test'], {
    equal: (prevVal, newVal) => {
      // gdy przy zmianie wartości 1 element tablicy jest inny niż poprzednio
      // to wtedy wyślij info o aktualizacji
      if (newVal[0] === prevVal[0]) {
        return true;
      } else {
        // wysyła informację o update na false
        // czyli, że nowy 1-szy elment tablicy jest inny od poprzedniego 1-szego
        return false;
      }
    },
  });
  updateSignal3a = () => {
    this.signalValue3.set(['test']);
  };
  updateSignal3b = () => {
    this.signalValue3.set(['test1']);
  };

  computedSignal3 = computed(() => {
    console.log(`EQUAL | computed`);
    return this.signalValue3();
  });
}

// ###############################
// ###############################  SPRAWDZENIE CZY COŚ JEST SYGNAŁEM
// ###############################  isSignal  &&  isWritableSignal
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalAA_SignalCheck',
  template: ``,
})
export class SignalAA_SignalCheck {
  /*
  do sprawdzenia czy dana zmienne jest sygnałem są:
    -  isSignal 
    -  isWritableSignal
  
  const count = signal(0);
                isSignal(count);            // true
                isSignal(42);               // false (42 jako number)
                isWritableSignal(count);    // true
  
  const doubled = computed(() => count() * 2);
                isSignal(doubled);          // true
                isWritableSignal(doubled);  // false - nie da się wywołać metod 'set' lub 'update'
  */
}
