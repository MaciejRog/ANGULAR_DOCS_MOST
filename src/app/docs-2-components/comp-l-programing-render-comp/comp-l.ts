import { NgComponentOutlet } from '@angular/common';
import {
  afterEveryRender,
  Component,
  computed,
  forwardRef,
  HostListener,
  Injectable,
  Injector,
  input,
  inputBinding,
  model,
  output,
  outputBinding,
  signal,
  twoWayBinding,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-comp-l',
  template: `
    <p>KOMPONENT L</p>
    <hr />
    <app-comp-l-parent-a />
    <hr />
    <div class="view-ref-wrapper">
      <app-comp-l-parent-b />
    </div>
  `,
  imports: [forwardRef(() => CompLParentA), forwardRef(() => CompLParentB)],
})
export class CompL {}

// ###############################
// ############################### <ng-container />
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
/*
<ng-container> to taki "REACT FRAGMENT". 
    Pozwala na grupowanie elementów i nakładanie na nie logiki (dyrektyw),
    ale sam nie pojawia się w końcowym kodzie HTML.

UWAGA:
    - pozwala ominąć zasadę "Tylko jedna dyrektywa strukturalna"

    <ng-container *dyrektywaA> 
      <ng-container *dyrektywaB> 
        //...
      </ng-container>
    </ng-container> 
*/
@Injectable({ providedIn: 'root' })
export class CustomServiceTest {}

// ###############################
// ############################### Programistyczne renderowanie komponentów
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
poza renderowaniem komponentów w szablonach 
można je wyrenderować też programistycznie, są 2 metody:
	- NgComponentOutlet   -> automatycznie działa w szablonie
	- ViewContainerRef    -> działa tylko z poziomu Klasy
*/

@Component({
  selector: 'app-comp-l-child-a',
  template: `<div>CHILD_A | {{ value() }}</div>
    <ng-content />`,
})
export class CompLChildA {
  value = input<string>('');
  isExpanded = model<boolean>();
  close = output<boolean>();

  @HostListener('click', ['$event'])
  handleClick = (event: Event) => {
    console.warn(`CompLChildA CLICK | event = `, event);
    this.close.emit(true);
  };

  constructor(private customService: CustomServiceTest) {}
}

@Component({
  selector: 'app-comp-l-child-b',
  template: `<div>CHILD_B | {{ value() }}</div>
    <ng-content />`,
})
export class CompLChildB {
  value = input<string>('');
}

// ###############################
// ############################### NgComponentOutlet
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-l-parent-a',
  template: `
    <div>PARENT_A</div>
    <ng-container *ngComponentOutlet="getComp()" />
    <ng-container *ngComponentOutlet="getComp(false)" />
    <div *ngComponentOutlet="dynamicComponent; inputs: dynamicInputs()"></div>
    <div *ngComponentOutlet="dynamicComponent; content: dynamicContent()"></div>
    <ng-container *ngComponentOutlet="dynamicComponent; injector: myCustomInjector" />
  `,
  /* w DOM będzie
	<app-comp-l-parent-a>
    <div>PARENT_A</div><app-comp-l-child-a><div>CHILD_A | </div></app-comp-l-child-a>
    <app-comp-l-child-b><div>CHILD_B | </div></app-comp-l-child-b>
    <app-comp-l-child-a><div>CHILD_A | Ania</div></app-comp-l-child-a>
    <app-comp-l-child-a><div>CHILD_A | </div><b> I to też!</b></app-comp-l-child-a>
    <app-comp-l-child-a><div>CHILD_A | </div></app-comp-l-child-a>
  </app-comp-l-parent-a>
	*/
  imports: [NgComponentOutlet],
})
export class CompLParentA {
  /*
	NgComponentOutlet
			- jest to dyrektywa strukturalna 	-> *ngComponentOutlet
			- wymaga importu w 'imports'
			- i przekazania funkcji która zwraca klasy komponentu

	w efekcie tag, który ma tą dyrektywę zniknie, a w jego miejsce zostanie wyrenderowany 
	zwrócony przez funkcję komponent

  STOSOWANIE:
      - angular sam tworzy i niszczy komponenty
      - czysty kod HTML
      - proste komponenty (brak reakcji na output)
	*/
  getComp = (warunek = true) => {
    if (warunek) {
      return CompLChildA;
    } else {
      return CompLChildB;
    }
  };

