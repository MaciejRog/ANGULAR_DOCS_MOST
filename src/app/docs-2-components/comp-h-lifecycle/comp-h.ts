import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  afterEveryRender,
  afterNextRender,
  forwardRef,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-comp-h',
  template: `
    <p>SHOW {{ show() }} | <button (click)="handleToggle()">ZMIEŃ SHOW</button></p>
    <p>
      inputVal {{ parentInputVal() }} | <button (click)="changeInputVal()">ZMIEŃ INPUT VAL</button>
    </p>
    <br />
    <br />
    @if (show()) {
      <app-comp-h-child [inputVal]="parentInputVal()">
        <p>H PARENT KONTENT - STATIC</p>
        <p>
          H PARENT KONTENT - DYNAMIC | {{ value() }}
          <button (click)="handleClick()">ZMIEŃ KONTENT</button>
        </p>
      </app-comp-h-child>
      <br />
      <br />
      <br />
      <app-comp-h-child-new [inputVal]="parentInputVal()">
        <p>H PARENT KONTENT - STATIC</p>
        <p>
          H PARENT KONTENT - DYNAMIC | {{ value() }}
          <button (click)="handleClick()">ZMIEŃ KONTENT</button>
        </p>
      </app-comp-h-child-new>
    }
  `,
  imports: [forwardRef(() => CompHChild), forwardRef(() => CompHChildNew)],
})
export class CompH
  implements
    OnInit,
    OnChanges,
    OnDestroy,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked
{
  /*
	PRZYPOMNIENIE NAZWY ELEMENTOW KOMPONENTU
			<app-comp-f-child>														// HOST -> odpowiednik w DOM selectora
				<div>																				// VIEW -> szablon to co w template
					<p>CONTENT CHILD</p>											// VIEW
					<p>Treść ng-content przez rodzica</p>			// CONTENT -> to co między tagami HOSTA w miejscu <ng-content/>
				</div>																			// VIEW
			</app-comp-f-child>														// HOST



	lifecycle -> to cykl życia komponentu od chwili jego utworzenia, aż do zniszczenia
	każda metoda z cyklu życia to inny proces powiązany z renderowaniem komponentu i sprawdzaniem w nim zmian
	angular przy sprawdzaniu zmian idzie od ROOT -> LISCI
	każdy komponent sprawdza tylko 1 raz, więc podczas sprawdzania należy nie wprowadzać zmian
	
	KOLEJNOŚĆ WYKONANIE:
	NA POWSTANIE KOMPONENTU
				constructor 
				ngOnChanges
				ngOnInit 
				ngDoCheck 
				ngAfterContentInit 
				ngAfterContentChecked 
				ngAfterViewInit
				ngAfterViewChecked
	NA UPDATE / RERENDER 
				ngDoCheck 
				ngAfterContentChecked 
				ngAfterViewChecked
	NA ODMONTOWANIE KOMPONENTU Z DOM
				ngOnDestroy

	UWAGA
		jeśli komponent ma np dyrektywy i pokrywają się lifecycle hooki to kolejności 
		ich wykonania jest przypadkowa
	*/
  show = signal(true);
  handleToggle = () => {
    console.log('');
    this.show.update((prev) => !prev);
  };
  parentInputVal = signal(10);
  changeInputVal = () => {
    console.log('');
    this.parentInputVal.update((prev) => prev + 1);
  };
  value = signal(1);
  handleClick = () => {
    console.log('');
    this.value.update((prev) => prev + 1);
  };

  constructor() {
    console.error('PARENT constructor');
  }
  ngOnInit(): void {
    console.error('PARENT ngOnInit');
  }
  ngDoCheck(): void {
    console.error('PARENT ngDoCheck');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.error('PARENT ngOnChanges | changes = ', changes);
  }
  ngAfterContentInit(): void {
    console.error('PARENT ngAfterContentInit');
  }
  ngAfterContentChecked(): void {
    console.error('PARENT ngAfterContentChecked');
  }
  ngAfterViewInit(): void {
    console.error('PARENT ngAfterViewInit');
  }
  ngAfterViewChecked(): void {
    console.error('PARENT gAfterViewChecked');
  }
  ngOnDestroy(): void {
    console.error('PARENT ngOnDestroy');
  }
}

