import {
  afterEveryRender,
  booleanAttribute,
  ChangeDetectionStrategy,
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
  imports: [
    forwardRef(() => CompD_Input), //
    forwardRef(() => CompD_Model),
  ],
  template: `
    <!--  -->
    <CompD_Input />
    <br />
    <hr />

    <!--  -->
    <CompD_Model />
    <br />
    <hr />
  `,
})
export class CompD {
  /*
  input properties
  przekazywanie danych między komponentami -> mechanizm jak props w React'cie

  właściwści input properties:
    - zmiana (dodanie, usunięcie) nie możliwa w run time (podczas działania aplikacji) 
    - można używać w Componentach i Dyrektywach
    - przy dziedziczeniu są dziedziczone
    - nazwy są case-sensitive 
    - nowoczesne inputy są sygnałami
  */
}

// ###############################
// ############################### PRZEKAZYWANIE DANYCH DO KOMPONENTU od rodzica do dziecka
// ############################### input()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompD_Input',
  imports: [
    forwardRef(() => CompD_InputBase),
    forwardRef(() => CompD_InputConfig),
    forwardRef(() => CompD_InputChangeDetection),
  ],
  template: `
    <div>
      <p>CompD_Input</p>
      <br />
      <br />

      <!--  -->
      <CompD_InputBase
        [inputAge]="inputBaseAge()"
        [inputAdress]="inputBaseAdress"
        inputRequired="Wartość"
        [inputExclamationMark]="{ name: 'Maciej' }"
      />
      <br />
      <br />

      <!--  -->
      <div>
        <div>input ChD object = {{ this.inputChangeDetectionObject.name }}</div>
        <div>
          <button (click)="updateInputChangeDetectionObjectVal()">update_val</button>
          <button (click)="updateInputChangeDetectionObjectRef()">update_ref</button>
        </div>
      </div>
      <CompD_InputChangeDetection [propertyObject]="this.inputChangeDetectionObject" />
      <br />
      <br />

      <!--  -->
      <CompD_InputConfig
        [inputConfigTransform]="'Agulka'"
        [transformBuildBool]="{}"
        [transformBuildNumber]="'1234'"
        [nazwaDoStosowania]="192821"
      />
      <br />
      <br />
    </div>
  `,
})
export class CompD_Input {
  /*
   */
  inputBaseAge = signal(32);
  inputBaseAdress = { street: 'Różana' };

  inputChangeDetectionObject = { name: 'Ma_kota' };
  updateInputChangeDetectionObjectVal = () => {
    this.inputChangeDetectionObject.name += '1';
  };
  updateInputChangeDetectionObjectRef = () => {
    this.inputChangeDetectionObject = {
      ...this.inputChangeDetectionObject,
      name: this.inputChangeDetectionObject.name + '2',
    };
  };
}

