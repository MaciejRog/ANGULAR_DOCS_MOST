import {
  afterEveryRender,
  Component,
  forwardRef,
  Host,
  inject,
  Injectable,
  InjectionToken,
  Optional,
  Self,
  SkipSelf,
} from '@angular/core';

@Component({
  selector: 'app-DI-e',
  template: `<app-DI-e-child-a />
    <hr />
    <app-DI-e-child-b />
    <hr />
    <app-DI-e-child-c />
    <hr />
    <hr />
    <hr />
    <app-DI-e-child-d />`,
  imports: [
    forwardRef(() => DIEChildA),
    forwardRef(() => DIEChildB),
    forwardRef(() => DIEChildC),
    forwardRef(() => DIEChildD),
  ],
})
export class DIE {
  /*
	Hierarchia injectorów to system "szukania pomocy". 
	Jeśli komponent potrzebuje serwisu, najpierw sprawdza u siebie.
	Jeśli go nie ma, idzie do "rodzica", potem do "dziadka", aż dotrze do samej góry.
	
	RODZAJE HIERARCHI:
		- 'EnvironmentInjector' hierarchy
					Instancja zarządza serwisami dostępnymi globalnie lub w dużych fragmentach aplikacji 
					(np. w modułach ładowanych leniwie).
							@Injectable({ providedIn: 'platform' })
							export class ServisE1 { //... }

							@Injectable({ providedIn: 'root' })
							export class ServisE2 { //... }

							ApplicationConfig providers 

							UWAGA 
									zalecane jest @Injectable({ providedIn: 'root' }) nad ApplicationConfig
									bo ma automatyczne 'tree-shaking' (jeśli serwis nie jest nigdzie stosowany)
									to nie trafia do buildu (lżejszy start apki)
							UWAGA
									ApplicationConfig nadpisuje definicje w @Injectable({ providedIn: 'root' })

					WARSTWY:
						1) NullInjector - jeśli szukanie dotrze tutaj, Angular rzuca błąd 
						|									(chyba że użyjesz @Optional() to dostanie null).
						V
						2) PlatformInjector - rzeczy wspólne dla całej karty przeglądarki 
						|											(np. obsługa zdarzeń DOM).
																	Zasięg: Wszystkie aplikacje Angularowe na danej karcie.
																	PRZYDATNE DLA:
																	- Mikrofrontendy: wiele małych aplikacji, 
																										PlatformInjector pozwala współdzielić zasoby
																	- (SSR): Kiedy aplikacja działa na serwerze (Node.js), Angular 
																					używa innego PlatformInjectora (dla serwera) niż w 
																					przeglądarce, RootInjector (Twoja logika) bez zmian
						V
						3) RootInjector - serce aplikacji 99% użycia. Tu lądują serwisy z providedIn: 'root' 
						|									oraz te z ApplicationConfig
															Cała Twoja aplikacja, wszystkie jej komponenty i dyrektywy.
						V
						4) ModuleInjector (Lazy Loaded) - Jeśli masz moduł ładowany na żądanie, 
							on tworzy własny EnvironmentInjector, który "dziedziczy" po RootInjectorze.

		- 'ElementInjector' hierarchy
					hierarchia "lokalna", tworzona automatycznie na elementach DOM. 
					Każdy komponent lub dyrektywa może stworzyć własny ElementInjector.
					
					@Component({
						providers: [LocalService], // serwis żyje w komponencie i jego dzieciach
						// ...
					})
					export class Component { // ... }

		- 'ModuleInjector' hierarchy -> aplikacje z NgModule

	SZUKANIE ZALEŻNOŚCI, dziąła jak eventy w JS 'Bąbelkowanie'
			<app>
				<parent>
					<child />			
				</parent>
			</app>
			Jeśli 'child' poprosi o ZALEŻNOŚC, to szukana jest w:
				'ElementInjector' 
					1) 'provider' <child>, jeśli nie znajdzie to niżej
					2) 'provider' <parent>, jeśli nie znajdzie to niżej
					3) 'provider' <app>, jeśli nie znajdzie to niżej
				Po sprawdzeniu wszystkich potomków komponentu Angular wraca do <child> i
				przełącz się na 'EnvironmentInjector'
					4)  RootInjector, jeśli nie znajdzie to niżej
					5)	PlatformInjector, jeśli nie znajdzie to niżej
					6)	NullInjector -> RZUCA błąd, jeśli servis nie jest @Optional

	SHADOWING (Przesłanianie)
		Możesz mieć globalny serwis, ale w konkretnym miejscu go "podmienić".			
				// 1. Globalny serwis
				//		wszędzie 'color' jest taki jak tutaj
				@Injectable({ providedIn: 'root' })
				class ThemeService { color = 'blue'; }

				// 2. Komponent, który chce być inny
				//		ale można go nadpisać
				//		<app-button> i <app-dark> mają wartość 'color' na 'black'
				@Component({
					selector: 'app-dark',
					providers: [{ provide: ThemeService, useValue: { color: 'black' } }],
					template: `<app-button></app-button>` 
				})
				export class Dark { }

	*/
}

