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
  template: `
    <app-comp-i-child>
      <h1 #contentRef>CONTNET_ELEMENT_1</h1>
      <h1 #contentRef>CONTNET_ELEMENT_2</h1>
      <app-comp-i-child-content-child id="1" #contentComp />
      <app-comp-i-child-content-child id="2" />
    </app-comp-i-child>
    <hr />
    <app-comp-i-child-b>
      <h1 #contentRef>CONTNET_ELEMENT_1</h1>
      <h1 #contentRef>CONTNET_ELEMENT_2</h1>
      <app-comp-i-child-content-child id="1" #contentComp />
      <app-comp-i-child-content-child id="2" />
      <div>
        <app-comp-i-matrioszka-a>
          <app-comp-i-matrioszka-c />
        </app-comp-i-matrioszka-a>
      </div>
    </app-comp-i-child-b>
  `,
  imports: [
    forwardRef(() => CompIChild),
    forwardRef(() => CompIChildContentChild),
    forwardRef(() => CompIChildB),
    forwardRef(() => CompIMatrioszkaA),
    forwardRef(() => CompIMatrioszkaC),
  ],
})
export class CompI {}

// ###############################
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-i-child-content-child',
  template: `<div>CONTENT_CHILD_COMPONENT_{{ id() }}</div>`,
})
export class CompIChildContentChild {
  id = input.required<number | string>();
}

@Component({
  selector: 'app-comp-i-child-view-child',
  template: `<div>VIEW_CHILD_COMPONENT_{{ id() }}</div>`,
})
export class CompIChildViewChild {
  id = input.required<number | string>();
}

@Component({
  selector: 'app-comp-i-child',
  template: `
    <p #myDOM>VIEW_DOM_ELEMENT_1</p>
    <p #myDOM>VIEW_DOM_ELEMENT_2</p>
    <app-comp-i-child-view-child id="1" #myComp />
    <app-comp-i-child-view-child id="2" />
    <ng-content></ng-content>
  `,
  imports: [CompIChildViewChild],
})
export class CompIChild {
  /*
	są 2 rodzaje zapytań (queries)
	view queries && content queries.

	zapytania slużą do odczytania wartości z
	child components, directives, DOM elements itp..
	Wszystkie funkcje zapytań zwracają sygnały odzwierciedlające najbardziej aktualne wyniki

	queries znajdzie element jeśli jest w DOM przeglądarki,
	jeśli nie zwróci 'udefined'
	nie widzi elementów schowanych np przez '@if / *ngIf'
	*/
  /*


	View Queries
	mechanizm, który pozwala klasie komponentu uzyskać referencję 
	do elementów znajdujących się w jego własnym szablonie VIEW. Mogą to być:
    - Zwykłe elementy HTML (np. <div>, <input>).
    - Inne komponenty Angulara, których używasz w swoim HTML-u.
    - Dyrektywy.

	Możemy oznakować element DOM referencję aby później móc go pobrać (template reference variable)
	<p #myDOM>VIEW_DOM_ELEMENT</p>		-> referencja '#myDOM'
	UWAGA
			tej samej referencji może używać WIELE elementów 

	Query przyjmuje jako argument LOKATOR, możliwe wartości:
			viewChildEl = viewChild('myDOM');						// template ref 'myDOM' <p #myDOM></p>
			viewChildEl = viewChild(klasaKomponentu);
			viewChildEl = viewChild(klasaDyrektywy);
			ProviderToken !!!!
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
	UWAGA
			Selectory CSS -> NIE SA OBSŁUGIWANE jako queries


	INFO O DEKORATORACH @:
			@viewChild, zwraca: 
			- ElementRef						| opakowanie DOM
																przy dostępie angular nie wie co zastanie w DOM (natywny HTML czy komponent)
																więc dlatego bezpośrednie tagi html opakowuje
			- instancję komponentu	|

			@viewChildren, zwraca:
			- QueryList<ElementRef<HTMLElement>>	| opakowanie wielu elementów DOM
																							QueryList lepsza niż zwykła tablica, bo jeśli np. 
																							użyjesz *ngFor i lista się zmieni, 
																							QueryList automatycznie się zaktualizuje!
																							UWAGA - tylko dla @dekoratorów :)
			- Tablicę instancji komponentów


			'@ContentChild' i '@ContentChildren' są dostepne od 'ngAfterContentInit'
			'@viewChild' i '@viewChildren' są dostepne od 'ngAfterViewInit'

			-	OPCJA STATYCZNA: { static: true } DLA @ViewChild i @ContentChild
					domyślna wartość to 'false' wtedy dostęp to view/content dostępny dopiero po 'afterViewXXX' lub 'afterContentXXX'
					z 'true' dostęp już od 'onInit' bo mówimy, że element który chcemy dostać jest na 100% w DOM
					w tym, że nie jest warunkowo renderowany 
					DZIAŁA GDY:
							- element nie jest w '*ngIf' lub '*ngFor.'
							- element nie jest w '<ng-template>.'
							- Jest obecny w VIEW zawsze.
					UWAGA!!!:
							- brak updatu po inicjalizacji
			
	*/
  constructor() {
    afterEveryRender({
      read: () => {
        console.warn(`viewChildEl1 | viewChild = `, this.viewChildEl1()?.nativeElement);
        console.warn(`viewChildEl2 | @ViewChild = `, this.viewChildEl2);
        console.warn(`viewChildrenEl1 | viewChildren = `, this.viewChildrenEl1());
        console.warn(`viewChildrenEl2 | @ViewChildren = `, this.viewChildrenEl2);
        //
        console.warn(`\n\n`);
        //
        console.warn(`contentChildEl1 | contentChild = `, this.contentChildEl1()?.nativeElement);
        console.warn(`contentChildEl2 | @ContentChild = `, this.contentChildEl2);
        console.warn(`contentChildrenEl1 | contentChildren = `, this.contentChildrenEl1());
        console.warn(`contentChildrenEl2 | @ContentChildren= `, this.contentChildrenEl2);
        //
        console.warn(`\n\n`);
        //
      },
    });
  }

