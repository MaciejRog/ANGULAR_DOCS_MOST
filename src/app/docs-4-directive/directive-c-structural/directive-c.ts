import {
  Component,
  Directive,
  effect,
  forwardRef,
  inject,
  input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-directive-c',
  template: `
    <div *appFetchA>ELEMENT_A_1</div>
    <ng-template [appFetchA]>
      <div>ELEMENT_A_2</div>
    </ng-template>
    <hr />
    <div *appFetchB="let fetchBUser; let user = user; source: mockFetch">
      ELEMENT_B_1 | {{ fetchBUser }} | {{ user }}
    </div>
    <ng-template appFetchB [appFetchBSource]="mockFetch" let-fetchBUser let-user="user">
      <div>ELEMENT_B_2 | {{ fetchBUser }} | {{ user }}</div>
    </ng-template>
    <hr />
    <hr />
    <hr />
    <app-directive-c-child-b />
  `,
  imports: [
    forwardRef(() => FetchDirectiveA),
    forwardRef(() => FetchDirectiveB),
    forwardRef(() => DirectiveCChildB),
  ],
})
export class DirectiveC {
  /*
	Dyrektywy strukturalne 
		to dyrektywy stosowane do <ng-template>, 
		warunkowo lub wielokrotnie renderują zawartość tego elementu <ng-template>.


	*/
  /*
	WIĘC O TYM PONIŻEJ w 'DirectiveCChildA'
	
	DYREKTYWY STRUKTURALNE MOŻNA ZASTOSOWAĆ w 2 WERSJACH
		- PEŁNA (zawsze do <ng-template>)
		- SKROTOWA - shorthand / microsyntax (zawsze ze znakiem '*' może być dodana na dowolny tag)
				w tle angular opakowuje wtedy nasz element tagiem <ng-template>
				i do niego dodaje naszą dyrektywę
				UWAGA 
						TYLKO 1 '*' NA ELEMENT !!!!
						Dlaczego nie możemy użyć dwóch i więcej gwiazdek na jednym elemencie?
						* tworzy otoczkę <ng-template> wokół elementu, więc to dlatego, że
						Angular nie wiedziałby, która dyrektywa ma być „zewnętrzna”, a która „wewnętrzna”.
						(które <ng-template> ma być zagnieżdżone w które)
						(z rozwiązaniech przychodzi <ng-container> na którym może być '*')

	PRZYKŁADY PONIŻEJ
	1) --------------
		SKROTOWA
			<div *ngIf="isLoggedIn">Witaj</div>
		PEŁNA
			<ng-template [ngIf]="isLoggedIn">
				<div>Witaj</div>
			</ng-template>
	
	2) --------------
		SKROTOWA
			<li *ngFor="let user of users; track: user.id">
				{{ user.name }}
			</li>
		PEŁNA
			<ng-template ngFor let-user [ngForOf]="users" [ngForTrackBy]="user.id">
				<li>{{ user.name }}</li>
			</ng-template>

			Zauważ, że:
    		- let user -> stało się 'let-user' (deklaracja zmiennej wewnątrz <ng-template>).
				- of users -> zamieniło się w bindowanie właściwości [ngForOf].

	3) --------------
		SKROT: 
			<div *appFetchB="let fetchBUser; let user = user; source: mockFetch">
		PEŁNA
			<ng-template appFetchB [appFetchBSource]="mockFetch" let-fetchBUser let-user="user">

		WIĘC ZMIANY TO:
			let-fetchBUser										-> 		let fetchBUser;
			let-user="user"										-> 		let user = user;
			[appFetchBSource]="mockFetch"			-> 		source: mockFetch
																							GDZIE:
																								'appFetchB' to nazwa dyrektywy 
																								'appFetchBSource' to nazwa 'input'
																								w skrócie znika nazwa dyrektywy



	*/

  mockFetch(): Promise<string> {
    return new Promise((resolve) => {
      const timeoutValue = Math.random() * 4000 + 1000;
      console.log(`timeoutValue = `, timeoutValue);
      setTimeout(() => {
        resolve('Aga');
      }, timeoutValue);
    });
  }
}

