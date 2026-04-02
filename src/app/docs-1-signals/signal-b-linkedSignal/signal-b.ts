import { ChangeDetectionStrategy, Component, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-signal-b',
  imports: [],
  // templateUrl: './signal-b.html',
  // styleUrl: './signal-b.css',
  template: `
    <div class="wrapper">
      <p>writable signal | val1 = {{ this.val1() }}</p>
      <p>writable signal | linkVal1 = {{ this.linkVal1() }}</p>
      <button (click)="updateVal1()">update val1</button>
      <button (click)="setVal1()">set val1</button>
      <button (click)="updateLinkVal1()">update linkVal1</button>
    </div>

    <div class="wrapper">
      <p>writable signal | val2 = {{ this.val2() }}</p>
      <p>writable signal | linkVal2 = {{ this.linkVal2() }}</p>
      <button (click)="updateVal2()">update val2</button>
      <button (click)="setVal2()">set val2</button>
      <button (click)="updateLinkVal2()">update linkVal2</button>
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
export class SignalB {
  // ###############################
  // ############################### linkedSignal
  // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
  /*
	linkedSignal

	Tradycyjnie w Angularze mieliśmy dwa główne rodzaje sygnałów:
		signal: 		Zapisywalny (set / update), ale nie reaguje na zmiany innych danych.
		computed: 	Reaguje na zmiany, ale jest tylko do odczytu (read-only).

	linkedSignal łączy te dwa światy. 
		wartość, możesz ręcznie zmieniać (set / update)
		Automatycznie "resetuje się" do nowej wartości obliczonej na podstawie źródła, gdy ulegnie zmianie.

		Cecha								computed												linkedSignal
	Zapisywalność			Nie (tylko do odczytu)						Tak (.set, .update)
	Reaktywność				Zawsze wyliczany ze źródła				Wyliczany przy zmianie źródła, ale potem niezależny
	Zastosowanie			Transformacja danych							Stan formularza, wybór z listy, UI "drafts"
	*/
  initVal1 = ['Standard', 'Express'];
  val1 = signal(this.initVal1);

  /*
  podejście do 'linkedSignal'  jak do 'computation'
  przekazujemy funkcję, która zwraca wartość + określa zależności / producentów
  */
  linkVal1 = linkedSignal(() => {
    const dependency = this.val1();
    // Gdy val1 się zmieni, linkVal1 zresetuje się do pierwszego elementu z tablicy
    return dependency[0];
  });
  updateVal1 = () => {
    this.val1.update((prev) => {
      return [`New-${prev.length}`, ...prev];
    });
  };
  setVal1 = () => {
    this.val1.set(this.initVal1);
  };
  updateLinkVal1 = () => {
    this.linkVal1.update((prev) => {
      return prev + '1';
    });
  };

  initVal2 = ['Standard', 'Express'];
  val2 = signal(this.initVal2);
  /*
  inne nowe podejście do 'linkedSignal'
  w obiekcie konfiguracyjnym podajemy:
    - source        (zależności / producentów)
    - computation   (obliczenie wartości dla linkedSignal może bazować na poprzednich wartościach)
  */
  linkVal2 = linkedSignal({
    // source - to signal, lub input, modal (ogólnie producent)
    source: this.val2,
    computation: (newOptions, previous) => {
      // update gdy source sie zmieni lub jakaś wartośc w 'computation'
      // Możemy użyć poprzedniej wartości, aby zdecydować o nowej
      console.log(`UPDATE LINKED SIGNAL | newOptions | current val2 value= `, newOptions);
      console.log(`UPDATE LINKED SIGNAL | previous val2 value = `, previous?.source);
      console.log(`UPDATE LINKED SIGNAL | current linkVal2 value = `, previous?.value);
      return newOptions[0];
    },
  });
  updateVal2 = () => {
    this.val2.update((prev) => {
      return [`New-${prev.length}`, ...prev];
    });
  };
  setVal2 = () => {
    this.val2.set(this.initVal2);
  };
  updateLinkVal2 = () => {
    this.linkVal2.update((prev) => {
      return prev + '1';
    });
  };

  /*
	UWAGA
	Przed linkedSignal programiści często używali effect(), aby ręcznie resetować sygnały:

	// STARE PODEJŚCIE (niezalecane)
	effect(() => {
		const user = currentUser();
		emailDraft.set(user.email); // Potencjalne problemy z cyklami i wydajnością
	});

	linkedSignal jest bezpieczniejszy, ponieważ:
    - Unika efektów ubocznych: Jest częścią grafu reaktywnego Angulara.
    - Jest czystszy: Mniej kodu boilerplate.
    - Lepsza wydajność: Angular dokładnie wie, kiedy dokonać aktualizacji.
	*/
}
