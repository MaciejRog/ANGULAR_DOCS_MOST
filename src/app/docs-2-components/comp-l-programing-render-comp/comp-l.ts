import { NgComponentOutlet } from '@angular/common';
import {
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
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-comp-l',
  imports: [
    forwardRef(() => CompL_NgContainer), //
    forwardRef(() => CompL_ViewContainerRef),
    forwardRef(() => CompL_NgComponentOutlet),
  ],
  template: `
    <!--  -->
    <CompL_NgContainer />
    <br />
    <hr />

    <!--  -->
    <CompL_NgComponentOutlet />
    <br />
    <hr />

    <!--  -->
    <CompL_ViewContainerRef />
    <br />
    <hr />
  `,
})
export class CompL {}

// ###############################
// ############################### TAG DO GRUPOWANIA taki "react.fragment"
// ############################### <ng-container>
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompL_NgContainer',
  imports: [],
  template: `
    <div>
      <div>CompL_NgContainer</div>
      <br />
      <ng-container>
        <ng-container>
          <span>NG-CONTAINER</span>
        </ng-container>
      </ng-container>
    </div>
  `,
})
export class CompL_NgContainer {
  /*
  <ng-container> to taki "react.fragment". 
  Pozwala na grupowanie elementów i nakładanie na nie logiki (dyrektyw),
  ale sam tag <ng-container> nie pojawia się w DOM przeglądarki.

  UWAGA:
  pozwala ominąć zasadę "Tylko jedna dyrektywa strukturalna"
      <ng-container *dyrektywaA> 
        <ng-container *dyrektywaB> 
          //...                       <- to tutaj dostaje 'dyrektywaA' i 'dyrektywaB'
        </ng-container>
      </ng-container> 
  */
}

// ###############################
// ############################### Programistyczne renderowanie komponentów
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
/*
są 2 metody renderowanie komponentów:
- renderowanie w szablonach -> <Comp />
- renderowanie programistyczne, w tym 2 metody:
    - NgComponentOutlet   -> automatycznie działa w szablonie/template
    - ViewContainerRef    -> działa tylko z poziomu Klasy
*/

@Injectable({ providedIn: 'root' })
export class CompL_Service {}

@Component({
  selector: 'CompL_ChildA',
  template: `
    <div>
      <div>CompL_ChildA | {{ value() }} | {{ this.compLService }}</div>
      <ng-content />
    </div>
  `,
})
export class CompL_ChildA {
  value = input<string>('');
  isExpanded = model<boolean>();
  close = output<boolean>();

  @HostListener('click', ['$event'])
  handleClick = (event: Event) => {
    console.warn(`CompL_ChildA CLICK | event = `, event);
    this.close.emit(true);
  };

  constructor(public compLService: CompL_Service) {}
}

@Component({
  selector: 'CompL_ChildB',
  template: `
    <div>
      <div>CompL_ChildB | {{ value() }}</div>
      <ng-content />
    </div>
  `,
})
export class CompL_ChildB {
  value = input<string>('');
}

// ###############################
// ###############################
// ############################### NgComponentOutlet
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompL_NgComponentOutlet',
  imports: [
    NgComponentOutlet, //
  ],
  template: `
    <div>
      <div>CompL_NgComponentOutlet</div>
      <br />

      <div>
        <div>PARENT_A</div>
        <br />
        <ng-container *ngComponentOutlet="getComp()" />
        <ng-container *ngComponentOutlet="getComp(false)" />
        <div *ngComponentOutlet="dynamicComponent; inputs: dynamicInputs()"></div>
        <div *ngComponentOutlet="dynamicComponent; content: dynamicContent()"></div>
        <ng-container *ngComponentOutlet="dynamicComponent; injector: myCustomInjector" />
      </div>
      <!--
      WYRENDEROWANE WARTOŚCI 
      <div>
        <div>PARENT_A</div>
        <br>
        <compl_childa><div><div>CompL_ChildA |  | [object Object]</div></div></compl_childa>
        <compl_childb><div><div>CompL_ChildB | </div></div></compl_childb>
        <compl_childa><div><div>CompL_ChildA | Aga_ma_kota | [object Object]</div></div></compl_childa>
        <compl_childa><div><div>CompL_ChildA |  | [object Object]</div><b>CHILD_A - CONTENT</b></div></compl_childa>
        <compl_childa><div><div>CompL_ChildA |  | dark</div></div></compl_childa>
      </div>
      -->
    </div>
  `,
})
export class CompL_NgComponentOutlet {
  /*
	NgComponentOutlet -> programistyczne renderowanie komponentów
  - to dyrektywa strukturalna 	-> *ngComponentOutlet
    przyjmuje funkcję, której return to klasa komponentu
  - wymaga importu `imports: [ NgComponentOutlet ]`
  - jako dyrektywa strukturalna, tag HTML z nią znika w DOM, a w jego miejsce 
    renderuje się komponent klasy dostarczonej do dyrektywy
  */
  /*
  ARGUMENT DLA 'ngComponentOutlet'
      <ng-container *ngComponentOutlet="getComp()" />
      getComp()     <- zwraca klasę komponentu
	*/
  getComp = (warunek = true) => {
    return warunek ? CompL_ChildA : CompL_ChildB;
  };

