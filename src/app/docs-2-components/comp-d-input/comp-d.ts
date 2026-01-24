import { Component, computed, forwardRef, input } from '@angular/core';

@Component({
  selector: 'app-comp-d',
  template: ` <app-comp-dd [inputName]="50" [inputReuired]="100" /> `,
  imports: [forwardRef(() => CompDD)],
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
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'app-comp-dd',
  template: `
    <div>
      <p>Component DD</p>
      <p>inputName = {{ inputName() }}</p>
      <p>inputB = {{ inputB() }}</p>
      <p>inputC = {{ inputC() }}</p>
      <p>computedValue = {{ computedValue() }}</p>
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
   */
  inputReuired = input.required<number>();
  // inputReuired1 = input.required<number>(10);  // BŁĄD - required nie może mieć inicjalnej wartości
}