// ############################### 'EnvironmentInjector' hierarchy
// ############################### 'ElementInjector' hierarchy
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// @Injectable({ providedIn: null })		// takiego się nie da wstrzyknąć nigdzie
// export class ServisE0 {
//   name = 'service_0';
// }

@Injectable({ providedIn: 'platform' })
export class ServisE1 {
  name = 'service_1';
}

@Injectable({ providedIn: 'root' })
export class ServisE2 {
  name = 'service_2';
}

export const TOKEN_1 = new InjectionToken('token_1', {
  providedIn: 'root',
  factory: () => {
    return 'token1';
  },
});

@Component({
  selector: 'app-DI-e-child-a-comp-parent',
  template: `<p>PARENT</p>
    <app-DI-e-child-a-comp-child />`,
  imports: [forwardRef(() => CompChild)],
  providers: [
    {
      provide: TOKEN_1, //
      useValue: 'TOKEN_1_NEW_VAL', // <-- zmian tutaj wpływa na dzieci komponentu
    },
  ],
})
export class CompParent {}

@Component({
  selector: 'app-DI-e-child-a-comp-child',
  template: `<p>CHILD</p>`,
})
export class CompChild {
  // diVal1 = inject(ServisE0);
  diVal2 = inject(ServisE1);
  diVal3 = inject(ServisE2);
  diVal4 = inject(TOKEN_1); // nowa wartość nadpisana przez CompParent w 'providers'

  constructor() {
    afterEveryRender(() => {
      // console.warn('HIERARCHIA CHILD | ServisE0 = ', this.diVal1);
      console.warn('HIERARCHIA CHILD | ServisE1 = ', this.diVal2);
      console.warn('HIERARCHIA CHILD | ServisE2 = ', this.diVal3);
      console.warn('HIERARCHIA CHILD | TOKEN_1 = ', this.diVal4); // 'TOKEN_1_NEW_VAL'
    });
  }
}

@Component({
  selector: 'app-DI-e-child-a',
  template: `
    <br />
    <br />
    <app-DI-e-child-a-comp-parent />
    <br />
    <br />
  `,
  imports: [CompParent],
})
export class DIEChildA {
  /*

 */
  diVal5 = inject(TOKEN_1);

  constructor() {
    afterEveryRender(() => {
      console.warn('HIERARCHIA MAIN | TOKEN_1 = ', this.diVal5);
    });
  }
}

