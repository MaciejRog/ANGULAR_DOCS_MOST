import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Inject,
  inject,
  Injectable,
  InjectionToken,
  Optional,
  Provider,
} from '@angular/core';

@Component({
  selector: 'app-DI-c',
  template: `
    <app-DI-c-child-a />
    <hr />
    <app-DI-c-child-b />
    <hr />
    <app-DI-c-child-c />
    <hr />
    <app-DI-c-child-d />
    <hr />
    <app-DI-c-child-e />
    <hr />
    <app-DI-c-child-f />
    <hr />
  `,
  imports: [
    forwardRef(() => DICChildA), //
    forwardRef(() => DICChildB),
    forwardRef(() => DICChildC),
    forwardRef(() => DICChildD),
    forwardRef(() => DICChildE),
    forwardRef(() => DICChildF),
  ],
})
export class DIC {
  /*
	Angular pozwala określić coś jako ZALEŹNOŚĆ:
		- automatycznie 
				-	providedIn w dekoratorze @Injectable 
				- fabryka w konfiguracji InjectionToken
		- ręcznie/manualnie
				array providers w komponentach, dyrektywach, trasach lub konfiguracji aplikacji
	*/
}

// ###############################	InjectionToken
// ############################### 	+ automatyczne zapenienie wartości 'factory'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV 	+ BAZA Manulne zapenienie wartości 'providers'

/*
	globalna wartość:
			- klasa/service											-> @Injectable({ providedIn: 'root' })
			- obiekt/funkcja/wartość_prosta			-> InjectionToken
*/

/*
@Injectable({ providedIn: 'root' })
		określa globalne klasy / serwisy
		singleton współdzielony w ramach całej aplikacji
*/
@Injectable({ providedIn: 'root' })
export class ServiceB {
  name = 'SERVICE_B';
  constructor() {
    console.warn(`WOWOŁANO KONSTRUKTOR | SERVICE_B **** `);
  }
  setName = (newName: string) => {
    this.name = newName;
  };
}

/*
InjectionToken
		określa globalne zmienne (obiekty, funkcje, typy proste)

		taki "identyfikator zastępczy". Pozwala stworzyć unikalny klucz, 
		który Angular rozpozna w systemie DI, nawet jeśli dane nie są klasą.


'GLOBAL_STRING' 								-> Token (nie posiada jeszcze wartości )
new InjectionToken<string>			-> token będzie miał wartość 'string'
'opisTokenu.string'							-> opis dla tokenu, tylko do debugowania
																		powinien, ale nie musi mieć unikalą wartość
																		UWAGA
																			angular odróżnia tokeny po ich referencji
	
UWAGA 
		MUSIMY JESCZE OKREŚLIĆ ICH WARTOŚCI / JAK JE TWORZYĆ,
		1. MANUALNA / RĘCZNA
			dodać pole 'providers' w dekoratorze
						providers: [
							{ 
								provide: GLOBAL_OBJECT_A, 		// określa InjectionToken
								useValue: { name: 'Ja' } 			// nadaje mu wartość
							},
						],
		2. AUTOMATYCZNA 
			dodać 2 argument opcji do InjectionToken wraz z 'factory'
						export const GLOBAL_OBJECT_B = new InjectionToken<{ name: string }>(
							'opisTokenu.object', 
							{
								// providedIn: 'root',					// możemy też ustawić 'providedIn'
																								// domyślnie gdy jest 'factory' jest na 'root'
								factory: () => {								// funkcja która nada wartość tokenowi
																								// UWAGA!!!!
									return { name: 'Aguś' };			//.    wewnątrz factory możliwe DI !!!!!
								},
							}
						);

						UWAGA - pozwala dodać też obikety przeglądarki 
						export const LOCAL_STORAGE = new InjectionToken<Storage>('localStorage', {
							factory: () => window.localStorage,
						});


*/
// tokeny z '_A' będą miały manualne zapewnienie wartości
export const GLOBAL_STRING_A = new InjectionToken<string>('opisTokenu.string');
export const GLOBAL_FUN_A = new InjectionToken<(msg: string) => string>('opisTokenu.function');
export const GLOBAL_OBJECT_A = new InjectionToken<{ name: string }>('opisTokenu.object');

