import { Component } from '@angular/core';

@Component({
  selector: 'app-temp-a',
  template: ` <div>TEMP_A</div> `,
})
export class TempA {
  /*
  template -> szablon

  służy do definiowania DOM (HTMLa komponentu)
  bazuje na HTML, ale ma dodane bindowania, eventy, zmienne itp
  kompilator Angulara czyta te szablony i zamienia
  w bardzo wydajny kod JavaScript, który aktualizuje stronę.

  ROŻNICE SZABLON vs CZYSTY HTML:
      - komentarze w szablonie, nie trafią do HTML'a
      - komponenty mogą byc samo zamykalne <komponent /> lub otwarte <komponent></komponent>
      - bindowanie:
          - [atrybutow]
          - (eventow)
      - znak '@' LUB '&commat;' LUB '&#64;'
          wchodzi w tryb dynamiczny np: 'control flow'
      - ignoruje 'whitespace'
      - tag <script> JEST IGNOROWANY !!!
  */
}
