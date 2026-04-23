import { Component, Input, forwardRef } from '@angular/core';

@Component({
  selector: 'app-comp-d-old',
  imports: [
    forwardRef(() => CompDOld_DecoratorInput), //
    forwardRef(() => CompDOld_ConstructorInputs),
  ],
  template: `
    <!--  -->
    <CompDOld_DecoratorInput
      [inputAge]="30"
      [input-name-alias]="'     Agnieszka.     '"
      [inputHidden]="40"
    />
    <br />
    <hr />

    <!--  -->
    <CompDOld_ConstructorInputs
      [inputAge]="25"
      [input-name-alias]="'nowe-imie'"
      [input-transform-alias]="'Maciek'"
    />
    <br />
    <hr />
  `,
})
export class CompDOld {}

// ###############################
// ############################### stare podejście do 'inputów' jeszcze przed sygnałami
// ############################### dekorator @Input
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompDOld_DecoratorInput',
  imports: [],
  template: `
    <div>
      <p>CompDOld_DecoratorInput</p>
      <br />

      <div>input_age = {{ this.inputAge }}</div>
      <div>input_name = '{{ this.inputName }}'</div>

      <div>input_hidden = {{ this.inputHidden }}</div>
    </div>
  `,
})
export class CompDOld_DecoratorInput {
  /*
  dekorator @Input
  mechanizm jak props w React, rekomendowane nowe podejście z sygnałami 'input()' i 'model()'

  dekorator '@Input()' analogiczny w działaniu jak sygnał 'input()'
  */
  @Input()
  inputAge = 20;
  /*
  konfiguracja dekoratora '@Input()'
  poprzez obiekt konfiguracyjny, a w nim możliwe właściwości:
  - required 		-> czy podanie wartości property jest wymagane
  - alias 			-> pod jaką nazwą można ustawić wartość property <app-comp [input-name-alias]="'napis'" />
  - transform		-> modyfikacja wartość wejściowej property na wartość, która ma mieć pole komponentu
  */
  @Input({
    required: true, //
    alias: 'input-name-alias',
    transform: trimValue,
  })
  inputName = 'b';

  /*
  @Input wraz z 'get' i 'set'
  dekoratorem można określić getter i/lub setter dla pola w klasie komponentu
	UWAGA
  konstrukcja ta jest niezalecana, może pełnić bardzo podobną rolę jak 'transform'
  ale i tak preferowane jest użycie 'transform' do modyfikacji wartości przekazanej w 'property'
	*/
  @Input()
  get inputHidden(): number {
    return this.privateField;
  }
  set inputHidden(newVal: number) {
    this.privateField = newVal;
  }
  private privateField: number = 0;
}

function trimValue(value: string): string {
  return value.trim();
}

// ###############################
// ############################### Inputy możemy też definiować z poziomu dekoratora komponentu
// ############################### constructor inputs
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompDOld_ConstructorInputs',
  imports: [],
  template: `
    <div>
      <p>CompDOld_ConstructorInputs</p>
      <br />

      <div>input_age = {{ this.inputAge }}</div>
      <div>input_name = '{{ this.inputName }}'</div>

      <div>input_transform= {{ this.inputTransform }}</div>
    </div>
  `,
  inputs: [
    'inputAge', //
    'inputName: input-name-alias',
    {
      name: 'inputTransform',
      alias: 'input-transform-alias',
      required: true,
      transform: modifyVal,
    },
  ],
})
export class CompDOld_ConstructorInputs {
  /*
  inputy możemy też zdefiniować wewnątrz dekoratora komponentu:
  'inputAge'                          <- definiuje 'property' 'inputAge'
  'inputName: input-name-alias',      <- definiuje 'property' 'inputName' o aliasie 'input-name-alias'
  {
    name: 'inputTransform',           <- definiuje 'property' 'inputTransform'
    alias: 'input-transform-alias',   <- alias dla 'inputTransform'
    required: true,                   <- 'property' 'inputTransform' jest wymagane 
    transform: modifyVal,             <- funkcja transform (modyfikacja wartości przekazanej do 'property')
  }

  każdy input zdefiniowany w dekoratorze musi mieć zmienną w klasie o nazwie jak zdefiniowane 'property'
  */
  inputAge = 10;
  inputName = '';
  inputTransform = ''; // CIEKAWOSTKA input jest 'required', ale ma wartość domyślną
}

function modifyVal(val: string): string {
  return val + '_dodane1';
}