// ############################### NOWE PODEJŚCIE DO CYKLU ŻYCIA DLA 'SSR"
// ###############################	SERVER SIDE RENDERINGU - afterEveryRender && afterNextRender
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-h-child-new',
  template: `
    <p>NEW | STATYCZNY H CHILD NEW</p>
    <p>
      NEW | DYNAMICZNY H CHILD NEW | {{ value() }} <button (click)="handleClick()">ZMIEŃ</button>
    </p>
    <ng-content />
  `,
})
export class CompHChildNew implements AfterViewInit, AfterViewChecked {
  inputVal = input.required<number>();
  value = signal(1);
  handleClick = () => {
    console.log('');
    this.value.update((prev) => prev + 1);
  };

  constructor() {
    /*
		To nie są metody cyklu życia jak ngOnInit. 
		To funkcje pomocnicze, które pozwalając na bezpieczny dostęp do przeglądarki.

		Przy SSR haki cyklu życia np: 'ngOnInit' próbowały się odpalać i w przeglądarce, ale
		też na serwerze (a tam nie ma window, document itp)
		'afterNextRender' i 'afterEveryRender' rozwiązują problem: wykonują się 
		TYLKO W PRZEGLADARCE.

		Jeśli kod dotyka window, document lub używasz biblioteki, która "rysuje" po DOM 
		zapomnij o starych hakach. Używaj afterNextRender i afterEveryRender
		
		*/
    afterEveryRender(() => {
      console.warn(`CompHChildNew | afterEveryRender`);
      /*
			- URUCHAMIANY_GDY:	WIELE RAZY
				po każdym cyklu renderowania całego VIEW w przeglądarce
			- przyjazny dla SSR.
			- DZIAŁA JAK 'ngAfterViewChecked' 
			- wykonuje się na samym końcu po wszystkich lifecycle hooks WSZYSTKICH KOMPONENTOW
			- wywołanie w kontekcie komponentu (najlepiej konstruktor)

			STOSOWANIE:
			- biblioteki JS z dostępem do DOM
			-	zmiana fizycznego wygląd strony, praca na natywnym DOM. itp

					afterEveryRender(() => {
						// Wykona się po każdej zmianie widoku.
						// Możesz tu np. mierzyć rozmiary elementów, by przeliczyć pozycję tooltipa. itp
						const rect = document.querySelector('#target-element')?.getBoundingClientRect();
						console.log('Aktualna pozycja celu:', rect);
					});
			*/
    });

    afterNextRender(() => {
      console.warn(`CompHChildNew | afterNextRender`);
      /*
			- URUCHAMIANY_GDY:	TYLKO 1 RAZ
			- przyjazny dla SSR.
			- DZIAŁA JAK 'ngAfterViewInit' 
			- wykonuje się na samym końcu po wszystkich lifecycle hooks WSZYSTKICH KOMPONENTOW
			- wywołanie w kontekcie komponentu (najlepiej konstruktor)

			uruchamiany gdy VIEW komponentu się zainicjuje
			Angular kończy renderowanie VIEW komponentu (template) oraz wszystkich jego komponentów dzieci.

			stosujmey do:
			- biblioteki JS z dostępem do DOM
			-	zmiana fizycznego wygląd strony, praca na natywnym DOM. itp
			*/
    });

    afterEveryRender({
      // modyfikację DOM wpływają na performance dlatego Anuglar
      // wydzielił 4 fazy by go poprawić (poniżej w kolejności ich wykonania)
      earlyRead: () => {
        // UNIKAĆ
        // 1) by czytać z DOM, przed 'write'
        console.warn(`afterEveryRender | earlyRead | `);
        return 1;
      },
      write: (arg) => {
        // 2) możem zmienić DOM, ale NIE CZYTAĆ z niego
        console.warn(`afterEveryRender | write | arg = `, arg);
        return arg + 1; // arg = 1 -> przekazane z 'earlyRead'
      },
      mixedReadWrite: (arg) => {
        // DOMYŚLNA - jak nie ma podziały na fazy to jesteśmy w tej
        // 3) mieszany 2 i 4
        console.warn(`afterEveryRender | mixedReadWrite | arg = `, arg);
        return arg + 1; // arg = 2 -> przekazane z 'write'
      },
      read: (arg) => {
        // 4) czytanie z DOM, NIGDY ZAPIS
        console.warn(`afterEveryRender | read | arg = `, arg);
        return arg + 1; // arg = 3 -> przekazane z 'mixedReadWrite'
      },
    });
  }
  ngAfterViewInit(): void {
    console.warn(`CompHChildNew | ngAfterViewInit`);
  }
  ngAfterViewChecked(): void {
    console.warn(`CompHChildNew | ngAfterViewChecked`);
  }
}

