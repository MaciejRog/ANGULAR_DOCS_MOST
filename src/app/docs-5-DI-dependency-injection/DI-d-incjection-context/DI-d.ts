import {
  Component,
  inject,
  Injectable,
  forwardRef,
  OnInit,
  assertInInjectionContext,
  runInInjectionContext,
  EnvironmentInjector,
  InjectionToken,
} from '@angular/core';

@Component({
  selector: 'app-DI-d',
  template: `<app-DI-d-child-a />`,
  imports: [forwardRef(() => DIDChildA)],
})
export class DID {
  /*
	Injection Context (kontekście wstrzykiwania).

	Injection Context to miejsce, w której funkcja inject() ma prawo działać. 
	Czyli działają 'Injectory'
	Jeśli spróbujesz jej użyć poza tym miejscem, Angular rzuci błędem  
	(słynny NG0203: inject() must be called from an injection context).

	MIEJSCA Z KONTEKSTEM
			- Inicjalizacja pól komponentu/dyrektywy
						@Component({...})
						export class UserComponent {
							private userService = inject(UserService); 
						}
			- Konstruktor komponentu/dyrektywy
				konstruktor klasy inicjowanej przez system DI
						@Component({...})
						export class UserComponent {
							constructor() {
								const userService = inject(UserService);
							}
						}	
			- Funkcje fabrykujące (Factory Functions)
					- 'useFactory' zastosowanie w 'providers' dekoratora
								@Component({
									selector: 'app-DI-d-child-a',
									template: ``,
									providers: [
										{ 
											provide: DI_D_TOKEN, 
											useFactory: () => {
												const diVal = inject(DIDservice);
												return 'AGUS';
											} 
										}
									],
								})
					- funkcja 'factory' zastosowana w 'InjectionToken'
								export const DI_D_TOKEN = new InjectionToken<string>('nazwa', {
									factory: () => {
										const diVal = inject(DIDservice);
										return 'AGUS';
									},
								});


	GDZIE JESTEŚMY POZA KONTEKSTEM
	- kontekst znika, gdy tylko klasa zostanie zainicjalizowana
				@Component({...})
				export class UserComponent {
					private userService = inject(UserService); // OK

					ngOnInit() {
						// const http = inject(HttpClient); 		// BŁĄD! ngOnInit wykonuje się po zainicjalizowaniu pól.
					}

					onButtonClick() {
						// const auth = inject(AuthService);		// BŁĄD! Reakcja na kliknięcie dzieje się dużo później.
					}
				}
	


	WYMUSZNIE KONTEKSTU 'runInInjectionContext'
	pozwala użyć 'inject()' w miejscu gdzie go nie ma
				@Component({...})
				export class UserComponent {
					private injector = inject(EnvironmentInjector);

					executeLate() {
						runInInjectionContext(this.injector, () => {
							const service = inject(MyService);
							service.doSomething();
						});
					}
				}

	SPRAWDZENIE CZY JESTEŚMY W KONTEKŚCIE 'assertInInjectionContext'
	rzuca wyjątek gdy nie jesteśmy
				handleClickA() {
					// const diValC = inject(DIDservice); // BŁĄD!
					assertInInjectionContext(this.handleClickA);
				}
	*/
}

// ###############################
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Injectable({ providedIn: 'root' })
export class DIDservice {}

export const DI_D_TOKEN = new InjectionToken<string>('nazwa', {
  factory: () => {
    const diVal = inject(DIDservice);
    return 'AGUS';
  },
});

const provideFactory = () => {
  const diVal = inject(DIDservice);
  return 'AGUS_2';
};

@Component({
  selector: 'app-DI-d-child-a',
  template: `<button (click)="handleClickA()">CLICK</button>`,
  providers: [{ provide: DI_D_TOKEN, useFactory: provideFactory }],
})
export class DIDChildA implements OnInit {
  private injector = inject(EnvironmentInjector);

  diFieldA = inject(DIDservice);
  diFieldB = inject(DI_D_TOKEN);

  constructor(private diArg: DIDservice) {
    const diValA = inject(DIDservice);
    console.warn(`# | diValA = ${diValA}`);
  }

  ngOnInit(): void {
    // const diValB = inject(DIDservice);	// BŁĄD!
  }

  handleClickA() {
    // const diValC = inject(DIDservice); // BŁĄD!
    assertInInjectionContext(this.handleClickA); // próba wywołania 'handleClickA' zwróci Error
  }

  handleClickB() {
    runInInjectionContext(this.injector, () => {
      const diValD = inject(DIDservice);
      console.warn(`# | diValD = ${diValD}`);
    });
    console.warn(`# | diFieldA = ${this.diFieldA}`);
    console.warn(`# | diFieldB = ${this.diFieldB}`);
  }
}
