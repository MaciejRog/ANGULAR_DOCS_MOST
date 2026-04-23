import { Component, linkedSignal, signal, forwardRef } from '@angular/core';

@Component({
  selector: 'app-signal-b',
  imports: [forwardRef(() => SignalB_LinkedSignal)],
  template: `
    <SignalB_LinkedSignal />
    <br />
    <hr />
  `,
})
export class SignalB {}

// ###############################
// ############################### OBLICZANIE NA PODSTAWIE Innych sygnałów + możliwość SET / UPDATE
// ############################### linkedSignal
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalB_LinkedSignal',
  template: ` <div>
      <p>source_1 = {{ this.val1() }}</p>
      <p>link_signal_1 = {{ this.linkVal1() }}</p>
      <div>
        <button (click)="updateVal1()">update source_1</button>
        <button (click)="setVal1()">set source_1</button>
      </div>
      <div>
        <button (click)="updateLinkVal1()">update link_signal_1</button>
      </div>
    </div>
    <br />
    <hr />

    <div>
      <p>source_2 = {{ this.val2() }}</p>
      <p>link_signal_2 = {{ this.linkVal2() }}</p>
      <div>
        <button (click)="updateVal2()">update source_2</button>
        <button (click)="setVal2()">set source_2</button>
      </div>
      <div>
        <button (click)="updateLinkVal2()">update link_signal_2</button>
      </div>
    </div>`,
})
export class SignalB_LinkedSignal {
  /*
	W Angularze mieliśmy 2 rodzaje sygnałów
		signal: 		->  nie reaguje na zmianę wartości innych sygnałów
                    Można zmienić jego wartość (set / update) 
		computed: 	->  Reaguje na zmianę wartości innych sygnałów
                    ale jest tylko do odczytu (read-only) (nie można zmienić jego wartości)
                    ZASTOSOWANIE -> transformacja danych

	linkedSignal łączy te dwa światy. 
		- wartość można zmieniać (set / update)
		- Reaguje na zmianę wartości innych sygnałów
      można ustawić jego wartość, zależnie od wartości sygnałów ze źródła 'source', lub na podstawie poprzedniej jego wartości
      ZASTOSOWANIE -> stan formularza, wybór z listy, UI "drafts"
	*/
  /*
	UWAGA
  - Przed 'linkedSignal' stosowany był 'effect()' aby ręcznie zmieniać wartości sygnałów
      //
      //
      effect(() => {
        // stare i niezalecane
        // Potencjalne problemy z cyklami i wydajnością
        // zmiana sygnału 'emailDraft' na zmianę wartości sygnału 'currentUser'
        const user = currentUser();
        emailDraft.set(user.email); 
      });
      //
      //
      linkedSignal jest bezpieczniejszy:
        - unika efektów ubocznych: Jest częścią grafu reaktywnego Angulara.
        - Jest czystszy: Mniej kodu boilerplate.
        - Lepsza wydajność: Angular dokładnie wie, kiedy dokonać aktualizacji.
	*/

  initVal1 = ['AAA', 'BBB'];
  val1 = signal(this.initVal1);
  updateVal1 = () => {
    this.val1.update((prev) => {
      return [`New-${prev.length}`, ...prev];
    });
  };
  setVal1 = () => {
    this.val1.set(this.initVal1);
  };
  /*
  'linkedSignal' tak jak 'computed'
  w przekazanej funkcji odczytujemy sygnały 
  gdy zmieni się sygnał 'val1' to wartość 'linkVal1' ustawi się na 1 element z tablicy 'val1'
  ALE możemy sami zmienić wartośc 'linkVal1' jak np: w 'updateLinkVal1'
  */
  linkVal1 = linkedSignal(() => {
    const val1Value = this.val1();
    return val1Value[0];
  });
  updateLinkVal1 = () => {
    this.linkVal1.update((prev) => {
      return prev + '1';
    });
  };

  //
  //
  //
  //
  initVal2 = ['CCC', 'DDD'];
  val2 = signal(this.initVal2);
  updateVal2 = () => {
    this.val2.update((prev) => {
      return [`New-${prev.length}`, ...prev];
    });
  };
  setVal2 = () => {
    this.val2.set(this.initVal2);
  };
  /*
  'linkedSignal' jako obiekt z konfiguracją
    - source        (zależności / producentci) sygnały, których zmiana ma wykonać 'computation'
                    w przekazanej funkcji odczytujemy sygnały tak jak 'computed'
                    do 'computation' jako 1 argument przekazywany jest 'return' z 'source'
    - computation   obliczenie nowej wartości dla 'linkedSignal'
  */
  linkVal2 = linkedSignal({
    source: () => {
      const val2Value = this.val2();
      // wartość zwrócona w 'source' jest jako 1 argument w 'computation'
      return {
        element: val2Value,
      };
    },
    computation: (sourceValues, previous) => {
      /*
      sourceValues             -> wartość zwrócona w 'source'
      previous
           previous?.source    -> poprzednia wartość zwrócna przez 'source'
                                  może być 'undefined' gdy to 1 obliczenie 'linkedSignal'
           previous?.value     -> poprzednia wartość 'linkedSignal'
                                  może być 'undefined' gdy to 1 obliczenie 'linkedSignal'
      */
      console.log(`link_signal_2 | sourceValues = `, sourceValues);
      console.log(`link_signal_2 | previous.source = `, previous?.source);
      console.log(`link_signal_2 | previous.value = `, previous?.value);
      return sourceValues.element[0];
    },
  });
  updateLinkVal2 = () => {
    this.linkVal2.update((prev) => {
      return prev + '1';
    });
  };
}
