import { Component, forwardRef } from '@angular/core';

@Component({
  selector: 'app-comp-b',
  imports: [
    forwardRef(() => CompBBType),
    forwardRef(() => CompBBAttr),
    forwardRef(() => CompBBNot),
    forwardRef(() => CompBBMulti),
  ],
  template: `<div>
    <app-comp-bb-type></app-comp-bb-type>
    <app-comp-bb-type />
    <br />
    <hr />
    <!--  -->
    <div app-comp-bb-attr></div>
    <br />
    <hr />
    <!--  -->
    <div class="app-comp-bb-class"></div>
    <br />
    <hr />
    <!--  -->
    <!-- tutaj będzie 'CompBBNot'  -->
    <div app-not>APP-NOT</div>
    <br />
    <!-- tutaj NIE będzie 'CompBBNot' -->
    <p app-not class="abc">NOT APP-NOT</p>
    <br />
    <hr />
    <!--  -->
    <p app-multi-1></p>
    <p app-multi-2></p>
    <br />
    <hr />
  </div>`,
})
export class CompB {
  /*
  selektor to lokalizacja, która mówi Angularowi: 
  "wszędzie w kodzie HTML gdzie znajdziesz tę nazwę, wstaw instancję mojego komponentu”

  UWAGA do selektorów:
    - pozwala osadzić komponent w innym    <app-comp-b></app-comp-b>
    - 1 selektor dla 1 komponentu | jeśli więcej komponentów niż 1 ma ten sam selektor to Angular zwraca błąd 
    - caseSensitive (rozrónia duże i małe litery)
    - najlepiej kebab-case      czyli-taki-tekst-malej-litery
    - nigdy nie używać selektorów z atrybutem 'id' (klasa może miec wiele instacji, a 'id' z definicji ma 1-ną )
    - zawsze wybrać prefix np:
        - app (domyślny), yt, itp...
        - UWAGA nigdy nie 'ng' to jest zarezerowane dla angularowych komponentów
    - preferować 'Type selector' -> tagi html'a
      
  rodzaje selektorów:
  - Type selector 	       -> jako tag HTML 	      -> np:  profile-photo
  - Attribute selector 	   -> atrybut HTML          -> np: [dropzone]  [type="reset"]  
  - Class selector 	       -> klasa CSS 	          -> .menu-item
  - pseudo class           -> Psuedoklasy CSS       -> :not()
  */
}

// ###############################
// ############################### selector: 'app-comp-bb-type',  ->  <app-comp-bb-type />
// ############################### SELEKTOR TYPE -> TAG HTML
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'app-comp-bb-type',
  template: ` <div>CompBBType</div> `,
})
export class CompBBType {
  /*
  Type selector -> tag HTML (może być i najlpeiej by był nowym wymyślonym tagiem, nie 'div' choć może i nim być)

  SELEKTOR:       'app-comp-bb-type',
  ZASTOSOWANIE:   <app-comp-bb-type></app-comp-bb-type>
                  <app-comp-bb-type />
  */
}

// ###############################
// ############################### selector: '[app-comp-bb-attr]',  ->  <div app-comp-bb-attr></div>
// ############################### SELEKTOR ATTRIBUTE -> atrybut tagów html
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: '[app-comp-bb-attr]',
  template: ` <div>CompBBAttr</div> `,
})
export class CompBBAttr {
  /*
  Attribute selector -> powoduje zmianę elementu, który posiada podany atrybut na 
                        instancję klasy o podanym selektorze
                        (często używane przy dyrektywach, ale technicznie możliwe też w komponentach).

  SELEKTOR:       '[app-comp-bb-attr]',
  ZASTOSOWANIE:   <div app-comp-bb-attr></div>

  SELEKTOR:       'button[type="reset"]',
  ZASTOSOWANIE:   <button type="reset"></button>

  UWAGA - można łączyć np. konkretny tag + konkretny atrybut lub nawet konkretna wartość aatrybutu
          selector: 'button[app-special-btn]',          <- <button app-special-btn></button>
          selector: 'button[type="reset"]',             <- <button type="reset"></button>
  */
}

// ###############################
// ############################### selector: '.app-comp-bb-class',  ->   <div class="app-comp-bb-class"></div>
// ############################### CLASS SELECTOR -> posiadane przez tag html klasy CSS
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: '.app-comp-bb-class',
  template: ` <div>CompBBClass</div> `,
})
export class CompBBClass {
  /*
  UWAGA 
  NIEZALECANE STOSOWANIE!!!

  class selector -> powoduje zmianę elementu, który posiada konkretną klasę CSS

  SELEKTOR:       '.app-comp-bb-class',
  ZASTOSOWANIE:   <div class="app-comp-bb-class"></div>
  */
}

// ###############################
// ############################### selector: '[app-not]:not(p)',  ->  <div app-not>NOT NOT ABC</div>
// ############################### pseudoclass selector
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  // selector: '[app-not]:not(.abc)',
  selector: '[app-not]:not(p)',
  template: ` <div>CompBBNot</div> `,
})
export class CompBBNot {
  /*
  pseudoclass selector 
  jedynie działa pseudoklasa  -> :not  
  reszta pseudoklas nie działa

  SELEKTOR:       '[app-not]:not(.abc)',                  -> wszystko z atrybutem 'app-not', ale bez klasy 'abc'
  ZASTOSOWANIE:   <p app-not>NOT NOT ABC</p>          

  SELEKTOR:       '[app-not]:not(p)',                     -> wszystko z atrybutem 'app-not', ale bez tagu 'p'
  ZASTOSOWANIE:   <div app-not class="abc">NOT ABC</div>      

  */
}

// ###############################
// ############################### WIELE SELEKTOROW dla 1-go komponentu
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: '[app-multi-1], [app-multi-2]',
  template: ` <div>CompBBMutli</div> `,
})
export class CompBBMulti {
  /*
  komponent może mieć wiele selectorów, odzielonych przecinkami 

  SELEKTOR:         '[app-multi-1], [app-multi-2]',   -> 2 selektory atrybutowe 
  ZASTOSOWANIE:     <p app-multi-1></p>               -> atrybut 1
                    <p app-multi-2></p>               -> atrybut 2
  */
}