// ###############################
// ############################### PRZYKŁAD DYREKTYWY STRUKTURALNEJ KROK PO KROKU
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Directive({
  selector: '[appFetchA]',
})
export class FetchDirectiveA implements OnInit {
  /*
	Angular potrzebuje mieć 2 DEPENDENCY:
		- TemplateRef (HOST dla strukturalnej dyrektywy to zawsze <ng-template>)
		- ViewContainerRef (aby móc dadać/zmienić/usunąć <ng-template> i nie tylko)

	
	W EFEKCIE, Z KODU:
			<div *appFetchA>ELEMENT_A_1</div>
			<ng-template [appFetchA]>
				<div>ELEMENT_A_2</div>
			</ng-template>
	ZROBI W DOM:
			<div>ELEMENT_A_1</div>
			<div>ELEMENT_A_2</div>

	*/
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit() {
    /*
		UWAGA
				metody 'viewContainerRef' zawsze wywoływać w OnInit dla dyrektyw strukturalnych
				nigdy nie w konstruktorze (brak dostępu do 'inputów')
				oraz nie 'AfterViewInit' bo może wywołać błąd 'ExpressionChangedAfterItHasBeenCheckedError'
				Podejście „Pro”: Setter (Reaktywność)

				NAJLEPIEJ 'SETTER'
				W nowoczesnym Angularze najczęściej nie używamy nawet ngOnInit, 
				ale settera na polu @Input.
						@Input() set appMojaDyrektywa(condition: boolean) {
							this.vcr.clear(); // Czyścimy stary widok
							if (condition) {
								this.vcr.createEmbeddedView(this.templateRef);
							}
						}
				NOWSZE NAJLEPIEJ 'effect' -> skutki uboczne na zmianę wartości taki 'useEffect' z React
						condition = input<boolean>(false, { alias: 'appSygnalIf' });
						constructor() {
							effect(() => {
								const isVisible = this.condition(); // Subskrypcja sygnału
								this.vcr.clear();
								if (isVisible) {
									this.vcr.createEmbeddedView(this.templateRef);
								}
							});
						}
		
		*/
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}

// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Directive({
  selector: '[appFetchB]',
})
export class FetchDirectiveB implements OnInit {
  /*
	
	W EFEKCIE, Z KODU:
		<div *appFetchB="let fetchBUser; let user = user; source: mockFetch">
      ELEMENT_B_1 | {{ fetchBUser }} | {{ user }}
    </div>
    <ng-template appFetchB [appFetchBSource]="mockFetch" let-fetchBUser let-user="user">
      <div>ELEMENT_B_2 | {{ fetchBUser }} | {{ user }}</div>
    </ng-template>
	ZROBI W DOM:
		<div> ELEMENT_B_1 | Aga | TESTUJEMY </div>
		<div>ELEMENT_B_2 | Aga | TESTUJEMY</div>


	UWAGI:
		SKROT: 
			<div *appFetchB="let fetchBUser; let user = user; source: mockFetch">
		PEŁNA
			<ng-template appFetchB [appFetchBSource]="mockFetch" let-fetchBUser let-user="user">

		WIĘC ZMIANY TO:
			let-fetchBUser										-> 		let fetchBUser;
			let-user="user"										-> 		let user = user;
			[appFetchBSource]="mockFetch"			-> 		source: mockFetch
	*/
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  // nazwa zmiennej 'input' zbudowana jest jako
  // 'nazwaDyrektywy'+'DowolnaNazwa'
  appFetchBSource = input.required<() => Promise<string>>();

  ngOnInit() {
    this.appFetchBSource()().then((result) => {
      /*
			Aby przekazać dane do zmiennej szablonowej 'let-fetchBUser' stosujemy context 
			context -> to 2 argument funkcj 'createEmbeddedView'

			$implicit  -> specjalna nazwa oznacza wartość domyślną
					np: dla 'let-cos' gdy po '=' nie ma wartości Angular automatycznie 
					przypisze do 'cos' to, co znajdzie w obiekcie kontekstu pod kluczem $implicit.

					więc tutaj	
						'let fetchBUser; let user = user;'
					lub
						let-fetchBUser let-user="user"
					DLA:
						{{ fetchBUser }}			-> będzie wartość z '$implicit'
						{{ user }}}						-> będzie wartość z 'user'
					
			*/
      this.viewContainerRef.createEmbeddedView(this.templateRef, {
        $implicit: result,
        user: 'TESTUJEMY',
      });
    });
  }
}

// ###############################
// ############################### SKROT / shorthand
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV STOSOWANIE *