// tokeny z '_B' będą miały automatyczne zapewnienie wartości
export const GLOBAL_STRING_B = new InjectionToken<string>(
  'opisTokenu.string', //
  {
    factory: () => {
      return 'AGUSIA';
    },
  },
);
export const GLOBAL_FUN_B = new InjectionToken<(msg: string) => string>('opisTokenu.function', {
  factory: () => {
    return (msg: string) => `treść MSG | ${msg}`;
  },
});
export const GLOBAL_OBJECT_B = new InjectionToken<{ name: string }>('opisTokenu.object', {
  // providedIn: 'root',
  factory: () => {
    const stringB = inject(GLOBAL_STRING_B); // UWAGA 'DI' w 'factory'
    return { name: stringB + '__Aguś' };
  },
});

@Component({
  selector: 'app-DI-c-child-a',
  template: `
    <p>CHILD_A</p>
    <p>
      AUTO service = {{ serviceInstance.name }} |
      <button (click)="serviceInstance.setName('ZMIANA_B')">CHANGE</button>
    </p>
    <br />
    <p>BASE MANUAL object = {{ globalObjectA | json }}</p>
    <p>BASE MANUAL const = {{ globalConstA }}</p>
    <p>BASE MANUAL fun = {{ globalFunA('wywołanie_1') }}</p>
    <br />
    <p>AUTO object = {{ globalObjectB | json }}</p>
    <p>AUTO const = {{ globalConstB }}</p>
    <p>AUTO fun = {{ globalFunB('wywołanie_1') }}</p>
  `,
  imports: [CommonModule],
  // poniżej manualne zapenienie wartości
  providers: [
    { provide: GLOBAL_OBJECT_A, useValue: { name: 'Ja' } },
    {
      provide: GLOBAL_FUN_A,
      useValue: (msg: string) => {
        return 'TO DZIAŁA ' + msg;
      },
    },
    { provide: GLOBAL_STRING_A, useValue: 'TO_ZYJE' },
  ],
})
export class DICChildA {
  serviceInstance = inject(ServiceB);
  //
  globalObjectA = inject(GLOBAL_OBJECT_A);
  globalConstA = inject(GLOBAL_STRING_A);
  globalFunA = inject(GLOBAL_FUN_A);
  //
  globalObjectB = inject(GLOBAL_OBJECT_B);
  globalConstB = inject(GLOBAL_STRING_B);
  globalFunB = inject(GLOBAL_FUN_B);
}

// ###############################
// ############################### Manulne zapenienie wartości 'providers'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV część_1

@Injectable()
export class ServiceA {
  name = 'SERVICE_A';
  constructor() {
    console.warn(`WOWOŁANO KONSTRUKTOR | SERVICE_A ____ `);
  }
}

