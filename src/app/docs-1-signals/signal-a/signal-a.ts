import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-signal-a',
  imports: [],
  // templateUrl: './signal-a.html',
  // styleUrl: './signal-a.css',
  template: `
    <div class="wrapper">
      <p>writable signal | value = {{ writableSignal() }}</p>
      <button (click)="setWritableSignal()">set writable signal</button>
      <button (click)="updateWritableSignal()">update writable signal</button>
    </div>

    <div class="wrapper">
      <p>readonly signal | value = {{ readonlySignal() }}</p>
      <button (click)="updateWrongReadonlySignal()">set readonly signal</button>
      <button (click)="updateGoodReadonlySignel()">update readonly signal</button>
    </div>

    <div class="wrapper">
      <p>computed signal | value = {{ computedSignal() }}</p>
      <p>
        computed parts | 1 = {{ signalFirst().age }} | 2 = {{ signalTwo() }} | 3 =
        {{ signalThird() }}
      </p>
      <button (click)="updateSignalPartFirst()">update part 1</button>
      <button (click)="updateSignalPartTwo()">update part 2</button>
      <button (click)="updateSignalPartThird()">update part 3</button>
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
export class SignalA {
  // Writable signal - normalne
  writableSignal = signal(1);
  setWritableSignal() {
    // metoda set - ustawiająca wartość
    this.writableSignal.set(1);
  }
  updateWritableSignal = () => {
    // metoda update -> pozwala bazowac na poprzdniej wartości signal
    this.writableSignal.update((prevValue) => {
      console.log(`writableSignal.update | prevValue = `, prevValue);
      return prevValue + 1;
    });
  };

  // readonly signal - tylko do odczytu
  private readonly _readonlySignel = signal('a');
  readonly readonlySignal = this._readonlySignel.asReadonly();
  updateWrongReadonlySignal = () => {
    // this.readonlySignel
    console.log(`nie da się updatować `);
  };
  updateGoodReadonlySignel = () => {
    this._readonlySignel.update((prev) => prev + 'a');
  };

  // Computed signals - sygnały łączone
  signalFirst = signal({ age: 1 });
  signalTwo = signal('a');
  signalThird = signal(true);
  updateSignalPartFirst = () => {
    this.signalFirst.update((prev) => {
      // return prev;
      // wygląda na to że potrzeba zwrócić nową referencję
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
  // jest tylko do odczytu, a update za kazdy razem gdy któryś ze składowych syngałów się zaktualizuje
  // cachuje wartości
  // świetne do skomplikowanych obliczeń
  computedSignal = computed(() => {
    console.log(`COMPUTED`);
    const date = new Date().getTime();
    const first = this.signalFirst();
    // UWAGA!!! nawet mimo iż first nie jest użyte to i tak powoduje update ;)
    const two = this.signalTwo();

    if (two.length > 2) {
      // UWAGA!!!
      // dopiero gdy two ma min 2 znaki, to od tego momentu
      // update third powoduje update computed value, wcześniej nie !!!!
      const third = this.signalThird();
      return `${date}-${two}-${third}`;
    } else {
      return `${date}-${two}-+++`;
    }
  });

  constructor() {
    console.log(`Writable signal | get = `, this.writableSignal());
  }
  //
}
