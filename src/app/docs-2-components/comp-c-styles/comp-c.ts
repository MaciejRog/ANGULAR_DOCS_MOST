import { Component, forwardRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-comp-c',
  imports: [
    forwardRef(() => CompC_Styles_InlineStyles), //
    forwardRef(() => CompC_Host),
    forwardRef(() => CompC_Encapsulation),
    forwardRef(() => CompC_Deep),
  ],
  template: `
    <div>
      <!--  -->
      <CompC_Styles_InlineStyles />
      <br />
      <hr />

      <!--  -->
      <CompC_Host />
      <br />
      <hr />

      <!--  -->
      <CompC_Deep />
      <br />
      <hr />

      <!--  -->
      <CompC_Encapsulation />
      <br />
      <hr />
    </div>
  `,
})
export class CompC {
  /*
	stylowanie komponentu -> określenie jego wyglądu
  Podczas renderowania komponentu Angular uwzględnia powiązane z nim style, nawet podczas lazy-loadingu
	*/
}

// ###############################
// ############################### Stylowanie komponentu, czyli GDZIE definiować wygląd?
// ############################### metadane 'styleUrl', 'styleUrls', 'styles'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompC_Styles_InlineStyles',
  imports: [
    forwardRef(() => CompC_Styles), //
    forwardRef(() => CompC_InlineStyles),
  ],
  template: `
    <div>
      <p>CompC_Styles_InlineStyles</p>

      <!--  -->
      <CompC_Styles />
      <br />

      <!--  -->
      <CompC_InlineStyles />
      <br />
    </div>
  `,
})
export class CompC_Styles_InlineStyles {
  /*
   */
}

@Component({
  selector: 'CompC_Styles',
  template: `
    <div>
      <p>CompC_Styles</p>
    </div>
  `,
  // styleUrl: './comp-c.css',
  styleUrls: ['./comp-c.css'],
})
export class CompC_Styles {
  /*
  style można zaczytać z zewnętrznych plików:
    - css
    - sass
    - scss
  poprzez własiwości metadanych komponentu:
    - styleUrl: './comp-c.css',         <- pozwala zaczytać 1 plik styli
    LUB
    - styleUrls: ['./comp-c.css'],      <- pozwala zaczytać wiele plików styli
  */
}

@Component({
  selector: 'CompC_InlineStyles',
  template: `
    <div>
      <p>CompC_InlineStyles</p>
    </div>
  `,
  styles: `
    p {
      color: blue;
      font-weight: bold;
    }
  `,
})
export class CompC_InlineStyles {
  /*
  style można określić wewnątrz metadanych komponentu, poprzez właściwość:
    - styles
  */
}

// ###############################
// ############################### STYLOWANIE tagu HTML, który renderuje komponent
// ############################### STYL :host & :host-context()
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompC_Host',
  imports: [forwardRef(() => CompC_HostInner)],
  template: `
    <div>
      <p>CompC_Host</p>

      <!--  -->
      <div class="host-wrapper">
        <div class="light">
          <CompC_HostInner />
        </div>
        <div class="dark">
          <CompC_HostInner />
        </div>
      </div>
      <br />
    </div>
  `,
})
export class CompC_Host {
  /*
  STYLE CSS:
	:host               -> element, który reprezentuje nasz komponent HOST
	:host-context()     -> PRZESTARZAŁE i UNIKAĆ
			                   pozwala stylować elementy komponentu, którego HOST jest osadzony w 
                         czyli szykamy od zewnętrzych komponentów

  <div class="host-wrapper">
    <div class="light">                 
      <CompC_HostInner>                 // :host    LUB     :host-context()
        <div>                           // 
          <p>CompC_HostInner</p>        // 
        </div>
      </CompC_HostInner>
    </div>
    <div class="dark">                  
      <CompC_HostInner>                 // :host    LUB     :host-context() 
        <div>                           // 
          <p>CompC_HostInner</p>        // :host-context(.dark) p
        </div>
      </CompC_HostInner>
    </div>
  </div>
	*/
}

@Component({
  selector: 'CompC_HostInner',
  template: `
    <div>
      <p>CompC_HostInner</p>
    </div>
  `,
  styles: `
    :host {
      margin: 4px;
      display: block;
      border: 2px solid red;
    }

    /*
    :host-context() {
      margin: 4px;
      display: block;
      border: 2px solid blue;
    }
    */

    :host-context(.dark) p {
      margin: 4px;
      display: block;
      border: 2px solid green;
    }
  `,
})
export class CompC_HostInner {
  /*
   */
}

