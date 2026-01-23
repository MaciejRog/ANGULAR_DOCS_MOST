import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-comp-bb-type',
  template: ` <div>CompBBType</div> `,
})
export class CompBBType {
  /*
  Type selector 
  nowa, niestandardowa metka HTML (custom tag).

  selector: 'app-comp-bb-type',
            <app-comp-bb-type></app-comp-bb-type>
  */
}

@Component({
  selector: '[app-comp-bb-attr]',
  template: ` <div>CompBBAttr</div> `,
})
export class CompBBAttr {
  /*
  Attribute selector 
  „doczepiamy” nasz komponent do już istniejącego elementu HTML

  rozszerza istnienie elementu bez dodawania nowego tagu
  (często używane przy dyrektywach, ale technicznie możliwe też w komponentach).

  selector: '[app-comp-bb-attr]',
            <div app-comp-bb-attr></div>

  UWAGA - można łączyć np. konkretny tag + konkretny atrybut lub konkretna wartość
          selector: 'button[app-special-btn]',
                    przycisków z atrybutem
          selector: 'button[type="reset"]',
                    <button type="reset"></button>
  
  */
}

@Component({
  selector: '.app-comp-bb-class',
  template: ` <div>CompBBClass</div> `,
})
export class CompBBClass {
  /*
  UWAGA NIEZALECANY !!!

  class selector 

  selector: 'app-comp-bb-type',
            <app-comp-bb-type></app-comp-bb-type>
  */
}

@Component({
  // selector: '[app-not]:not(.abc)',
  selector: '[app-not]:not(p)',
  template: ` <div>CompBBNot</div> `,
})
export class CompBBNot {
  /*
  pseudoclass selector ( jedynie :not  reszta nie działa )

  selector: '[app-not]:not(.abc)',    // wszystko z atrybutem 'app-not', ale bez klasy 'abc'
  selector: '[app-not]:not(p)',       // wszystko z atrybutem 'app-not', ale bez tagu 'p'

  */
}

@Component({
  selector: '[app-multi-1], [app-multi-2]',
  template: ` <div>CompBBMutli</div> `,
})
export class CompBBMulti {
  /*
  wiele selectorów, odzielone przecinkami 

  selector: app-multi-1
  selector: app-multi-2
  */
}

@Component({
  // selector
  selector: 'app-comp-b',
  imports: [CompBBType, CompBBAttr, CompBBClass, CompBBNot, CompBBMulti],
  template: `<div>
    <app-comp-bb-type></app-comp-bb-type>
    <!--  -->
    <div app-comp-bb-attr></div>
    <!--  -->
    <div class="app-comp-bb-class"></div>
    <!--  -->
    <!-- V tutaj będzie 'CompBBNot'  -->
    <div app-not>NOT NOT ABC</div>
    <!-- V tutaj będzie to co poniżej -->
    <p app-not class="abc">NOT ABC</p>
    <!--  -->
    <p app-multi-1></p>
    <p app-multi-2></p>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompB {
  /*
  selektor to taki „adres pomocniczy” Mówi Angularowi: 
  „Hej, wszędzie tam, gdzie w kodzie HTML znajdziesz tę nazwę, wstaw tam instancję mojego komponentu”

  selector:
      - za jego pomocą można osadzić komponent w innym    <app-comp-b></app-comp-b>
      - 1 selektor dla 1 komponentu | jak więcej ma ten sam to zwraca błąd Angular
      - caseSensitive (rozrónia duże i małe litery)
      - najlepiej kebab-case      czyli-taki-tekst-malej-litery
      - nigdy nie używać selektorów ID (może miec wiele instacji a ID z definicji ma 1 instancję )
      - zawsze wybrać prefix np:
          - app (domyślny), yt, itp...
          - UWAGA nigdy nie 'ng' to jest zarezerowane dla angularowych komponentów
      - preferować 'Type selector'
      
  rodzaje selektorów:
    Selector  	            Description 	                                    Examples

  Type selector 	        HTML tag name, or node name. 	                    profile-photo

  Attribute selector 	    HTML attribute                                    [dropzone] 
                          optionally exact value of attribute. 	            [type="reset"]  

  Class selector 	        CSS class. 	                                      .menu-item

  pseudo class            Psuedoclassy CSS                                  :not()
  */
}
