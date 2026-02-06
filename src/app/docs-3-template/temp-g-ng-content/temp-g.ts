import { Component, forwardRef } from '@angular/core';

@Component({
  selector: `app-temp-g`,
  template: `
    <div>
      <p>PARENT</p>
      <hr />
      <app-temp-g-child-a>
        <p>CHILD KONTENT</p>
      </app-temp-g-child-a>
    </div>
  `,
  imports: [forwardRef(() => TempGChildA)],
})
export class TempG {
  /*
	tag '<ng-content />'
	pozwala na render w szablonie kontentu przekazanego między tagami hosta/komponentu

	WIĘCEJ w opisie komponentów
	*/
}

// ###############################
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: `app-temp-g-child-a`,
  template: `<div>
    <p>CHILD</p>
    <ng-content />
  </div>`,
})
export class TempGChildA {
  /*
	<app-temp-g-child-a>
		<p>CHILD KONTENT</p>				// to jest kontent
	</app-temp-g-child-a>

	WYRENDERUJE:

	<app-temp-g-child-a>
		<div>
			<p>CHILD</p>
			<p>CHILD KONTENT</p>			// trafi w miejsce '<ng-content />'
		</div>
	</app-temp-g-child-a>
	*/
}
