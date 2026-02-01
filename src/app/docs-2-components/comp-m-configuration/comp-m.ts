import {
  afterEveryRender,
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  forwardRef,
  Input,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-comp-m',
  template: `
    <p>Classic {{ valClassic.age }} <button (click)="changeClassic()">change</button></p>
    <p>Signal {{ valSignal().age }} <button (click)="changeSignal()">change</button></p>
    <hr />
    <app-comp-m-child-a [valClassic]="valClassic" [valSignal]="valSignal()" />
    <hr />
    <app-comp-m-child-b />
    <hr />
    <app-comp-m-child-c />
  `,
  imports: [
    forwardRef(() => CompMChildA),
    forwardRef(() => CompMChildB),
    forwardRef(() => CompMChildC),
  ],
})
export class CompM {
  valClassic = { age: 1 };
  valSignal = signal({ age: 1 });

  changeClassic = () => {
    this.valClassic.age += 1;
  };

  changeSignal = () => {
    this.valSignal.update((prev) => {
      return {
        ...prev,
        age: prev.age + 1,
      };
    });
  };
}

// ###############################
// ############################### ChangeDetectionStrategy
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-m-child-a',
  template: `
    <p>CHILD classic {{ valClassic.age }}</p>
    <p>CHILD signal {{ valSignal().age }}</p>
  `,
  // changeDetection: ChangeDetectionStrategy.Default,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompMChildA implements AfterViewChecked {
  /*
	Strategie wykrywania zmian:
		- ChangeDetectionStrategy.Default (DOMYŚLNE)
					Angular sprawdza komponent i całe jego poddrzewo 
					przy każdym cyklu wykrywania zmian.
					NA KAŻDE ZDARZENIE W APLIKACJI
					NA: user interaction, network response, timers, and more.

		- ChangeDetectionStrategy.OnPush
					sprawdza tylko czy komponent nie potrzebuje aktualizacji DOM, NA:
							- zmiana referencji @Input()
							- Zdarzenie (Event) wewnątrz komponentu: 
							- Pipe async: Gdy Observable powiązany z szablonem wyemituje nową wartość.
							- Ręczne wywołanie: Gdy sam powiesz Angularowi: „Teraz sprawdź!” (markForCheck()).
										constructor(private cdr: ChangeDetectorRef) {}
										updateData() {
											// Robimy coś poza Angularem lub w skomplikowany sposób
											this.data = 'Nowa wartość';
											// Mówimy: "Przy najbliższej okazji sprawdź ten komponent"
											this.cdr.markForCheck();
										}
	*/
  @Input({ required: true })
  valClassic: { age: number } = { age: 0 };

  valSignal = input.required<{ age: number }>();

  ngAfterViewChecked(): void {
    console.warn(
      `${Math.random() * 10000} | AFTER_VIEW_CHECKED classic=${this.valClassic.age}, signal=${this.valSignal().age}`,
    );
  }
}

// ###############################
// ############################### PreserveWhitespaces
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-m-child-b',
  template: `
    <p>Tutaj mamy trochę wcięć</p>

    <p>i enterów nadanych</p>
  `,
  // preserveWhitespaces: true,
  /* WYRENDERUJE SZABLON JAKO:
	<app-comp-m-child-b>
    <p>Tutaj mamy trochę wcięć</p>

    <p>i enterów nadanych</p>
  </app-comp-m-child-b>
	*/
  preserveWhitespaces: false,
  /* WYRENDERUJE SZABLON JAKO:
	<app-comp-m-child-b><p>Tutaj mamy trochę wcięć</p><p>i enterów nadanych</p></app-comp-m-child-b>
	*/
})
export class CompMChildB {
  /*
	Domyślnie Angular usuwa i kompresuje zbędne spacje w szablonach, 
	najczęściej w nowych wierszach i wcięciach
	*/
}

// ###############################
// ############################### Custom element schemas
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-m-child-c',
  template: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompMChildC {
  /*
	DOMYŚLNIE ANGULAR rzuci BŁĘDEM gdy napotka nieznany tag HTML
	można to wyłączyć, dzieki opcji
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
	*/
}