// ############################### modyfikatory ROZTRZYGANIA DI !!
// ############################### Resolution modifiers
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-DI-e-child-b',
  template: `<p>CHILD_B</p>
    <app-DI-e-child-b-1 />`,
  imports: [forwardRef(() => DIEChildB1)],
  providers: [ServisE2],
})
export class DIEChildB {
  /*
	Resolution Modifiers (modyfikatory rozstrzygania) to instrukcje,
	które zmieniają algorytm szukania DI.

	MODYFIKATOR:
	1. @Optional() – Modyfikator „Bez paniki”
		Jeśli DI nie znajdzie serwisy/tokenu to ustawi jego wartość na null
		Domyślnie zrzuci Błędem i wysypię aplikację
				diVar1 = inject(ServisE1, { optional: true });

	2. @Self() – Modyfikator „Tylko ja”
		Szukaj zależności wyłącznie w ElementInjectorze tego konkretnego komponentu 
		lub dyrektywy”. Jeśli nie zadeklarowałeś go w tablicy providers tego komponentu 
		Angular wyrzuci błąd, nawet jeśli serwis jest w root
				diVar2 = inject(ServisE2, { self: true });

	3. @SkipSelf() – Modyfikator „Zacznij szukać powyżej mnie”. 
		Angular zignoruje providera zadeklarowanego w tym samym komponencie i 
		zacznie szperać od rodzica w górę.
		Zastosowanie: np: serwis, który ma rozszerzać instancją tego samego serwisu u rodzica 
											(np. w systemach zagnieżdżonych formularzy).
				diVar3 = inject(TOKEN_1, { skipSelf: true });

	4. @Host() – Modyfikator „nie szukaj poza hostem"
		„Szukaj w górę, ale zatrzymaj się, gdy dojdziesz do hosta”. 
		np: w dyrektywach, aby upewnić się, że pobierają one serwis z komponentu, 
				na którym są umieszczone, a nie z globalnego RootInjectora.
				diToken2 = inject(TOKEN_2, { host: true });

	@Self VS @Host
	@Host dla stosowanie na @component, działa tak jak @Self
	Dla stosowanie na dyrektywach, jest różnica @Self będzie tylko dla 'providers' klasy dyrektywy,
	a @Host sprawdzi klasę dyrektywy i klasę komponentu, na który jest dyrektywa dodana


		Modyfikator					Co robi?																		Co jeśli nie znajdzie?
	------------------------------------------------------------------------------------------
	Brak (Domyślnie)		Szuka od siebie aż do Root i Platform.			NullInjectorError
	@Optional()					Nie zmienia ścieżki, ale dopuszcza brak.		Zwraca null
	@Self()							Szuka tylko na samym sobie.									NullInjectorError
	@SkipSelf()					Zaczyna szukać od rodzica w górę.						NullInjectorError
	@Host()							Szuka od siebie do komponentu-hosta.				NullInjectorError
 */

  diVar1 = inject(ServisE1, { optional: true });

  diVar2 = inject(ServisE2, { self: true });

  diVar3 = inject(TOKEN_1, { skipSelf: true });

  constructor /*
	UWAGA
		diVar1 = inject(ServisE1, { optional: true });
		diVar2 = inject(ServisE2, { self: true });
		diVar3 = inject(TOKEN_1, { skipSelf: true });
		diToken2 = inject(TOKEN_2, { host: true });

		WSZYSTKIE powyższe mają odpowiedniki w poniższych ,
		te wyżej dostępne w polach lub ciele contruktora
		te poniżej jako argumenty konstruktora

    @Optional() private diConstructorVal1: ServisE1,
    @Self() private diConstructorVal2: ServisE2,
    @SkipSelf() private diConstructorVal3: ServisE2,
    @Host() private diConstructorVal4: ServisE2,
		*/() {
    afterEveryRender(() => {
      console.warn(`Resolution modifier | @Optional = `, this.diVar1);
      console.warn(`Resolution modifier | @Self = `, this.diVar2);
      console.warn(`Resolution modifier | @SkipSelf = `, this.diVar3);
    });
  }
}

const TOKEN_2 = new InjectionToken('token.2', { providedIn: 'root', factory: () => 'token_2' });

