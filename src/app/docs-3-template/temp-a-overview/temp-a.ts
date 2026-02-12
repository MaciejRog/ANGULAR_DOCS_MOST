import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-temp-a',
  template: `
    <div>TEMP_A</div>
    <!-- {{ Math | json }} -->
  `,
  imports: [CommonModule],
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
  

  ##########################
  ##########################
  ##########################
  Expression Syntax (składnia wyrażeń) 
      język, którym Twój szablon porozumiewa się z klasą komponentu. 

  CO NIE DZIAŁA/ NIE MOŻNA ROBIĆ w szablonie:
    - BigInt np:  	1n
          stringi, number, boolen, object, array, null DZIAŁA 
    - globalne obiekty np: Number, NaN itp
      Angular szuka nazw zmiennych wyłącznie w klasie komponentu.
            NIE DZIAŁA: window, Math
                MOŻNA OBEJŚĆ PRZEZ - ALE LEPIEJ NIE
                export class MyComponent {
                  // Tworzysz lokalną referencję do globalnego obiektu
                  protected readonly Math = Math;
                  protected readonly window = window;
                }
            DZIAŁA  undefined
    - NIEKTRE OPERATORY
          All bitwise operators 	  &, &=, ~, |=, ^=, etc.
          Object destructuring 	    const { name } = person
          Array destructuring 	    const [firstItem] = items
          Comma operator 	          x = (x++, x)
          instanceof 	              car instanceof Automobile
          new 	                    new Car()
      POZOSTAŁE (dodanie, modulo, dzielenie, typeof, rest itp.. ) DZIAŁA
      UWAGA: dla optional chainingu       obj?.propA?.propB
            w JS zwróci       -> 'udefined'
            Angular zwróci    -> 'null'
    - DEKLARACJE:
      klas, funkcji zwykłych, arrow functions, zmiennych JS/TS
      możliwe tylko zmienne szablonowe
    
    UWAGA:
      zmienna w szablonie o tej samej nazwie co w klasie komponentu
      nadpiszę tą z klasy i będzie miała wartość taką jak ta z szablonu/template


  ##########################
  ##########################
  ##########################
  whitespace (białe znaki) 
      spacje, tabulatory i zanki nowej linii

  Domyślnie Angular usuwa nadmiarowe białe znaki.
    Spacje i znaki nowej linii pomiędzy elementami HTML są usuwane.
    Wielokrotne spacje wewnątrz tekstu są zamieniane na jedną spację.

  MOZNA Zachować je zmieniając dekorator 'preserveWhitespaces'
        @Component({
          selector: 'app-user-card',
          templateUrl: './user-card.component.html',
          preserveWhitespaces: true                       // <--- 
        })
        export class UserCardComponent {}
  
  jeśli bardzo musimy dodać więcej niż 1 spację to:
      - &nbsp;    -> <span>A &nbsp; </span>
      - string    -> <span>A {{ ' ' }} </span>
      - &ngsp;    -> <span>A &ngsp; </span>

  UWAGA:
     zostawić to w spokoju whitespace zwiększa rozmiar plików
     opóźnia ładowanie strony i tworzy niepotrzebne tekstowe nodes w DOM
  */
}
