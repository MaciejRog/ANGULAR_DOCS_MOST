import {
  booleanAttribute,
  Component,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-comp-d',
  template: `
    <app-comp-dd
      [inputName]="50"
      [inputReuired]="100"
      [inputConfigTransform]="'abc'"
      [transformBuildBool]="false"
      [transformBuildNumber]="false"
      [nazwaDoStosowania]="1"
    />
    <app-comp-dd-model />
    <app-comp-dd-model-two-way-parent />
  `,
  imports: [
    forwardRef(() => CompDD),
    forwardRef(() => CompDDModel),
    forwardRef(() => CompDDModelTwoWayParent),
  ],
})
export class CompD {
  /*
  INPUT -> mechanizm jak props w React

  właściwści inputów:
    - zmiana inputów nie możliwe w RUN_TIME 
    - input można używać w Componentach i Dyrektywach
    - przy dziedziczeniu komponentu jego inputy przechodzą do dziecka 
    - nazwy inputów są case-sensitive 
    - nowoczesne inputy są sygnałami
	*/
}

// ###############################
// ############################### input()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'app-comp-dd',
  template: `
    <div>
      <p>Component DD INPUT</p>
      <br />
      <p>inputName = {{ inputName() }}</p>
      <p>inputB = {{ inputB() }}</p>
      <p>inputC = {{ inputC() }}</p>
      <p>computedValue = {{ computedValue() }}</p>
      <br />
      <p>TRANSFORM CONFIG</p>
      <p>inputConfigTransform = {{ inputConfigTransform() }}</p>
      <p>transformBuildBool = {{ transformBuildBool() }}</p>
      <p>transformBuildNumber = {{ transformBuildNumber() }}</p>
    </div>
  `,
})
export class CompDD {
  /*
  określamy zmienną jako 'input' z domyślną wartością '0'
  przypisanie wartości za pomocą nazwy 'inputName'
  <app-comp-dd [inputName]="50" />
  */
  inputName = input(0);
  inputB = input(1);
  // inputC ma TYP <number | undefined>
  inputC = input<number>();

  computedValue = computed(() => {
    // wartość sygnału z input jest 'read-only'
    const inputNameVal = this.inputName();
    return `KOMPUTED = ${inputNameVal}`;
  });

  /*
  required
      - podanie wartość inputu jest wymagane  <app-comp-dd [inputReuired]="100" /> 
      - nie posiada wartość undefined inicjalnie
      - nie można podać wartości inicjalnej (rodzic MUSI ją nadać)
   */
  inputReuired = input.required<number>();
  // inputReuired1 = input.required<number>(10);  // BŁĄD - required nie może mieć inicjalnej wartości

  /*
  jako 2 argument input przyjmuje obiekt konfiguracji, a w nim funkcje 'transform'
      - przy zmianie wartości input, zostanie uruchomiona funkcja zmieniająca jej wartość
    
  poniżej np: przy ustawieniu wartości 'input inputConfigTransform' na 100 
  ostateczna wartość będzie 2 razy większa czyli 200
  UWAGA transformacja nie dotyczy wartości inicjalnej !!!!

  funkcje stosowane w 'transform' zawsze powinny być PURE !!!

  UWAGA!!!
    typ 'inputConfigTransform' określa funkcja użyta w 'transform' np poniżej:
    inputConfigTransform może przyjąć 'number' 'string' 'undefined', ale zawsze zwróci 'number'
      [inputConfigTransform]="10"     // number
      [inputConfigTransform]="'abc'"  // string
  */
  transformDouble = (value: number | string | undefined): number => {
    if (value === undefined) {
      return 0;
    } else if (typeof value === 'string') {
      return 2 * value.length;
    } else {
      return 2 * value;
    }
  };
  inputConfigTransform = input(100, {
    transform: this.transformDouble,
  });

  /*
  2 wbudowane funkcje transform:
    - zmiana wartość na boolean | booleanAttribute
          [transformBuildBool]="null"         | false
          [transformBuildBool]="undefined"    | false
          [transformBuildBool]="0"            | true    // DZIWNE
          [transformBuildBool]="1"            | true
          [transformBuildBool]="''"           | true    // DZIWNE
          [transformBuildBool]="'true'"       | true
          [transformBuildBool]="'false'"      | false   // DZIWNE
          [transformBuildBool]="[]"           | true
          [transformBuildBool]="{}"           | true
    - zmiana wartość na number | numberAttribute
          [transformBuildNumber]="0"          | 0
          [transformBuildNumber]="1"          | 1
          [transformBuildNumber]="'100'"      | 100
          [transformBuildNumber]="'abc'"      | NaN
          [transformBuildNumber]="[]"         | NaN
          [transformBuildNumber]="{}"         | NaN
          [transformBuildNumber]="false"      | NaN
  */
  transformBuildBool = input(false, { transform: booleanAttribute });
  transformBuildNumber = input(1, { transform: numberAttribute });

  /*
  ALIAS inputu, zmiania nazwą atrybutu pod którym należy nadać wartość
  UNIKAĆ STOSOWANIA

  bez aliastu byłoby by
        <app-comp-dd [aliasInput]="1" />
  po ALIASIE JEST
        <app-comp-dd [nazwaDoStosowania]="1" />
  */
  aliasInput = input(0, { alias: 'nazwaDoStosowania' });
}

