import {
  afterEveryRender,
  Component,
  ContentChild,
  contentChild,
  ContentChildren,
  contentChildren,
  ElementRef,
  forwardRef,
  input,
  QueryList,
  TemplateRef,
  ViewChild,
  viewChild,
  viewChildren,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-comp-i',
  imports: [
    forwardRef(() => CompI_ViewQueries), //
    forwardRef(() => CompI_ContentQueriesWrapper),
    forwardRef(() => CompI_QueriesAdvance),
    forwardRef(() => CompIMatrioszkaA),
    forwardRef(() => CompIMatrioszkaC),
    forwardRef(() => CompI_QueryChild),
  ],
  template: `
    <!--  -->
    <CompI_ViewQueries />
    <br />
    <hr />

    <!--  -->
    <CompI_ContentQueriesWrapper />
    <br />
    <hr />

    <!--  -->
    <CompI_QueriesAdvance>
      <h1 #contentRef>CONTNET_ELEMENT_1</h1>
      <h1 #contentRef>CONTNET_ELEMENT_2</h1>
      <CompI_QueryChild name="advance-1" #contentComp />
      <CompI_QueryChild name="advance-2" />
      <div>
        <app-comp-i-matrioszka-a>
          <app-comp-i-matrioszka-c />
        </app-comp-i-matrioszka-a>
      </div>
    </CompI_QueriesAdvance>
    <br />
    <hr />
  `,
})
export class CompI {
  /*
	są 2 rodzaje zapytań (queries)
	VIEW QUERY && CONTENT QUERY

	queries/zapytania slużą do odczytania wartości z DOM
	Wszystkie queries zwracają sygnały odzwierciedlające aktualne wyniki

	queries znajdą element jeśli ten jest w DOM przeglądarki, jeśli nie zwrócą 'udefined'
	UWAGA -> nie widzą elementów schowanych np przez '@if / *ngIf'

  VIEW/CONTENT QUERY 
	pobranie referencji do elementów znajdujących się w szablonie/VIEW komponentu. Mogą to być:
  - Zwykłe elementy HTML (np. <div>, <input>).
  - Inne komponenty Angulara
  - Dyrektywy.

  TRF -> TEMPALTE REFERENCE VARIABLE
	Możemy oznakować element DOM referencję aby później móc go pobrać
	<p #myDOM>VIEW_DOM_ELEMENT</p>		-> referencja '#myDOM'
	UWAGA
	tej samej referencji może używać WIELE elementów 

  QUERY przyjmuje jako argument, możliwe wartości:
	- TEMPLATE_REF                         viewChild('myDOM');						// <p #myDOM></p>
	- klasę komponentu/dyrektywy           viewChild(klasaKomponentu);
	UWAGA
	selectory CSS -> NIE są obsługiwane jako argumenty w queries
	*/
  /*
  CIEKAWOSTKA 
  QUERY wraz z DI ProviderToken 
      const SUB_ITEM = new InjectionToken<string>('sub-item');
      @Component({
        //...
        providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
      })
      export class SpecialItem {}
      @Component({
        //...
      })
      export class CustomList {
        subItemType = contentChild(SUB_ITEM);
      }
  */
}

@Component({
  selector: 'CompI_QueryChild',
  imports: [],
  template: `
    <div>
      <div>CompI_QueryChild - {{ name() }}</div>
      <br />
    </div>
  `,
})
export class CompI_QueryChild {
  name = input.required<string>();
}