@Component({
  selector: 'app-DI-c-child-b',
  template: ` <p>CHILD_B</p>
    <p>MANUAL servie = {{ serviceInstance.name }}</p>
    <p>
      MANUAL servie (FROM AUTO) = {{ serviceInstanceB.name }} |
      <button (click)="serviceInstanceB.setName('ZMIANA_B')">CHANGE</button>
    </p>
    <br />
    <p>MANUAL object = {{ globalObjectA | json }}</p>
    <p>MANUAL const = {{ globalConstA }}</p>
    <p>MANUAL fun = {{ globalFunA('wywołanie_1') }}</p>`,
  imports: [CommonModule],
  /*
	MANUALNE USTAWIENIE ZALEŻNOŚCI 
	*/
  providers: [
    {
      provide: ServiceA, //
    },
    {
      provide: ServiceB, //
    },
    {
      provide: GLOBAL_OBJECT_A, //
      useValue: { name: 'Ja' },
    },
    {
      provide: GLOBAL_FUN_A, //
      useValue: (msg: string) => {
        return 'TO DZIAŁA ' + msg;
      },
    },
    {
      provide: GLOBAL_STRING_A, //
      useValue: 'TO_ZYJE',
    },
  ],
})
export class DICChildB {
  /*
	MANUALNA ustawienie w 'providers' dekoratora daje więcej możliwości, np:
		- 1-da możliwość dla serwisów bez 'providedIn'
		- potrzeba nowej instancji (innej niż aplikacyjny singleton)

	AUTOMATYCZNA vs MANUALNA
		AUTOMATYCZNA 
				działa jak providedIn: „root” dla servisów
				Tree-shakeable DZIAŁA, dodane do pliku js tylko gdy użyty
				możliwe stosowania 'inject()' w 'factory'

	UWAGA
			servis z „providedIn: root” można nadpisać na poziomie komponentu w 'providers'. 
			NOWA instancja nie singleton
			To wiąże instancję servisu z cyklem życia komponentu. 
			W rezultacie, gdy komponent jest niszczony, servis też jest niszczony
	*/
  serviceInstance = inject(ServiceA);
  serviceInstanceB = inject(ServiceB);
  //
  globalObjectA = inject(GLOBAL_OBJECT_A);
  globalConstA = inject(GLOBAL_STRING_A);
  globalFunA = inject(GLOBAL_FUN_A);
}

// ###############################
// ############################### Hierarchia DI
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-DI-c-child-c',
  template: ``,
})
export class DICChildC {
  /*
  System wstrzykiwania zależności (DI) jest hierarchiczny. 
  Gdy komponent żąda zależności, Angular rozpoczyna od iniektora tego komponentu 
  i podąża w górę drzewa, aż znajdzie dostawcę dla tej zależności. 
  Iniektory te tworzą hierarchię, która odzwierciedla drzewo komponentów.

  hierarchia pozwala, na:
    - Instancje o ograniczonym zakresie: 
          Różne części aplikacji mogą mieć różne instancje tej samej usługi.
    - nadpisywanie: 
          Komponenty podrzędne mogą nadpisywać dostawców z komponentów nadrzędnych.
    - Efektywność pamięci: 
          Usługi są tworzone tylko w razie potrzeby.

  <comp-a>
    <comp-b></comp-b>
    <comp-c>
      <comp-d></comp-d>
    </comp-c>
  </comp-a>

  comp-a -> może dostarczyć wartości dla 'comp-b' i 'comp-c'
  comp-c -> może dostarczyć wartości dla 'comp-d', ale NIE DLA 'comp-a'
  */
}

// ###############################
// ############################### Manulne zapenienie wartości 'providers'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV część_2

@Injectable()
export class ServiceC {
  name = 'SERVICE_C';
}

export class ServiceClassA {
  name = 'SERVICE_ClassA';
}
const IS_PROD = false;
const SUFIX = '- a mam wartość';

const TOKEN_A = new InjectionToken<string | number>('child.d.test.token.a');

@Injectable()
export class ServiceD {
  name = 'SERVICE_D';
}

@Injectable()
export class ServiceE {
  name = 'SERVICE_E';
}

@Injectable()
export class ServiceF {
  name = 'SERVICE_F';
}

const TOKEN_B = new InjectionToken<string | number>('child.d.test.token.b');