@Component({
  selector: 'app-directive-c-child-a',
  template: ``,
})
export class DirectiveCChildA {
  /*
	DYREKTYWY STRUKTURALNE MOŻNA ZASTOSOWAĆ w 2 WERSJACH
		- PEŁNA (zawsze do <ng-template>)
		- SKROTOWA - shorthand / microsyntax (zawsze ze znakiem '*' może być dodana na dowolny tag)
				w tle angular opakowuje wtedy nasz element tagiem <ng-template>
				i do niego dodaje naszą dyrektywę
				UWAGA 
						TYLKO 1 '*' NA ELEMENT !!!!
						Dlaczego nie możemy użyć dwóch i więcej gwiazdek na jednym elemencie?
						* tworzy otoczkę <ng-template> wokół elementu, więc to dlatego, że
						Angular nie wiedziałby, która dyrektywa ma być „zewnętrzna”, a która „wewnętrzna”.
						(które <ng-template> ma być zagnieżdżone w które)
						(z rozwiązaniech przychodzi <ng-container> na którym może być '*')

	PRZYKŁADY PONIŻEJ
	1) --------------
		SKROT: 
			<div *appFetchB="let fetchBUser; let user = user; source: mockFetch">
		PEŁNA
			<ng-template appFetchB [appFetchBSource]="mockFetch" let-fetchBUser let-user="user">

		WIĘC ZMIANY TO:
			let-fetchBUser										-> 		let fetchBUser;
			let-user="user"										-> 		let user = user;
			[appFetchBSource]="mockFetch"			-> 		source: mockFetch
																							GDZIE:
																								'appFetchB' to nazwa dyrektywy 
																								'appFetchBSource' to nazwa 'input'
																								w skrócie znika nazwa dyrektywy
	

	*myDir="let item of [1,2,3]" 	
	<ng-template myDir let-item [myDirOf]="[1, 2, 3]">

	*myDir="let item of [1,2,3] as items; trackBy: myTrack; index as i" 	
	<ng-template myDir let-item [myDirOf]="[1,2,3]" let-items="myDirOf" 
							[myDirTrackBy]="myTrack" let-i="index">
	
	*ngComponentOutlet="componentClass"; 	
	<ng-template [ngComponentOutlet]="componentClass">

	*ngComponentOutlet="componentClass; inputs: myInputs"; 	
	<ng-template [ngComponentOutlet]="componentClass" [ngComponentOutletInputs]="myInputs">

	*myDir="exp as value" 	
	<ng-template [myDir]="exp" let-value="myDir">


	REGUŁY:
		- zmienne szablonowe <ng-template>
				W SKROCIE (słowa kluczowe 'let' i 'as' ):
						let zmienna = coś			-> let-zmienna = coś
						let zmienna						-> let-zmienna
						coś as zmienna				-> let-zmienna='coś'
		- property binding / inputy (pozostałe słowa)
				W SKROCIE
						of [1]								-> [nazwaDyrektywyOf]="[1]"
						source: mockFetch			-> [nazwaDyrektywySource]="mockFetch"
		- input o nazwie dyrektywy
				W SKRóCIE
						*myDir="val; of [1]"	-> [myDir]="val"
																		 [myDirOf]="[1]"

	Składnia w *			Atrybut w <ng-template>					Opis
	---------------------------------------------------------------
	prefix						[prefix]												Główne wejście (np. *ngIf="user")
	let var						let-var													Pobiera $implicit z kontekstu
	let var = key			let-var="key"										Pobiera konkretny klucz z kontekstu
	key: value				[prefixKey]="value"							Przekazuje dane do @Input()

	*/
}

// ###############################
// ###############################
// ###############################
// ###############################
// ############################### SPRADZANIE TYPOW dla dyrektyw strukturalnych
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-directive-c-child-b',
  template: `
    <app-directive-c-child-b-b />
    <app-directive-c-child-b-c />
  `,
  imports: [forwardRef(() => DirectiveCChildBB), forwardRef(() => DirectiveCChildBC)],
})
export class DirectiveCChildB {
  /*
	SPRADZANIE TYPOW wewątrz dyrektyw:
		- ngTemplateGuard_(input)
					pozwala określić/zawęzcić typy dla 'inputów' przekazywanych do dyrektywy
		- ngTemplateContextGuard
					pozwala określić typ CONTEXT dla <ng-template> czyli określić typy
					zmiennych szablonowych np: let-user
	*/
}

