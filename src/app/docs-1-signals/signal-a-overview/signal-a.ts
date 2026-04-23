import { Component, computed, forwardRef, signal } from '@angular/core';

@Component({
  selector: 'app-signal-a',
  imports: [
    forwardRef(() => SignalA_Signal),
    forwardRef(() => SignalA_ReadonlySignal),
    forwardRef(() => SignalA_Computed),
  ],
  template: `
    <SignalA_Signal />
    <br />
    <hr />
    <SignalA_ReadonlySignal />
    <br />
    <hr />
    <SignalA_Computed />
  `,
})
export class SignalA {}

// ###############################
// ############################### SYGNAŁ
// ############################### signal()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalA_Signal',
  template: `
    <div>
      <p>signal | value = {{ writableSignal() }}</p>
      <div>
        <button (click)="setWritableSignal()">set signal</button>
        <button (click)="updateWritableSignal()">update signal</button>
      </div>
    </div>
  `,
})
export class SignalA_Signal {
  /* 
  signal(1)       -> tworzy sygnał (Writable signal - możliwa jest zmiana jego wartości)

  definicja                   writableSignal = signal(1);
  odczytanie wartości         writableSignal() 
  ustawienie wartości
    - nadpisanie starej       this.writableSignal.set(1);
    - bazując na starej       this.writableSignal.update((prevValue) => { ... } )

  */
  writableSignal = signal(1);

  setWritableSignal() {
    // metoda set - ustawia wartość
    this.writableSignal.set(1);
  }
  updateWritableSignal = () => {
    // metoda update -> pozwala bazowac na poprzdniej wartości sygnału
    this.writableSignal.update((prevValue) => {
      console.log(`writableSignal.update | prevValue = `, prevValue);
      return prevValue + 1;
    });
  };
}

// ###############################
// ############################### SYGNAŁ TYLKO DO ODCZYTU
// ############################### asReadonly()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalA_ReadonlySignal',
  template: ` <div>
    <p>readonly signal | value = {{ readonlySignal() }}</p>
    <div>
      <button (click)="updateWrongReadonlySignal()">set readonly signal</button>
      <button (click)="updateGoodReadonlySignel()">update readonly signal</button>
    </div>
  </div>`,
})
export class SignalA_ReadonlySignal {
  /* 
  readonly signal - możliwy jest tylko odczyt jego wartości
  nie możemy zmienić jego wartości 

  zamiana sygnału na 'readolny' przez metodę  .asReadonly()
  wywołaną na normalnym sygnale
  */
  private readonly _hiddenSignel = signal('a');
  readonly readonlySignal = this._hiddenSignel.asReadonly();
  updateWrongReadonlySignal = () => {
    // this.readonlySignel.set('b')      // Błąd
    // nie można wywołać metody zmieniającej taki sygnał
    console.log(`nie da się updatować `);
  };
  updateGoodReadonlySignel = () => {
    // można natomiast zmienić sygnał, z którego powstał 'readonly'
    // to zmieni wartość też tego 'readonly'
    this._hiddenSignel.update((prev) => prev + 'a');
  };
}

// ###############################
// ############################### SYGNAŁ WYLICZANY Z INNYCH SYGNAŁOW (łączony)
// ############################### computed()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalA_Computed',
  template: ` <div>
    <p>computed | value = {{ computedSignal() }}</p>
    <p>
      <span>Składowa 1 = {{ signalFirst().age }}</span> |
      <span>Składowa 2 = {{ signalTwo() }}</span> |
      <span>Składowa 3 = {{ signalThird() }}</span>
    </p>
    <div>
      <button (click)="updateSignalPartFirst()">update part 1</button>
      <button (click)="updateSignalPartTwo()">update part 2</button> |
      <button (click)="updateSignalPartThird()">update part 3</button>
    </div>
  </div>`,
})
export class SignalA_Computed {
  signalFirst = signal({ age: 1 });
  signalTwo = signal('a');
  signalThird = signal(true);
  updateSignalPartFirst = () => {
    this.signalFirst.update((prev) => {
      // potrzeba zwrócić nową referencję, aby wykonać ponowne obliczenie
      return {
        ...prev,
        age: prev.age + 1,
      };
    });
  };
  updateSignalPartTwo = () => {
    this.signalTwo.update((prev) => prev + 'a');
  };
  updateSignalPartThird = () => {
    this.signalThird.update((prev) => !prev);
  };
  /*
  powyżej mamy syngały wejściowe, których zmiana wywołuje obliczenia w 'computed'

  computed to sygnał łączony, nasłuchuje zmian w sygnałach, których wartości w nim odczytujemy
  i zwraca nową wartość 

  jest tylko do odczytu, a update tylko poprzez zmianę nasłuchiwanych sygnałów

  UWAGA
    - wartości są cachowane
    - idealne do skomplikowanych obliczeń
  */
  computedSignal = computed(() => {
    console.log(`computed wywołany`);

    const date = new Date().getTime();

    // UWAGA!!!
    //    - mimo iż sygnał 'first' nie jest użyty
    //      to sam fakt odczytania jego wartości przy jej zmianie spowoduje przeliczenie computed
    const first = this.signalFirst();
    const two = this.signalTwo();

    if (two.length > 2) {
      // UWAGA!!!
      //      - dopiero gdy wartość sygnału 'two' ma min 2 znaki, to od tego momentu
      //        update wartości sygnału 'third' powoduje przeliczenie computed, wcześniej nie !!!!
      const third = this.signalThird();
      return `${date}-${two}-${third}`;
    } else {
      return `${date}-${two}-+++`;
    }
  });
}