@Component({
  selector: 'CompD_InputBase',
  imports: [],
  template: `
    <div>
      <p>CompD_InputBase</p>

      <div>name = {{ inputName() }}</div>
      <div>age = {{ inputAge() }}</div>

      <div>adres = {{ inputAdress()?.street }}</div>
      <div>ex_mark = {{ inputExclamationMark()!.name }}</div>

      <div>optional = {{ inputOptional() }}</div>
      <div>required = {{ inputRequired() }}</div>
    </div>
  `,
})
export class CompD_InputBase {
  /*
  input properties, możemy przekazać za pomoca sygnału 'input()'
  wartość sygnału 'input()' jest 'read-only', nie można jej ustawić przez set/update
  można określić wartość domyślną, która ma zastosowanie gdy nie przekazano wartości

  przekazanie wartości dla properties na instancji komponentu
  <CompD_InputBase
    inputName="Agnieszka"                           // przekazano string 'Agnieszka'
    [inputAge]="inputBaseAge()"                     // property binding, wartość 'inputAge' jak sygnału 'inputBaseAge'
    [inputAdress]="inputBaseAdress"                 // property binding do zwykłej zmienej w klasie
    inputRequired="Wartość"                         // brak tego property Angular rzuci błąd 
    [inputExclamationMark]="{ name: 'Maciej' }"     // property binding do obiektu ad-hoc
  />
  */
  /*
  wartość domyślna - [OPCJONALNE] ma zastosowania gdy instancja komponentu nie posiada przekazania wartości dla property
  input('Aga')    -> domyślnie 'Aga', wartość przekazana w property nadpiszą tą wartośc
  input(30)       -> domyślnie 30
  */
  inputName = input('Aga');
  inputAge = input(30);
  /*
  input jest generyczny, 
  domyślnie rodzaj wartości, który posiada jest taki jak typ wartości domyślnej
      input('Aga')                      -> jest typu  'InputSignal<string>'
  ale input nie musi mieć wartości domyślnej
      input()                           -> jest typu 'InputSignal<unknown>' 
  typ można określić jako generyczny
      input<{ street: string }>()       -> jest typu 'InputSignal<{street: string;} | undefined>'
                                           'undefined' zostało dodane bo nie ma wartości domyślnej
  UWAGA
  dostęp do 'input', które mogą być 'undefined' z poziomu szablonu poprzez '?' lub '!'
      inputAdress()?.street                  <- 
      inputExclamationMark()!.name           <- znak '!' zakład, że wartośc nie może być 'undefined' lub 'null'       
                                                trochę jakby zakładało, że wartość jest wymagana                       
  */
  inputAdress = input<{ street: string }>();
  inputExclamationMark = input<{ name: string }>();
  /*
  inputy opcjonalne vs wymagane(required)
  przekazanie wartości dla properties na instancji komponentu, dla
      input();            -> jest OPCJONALNE
      input.required()    -> jest WYMAGANE, brak wartości dla takiego properties rzuci błędem aplikacji
                             typ sygnału nie zawiera 'undefined' Angular wie że będzie wartość
                             UWAGA      
                             input.required nie może mieć inicjalnej wartości 
                             np: 'input.required(10)' -> spowoduje błąd kompilacji
  <CompD_InputBase />                                                 -> BŁED, brak wartości dla properies z '.required'
  <CompD_InputBase inputOptional="VAL_1" />                           -> BŁED, brak wartości dla properies z '.required'
  <CompD_InputBase inputRequired="VAL_2" />                           -> OK 
  <CompD_InputBase inputRequired="VAL_2" inputOptional="VAL_1"/>      -> OK 
  */
  inputOptional = input();
  inputRequired = input.required();
}