@Component({
  selector: 'app-DI-c-child-d',
  template: `<p>app-DI-c-child-d</p>`,
  providers: [
    /*
    ---------
    useClass:
        ##V skrócona forma, bez pełnego obiektu domyślnie zakłada użycie 'useClass'
            providers: [DataService];
        ##V pełna forma  (!!!! możemy podać inną klasę niż tą z 'provide')
            providers: [{provide: DataService, useClass: NewDataService}];
        ##V wartość może zależeć np: od inputa
            providers: [{
                provide: StorageService,
                useClass: isProd ? ClassA : ClassB,
            },];
        Pamiętaj: useClass tworzy nową instancję klasy w obrębie dostawcy (injectora). 
        Jeśli masz serwis w providedIn: 'root', a potem użyjesz go w 
        providers: [ { provide: S, useClass: S } ] w komponencie 
        ten komponent i jego dzieci dostaną inną kopię serwisu niż reszta aplikacji.
    */
    {
      provide: ServiceC,
      useClass: IS_PROD ? ServiceC : ServiceClassA,
    },
    /*
    useValue
        nadaje 'InjectionToken' statyczną wartość (Obiekt, Tablica, number, string itp...)
        UWAGA TS 'types' i 'interface' nie mogą być użyte w 'useValue'
            bo istnieją tylko przed kompilacja 
     */
    {
      provide: TOKEN_A,
      useValue: 'Aguś to żyje!',
    },
    /*
    useFactory
        funkcja, która zwraca nową wartość dla Iniektora
        ##V najprostsze funkcja 'factory' bez argumentów
            {
              provide: ServiceD,
              useFactory: () => {
                return { name: 'AGA' };
              },
            },
        ##V 'factory' z argumentem 
        ##  property 'deps' przyjmuje tablicę ZALEŻNOŚCI !!!
        ##  wszystko co jest w tablicy 'deps' jest wymagane w kolejności
        ##  jako argumenty 'factory'
            {
              provide: ServiceD,
                    // ServiceC - DI z 'providers' klasy
                    // ServiceB - DI z 'root'
              useFactory: (serviceC: ServiceC, serviceB: ServiceB) => {
                return {
                  name: 'AGA',
                  nameC: 'provide C = ' + serviceC.name,
                  nameB: 'root B = ' + serviceB.name,
                };
              },
              deps: [ServiceC, ServiceB],      // lista argumentów (zależności dla factory)
            },
        ##V 'factory' z argumentem opcjonalnym '[new Optional(), ServiceE]'
        ## oznaczenie opcjonalnej zależności 
        ##      [ new Optional(), NazwaZależności. ]
            {
              provide: ServiceD,
                    // ServiceC - DI z 'providers' klasy
                    // ServiceB - DI z 'root'
                    // serviceE - Opcjonalne DI, w 'providers' klasy ani 'root' go nie ma
                    //            ale może np: rodzic <app-DI-c-child-d> go mieć
              useFactory: (serviceC: ServiceC, serviceB: ServiceB, serviceE?: ServiceE) => {
                return {
                  name: 'AGA',
                  nameC: 'provide C = ' + serviceC.name,
                  nameB: 'root B = ' + serviceB.name,
                  nameE: `optional E = ${serviceE ? serviceE?.name : ''}`,
                };
              },
              deps: [ServiceC, ServiceB, [new Optional(), ServiceE]],
            },
    */
    {
      provide: ServiceD,
      // ServiceC - DI z 'providers' klasy
      // ServiceB - DI z 'root'
      // serviceE - Opcjonalne DI, w 'providers' klasy ani 'root' go nie ma
      //            ale może np: rodzic <app-DI-c-child-d> go mieć
      useFactory: (serviceC: ServiceC, serviceB: ServiceB, serviceE?: ServiceE) => {
        // UWAGA!!!
        //    nie trzeba przekazywać argumentów bo DI, jest możliwe wewnątrz funkcji
        //.   TYLKO DLA istniejących
        //    GDY servise jest OPCJONALNY to i tak trzeba go przekazać w 'deps' i jako argument

        const servCimplB = inject(ServiceB);
        const servBimplC = inject(ServiceC);
        // const servEimplE = inject(ServiceE);     // BŁAD
        return {
          name: 'AGA',
          nameB: 'root B = ' + serviceB.name,
          nameC: 'provide C = ' + serviceC.name,
          nameE: `optional E = ${serviceE ? serviceE?.name : ''}`,
          implBServB: 'root B = ' + servCimplB.name,
          implBServC: 'provide C = ' + servBimplC.name,
        };
      },
      deps: [ServiceC, ServiceB, [new Optional(), ServiceE]],
    },
    /*
    useExisting
        tworzy aliast 1 zależność współdzieli wartość z inną zależnością
        OBIE ZWRACAJA tą samą wartość !!! (wspólna instancja singletonu)
        UWAGA !!! Wszystkie poniższe DZIAŁAJą
              nie ma znaczenia czy współdzielimy wartość z servisem klasy
              injectionTokenem czy zależność była zdefiniowa w 'providers' lub 'root'
    */
    {
      provide: ServiceF,
      // useExisting: ServiceC,   // service z 'providers' klasy
      // useExisting: TOKEN_A,    // InjectionToken z 'providers' klasy
      useExisting: ServiceB, // servie z 'root'
    },
    /*
    MUTLI 
        wiele wartość dla tej samej zależności
        każda dodaje wartość do tablicy 
        w efekcie wartość dla TOKEN_B -> '[ 111, "AGUSIA" ]'
        UWAGA
            każda pozycja przy 'multi' musi mieć. 'multi: true'
            inaczej albo będzie nadpisanie, albo błąd, że nie da się zrobić 'push'
    */
    {
      provide: TOKEN_B,
      useValue: 111,
      multi: true,
    },
    {
      provide: TOKEN_B,
      useValue: 'AGUSIA',
      multi: true,
    },
  ],
})
export class DICChildD {
  /*
  każdy obiekt providera musi miec:
    - provide
    - wartości, określonej przez 1 z poniższych 
        useClass / useValue / useFactory / useExisting
        Wartość należy rozumieć tak:
        gdy ktoś chce stworzyć instancję komponentu to dostarcz do niego 
        to co podano w 'provide', ale nadaj mu nową wartość/instancję
        zgodnie z tym co jest w 'use...' 

    {
      provide: ServiceC,      // Identyfikator dostawcy np:
                              //          klasa z dekoratorem @Injectable
                              //          token utworzony z InjectionToken
                              //          NIC innego np: interfejs nie zadziała
      useClass      – dostarcza klasę JavaScript. (domyślna, gdy damy sam Token w tablicy)
      useValue      – dostarcza wartość statyczną np: obiekt
      useFactory    – dostarcza funkcję fabryczną zwracającą wartość.
      useExisting   – dostarcza alias do istniejącego dostawcy.
    },


   */