// ########
// ngTemplateGuard_(input)
// VVVVVVVV

export class Person {
  name = 'person';
  age = 11;
}
export class Animal {
  name = 'animal';
  type = 'DZIALA';
}

@Component({
  selector: 'app-directive-c-child-b-b',
  template: `
    <div *childDirA="let potrzebne; age: valNumber">childDirA 1 - age | {{ potrzebne }}</div>
    <div *childDirA="let potrzebne; age: valNull">childDirA 2 - age | {{ potrzebne }}</div>

    <div *childDirB="let potrzebne; user: person">childDirB 1 - user | {{ potrzebne.name }}</div>
    <div *childDirB="let potrzebne; user: animal">childDirB 2 - user | {{ potrzebne.name }}</div>
  `,
  imports: [
    forwardRef(() => DirectiveCChildBDirA), //
    forwardRef(() => DirectiveCChildBDirB),
  ],
})
export class DirectiveCChildBB {
  /*
	ZAWĘŻENIE WZGLĘDEM INPUTOW - ngTemplateGuard_(input)
			Angular używa go do sprawdzenia, czy szablon w ogóle 
			ma zostać wyrenderowany (podobnie jak *ngIf).

	są 2 możliwości:
		- zawężenie 'TypeScript type assertion function'
					wymuszamy aby iput był konkretnej klasy 
					dopiero wtedy dyrektywa pokaże ng-template
		- zawężenie na podstawie 'prawdziwości'
					np: do eliminacji null / udefined
					dyrektywa będzie się zachowywała tak jakby 
					input był PRAWDZIWY czyli nie jest null lub udefined
	*/
  valNumber = 20;
  valString = '10';
  valNull = null;
  person = new Person();
  animal = new Animal();
}

@Directive({
  selector: '[childDirA]',
})
export class DirectiveCChildBDirA {
  childDirAAge = input<number | null | undefined>();
  static ngTemplateGuard_childDirAAge: 'binding';
  // Angular wie, że jeśli div się wyrenderował, to childDirAAge nie jest null

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const age = this.childDirAAge();
      this.viewContainerRef.clear();
      // MUSISZ dodać ten warunek, aby strażnik miał sens!
      if (age !== undefined && age !== null) {
        this.viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: age });
      }
    });
  }
}

@Directive({
  selector: '[childDirB]',
})
export class DirectiveCChildBDirB {
  childDirBUser = input<Person | Animal>();
  static ngTemplateGuard_childDirBUser(
    dir: DirectiveCChildBDirB,
    expr: Person | Animal,
  ): expr is Person {
    // Angular wie, że jeśli div się wyrenderował, to 'childDirBUser' jest 'Person'
    return true;
  }

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const user = this.childDirBUser();
      this.viewContainerRef.clear();
      // MUSISZ dodać ten warunek, aby strażnik miał sens!
      if (user instanceof Person) {
        this.viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: user });
      }
    });
  }
}

// ########
// ngTemplateContextGuard
// VVVVVVVV

@Component({
  selector: 'app-directive-c-child-b-c',
  template: `
    <div *childDirC="let potrzebne; user: person">childDirB 1 - user | {{ potrzebne.age }}</div>
    <div *childDirC="let potrzebne; user: animal">childDirB 2 - user | {{ potrzebne.age }}</div>
  `,
  imports: [
    forwardRef(() => DirectiveCChildBDirC), //
  ],
})
export class DirectiveCChildBC {
  /*
	ngTemplateContextGuard
	pozwala określić typ kontekstu dla <ng-template>
	*/
  person = new Person();
  animal = new Animal();
}

export interface TemplateContext {
  $implicit: Person;
}

@Directive({
  selector: '[childDirC]',
})
export class DirectiveCChildBDirC {
  childDirCUser = input<Person | Animal>();
  static ngTemplateGuard_childDirCUser(
    dir: DirectiveCChildBDirC,
    expr: Person | Animal,
  ): expr is Person {
    return true;
  }

  //
  static ngTemplateContextGuard(dir: DirectiveCChildBDirC, ctx: any): ctx is TemplateContext {
    return true;
  }

  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const user = this.childDirCUser();
      this.viewContainerRef.clear();
      if (user instanceof Person) {
        this.viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: user });
      }
    });
  }
}