@Component({
  selector: 'app-DI-e-child-b-1',
  template: `<p>CHILD_B_1</p>
    <app-DI-e-child-b-2 />`,
  imports: [forwardRef(() => DIEChildB2)],
  // providers: [{ provide: TOKEN_2, useValue: 'TOKEN-2' }],
})
export class DIEChildB1 {}

@Component({
  selector: 'app-DI-e-child-b-2',
  template: `<p>CHILD_B_2</p>`,
  providers: [{ provide: TOKEN_2, useValue: 'TOKEN-2' }],
})
export class DIEChildB2 {
  diToken2 = inject(TOKEN_2, { host: true });

  constructor() {
    afterEveryRender(() => {
      console.warn(`Resolution modifier | @Host = `, this.diToken2);
    });
  }
}

// ###############################
// ############################### providers VS viewProviders
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-DI-e-child-c',
  template: `<p>CHILD_C</p>
    <app-DI-e-child-c-parent>
      <app-DI-e-child-c-content />
    </app-DI-e-child-c-parent> `,
  imports: [forwardRef(() => DIEChildCParent), forwardRef(() => DIEChildCContent)],
})
export class DIEChildC {
  /*
	providers: 
			To usługi dostępne dla wszystkich
			szablonu komponentu (template) oraz <ng-content> (Projected Content)
	viewProviders: 
			To usługi „tylko dla domowników”. 
			szablonu komponentu (template) + komponenty wewnątrz jego szablonu 
			NIE DOSTĘPNE DLA <ng-content> (Projected Content)

	Głównym powodem jest bezpieczeństwo i hermetyzacja. Wyobraź sobie, że budujesz 
	serwis do obliczeń i nie chcesz, żeby ktokolwiek coś w nim mieszał z zewnątrz
	viewProviders tworzy niewidzialną barierę, która chroni Twoje wewnętrzne 
	narzędzia przed zewnętrznym światem.
 */
}

@Injectable()
export class ServisE3 {
  name = 'Service_E_3';
}

@Component({
  selector: 'app-DI-e-child-c-parent',
  template: `<p>CHILD_C_PARENT</p>
    CHILD
    <app-DI-e-child-c-child />
    CONTENT
    <ng-content></ng-content> `,
  imports: [forwardRef(() => DIEChildCChild)],
  /*
	PRZY 'providers' 			W 'DIEChildCContent' JEST SERWIS
	PRZY 'viewProviders' 	W 'DIEChildCContent' NIE MA SERWISU !!!
   */
  // providers: [{ provide: ServisE3, useClass: ServisE3 }],
  viewProviders: [{ provide: ServisE3, useClass: ServisE3 }],
})
export class DIEChildCParent {}

@Component({
  selector: 'app-DI-e-child-c-child',
  template: `<p>CHILD_C_CHILD</p>`,
})
export class DIEChildCChild {
  servisE3VarChild = inject(ServisE3, { optional: true });

  constructor() {
    afterEveryRender(() => {
      console.warn(`provider vs viewProvider | CHILD ServisE3 = `, this.servisE3VarChild?.name);
    });
  }
}

@Component({
  selector: 'app-DI-e-child-c-content',
  template: `<p>CHILD_C_CONTENT</p>`,
})
export class DIEChildCContent {
  ervisE3VarContent = inject(ServisE3, { optional: true });

  constructor() {
    afterEveryRender(() => {
      console.warn(`provider vs viewProvider | CONTENT ServisE3 = `, this.ervisE3VarContent?.name);
    });
  }
}

// ###############################
// ############################### @Host & @SkipSelf z <ng-content>
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
TO_DO 
JAKIEŚ TRUDNE NIE DO KOŃCA WIEM CO SIĘ TUTAJ DZIEJE 
CO JEST @Hostem w DI na <ng-content>


wizualna hierarchia (to, co widzisz w przeglądarce) rozjeżdża się 
z hierarchią wstrzykiwania zależności DI


<ng-content>