// ###############################
// ############################### dostęp do elementów DOM w szablonie
// ############################### viewChild & viewChildren
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'CompI_ViewQueries',
  imports: [CompI_QueryChild],
  template: `
    <div>
      <div>CompI_ViewQueries</div>
      <br />

      <div>
        <p #myDOM>VIEW_DOM_ELEMENT_1</p>
        <p #myDOM>VIEW_DOM_ELEMENT_2</p>
        <CompI_QueryChild name="view-1" #myComp />
        <CompI_QueryChild name="view-2" />
      </div>
    </div>
  `,
})
export class CompI_ViewQueries {
  /*
  VIEW QUERIES dostępne są po: 'ngAfterViewInit'

	Dostępne są 2 rodzaje QUERY:
  SYGNAŁOWE:
  - viewChild    (1-wszy pasujący element)
  - @viewChild   (1-wszy pasujący element
  DEKORATORY:
  - viewChildren
	-	@viewChildren
  */
  /*
  @viewChild, zwraca: 
  - instancję komponentu	
  - ElementRef						| opakowanie dla elementu DOM (przy odpytaniu nie wie czy to natywny HTML czy KOMPONENT)
  
  @viewChildren, zwraca:
  - Tablicę instancji komponentów
  - QueryList<ElementRef<HTMLElement>>	| opakowanie wielu elementów DOM
                                          lepsza niż zwykła tablica, bo, automatycznie się zaktualizuje!
                                          UWAGA - tylko dla @dekoratorów

	OPCJA STATYCZNA -> { static: true } DLA @ViewChild i @ContentChild
  domyślna 'false' -> dostęp to view/content od 'afterViewXXX' lub 'afterContentXXX'
  z 'true' dostęp od 'onInit'. To mówi, że element który chcemy dostać jest na 100% w DOM od powstania szablonu
  DZIAŁA GDY:
    - element nie jest w '*ngIf' lub '*ngFor.'
    - element nie jest w '<ng-template>.'
    - Jest obecny w VIEW zawsze.
  UWAGA!!!:
    - brak updatu zmiennej po inicjalizacji
			
	*/
  constructor() {
    afterEveryRender({
      read: () => {
        console.log(`\n\n`);
        console.warn(`VIEW | signal viewChild = `, this.viewChildEl1()?.nativeElement);
        console.warn(`VIEW | @ViewChild = `, this.viewChildEl2);
        console.warn(`VIEW | signal viewChildren = `, this.viewChildrenEl1());
        console.warn(`VIEW | @ViewChildren = `, this.viewChildrenEl2);
      },
    });
  }

  // Pobranie JEDEN elemnt (Pierwszy, który ma referencję)
  viewChildEl1 = viewChild<ElementRef<HTMLParagraphElement>>('myDOM'); // referencja była '#myDOM'
  // viewChildEl1 = viewChild<ElementRef>('myComp');									 // <- nie znajdzie komponentu przed REF 'udefined'

  @ViewChild(CompI_QueryChild)
  viewChildEl2!: CompI_QueryChild;

  // pobranie listy elementów
  viewChildrenEl1 = viewChildren(CompI_QueryChild);
  // viewChildrenEl1 = viewChildren<ElementRef<HTMLParagraphElement>>('myDOM'); // TEŻ OK

  @ViewChildren('myDOM')
  viewChildrenEl2!: QueryList<ElementRef<HTMLParagraphElement>>;
}

// ###############################
// ############################### dostęp do elementów DOM w kontencie
// ############################### contentChild & contentChildren
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompI_ContentQueriesWrapper',
  imports: [
    CompI_QueryChild, //
    forwardRef(() => CompI_ContentQueries),
  ],
  template: `
    <div>
      <div>CompI_ContentQueriesWrapper</div>
      <br />

      <CompI_ContentQueries>
        <p #myDOM>VIEW_DOM_ELEMENT_1</p>
        <p #myDOM>VIEW_DOM_ELEMENT_2</p>
        <CompI_QueryChild name="view-1" #myComp />
        <CompI_QueryChild name="view-2" />
      </CompI_ContentQueries>
    </div>
  `,
})
export class CompI_ContentQueriesWrapper {}

