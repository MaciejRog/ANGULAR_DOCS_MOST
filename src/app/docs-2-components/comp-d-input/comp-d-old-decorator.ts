import { ChangeDetectionStrategy, Component, Input, forwardRef } from '@angular/core';

@Component({
  selector: 'app-comp-d-old',
  template: `
    <p>INIT A = {{ initA }} <button (click)="updateA()">UPDATE</button></p>
    <p>INIT B = {{ initB }} <button (click)="updateB()">UPDATE</button></p>
    <p>INIT C = {{ initC }} <button (click)="updateC()">UPDATE</button></p>
    <app-comp-d-old-child [inputValA]="initA" [inputValBNewName]="initB" [inputValC]="initC" />
    <app-comp-d-old-child-b [nazwaInputa]="'abc'" [nowaNazwa]="'Ala_ma_kota'" [aliasB]="'piesek'" />
  `,
  imports: [forwardRef(() => CompDOldChild), forwardRef(() => CompDOldChildB)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompDOld {
  /*
  @INPUT -> mechanizm jak props w React
	REKOMENDOWANE nowe podejście z sygnałami
	*/
  initA = 11;
  initB = '  ABC. ';
  initC = 111;

  updateA = () => {
    this.initA += 1;
  };
  updateB = () => {
    this.initB += '-';
  };
  updateC = () => {
    this.initC += 1;
  };
}

// ###############################
// ############################### @Input decorator
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-d-old-child',
  template: `
    <p>@INPUT</p>
    <p>inputValA = {{ inputValA }}</p>
    <p>inputValB = {{ inputValB }}</p>
    <p>inputValC = {{ inputValC }}</p>
  `,
  // ChangeDetectionStrategy nie wpływa na odświeżanie (zmiana. u rodzica DOWOLNA odświeża dziecko)
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompDOldChild {
  /*
	klasyczny input z dekoratorem
	<app-comp-d-old-child [inputValA]="11" />
	*/
  @Input() inputValA = 1;

  /*
	można podać do dekoratora obiekt konfiguracyjny, a w nim:
			- required 		-> czy wymagane
			- alias 			-> pod jaką nazwą można ustawić wartość
			- transform		-> modyfikacja wartość wejściowej
	<app-comp-d-old-child [inputValBNewName]="'ABC'" />
	*/
  @Input({
    required: true, //
    alias: 'inputValBNewName',
    transform: trimValue,
  })
  inputValB = 'b';

  /*
	można określić prop jako getter i/lub setter (MOZE być tylko 1 z nich lub 2 )
	UWAGA NIEZALECANE
			używać 'transform'
	*/
  @Input()
  get inputValC(): number {
    return this.privateVal;
  }
  set inputValC(newVal: number) {
    this.privateVal = newVal;
  }
  private privateVal: number = 0;
}

function trimValue(value: string): string {
  return value.trim();
}

// ###############################
// ############################### inputs @Component dekorator field
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-d-old-child-b',
  template: `
    <p>@COMPONENT INPUTS</p>
    <p>{{ nazwaInputa }}</p>
    <p>{{ nazwaInputaB }}</p>
    <p>{{ nazwa }}</p>
  `,
  /*
	inputy można też definiować w konstruktorze, jako
			- string 	
			- obiekt
				{
					name: string;
					alias?: string | undefined;
					required?: boolean | undefined;
					transform?: ((value: any) => any) | undefined;
				}
	ale już jako pola muszą istnieć w klasie !!!
	*/
  inputs: [
    //
    'nazwaInputa',
    'nazwaInputaB: aliasB',
    {
      name: 'nazwa',
      alias: 'nowaNazwa',
      required: true,
      transform: (val: string): string => {
        return val + '1';
      },
    },
  ],
})
export class CompDOldChildB {
  nazwaInputa = '';
  nazwaInputaB = '';
  nazwa = '';
}