dziedziczy INIEKTOR od rodzica, nie miejsca wyświetlania
Angular stosuje zasadę: „Twój dom jest tam, gdzie Cię napisano”.
Więc HOSTEM tutaj jest '<app-DI-e-child-d>'
czyli 
KONTENT						-> <app-DI-e-child-d-content />
RODZIC/HOST				-> <app-DI-e-child-d>
WYŚWIETLA GO			-> <app-DI-e-child-d-parent>

<app-DI-e-child-d>
	#view-d_START

	<app-DI-e-child-d-parent>
		#view-d-parent_START

		<app-DI-e-child-d-child>
			#view-d-child_START
			#view-d-child_END
		</app-DI-e-child-d-child>

		<app-DI-e-child-d-content>
			#view-d-content_START
			#view-d-content_END
		</app-DI-e-child-d-content>

		#view-d-parent_END
	</app-DI-e-child-d-parent>

	#view-d_END
</app-DI-e-child-d>

*/

export const TOKEN_3 = new InjectionToken<string>('token.3', { factory: () => 'WARTOSC_0' });

@Component({
  selector: 'app-DI-e-child-d',
  template: `<p>CHILD_D</p>
    <app-DI-e-child-d-parent>
      <app-DI-e-child-d-content></app-DI-e-child-d-content>
    </app-DI-e-child-d-parent> `,
  providers: [{ provide: TOKEN_3, useValue: 'WARTOSC_1' }],
  // viewProviders: [{ provide: TOKEN_3, useValue: 'WARTOSC_1' }],
  imports: [forwardRef(() => DIEChildDParent), forwardRef(() => DIEChildDContent)],
})
export class DIEChildD {
  /*
   */
}

@Component({
  selector: 'app-DI-e-child-d-parent',
  template: `<p>CHILD_D_PARENT</p>
    <p>PARENT token = {{ tokenVar }}</p>
    <app-DI-e-child-d-child />
    <p>####</p>
    <ng-content /> `,
  providers: [{ provide: TOKEN_3, useValue: 'WARTOSC_2' }],
  // viewProviders: [{ provide: TOKEN_3, useValue: 'WARTOSC_2' }],
  imports: [forwardRef(() => DIEChildDChild)],
})
export class DIEChildDParent {
  tokenVar = inject(TOKEN_3, {});
}

@Component({
  selector: 'app-DI-e-child-d-child',
  template: `<p>CHILD_D_CHILD</p>
    <p>CHILD token 2 = {{ tokenVar2 }}</p>`,
  providers: [{ provide: TOKEN_3, useValue: 'WARTOSC_3' }],
  // viewProviders: [{ provide: TOKEN_3, useValue: 'WARTOSC_3' }],
})
export class DIEChildDChild {
  // tokenVar1a = inject(TOKEN_3, { host: true, skipSelf: true }); // BŁAD !!!
  // tokenVar1b = inject(TOKEN_3, { self: true, skipSelf: true }); // BŁAD !!!
  tokenVar2 = inject(TOKEN_3, { host: true, skipSelf: true, optional: true });
}

@Component({
  selector: 'app-DI-e-child-d-content',
  template: `<p>CHILD_D_CONTENT</p>
    <p>CONTENT token 1a = {{ tokenVar1a }}</p>`,
  styles: `
    :host {
      display: block;
      border: 1px solid red;
    }
  `,
  providers: [{ provide: TOKEN_3, useValue: 'WARTOSC_4' }],
  // viewProviders: [{ provide: TOKEN_3, useValue: 'WARTOSC_4' }],
})
export class DIEChildDContent {
  // PRZY 'viewProviders'		-> WARTOSC_1  z 'app-DI-e-child-d'
  // PRZY 'providers'				-> WARTOSC_2  z 'app-DI-e-child-d-parent'
  tokenVar1a = inject(TOKEN_3, { host: true, skipSelf: true, optional: true }); // DZIAŁA !!!
  // tokenVar1b = inject(TOKEN_3, { self: true, skipSelf: true }); // BŁAD !!!
}