@Component({
  selector: 'CompI_ContentQueries',
  imports: [],
  template: `
    <div>
      <div>CompI_ContentQueries</div>
      <br />

      <div>
        <ng-content />
      </div>
    </div>
  `,
})
export class CompI_ContentQueries {
  /*
  VIEW QUERIES dostępne są po: 'ngAfterContentInit'

	Dostępne są 2 rodzaje QUERY:
  SYGNAŁOWE:
  - contentChild    (1-wszy pasujący element)
  - @contentChild   (1-wszy pasujący element
  DEKORATORY:
  - contentChildren
	-	@contentChildren
  
	Identyczne jak VIEW queries, ale dla kontentu
	*/
  constructor() {
    afterEveryRender({
      read: () => {
        console.log(`\n\n`);
        console.warn(`CONTENT | signal contentChild = `, this.contentChildEl1()?.nativeElement);
        console.warn(`CONTENT | @ContentChild = `, this.contentChildEl2);
        console.warn(`CONTENT | signal contentChildren = `, this.contentChildrenEl1());
        console.warn(`CONTENT | @ContentChildren= `, this.contentChildrenEl2);
      },
    });
  }

  // Pobranie JEDEN elemnt (Pierwszy, który ma referencję)
  contentChildEl1 = contentChild<ElementRef<HTMLParagraphElement>>('contentRef'); // referencja była '#myDOM'
  // contentChildEl1 = contentChild<ElementRef>('contentComp'); // <- nie znajdzie komponentu przed REF 'udefined'

  @ContentChild(CompI_QueryChild)
  contentChildEl2!: CompI_QueryChild;

  // pobranie listy elementów
  contentChildrenEl1 = contentChildren(CompI_QueryChild);
  // contentChildrenEl1 = contentChildren<ElementRef<HTMLParagraphElement>>('contentRef'); // TEŻ OK

  @ContentChildren('contentRef')
  contentChildrenEl2!: QueryList<ElementRef<HTMLParagraphElement>>;
}

// ###############################
// ############################### ZAAWANSOWE PODEJŚCIE DO QUERIES
// ############################### signal
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-i-matrioszka-a',
  imports: [forwardRef(() => CompIMatrioszkaB)],
  template: `
    <p>MATRIOSZKA_A</p>
    <app-comp-i-matrioszka-b />
    <ng-content></ng-content>
  `,
})
export class CompIMatrioszkaA {}

@Component({
  selector: 'app-comp-i-matrioszka-b',
  template: ` <p>MATRIOSZKA_B</p> `,
})
export class CompIMatrioszkaB {}

@Component({
  selector: 'app-comp-i-matrioszka-c',
  template: ` <p>MATRIOSZKA_C</p> `,
})
export class CompIMatrioszkaC {}