  /*
  INPUTS DO KOMPONENTU ngComponentOutlet

  można też przekazać inputy 
      *ngComponentOutlet="dynamicComponent; inputs: dynamicInputs"

      dynamicComponent - klasa komponentu
      dynamicInputs - obiekt z polami odpowiadającymi '@Input()' komponentu
  */
  dynamicComponent = CompLChildA;
  // dynamicInputs = { value: 'Ania' };
  dynamicInputs = signal({ value: 'Ania' });

  /*
  CONTENT DO KOMPONENTU ngComponentOutlet

  można przekazać zawartość <ng-content/> do dynamicznego komponentu
      *ngComponentOutlet="dynamicComponent; content: dynamicContent()"
  */
  dynamicContent = computed(() => {
    const boldNode = document.createElement('b');
    boldNode.innerText = ' I to też!';

    const toReturn = [[boldNode]];
    return toReturn;
  });

  /*
  INJECTOR ngComponentOutlet
      *ngComponentOutlet="dynamicComponent; injector: myCustomInjector"
  */
  myCustomInjector = Injector.create({
    providers: [
      {
        provide: CustomServiceTest, //
        useValue: 'dark',
      },
    ],
  });

  /*
      ### UWAGA można wykonać LAZY_LOADING
      async loadAdvanced() {
        const { AdvancedSettings } = await import('path/to/advanced_settings.js');
        this.advancedSettings = AdvancedSettings;
      }
      ### GDZIE
      <ng-container *ngComponentOutlet="advancedSettings" />
  */
}

// ###############################
// ############################### ViewContainerRef
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-l-parent-b',
  template: `<div>
    <button (click)="executeViewContainer()">EXECUTE ViewContainerRef</button>
  </div>`,
})
export class CompLParentB {
  /*
  ViewContainerRef
      daje dostęp do tzw View Container -> miejsce w DOM 
      z którego możemy pobierać i do którego możemy wstawiać komponenty

  */

  constructor(private viewContainer: ViewContainerRef) {}

  canClose = signal(true);
  isExpanded = signal(true);
  executeViewContainer = () => {
    /*
    TWORZENIE KOMPONENTU -> metoda 'createComponent'

        DOMYSLNIE 'ViewContainerRef' wskazuje na HOST
        a metoda 'createComponent' doda komponent ZA wskazywanym elementem 
        takie appendAfter 'add after as next sibling'

        <div class="view-ref-wrapper">
          <app-comp-l-parent-b>
            <div><button>EXECUTE ViewContainerRef</button></div>
          </app-comp-l-parent-b>            <---- tu HOST 
          <app-comp-l-child-a>              <---- to dodało komponent
            <div>CHILD_A | </div>
          </app-comp-l-child-a>
        </div>

    createComponent(
      compName,
      compOptionsObject: {
        bindings: [
          inputBinding    -> do bindowania @input
          twoWayBinding   -> do bindowania 2-way
          outputBinding   -> do bindowania @output
        ]
      }
    )
    */

    const componentRef = this.viewContainer.createComponent(CompLChildA, {
      bindings: [
        inputBinding('value', () => 'VCR'),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Closed with result:', confirmed);
        }),
      ],
      directives: [],
    });
  };

  /*
      import {
        createComponent,
        ApplicationRef,         // instancja aplikacji Angulara. nadzoruje VIEW i dba o proces wykrywania zmian (Change Detection) 
        EnvironmentInjector,    // specjalny injectora, który przechowuje usługi/services zdefiniowane na poziomie całej aplikacji
        inject,
        Injectable,
        inputBinding,
        outputBinding,
      } from '@angular/core';
      import {Popup} from './popup';

      @Injectable({providedIn: 'root'})
      export class PopupService {
        private readonly injector = inject(EnvironmentInjector);
        private readonly appRef = inject(ApplicationRef);

        show(message: string) {
          const host = document.createElement('popup-host');    // <- tworzymy HOST
          const ref = createComponent(Popup, {                  // <- tworzymy KOMPONENT
            environmentInjector: this.injector, 
            hostElement: host,
            bindings: [
              inputBinding('message', () => message),
              outputBinding('closed', () => {
                document.body.removeChild(host);        // usuwa komponent z DOM
                this.appRef.detachView(ref.hostView);   // odpina go z VIEW_DETECTION
                ref.destroy();                          // niszczy komponent
              }),
            ],
          });

          this.appRef.attachView(ref.hostView);         // dodaje komponent to VIEW_DETECTION !!!
          document.body.appendChild(host);              // dodaje komponent do DOM (POZA ANGULAREM)
        }
      }
  */
}