@Component({
  selector: 'CompD_InputChangeDetection',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <p>CompD_InputChangeDetection</p>

      <div>input_object = {{ this.propertyObject().name }}</div>
    </div>
  `,
})
export class CompD_InputChangeDetection {
  /*
  odbierając wartość dla 'inputów' komponent może się przerenderować
  aby to się wykonało musi zostać zarejestrowana zmiana
  domyślnie każda zmiana dla inputów wywoła rerender, ale możemy ustawić 
      changeDetection: ChangeDetectionStrategy.OnPush,
  co włącza rygorystyczne spojrzenie na to kiedy jest zmiana
  teraz np zmian wartości na input 'propertyObject' musi dotykać samej referencji obiektu 
  zmiana samej wartości 'name' obiektu inputu nie spowoduje rerenderu komponentu
   */
  propertyObject = input.required<{ name: string }>();

  constructor() {
    afterEveryRender(() => {
      console.log('CompD_InputBase rerendered');
    });
  }
}

@Component({
  selector: 'CompD_InputConfig',
  imports: [],
  template: `
    <div>
      <p>CompD_InputConfig</p>

      <div>input_transform = {{ this.inputConfigTransform() }}</div>
      <br />

      <div>input_build_transform_bool = {{ this.transformBuildBool() }}</div>
      <div>input_build_transform_number = {{ this.transformBuildNumber() }}</div>
      <br />

      <div>input_alias = {{ this.aliasInput() }}</div>
      <br />
    </div>
  `,
})
export class CompD_InputConfig {
  /*
  transformacja
  2gim argumentem dla 'input' jest obiekt konfiguracyjny, a w nim 'transform', czyli
  funkcja, która przy zmianie wartości 'inputa', zostanie uruchomiona by
  zmienić/zmapować wartość przekazaną do 'inputa' i zwrócić nową wartość tego 'inputa'
  UWAGA
  - transformacja nie dotyczy wartości inicjalnej
  - funkcje stosowane w 'transform' zawsze powinny być PURE
  - typ wartości, którą można nadać na 'property' określa argument 'transform', więc np:
        poperty 'inputConfigTransform'            -> akceptuje 'string' i 'number' (oba poniższe są OK)
                                                     <CompD_InputConfig [inputConfigTransform]="123" />
                                                     <CompD_InputConfig [inputConfigTransform]="'Agulka'" />
        sygnał 'this.inputConfigTransform()'      -> jego wartość jest 'number'
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
  inputConfigTransform = input(
    100, //
    {
      transform: this.transformDouble,
    },
  );

  /*
  w abgularze są 2 wbudowane funkcje do transform:
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
  ALIAS (używać ostrożnie i ogólnie niezalecane)
  określa nazwę dla 'property', pod którą trzeba nada wartość 'inputowie'
  bez aliastu
        <comp [aliasInput]="192821" />
  z alsiasem
        <comp [nazwaDoStosowania]="192821" />
  */
  aliasInput = input(0, { alias: 'nazwaDoStosowania' });
}

// ###############################
// ############################### PRZEKAZYWANIE DANYCH DO KOMPONENTU w 2wie strony
// ############################### model() + 2-way binding
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompD_Model',
  imports: [forwardRef(() => CompD_ModelProperty)],
  template: `
    <div>
      <p>CompD_Model</p>
      <br />
      <br />

      <div>
        <div>parent_val = {{ this.parentVal() }}</div>
        <div>
          <button (click)="updateParentVal()">update_parent_val</button>
        </div>
      </div>
      <CompD_ModelProperty
        [(childVal)]="this.parentVal"
        (childValChange)="listenToChildModelChange($event)"
      />
    </div>
  `,
})
export class CompD_Model {
  /*
  2-way binding
  konstrukcja [( ... )] tworzy 2-way data binding 
    
  <app-comp [(valueModel)]="value" />
  odpowiada
  <app-comp (valueModel)="value" (valueModelChange)="handleChange()"/>

  gdzie nazwa eventu 'valueModelChange' to 'nazwaModelu' + 'Change'
  i możemy nasłuchiwać zmian tego eventu
   */
  parentVal = signal(100);
  updateParentVal = () => {
    this.parentVal.update((prev) => prev + 1);
  };

  // bind na event '(childValChange)' tylko w ramach ciekawostki, nie wymagane przez 'model()'
  listenToChildModelChange = (childVal: number) => {
    console.warn('model child chage | childVal = ', childVal);
  };
}

@Component({
  selector: 'CompD_ModelProperty',
  imports: [],
  template: `
    <div>
      <p>CompD_ModelProperty</p>

      <div>
        <div>child_val = {{ this.childVal() }}</div>
        <div>
          <button (click)="updateChildVal()">update_child_val</button>
        </div>
      </div>
    </div>
  `,
})
export class CompD_ModelProperty {
  /*
  model() -> taki 'input()' tylko z motodą set/update
  'input()' pozwala tylko odczytać dane z rodzica, ale nie ustawiać je
  'model()' pozwala ustawiać wartość (set/update)
            ustawić może lokalnie na [] binding -> zmiana w child, nie ustawia parent, ale zmiana parent ustawia child
            lub na 2-way data binding [()]      -> zmiana w child ustawia parent i zmiana w parent ustawia child

  UWAGA 
  aby zmiana wartości 'child' poinformowała 'rodzica', wymagany jest 2-way data bidning
  <CompD_ModelProperty [(childVal)]="this.parentVal" />
  czyli dwa nawiasy na property:  [] -> do wartości, () -> do eventu na set/update
  oraz 'his.parentVal' to sygnał sam w sobie a nie jego wartość 'his.parentVal()'
  
  UWAGA - możliwe opcje dla modelu
  - model.required<number>();                     <- wymagane property (nie może mieć wartości domyślnej)
  - model<number>();                              <- typ generyczny
  - model(123);                                   <- wartość domyślna
  - model(0, { alias: 'nazwaDoStosowania' });     <- alias
  - BRAK 'transform', 'model()' tego NIE obsluguje
  */
  childVal = model.required<number>();
  updateChildVal = () => {
    this.childVal.update((prev) => prev + 1);
  };
}