@Component({
  selector: 'CompI_QueriesAdvance',
  imports: [CompI_QueryChild],
  template: `
    <div>
      <div>CompI_QueriesAdvance</div>
      <br />

      <div>
        <p #myDOM>B - VIEW_DOM_ELEMENT_1</p>
        <p #myDOM>B - VIEW_DOM_ELEMENT_2</p>
        <CompI_QueryChild name="B-1" #myComp />
        <CompI_QueryChild name="B-2" />
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class CompI_QueriesAdvance {
  constructor() {
    afterEveryRender({
      read: () => {
        console.log(`\n\n`);
        console.warn(`ADVANCE | required | zmienna5 = `, this.zmienna5());
        console.warn(`ADVANCE | required | zmienna6 = `, this.zmienna6());
        console.warn(`ADVANCE | descendants | contentChild DEFAULT = `, this.zmianna10a());
        console.warn(`ADVANCE | descendants | contentChild TRUE = `, this.zmianna10b());
        console.warn(`ADVANCE | descendants | contentChild FALSE = `, this.zmianna10c());
        console.warn(`ADVANCE | descendants | contentChildren DEFAULT = `, this.zmianna11a());
        console.warn(`ADVANCE | descendants | contentChildren TRUE = `, this.zmianna11b());
        console.warn(`ADVANCE | descendants | contentChildren FALSE = `, this.zmianna11c());
      },
    });
  }
  /*
  QUERY 'required'
	szukany element musi istnieć! Usuwa 'udefined'
	*/
  zmienna1a = viewChild.required('myDOM');
  zmienna1b = viewChild.required(CompI_QueryChild);
  zmienna2a = contentChild.required('contentRef');
  zmienna2b = contentChild.required(CompI_QueryChild);
  // zmienna3 = viewChildren.required('');				// 'required' NIE MA NA 'viewChildren'
  // zmienna4 = contentChildren.required('');			// 'required' NIE MA NA 'contentChildren'

  /*
	QUERY OPCJE/KONFIGURACJA
	read | pozwala wskazać konkretną rzecz do pobrania z elementu 
  DOMYŚLNE
  Jeśli celujesz w tag (np. <div>), dostaniesz ElementRef.
  Jeśli celujesz w komponent (np. <app-user>), dostaniesz instancję klasy tego komponentu.

  CO JEŚLI DANY ELEMENT MA WIĘCEJ niż domyślnie pobierana dla niego wartość? Wtedy wchodzi 'read'
      Jeśli chcesz:													Ustaw read na:
    natywnego DOM (nativeElement)							ElementRef
    metod i pól komponentu										(To jest domyślne, nie trzeba pisać)
    konkretnej dyrektywy na elemencie					NazwaDyrektywy
    dynamicznego dodawania komponentów				ViewContainerRef
    szablonu w <ng-template>									TemplateRef
  UWAGA
  NIE UŻYWAĆ ZA DUŻO, lepiej przez inputy itp...
	*/
  zmienna5 = viewChild(CompI_QueryChild, { read: ElementRef }); //              zwróci HOSTA
  // zmienna5 = viewChild(CompI_QueryChild, { read: KonkretnaDyrektywa });		  // zwróci DYREKTYWĘ
  // zmienna5 = viewChild(CompI_QueryChild, { read: TemplateRef });	//          zwróci <ng-template/>
  zmienna6 = contentChild(CompI_QueryChild, { read: ViewContainerRef }); //     wróci ContainerRef

  /*
	QUERY descendants -> wyjście poza ramy komponentu z poszukiwaniem
  domyślnie:
  - contentChild		| zagnieżdżone dzieci (wiele poziomów)
  - contentChildren | bezpośrednie dzieci (1 poziom)
	
	 <app-comp-i-child-b>
      <div>															// ten <div> sprawia, że matrioszka-a nie jest bezpośrednim potomkiem ....
        <app-comp-i-matrioszka-a>				
          <app-comp-i-matrioszka-c />
        </app-comp-i-matrioszka-a>
      </div>
    </app-comp-i-child-b>

	UWAGA: 
  - z 'descendants: true', można się dostać do:
      - CompIMatrioszkaA
      - CompIMatrioszkaC -> kontent CompIMatrioszkaA	(wchodzi w KONTENT innych komponentów)
  - dostęp do 'CompIMatrioszkaB' NIE JEST możliwy 'descendants' nie wchodzi w VIEW innych komponentów
	*/
  zmianna10a = contentChild(CompIMatrioszkaA); // domyślnie 'true'	//       ZNAJDZIE
  zmianna10b = contentChild(CompIMatrioszkaA, { descendants: true }); //     ZNAJDZIE
  zmianna10c = contentChild(CompIMatrioszkaA, { descendants: false }); //    NIE ZNAJDZIE
  zmianna11a = contentChildren(CompIMatrioszkaC); // domyślnie 'false' //    NIE ZNAJDZIE
  zmianna11b = contentChildren(CompIMatrioszkaC, { descendants: true }); //  ZNAJDZIE
  zmianna11c = contentChildren(CompIMatrioszkaC, { descendants: false }); // NIE ZNAJDZIE
}
