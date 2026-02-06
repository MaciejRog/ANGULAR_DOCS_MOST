import { Pipe, PipeTransform } from '@angular/core';

/*
możemy stworzyć własny PIPE, potrzebujemy:
		- dekorator @Pipe
		- funkcję 'transform' z interfejsu 'PipeTransform'
*/
@Pipe({
  name: 'customPipeA', // nazwa pipe'a pisac CamelCasem
  // pure: false,
  // UWAGA
  //			można oznaczyc pipe jako 'pure: false,'
  // 			wtedy wykrywa mutację w obiektach i tablicach
  //			NIGDY TEGO NIE UŻYWAĆ, zabija wydajność
  //			+ nazwę tego pipe'a dodajemy 'Inpure'
})
//					a nazwę klasy pipe'a PascalCase (by pokrywała się z name tylko z wielkiej litery)
export class CustomPipeA implements PipeTransform {
  /**
   * Metoda transform
   * @param value - wartość przed potokiem (wejście) po lewej od pipe
   * @param sufix - argument przekazany po dwukropku (opcjonalny)
   */
  transform(value: string, sufix: string = ''): string {
    // <p>{{ zmienna1 | customPipeA: 'sufix' }}</p>

    // value -> 'zmienna1'   wartość jaką przekażamy z lewej strony pipe'a (WYMAGANE)
    // sufix -> 'sufix'      argument po prawej -> OPCJONALNE nie musi być w transform

    let newValue = value;
    if (sufix !== '') {
      newValue = `${value}  ${sufix}`;
    }
    return newValue;
  }
}