  // Pobranie JEDEN elemnt (Pierwszy, który ma referencję)
  viewChildEl1 = viewChild<ElementRef<HTMLParagraphElement>>('myDOM'); // referencja była '#myDOM'
  // viewChildEl1 = viewChild<ElementRef>('myComp');									 // <- nie znajdzie komponentu przed REF 'udefined'

  @ViewChild(CompIChildViewChild)
  viewChildEl2!: CompIChildViewChild;

  // pobranie listy elementów
  viewChildrenEl1 = viewChildren(CompIChildViewChild);
  // viewChildrenEl1 = viewChildren<ElementRef<HTMLParagraphElement>>('myDOM'); // TEŻ OK

  @ViewChildren('myDOM')
  viewChildrenEl2!: QueryList<ElementRef<HTMLParagraphElement>>;

  /*


	Content Queries
	Identyczny temat jak ViewQueries tylko dla KONTENTU
	*/

  // Pobranie JEDEN elemnt (Pierwszy, który ma referencję)
  contentChildEl1 = contentChild<ElementRef<HTMLParagraphElement>>('contentRef'); // referencja była '#myDOM'
  // contentChildEl1 = contentChild<ElementRef>('contentComp'); // <- nie znajdzie komponentu przed REF 'udefined'

  @ContentChild(CompIChildContentChild)
  contentChildEl2!: CompIChildContentChild;

  // pobranie listy elementów
  contentChildrenEl1 = contentChildren(CompIChildContentChild);
  // contentChildrenEl1 = contentChildren<ElementRef<HTMLParagraphElement>>('contentRef'); // TEŻ OK

  @ContentChildren('contentRef')
  contentChildrenEl2!: QueryList<ElementRef<HTMLParagraphElement>>;
}

// ###############################
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-i-matrioszka-a',
  template: `
    <p>MATRIOSZKA_A</p>
    <app-comp-i-matrioszka-b />
    <ng-content></ng-content>
  `,
  imports: [forwardRef(() => CompIMatrioszkaB)],
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
  selector: 'app-comp-i-child-b',
  template: `
    <p #myDOM>B - VIEW_DOM_ELEMENT_1</p>
    <p #myDOM>B - VIEW_DOM_ELEMENT_2</p>
    <app-comp-i-child-view-child id="B-1" #myComp />
    <app-comp-i-child-view-child id="B-2" />
    <ng-content></ng-content>
  `,
  imports: [CompIChildViewChild],
})
export class CompIChildB {
  constructor() {
    afterEveryRender({
      read: () => {
        //
        console.warn(`\n\n`);
        //
        console.warn(`KOMP B | required | zmienna5 = `, this.zmienna5());
        console.warn(`KOMP B | required | zmienna6 = `, this.zmienna6());
        //
        console.warn(`\n\n`);
        //
        console.warn(`KOMP B | descendants | contentChild DEFAULT = `, this.zmianna10a());
        console.warn(`KOMP B | descendants | contentChild TRUE = `, this.zmianna10b());
        console.warn(`KOMP B | descendants | contentChild FALSE = `, this.zmianna10c());
        console.warn(`KOMP B | descendants | contentChildren DEFAULT = `, this.zmianna11a());
        console.warn(`KOMP B | descendants | contentChildren TRUE = `, this.zmianna11b());
        console.warn(`KOMP B | descendants | contentChildren FALSE = `, this.zmianna11c());
      },
    });
  }
  /*
	required - oznaczenie wymaganych (usuwa możliwość 'udefined' w sygnale )

	gdy queryChild nie znajdzie to zwraca 'udefined'
	np: schowane elementy przez '@if' 
	*/
  zmienna1a = viewChild.required('myDOM');
  zmienna1b = viewChild.required(CompIChildViewChild);
  zmienna2a = contentChild.required('contentRef');
  zmienna2b = contentChild.required(CompIChildContentChild);
  // zmienna3 = viewChildren.required('');				// 'required' NIE MA
  // zmienna4 = contentChildren.required('');			// 'required' NIE MA

  /*
	OPCJE:
			Dygresja: myśla o elementach w View i Content jak o pudełku

	- read | pozwala wskazać konkretną rzecz z pudełka 
					Jeśli celujesz w tag (np. <div>), dostaniesz ElementRef.
					Jeśli celujesz w komponent (np. <app-user>), dostaniesz instancję klasy tego komponentu.
								Jeśli chcesz:													Ustaw read na:
							natywnego DOM (nativeElement)							ElementRef
							metod i pól komponentu										(To jest domyślne, nie trzeba pisać)
							konkretnej dyrektywy na elemencie					NazwaDyrektywy
							dynamicznego dodawania komponentów				ViewContainerRef
							szablonu w <ng-template>									TemplateRef
					NIE UŻYWAĆ ZA DUŻO, lepiej przez inputy itp...
	*/
  zmienna5 = viewChild(CompIChildViewChild, { read: ElementRef }); //              zwróci HOSTA
  // zmienna5 = viewChild(CompIChildViewChild, { read: KonkretnaDyrektywa });		// zwróci DYREKTYWĘ
  // zmienna5 = viewChild(CompIChildViewChild, { read: TemplateRef });	//         zwróci <ng-template/>
  zmienna6 = contentChild(CompIChildContentChild, { read: ViewContainerRef }); //  wróci ContainerRef

  /*
	- descendants
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