// ###############################
// ############################### naruszenie eknapsulacji w dół/w głąb DOM
// ############################### ng-deep
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompC_Deep',
  imports: [forwardRef(() => CompC_DeepIn1)],
  template: `
    <div>
      <p>CompC_Deep</p>
      <br />

      <CompC_DeepIn1 />
    </div>
  `,
  styles: `
    :host::ng-deep p {
      margin: 0;
      color: orange;
      font-size: 1rem;
      font-weight: bold;
    }
  `,
})
export class CompC_Deep {
  /*
  ::ng-deep   -> pozwala naruszyć domyślną enkapsulację 
                 w powyższym przykładzie style dla tagu 'p'
                 dla wszystkich zagnieżdżonych komponentów wewnątrz <CompC_Deep/> i jego dzieci będą miały ten styl
                 czyli styl działa na tagi <p> wewnątrz:
                 - <CompC_Deep />         <- komponent sam w sobie
                 - <CompC_DeepIn1 />      <- bezpośrenie dziecko
                 - <CompC_DeepIn2 />      <- dziecko wewnątrz <CompC_DeepIn1 />, też ma ten styl

  UWAGA
  działa tylko w domyślnej enkpsulacji tj: encapsulation: ViewEncapsulation.Emulated,
   */
}

@Component({
  selector: 'CompC_DeepIn1',
  imports: [forwardRef(() => CompC_DeepIn2)],
  template: `
    <div>
      <p>CompC_DeepIn1</p>
      <br />

      <CompC_DeepIn2 />
    </div>
  `,
})
export class CompC_DeepIn1 {}

@Component({
  selector: 'CompC_DeepIn2',
  template: `
    <div>
      <p>CompC_DeepIn2</p>
    </div>
  `,
})
export class CompC_DeepIn2 {}

// ###############################
// ############################### ENKAPSULACJA - czyli zakres styli
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompC_Encapsulation',
  template: `
    <!-- 
    UWAGA 
    style które sa w <style> w 'template' też są objęte ENKAPSULACJĄ  
    dal 'encapsulation: ViewEncapsulation.None' -> wszystkie <p> dostaną kolor tła
    -->
    <style>
      p {
        background-color: purple;
      }
    </style>

    <div>
      <p>CompC_Encapsulation</p>
      <br />

      <CompC_EncapsulationNone>
        <CompC_EncapsulationEmulated emulated />
        <compc-encapsulation-shadow shadow />
        <compc-encapsulation-isolated izolated />
      </CompC_EncapsulationNone>
    </div>
  `,
  // encapsulation: ViewEncapsulation.None,
  imports: [
    forwardRef(() => CompC_EncapsulationNone),
    forwardRef(() => CompC_EncapsulationEmulated),
    forwardRef(() => CompC_EncapsulationShadow),
    forwardRef(() => CompC_EncapsulationIsolated),
  ],
})
export class CompC_Encapsulation {
  /*
	ENKAPSULACJA (Style Scoping - zakres styli) 

  Wyobraź sobie, że każdy komponent żyje w "bańce" i to co przepuszcza 
  do środka i do kolejnej bańki w kontekście styli zależy od nas
  ograniczenie odziaływania styli jest poprzez wartości
  właściwości obiektu metadanych komponentu 'encapsulation'

	możliwe wartości dla View Encapsulation:

  - Emulated (DOMYŚLNY)
      - style ograniczone tylko do komponentu
        (brak 100% gwarancji, w przypadku kolizji style spoza komponentu mają taką samą ważność) 
      - style komponentu mają zastosowanie tylko do elementów zdefiniowanych w szablonie 'template' komponentu
      - style globalne zdefiniowane poza komponentem DZIAŁAJĄ
      - generuje unikalny atrybut HTML dla każdej instancji:
          - HOSTA                           -> _nghost-ng-c1
          - tagów w szablonie 'template'    -> _ngcontent-ng-c1
        dodaje do selektorów CSS ten atrybut
          .title { color: blue; }           -> .title[_nghost-ng-c1] { color: blue; }	
      - obsługuje pseudoklasy
          - :host {}                      
          - :host-context() {}   (PRZESTARZAŁE - UNIKAC) 
        gdy znajdzie taką pseudoklasę w stylach to zamienia ją na stosowny atrybut '[_nghost-ng-c1] {}'
      - obsługuje
          - ::ng-deep            (UNIKAC - ODRADZANE STOSOWANIE) 
        wyłącza enkapsulację wgłąb komponentu
        np: :host::ng-deep p {} -> powoduje, że wszystkie tagi <p> w komponentcie i w jego dzieciach
        i dzieciach jego dzieci itp... dostaną style opisane przez 'ng-deep', nie ogranicza się do 'template'

  - None
      - brak izolacji zdefiniowane style są globalne.
        style z pliku komponentu zostaną dołączone do nagłówka <head> strony i staną się globalne.

  - ShadowDom (UNIKAĆ)
      - najbardziej rygorystyczna izolacja Wykorzystuje natywną funkcję przeglądarki (Shadow DOM)
        (brak 100% gwarancji, bo przeglądarka musi dobrze implementować shadow-dom, a nie każda to robi)
      - style globalne zdefiniowane poza komponentem NIE DZIAŁAJĄ
        style ze środka nigdy nie wyjdą na zewnątrz.
      - UWAGA 
        ShadowDom -> wpływa na propagację eventów 

  - ExperimentalIsolatedShadowDom
      - Style globalne zdefiniowane poza komponentem NIE DZIAŁAJĄ
        style wewnątrz drzewa cieni nie mogą wpływać na elementy poza tym drzewem cieni.
  
	*/
}

