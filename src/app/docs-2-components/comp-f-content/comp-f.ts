import { Component, forwardRef } from '@angular/core';

@Component({
  selector: 'app-comp-f',
  template: `
    <app-comp-f-child>
      <p>Treść przekazando do ng-content przez rodzica</p>
    </app-comp-f-child>
    <app-comp-f-child-b />
  `,
  imports: [forwardRef(() => CompFChild), forwardRef(() => CompFChildB)],
})
export class CompF {
  /*
	Content Projection (projektowanie treści).
			tag <ng-content>		-> pełni rolę props.children w angularze
														 pokazuje gdzie wyrenerowac html przekazany między tagami hosta -> CONTENT (KONTENT)

	<app-comp-f-child>																					// HOST -> odpowiednik w DOM selectora
		<div>																											// VIEW -> szablon to co w template
			<p>CONTENT CHILD</p>																		// VIEW
			<p>Treść przekazando do ng-content przez rodzica</p>		// CONTENT -> to co między tagami HOSTA
		</div>																										// VIEW
	</app-comp-f-child>																					// HOST

	Właściwości:
	  - tag <ng-content> nie tworzy dodatkowego elementu w HTML-u
		- Treść, którą projektujesz, jest tworzona w kontekście Rodzica (ten komponent bez tagu <ng-contnet/>)
		- Dany element tylko do 1 <ng-content>. Nie możesz wyświetlić tej samej treści 
			w dwóch miejscach jednocześnie przy użyciu tej techniki.
		- <ng-content> nie może miec atrybutów/dyrektyw itp...
		- UWAGA
				  NIE UŻYWAĆ w condition rendering (@if, @for, or @switch) do tego jest template
		- bez <ng-content> to co będzie podane jako KONTENT nie zostanie wyrenderowane w DOM
    - można przekazać domyślną wartość między tagami      
          <ng-content>DOMYŚLNA_WARTOŚĆ</ng-content>
    - można aliasować za pomocą atrybutu 'ngProjectAs'
      można podać dowolny selector CSS, aby wpasować dowolny tag do <ng-content/>
          <ng-content select="app-content-alias" />
          <div ngProjectAs="app-content-alias">AAAAA</div>
	*/
}

// ###############################
// ############################### pojedyńczy '<ng-content />'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-f-child',
  template: `<div>
    <p>CONTENT CHILD</p>
    <ng-content />
  </div>`,
})
export class CompFChild {
  /*
	<div>
    <p>CONTENT CHILD</p>
    <ng-content />																						// tag kontentu
  </div>

	<app-comp-f-child>
		<p>Treść przekazando do ng-content przez rodzica</p>			// wartość przekazana między tagiem komponentu KONTENT
	</app-comp-f-child>

	<app-comp-f-child>
		<div>
			<p>CONTENT CHILD</p>
			<p>Treść przekazando do ng-content przez rodzica</p>		// wyrenderowane w DOM
		</div>
	</app-comp-f-child>
   */
}

//
//
//
//
//

// ###############################
// ############################### wiele miejsc w komponencie
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
/*
w ramach 1 komponentu można podać wiele <ng-content />, 
ale wtedy należy dla każdego nadać unikalny SELECTOR CSS w 'select' 
wartości mogą być jak dla selectorów komponentów

<ng-content select="app-content-title" />     
      wymaga podania komponentu
      <app-content-title>TITLE_EL</app-content-title>

<ng-content select="[footer]" />
      wymaga podania tagu z atrybutem
      <div footer>FOOTER_EL</div>
*/

@Component({
  selector: 'app-comp-f-child-b',
  template: `
    <app-comp-f-child-b-child>
      <app-content-title>TITLE_EL</app-content-title>

      <p>BEZ_SELECT</p>

      <div footer>FOOTER_EL</div>

      <div ngProjectAs="app-content-alias">AAAAA</div>
    </app-comp-f-child-b-child>
  `,
  imports: [forwardRef(() => CompFChildBChild), forwardRef(() => CardTitle)],
})
export class CompFChildB {}

@Component({
  selector: 'app-content-title',
  template: `<ng-content>card-title</ng-content>`,
})
export class CardTitle {}

@Component({
  selector: 'app-comp-f-child-b-child',
  template: `
    <div>
      <header>
        <ng-content select="app-content-title" />
        <!-- ZAMINI_SIE_NA = <app-content-title>TITLE_EL</app-content-title> -->
      </header>

      <main>
        <ng-content />
        <!-- ZAMINI_SIE_NA = <p>BEZ_SELECT</p> -->
      </main>

      <footer>
        <ng-content select="[footer]" />
        <!-- ZAMINI_SIE_NA = <div footer="">FOOTER_EL</div> -->
      </footer>

      <div>
        <ng-content select="[placeholder]">DEFAULT_PLACEHOLDER_VALUE</ng-content>
        <!-- NIE MA PODANEJ u RODZICA WARTOŚCI więc wykorzysta domyślną wartość 'DEFAULT_PLACEHOLDER_VALUE' -->
      </div>

      <div>
        <ng-content select="app-content-alias" />
        <!-- aliasowanie  -->
      </div>
    </div>

    <!--
    <app-comp-f-child-b-child>
			<div>
        <header>
          <app-content-title>TITLE_EL</app-content-title>
        </header>
        <main>
					<p>BEZ_SELECT</p>
				</main>
        <footer>
					<div footer="">FOOTER_EL</div>
				</footer>
        <div>DEFAULT_PLACEHOLDER_VALUE</div>
      </div>
		</app-comp-f-child-b-child
    >
		-->
  `,
})
export class CompFChildBChild {}