// ############################### metody cyklu życia
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-h-child',
  template: `
    <p>STATYCZNY H CHILD</p>
    <p>DYNAMICZNY H CHILD | {{ value() }} <button (click)="handleClick()">ZMIEŃ</button></p>
    <ng-content />
  `,
})
export class CompHChild
  implements
    OnInit,
    OnChanges,
    OnDestroy,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked
{
  inputVal = input.required<number>();
  value = signal(1);
  handleClick = () => {
    console.log('');
    this.value.update((prev) => prev + 1);
  };

  constructor() {
    console.warn('constructor');
    /*
		- URUCHAMIANY_GDY:	TYLKO 1 RAZ
		uruchamiany na stworzenie instancji klasy czyli na utworzenie komponentu
		tutaj wstrzykiwane są zależność (DEPENDENCY INCJECTION)
		BRAK dostępu do KONTENT, VIEW, HOST, @Inputs itp...
		*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.warn('ngOnChanges | changes = ', changes);
    /*
		- URUCHAMIANY_GDY:	WIELE RAZY
		uruchamiany za każdym razem gdy zmieni/ustawi się wartość 'input' / '@Input' 

		dzieje się przed sprawdzeniem TEMPLATE(VIEW) 
		można zaktualizować stan na bazie wartości inputów
		Grupowanie - Angular odpali ngOnChanges tylko raz dla wszystkich zmian @INPUT w tym samym cyklu wykrywania zmian.

		SimpleChanges
				PreviousValue: poprzednia wartość inputa
				CurrentValue: obecna wartość inputa
				FirstChange: Czy pierwsze przypisanie wartości (podczas inicjalizacji)?

		UWAGA
				dla input {} lub [] trzeba zmienić referencję by się uruchomił !

		PRZYKŁAD
				@Component({
					//...
					template: `
						<p>Aktualna cena: {{ price }} zł</p>
						<p>{{ message }}</p>
					`
				})
				export class PriceTrackerComponent implements OnChanges {
					@Input() price: number = 0;
					message: string = 'Czekam na dane...';

					ngOnChanges(changes: SimpleChanges): void {
						if (changes['price']) {														// Sprawdzamy, czy zmienił się input 'price'
							const prev = changes['price'].previousValue;
							const curr = changes['price'].currentValue;
							if (changes['price'].isFirstChange()) {
								this.message = 'Cena początkowa ustalona.';
							} else if (curr > prev) {
								this.message = `Cena wzrosła o ${curr - prev} zł! 📈`;
							} else {
								this.message = `Cena spadła o ${prev - curr} zł! 📉`;
							}
						}
					}
				}
		*/
  }

  ngOnInit(): void {
    console.warn('ngOnInit | inputVal = ', this.inputVal());
    /*
		- URUCHAMIANY_GDY:	TYLKO 1 RAZ
		uruchamiany jak Angular wczyta wszystkie 'input' / '@Input' z ich wartościami domyślnymi

		UWAGA:
			- template / view JESZCZE NIE DOSTĘPNE

		ZASTOSOWANIE: (LOGIKA KOMPONENTU)
			- HTTP
			- Inicjalizacja zmiennych, które zależą od wartości przekazanych przez @Input.
			- Konfiguracja formularzy (jeśli używasz Reactive Forms).
			- Ustawianie subskrypcji (np. nasłuchiwanie na zmiany w strumieniach danych).
		*/
  }

  ngDoCheck(): void {
    console.warn('ngDoCheck');
    /*
		- URUCHAMIANY_GDY:	WIELE RAZY
		uruchamiany gdy komponent jest wywołany przez Angular do sprawdzenia pod względem zmian

		pozwala na ręczne wykrywanie zmian, których Angular mógł nie zauważyć.
		uruchamiana podczas każdego cyklu wykrywania zmian, niezależnie gdzie ta zmiana nastąpiła.

		Krótka lekcja różnicy
    		ngOnChanges: "Puk, puk! Przyniosłem nową paczkę (nową referencję)".
    		ngDoCheck: "Puk, puk! Nie wiem czy coś przyszło, ale sprawdzam cały dom co 5 sekund na wszelki wypadek".

		Przykład ręcznego sprawdzenia zmian:
					Zmiana user.name = 'Stefan', referencja do obiektu user pozostaje ta sama. 
					ngOnChanges nie zareaguje! Tutaj wchodzi ngDoCheck, 
					który pozwala Ci sprawdzić zawartość obiektu "na piechotę".
		
		UWAGA:
				Kliknięcie przycisku gdziekolwiek na stronie, 
				zakończenie zapytania HTTP, poruszenie myszką (jeśli masz listenery) – 
				to wszystko odpala Change Detection, a co za tym idzie – Twoje ngDoCheck. 
				DLATEGO BARDZO OGRANICZYĆ UŻYWANIE 
		*/
  }

  ngAfterContentInit(): void {
    console.warn('ngAfterContentInit');
    /*
		- URUCHAMIANY_GDY:	TYLKO 1 RAZ
		uruchamiany gdy kontent komponentu się zainicjuje
				ngAfterContentInit jest chwilą, w której komponent wie co rodzic włożył mu 
				do środka przez Content Projection (czyli przez tagi <ng-content>).
		
		używamy gdy chcemy wejść w interakcję z KONTENTEM
		dostęp przez dekoratory @ContentChild lub @ContentChildren.

					@Component({
						//...
						template: `<ng-content></ng-content>`
					})
					export class CardComponent implements AfterContentInit {
						// Szukamy komponentu CardHeaderComponent wewnątrz <ng-content>
						@ContentChild(CardHeaderComponent) header!: CardHeaderComponent;
						
						ngAfterContentInit(): void {
							// W ngOnInit 'header' byłby jeszcze undefined!
							// Dopiero tutaj Angular gwarantuje, że projekcja treści została zakończona.
							if (this.header) {
								console.log('Znaleziono nagłówek, zmieniam kolor karty!');
							}
						}
					}
		*/
  }

  ngAfterContentChecked(): void {
    console.warn('ngAfterContentChecked');
    /*
		- URUCHAMIANY_GDY:	WIELE RAZY
		uruchamiany gdy KONTENT komponent jest wywołany przez Angular do sprawdzenia pod względem zmian
		(Change Detection) sprawdzi treść, która została wrzucona do Twojego komponentu przez <ng-content>

		TAKI ngDoCheck ALE DLA KONTENTU
		"nie wiem czy zmieniło sie coś w kontentcie więc wpadam na wszelki wypadek".
		do pracy nad  @ContentChild lub @ContentChildren.

		UWAGA:
				- unikać stosowania
				- zmiana stanu (zwłaszcza zmiennej wyświetlanej gdzies w DOM)
					może wywołać błąd 'ExpressionChangedAfterItHasBeenCheckedError'
					słynny błąd w Angularze, który mówi: 
					„Skończyłem sprawdzać widok, a Ty go znowu zmieniłeś pod moją nieobecność!”.
		*/
  }

  ngAfterViewInit(): void {
    console.warn('ngAfterViewInit');
    /*
		- URUCHAMIANY_GDY:	TYLKO 1 RAZ
		uruchamiany gdy VIEW komponentu się zainicjuje
		Angular kończy renderowanie VIEW komponentu (template) oraz wszystkich jego komponentów dzieci.

		trochę jak 'ngOnInit' ale z gotowym DOM 

		stosujmey do:
			- pracy nad DOM przez @ViewChild lub @ViewChildren.
			- biblioteki (np. wykresy Chart.js, mapy Google Maps), 
				które potrzebują fizycznego elementu w DOM, aby się „zakotwiczyć”.
			- ręczny focus na konkretnym polu formularza. 
			- itp..

		UWAGA:
				- zmiana stanu (zwłaszcza zmiennej wyświetlanej gdzies w DOM)
					może wywołać błąd 'ExpressionChangedAfterItHasBeenCheckedError'
					słynny błąd w Angularze, który mówi: 
					„Skończyłem sprawdzać widok, a Ty go znowu zmieniłeś pod moją nieobecność!”.
					JEŚLI JUŻ TRZEBA to przez:
						- setTimeout (opóxnienie zmiany)
						- signal (reaktywnie)
		*/
  }

  ngAfterViewChecked(): void {
    console.warn('ngAfterViewChecked');
    /*
		- URUCHAMIANY_GDY:	WIELE RAZY
		uruchamiany gdy VIEW komponent jest wywołany przez Angular do sprawdzenia pod względem zmian
		(Change Detection) zakończy sprawdzanie widoku Twojego komponentu oraz widoków jego dzieci.

		TAKI ngDoCheck ALE DLA VIEW 
		"nie wiem czy zmieniło sie coś w widoku/template/szablonie więc wpadam na wszelki wypadek".
		do pracy nad  @ViewChild lub @ViewChildren.

		STOSOWANIE:
		-	zmiana fizycznego wygląd strony, praca na natywnym DOM. np
    		Kiedy musisz przewinąć listę na sam dół po dodaniu nowej wiadomości.
    		Kiedy musisz zmierzyć nową wysokość elementu, który właśnie się rozwinął.

							export class ChatComponent implements AfterViewChecked {
								@ViewChild('scrollContainer') private scrollContainer!: ElementRef;
								ngAfterViewChecked() {
									// Angular właśnie sprawdził widok i dodał nowy <div> z wiadomością.
									// Teraz możemy bezpiecznie przewinąć kontener do dołu.
									this.scrollToBottom();
								}
								private scrollToBottom(): void {
									const el = this.scrollContainer.nativeElement;
									el.scrollTop = el.scrollHeight;
								}
		
		UWAGA:
				- zmiana stanu (zwłaszcza zmiennej wyświetlanej gdzies w DOM)
					może wywołać błąd 'ExpressionChangedAfterItHasBeenCheckedError'
					słynny błąd w Angularze, który mówi: 
					„Skończyłem sprawdzać widok, a Ty go znowu zmieniłeś pod moją nieobecność!”.
					JEŚLI JUŻ TRZEBA to przez:
						- setTimeout (opóxnienie zmiany)
						- signal (reaktywnie)
		*/
  }

  ngOnDestroy(): void {
    console.warn('ngOnDestroy');
    /*
		- URUCHAMIANY_GDY:	TYLKO 1 RAZ
		uruchamiany przez zniszczeniem instancji komponentu (odmonotwaniem/usunięciem go z DOM)

		SPRZATANIE PO SOBIE np:
				- czyszczenie timeoutów/interwałów
				- unsubscribe na Observable
		
		DestroyRef
		Nowy Angular ma alternatywę dla ngOnDestroy – DestroyRef. 
		Pozwala "posprzątać" w dowolnym miejscu kodu, nie tylko w specjalnej metodzie.

					import { inject, DestroyRef } from '@angular/core';

					// Wewnątrz klasy lub funkcji:
					const destroyRef = inject(DestroyRef);		// wstrzykiwanie zależności 
																										// można to przekazać za komponent 
																										// ma pole 'estroyRef.destroyed'
																										// by sprawdzić czy obiekt już jest zniszczony
					const sub = myObservable.subscribe();

					destroyRef.onDestroy(() => {
						sub.unsubscribe(); 						// To samo co w ngOnDestroy, ale bardziej elastyczne!
					});
		*/
  }

  /*
	TO_DO
	Rendering 	
	afterNextRender 			Runs once the next time that all components have been rendered to the DOM.
	afterEveryRender 			Runs every time all components have been rendered to the DOM.
	*/
}