@Component({
  selector: 'CompC_EncapsulationNone',
  template: `
    <div>
      <p>CompC_EncapsulationNone</p>
      <br />

      <ng-content select="[emulated]" />
      <br />

      <ng-content select="[shadow]" />
      <br />

      <ng-content select="[izolated]" />
      <br />
    </div>
  `,
  styles: `
    p {
      color: red;
      padding-left: 4px;
      border-left: 8px solid red;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CompC_EncapsulationNone {
  /*
   */
}

@Component({
  selector: 'CompC_EncapsulationEmulated',
  template: `
    <div>
      <p>CompC_EncapsulationEmulated</p>
      <CompC_EncapsulationChild />
    </div>
  `,
  styles: `
    p {
      color: green;
    }
  `,
  encapsulation: ViewEncapsulation.Emulated,
  imports: [forwardRef(() => CompC_EncapsulationChild)],
})
export class CompC_EncapsulationEmulated {
  /*
  styl globalny     -> DZIAŁA -> CompC_EncapsulationNone 
  styl tamplate     -> CompC_EncapsulationEmulated
  styl dziecka      -> CompC_EncapsulationChild + globalny
  */
}

@Component({
  selector: 'compc-encapsulation-shadow',
  template: `
    <div>
      <p>CompC_EncapsulationShadow</p>
      <CompC_EncapsulationChild />
    </div>
  `,
  styles: `
    p {
      color: blue;
    }
  `,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [forwardRef(() => CompC_EncapsulationChild)],
})
export class CompC_EncapsulationShadow {
  /*
  styl globalny     -> DZIAŁA -> CompC_EncapsulationNone (A NIE POWINIEN)
  styl tamplate     -> CompC_EncapsulationShadow
  styl dziecka      -> CompC_EncapsulationShadow + CompC_EncapsulationChild + globalny (A NIE POWINIEN)
  */
}

@Component({
  selector: 'compc-encapsulation-isolated',
  template: `
    <div>
      <p>CompC_EncapsulationIsolated</p>
      <CompC_EncapsulationChild />
    </div>
  `,
  styles: `
    p {
      color: magenta;
    }
  `,
  encapsulation: ViewEncapsulation.ExperimentalIsolatedShadowDom,
  imports: [forwardRef(() => CompC_EncapsulationChild)],
})
export class CompC_EncapsulationIsolated {
  /*
  styl globalny     -> NIE DZIAŁA
  styl tamplate     -> CompC_EncapsulationIsolated
  styl dziecka      -> CompC_EncapsulationIsolated (nadpisuje styl z CompC_EncapsulationChild)
  */
}

@Component({
  selector: 'CompC_EncapsulationChild',
  template: `
    <div>
      <p>CompC_EncapsulationChild</p>
    </div>
  `,
  styles: `
    p {
      margin: 0px;
    }
  `,
})
export class CompC_EncapsulationChild {
  /*
   */
}