// ###############################
// ############################### model()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'app-comp-dd-model',
  template: `
    <div>
      <br />
      <p>Component DD MODEL</p>
      <p>NAME SINGAL {{ nameSignal() }}</p>
      <button (click)="updateNameSignal()">updateNameSignal</button>
      <app-comp-dd-model-child [(nameModel)]="nameSignal" />
    </div>
  `,
  imports: [forwardRef(() => CompDDModelChild)],
})
export class CompDDModel {
  /*
  model()

  jeśli input() to list, który możesz tylko przeczytać, to model() jest jak współdzielony notatnik. 
  Możesz w nim pisać, Twój rodzic może w nim pisać, a oboje zawsze widzicie tę samą, aktualną wersję.

  2 WAY DATA BINDING
  specjalny rodzaj sygnału, który działa w 2 kierunkach, pozwala:
    - rodzicowi ustawić wartość zmiennej komponentu
    - komponentowi zmienić wartość i powiadomić rodzica
  
  
  modelReuired = model.required<number>();
  modelAliast = model(0, { alias: 'nazwaDoStosowania' });
  UWAGA
      w modelach nie ma 'transform' !!! NIE DZIAŁA 
  */

  /*
  w komponencie RODZICA jest SYGNAŁ !!!
  i przekazujemy go do DZIECKA w podwójnych nawiasach
  <app-comp-dd-model-child [(nameModel)]="nameSignal" />
  każdy update 'nameSignal' spowoduje przesłanie danych do dziecka
  UWAGA
      stosujemy 'nameSignal' czyli instancji sygnału
      a nie wartości 'nameSignal()'
  */
  nameSignal = signal(10);
  updateNameSignal = () => {
    this.nameSignal.update((prev) => {
      return prev + 1;
    });
  };
}

@Component({
  selector: 'app-comp-dd-model-child',
  template: `
    <div>
      <br />
      <p>Component DD MODEL Child</p>
      <p>NAME MODEL {{ nameModel() }}</p>
      <button (click)="updateNameModel()">updateNameModel</button>
    </div>
  `,
})
export class CompDDModelChild {
  /*
  w komponencie DZIECKA tworzymy MODEL input (writable signal)
  każdy update MODELU przesyła dane i aktualizuje SYGNAŁ u RODZICA
   */
  nameModel = model(1);
  updateNameModel = () => {
    this.nameModel.update((prev) => {
      return prev + 1;
    });
  };

  // modelReuired = model.required<number>();
  // modelAliast = model(0, { alias: 'nazwaDoStosowania' });
}

// ###############################
// ############################### Two-way binding
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
/*

konstrukcja [( ... )] tworzy 2-way data binding 
  
<app-comp [(valueModel)]="value" />

to automatycznie tworzy input + output więc konstrukcja 
<app-comp [(valueModel)]="value" />
odpowiada
<app-comp (valueModel)="value" (valueModelChange)="handleChange()"/>

co ciekawe pod event  'valueModelChange' czyli => nazwaModelu + 'Change'
możemy się podpiać, wywołany na 'set' lub 'update' modelu
*/
@Component({
  selector: 'app-comp-dd-model-two-way-parent',
  template: `
    <div>
      <br />
      <p>Component 2-WAY PARENT</p>
      <p>value {{ value }}</p>
      <!-- 
     
      -->
      <app-comp-dd-model-two-way-child [(valueModel)]="value" (valueModelChange)="handleChange()" />
    </div>
  `,
  imports: [forwardRef(() => CompDDModelTwoWayChild)],
})
export class CompDDModelTwoWayParent {
  /*
  do modelu można przekazać też zwykła zmienną, nie musi być reaktywna !
  */
  protected value = 11;

  handleChange = () => {
    console.warn(`TO JEST OUTPUT HANDLER`);
  };
}
@Component({
  selector: 'app-comp-dd-model-two-way-child',
  template: `
    <div>
      <br />
      <p>Component 2-WAY CHILD</p>
      <p>value model {{ valueModel() }}</p>
      <button (click)="updateValueModel()">UPDATE VALUE MODEL</button>
    </div>
  `,
})
export class CompDDModelTwoWayChild {
  valueModel = model<number>(1);
  updateValueModel = () => {
    this.valueModel.update((prev) => prev + 1);
  };
}

/*
input() vs model()

  Cecha	                input()	                                 model()
--------------------------------------------------------------------------------------------------
Modyfikacja	    Tylko do odczytu (Read-only).	            Można zmieniać (.set, .update).
Komunikacja	    Jednokierunkowa (Rodzic -> Dziecko).	    Dwukierunkowa (Rodzic <-> Dziecko).
Zastosowanie	  Dane do wyświetlenia, konfiguracja.	      Komponenty formularzowe, modale, filtry.
Mechanizm	      Tylko sygnał wejściowy.	                  Sygnał wejściowy + automatyczny Output.

Nazywająć inputy 
    - unikać nazw które mogą kolidować z atrybutami DOM
    - nie ma potrzeby dodawać prefixów
*/