  /*
  WYRENDEROWANIE KOMPONENTOW z 'inputs', 'outputs' 
  DO PROGRAMISTYCZNYCH KOMPONENTOW można przekazać 'inputs' itp...
      *ngComponentOutlet="dynamicComponent; inputs: dynamicInputs()"
  */
  dynamicComponent = CompL_ChildA;
  // dynamicInputs = { value: 'Aga_ma_kota' };
  dynamicInputs = signal({ value: 'Aga_ma_kota' });

  /*
  WYRENDEROWANIE KOMPONENTOW z 'content',
  DO PROGRAMISTYCZNYCH KOMPONENTOW można przekazać zawartość <ng-content/>
      *ngComponentOutlet="dynamicComponent; content: dynamicContent()"
  */
  dynamicContent = computed(() => {
    const boldNode = document.createElement('b');
    boldNode.innerText = 'CHILD_A - CONTENT';
    const toReturn = [[boldNode]];
    return toReturn; // typ przekazany do 'content' to 'HTMLElement[][]'
  });

  /*
  PRZEKAZANIE 'DI' DO PROGRAMISTYCZNEGO KOMPONENTU
      *ngComponentOutlet="dynamicComponent; injector: myCustomInjector"
  */
  myCustomInjector = Injector.create({
    providers: [
      {
        provide: CompL_Service, //
        useValue: 'dark',
      },
    ],
  });

  /*
  UWAGA -> PROGRAMISTYCZNY KOMPONENT z LAZY_LOADING
      async loadAdvanced() {
        const { AdvancedSettings } = await import('path/to/advanced_settings.js');
        this.advancedSettings = AdvancedSettings;
      }
      <ng-container *ngComponentOutlet="advancedSettings" />
  */
}

// ###############################
// ############################### Jeszcze potężniejsze narzędzie do dynamicznego renderowania komponentów
// ############################### ViewContainerRef
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompL_ViewContainerRef',
  imports: [],
  template: `
    <div>
      <div>CompL_ViewContainerRef</div>
      <br />

      <div>
        <button (click)="executeViewContainer()">EXECUTE ViewContainerRef</button>
      </div>
    </div>
  `,
})
export class CompL_ViewContainerRef {
  /*
  ViewContainerRef
  Aby skorzystać trzeba zastosować DI
  daje to dostęp do 'View Container' czyli miejsca w DOM 
  z którego możemy pobierać i do którego możemy wstawiać komponenty
  */
  constructor(private viewContainer: ViewContainerRef) {}

  canClose = signal(true);
  isExpanded = signal(true);
  executeViewContainer = () => {
    /*
    TWORZENIE KOMPONENTU z ViewContainerRef -> metoda 'createComponent'

    domyślnie 'ViewContainerRef' wskazuje na element HOST
    a metoda 'createComponent' doda komponent ZA wskazywanym elementem 
    takie appendAfter 'add after as next sibling'

    <CompL_ViewContainerRef />        // <- HOST
    <CompL_ChildA>                    // <- metoda 'createComponent' tu doda komponent
    */
    const componentRef = this.viewContainer.createComponent(
      CompL_ChildA, //                                        klasa komponentu
      {
        //                                                    zestaw opcji, z którymi zostanie wyrenderowany
        bindings: [
          inputBinding('value', () => 'VCR'), //              - bindowanie 'input'
          twoWayBinding('isExpanded', this.isExpanded), //    - bindowanie 'model' 2-way
          outputBinding<boolean>( //                          - bindowanie 'output'
            'close', //
            (confirmed) => {
              console.log('Closed with result:', confirmed);
            },
          ),
        ],
        directives: [],
      },
    );
  };

  /*
  UWAGA
  przykład sersiwu, który dynamicznie dodaje komponent angulara poza szablon/template aplikacji angulara
    
      import {
        createComponent,
        ApplicationRef,         // instancja aplikacji Angulara. nadzoruje VIEW 
        //                         i dba o proces wykrywania zmian (Change Detection) 
        EnvironmentInjector,    // specjalny injector, który przechowuje usługi/services 
        //                         zdefiniowane na poziomie całej aplikacji
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
          const ref = createComponent(                          // <- tworzymy KOMPONENT
            Popup, 
            {                 
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
            }
          );

          this.appRef.attachView(ref.hostView);         // dodaje komponent to VIEW_DETECTION !!!
          document.body.appendChild(host);              // dodaje komponent do DOM (POZA ANGULAREM)
        }
      }
  */
}