  tokenB = inject(TOKEN_B); // 'injectionToken' łatwiej wstrzyknąć jako pole

  constructor(
    private serviceC: ServiceC,
    @Inject(TOKEN_A) private tokenA: string | null, // w konstruktorze też się da, ale no czytelność
    private serviceD: ServiceD,
    private serviceF: ServiceF,
  ) {
    console.warn(`CHILD_D | serviceC = `, this.serviceC);
    console.warn(`CHILD_D | tokenA = `, this.tokenA);
    console.warn(`CHILD_D | serviceD = `, this.serviceD);
    console.warn(`CHILD_D | serviceF = `, this.serviceF);
    console.warn(`CHILD_D | tokenB = `, this.tokenB);
  }
}

// ###############################
// ############################### GDZIE MOŻNA OKREŚLIĆ 'providers' ?
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-DI-c-child-e',
  template: ``,
})
export class DICChildE {
  /*
  miejsce deklaracji providera decyduje o jego zasięgu (Scope) 
  oraz czasie życia (Lifetime). 
  Jak decydowanie, czy narzędzia mają być dostępne dla wszystkich pracowników, 
  tylko dla jednego działu, czy może tylko dla jednej osoby.

  0. 'providedIn: 'root'
      OPISNAE JAKO '0' bo nie pojawia się nigdy w 'providers'
      serwis jest singletonem (istnieje tylko jedna instancja w całej aplikacji)
      i jest tree-shakable (jeśli go nie użyjesz, Angular usunie go 
      z końcowego pliku, żeby aplikacja była lżejsza).
      mp:
          @Injectable({
            providedIn: 'root' // Serwis dostępny wszędzie
          })
          export class GlobalSettingsService {}




  1. Poziom Bootstrappingu (Application Config)
      możesz zadeklarować providery podczas startu aplikacji w pliku app.config.ts.
      - ma zakres aplikacji, 
      - singleton (jednej instancji współdzielonej przez całą aplikację)
      - servise/token nie wymaga konfiguracji specyficznej dla danego komponentu – 
            ogólne przeznaczenia działa wszędzie tak samo.
      np:
          // app.config.ts
          export const appConfig: ApplicationConfig = {
            providers: [
              { 
                provide: API_URL, 
                useValue: 'https://api.example.com'
              },
              provideRouter(routes),            // Przykład wbudowanego providera
            ]
          };

      Kiedy stosować?
        Gdy konfigurujesz globalne elementy (Router, HTTP, zmienne środowiskowe) 
        UWAGA - zawsze w kodzie produkcyjnym i. trudniejsze testy
        UWAGA - np dla servisów, które normalnie by były 'providedIn: 'root'
                ale wymagają konfiguracji
      UWAGA !!!
        Bootstrapping to rozruch. To takie przekręcenie kluczyka w stacyjce
        W Angularze bootstrapping to proces, w którym framework:
            - Wczytuje główny plik (zazwyczaj main.ts).
            - Tworzy główne środowisko (Injector).
            - Wyszukuje w pliku index.html specjalny znacznik (np. <app-root>).
            - Wstawia w to miejsce główny komponent aplikacji.

  2. Poziom Komponentu (Component Injector)
      UWAGA. Jeśli dodasz providera w dekoratorze @Component, 
      Angular stworzy nową instancję serwisu dla każdego egzemplarza tego komponentu.
      np:
          @Component({
            selector: 'app-editor',
            providers: [EditorHistoryService],      // Każdy edytor ma własną historię!
            template: `...`
          })
          export class EditorComponent {
            constructor(private history: EditorHistoryService) {}
          }
      
      Kiedy stosować?
        potrzeba izolacji. 
          Np tutaj każdy komponent ma mieć swoją historię "Cofnij" (Undo).
          Inaczej stan servise/tokenu zależy od danych w komponencie 
          np: validacja, cache itp
        Gdy serwis ma zostać zniszczony razem z komponentem.
      
      UWAGA: Jeśli wiele dyrektyw w tym samym elemencie dostarcza ten sam token, 
            jedna z nich wygra, ale która to już przypadek.

  3. Poziom lazy Modułu (NgModule)
      LUB
     Route providers

      np:
          @NgModule({
            declarations: [...],
            providers: [UserService], // Dostępny dla wszystkich w tym module i modułach importujących
            bootstrap: [AppComponent]
          })
          export class UserModule { }      

          // routes.ts
          export const routes: Routes = [
            {
              path: 'admin',
              providers: [
                AdminService,               // Only loaded with admin routes
                {provide: FEATURE_FLAGS, useValue: {adminMode: true}},
              ],
              loadChildren: () => import('./admin/admin.routes'),
            },]
          ];
      
      Kiedy stosować?
          Usługi potrzebne tylko dla określonych routes lub modułów funkcji

      UWAGA!!! 
          W przypadku modułów (Lazy Loaded Modules), providery 
          mają swój własny "ekosystem" i nie są widoczne na zewnątrz.

   */
}

// ############################### CIEKAWOSTKA - dla twórców bibliotek
// ############################### WZORZECZ PROJEKTOWY 'provide'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

export interface AnalyticsConfig {
  trackId: string;
}

const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('analytics.config');

export class AnalyticsService {
  private config = inject(ANALYTICS_CONFIG);
  track(event: string, properties?: any) {
    //
  }
}

export function provideAnalytics(config: AnalyticsConfig): Provider[] {
  return [{ provide: ANALYTICS_CONFIG, useValue: config }, AnalyticsService];
}

@Component({
  selector: 'app-DI-c-child-f',
  template: ``,
})
export class DICChildF {
  /*

  tworzymy funkcję 'provideAnalytics'
  która zwraca tablicę 'Provider'

   */
  constructor() {
    console.warn(provideAnalytics({ trackId: 'test-track-id' }));
  }
}
