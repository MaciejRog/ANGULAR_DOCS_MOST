import {
  afterEveryRender,
  Component,
  forwardRef,
  HostAttributeToken,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-comp-g',
  imports: [
    forwardRef(() => CompG_HostStyle),
    forwardRef(() => CompG_HostConfigurationInDecorator),
    forwardRef(() => CompG_HostConfigurationByFields),
    forwardRef(() => CompG_HostCollision),
  ],
  template: `
    <!--  -->
    <CompG_HostStyle />
    <CompG_HostStyle class="active" />
    <br />
    <hr />

    <!--  -->
    <CompG_HostConfigurationInDecorator />
    <br />
    <hr />

    <!--  -->
    <CompG_HostConfigurationByFields custom-attr="Maciej" />
    <br />
    <hr />

    <!--  -->
    <CompG_HostCollision />
    <br />
    <hr />
  `,
})
export class CompG {
  /*
	HOST to obiekt w DOM który odzwierciedla instancję komponentu (dopasowanie selectora komponentu)
	KOMPONENT 	-> CompGChild
	HOST 				-> <app-comp-g-child />
	*/
}

// ###############################
// ############################### stylowanie hosta
// ############################### psudoklasa ':host'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompG_HostStyle',
  imports: [],
  template: `
    <div>
      <div>CompG_HostStyle</div>
      <br />
    </div>
  `,
  styles: `
    /* dzięki temu ostylowany będzie HOST  */
    :host {
      display: block;
      border: 2px solid red;
    }
    /* dzięki temu ostylowany będzie HOST który ma klasę CSS 'active' */
    :host(.active) {
      border-color: blue;
    }
  `,
})
export class CompG_HostStyle {
  /*
  HOST można stylować w CSS za pomocą pseudoklasy | :host { ...style }
   */
}

// ###############################
// ############################### Zalecane podejście do konfiruacja HOSTA
// ############################### poperty 'host' w dekoratorze
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompG_HostConfigurationInDecorator',
  imports: [],
  template: `
    <div>
      <div>CompG_HostConfigurationInDecorator</div>
      <br />
    </div>
  `,
  host: {
    role: 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive',
    '[style.background]': `hasError ? 'red' : 'green'`,
    '[style.--color]': '"blue"', // bind do CSS custom property (CSS var)
    '[tabIndex]': 'disabled ? -1 : 0',
    '(click)': 'handleClick($event)',
  },
})
export class CompG_HostConfigurationInDecorator {
  /*
  konfiguracja HOSTA 
  zalecane podejście poprzez pole 'host' w dekoratorze komponentu, pozwa określić:
  - atrybuty / properties tagu hosta
  - klasę CSS + style CSS
  - eventy do nasłuchu

  w efekcie z powyższej konfiguracji powstaje:
  <CompG_HostConfigurationInDecorator
    role="slider" 
		tabindex="0" 
		aria-valuenow="0" 
		style="background: green;"
  />
  */
  value: number = 0;
  disabled: boolean = false;
  isActive = false;
  hasError = false;
  handleClick = (event: Event) => {
    console.log(`ConfigurationInDecorator | event = `, event);
  };
}

// ###############################
// ############################### Nie zalecana konfiguracja HOSTA
// ############################### dekoratory '@HostBinding' i '@HostListener'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompG_HostConfigurationByFields',
  imports: [
    forwardRef(() => CompG_HostEvent), //
  ],
  template: `
    <div>
      <div>CompG_HostConfigurationByFields</div>
      <br />

      <!--  -->
      <CompG_HostEvent />
      <br />
    </div>
  `,
})
export class CompG_HostConfigurationByFields {
  /*
  można dodać obsługę atrybutów/properties przez dekorator '@HostBinding'
  można dodać obsługę eventów przez dekorator '@HostListener'

  <compg_hostconfigurationbyfields 
    tabindex="0" 
    class="ala_ma_kota"
  >
    //...
  </compg_hostconfigurationbyfields>
  */
  @HostBinding('class')
  value = 'ala_ma_kota';

  @HostBinding('tabIndex')
  get tabIndex() {
    return 0;
  }

  @HostListener('click', ['$event'])
  handleClick = (event: Event) => {
    console.log(`HOST_PARENT | click event = `, event);
  };

  /*
  za pomocą DI można też odczytać wartość atrybutów nadanych na HOST
  */
  hostAttrToken = inject(new HostAttributeToken('custom-attr'), { optional: true });
  constructor() {
    afterEveryRender(() => {
      console.log('HostAttributeToken | custom-attr = ', this.hostAttrToken);
    });
  }
}

// ###############################
// ############################### do propagowanie 'eventu' click
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompG_HostEvent',
  imports: [],
  template: `
    <div>
      <div>CompG_HostEvent</div>
      <br />
    </div>
  `,
})
export class CompG_HostEvent {
  /*
  kliknięcie w ten komponent propaguje w górę drzewa DOM i powouje wywołanie 'handleClick' 
  dla PARENT i CHILD
   */
  @HostListener('click', ['$event'])
  handleClick = (event: Event) => {
    console.log(`HOST_CHILD | click event = `, event);
  };
}

// ###############################
// ############################### wartość atrybutów przy kolizji
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompG_HostCollision',
  imports: [
    forwardRef(() => CompG_HostCollisionChild), //
  ],
  template: `
    <div>
      <div>CompG_HostCollision</div>
      <br />

      <CompG_HostCollisionChild
        id="parent_stat_id"
        customA="parent_stat_customA"
        [attr.customB]="parentDynamicCustomB"
      />
    </div>
  `,
})
export class CompG_HostCollision {
  /*
  KOLIZJE, między wartościami nadanymi na HOST (PARENT) vs nadanymi w DEKORATORZE KOMPONENTU (CHILD)

  									PARENT			        CHILD
	id 								parent_static			  child_static 		  -> parent_static
	attr.customA			parent_static			  child_dynamic		  -> child_dynamic 
	attr.customB			parent_dynamic			child_dynamic		  -> child_dynamic

  OSTATECZNIE wartości atrybutów na HOST
  <compg_hostcollisionchild 
    id="parent_stat_id" 
    customa="child_dynamic_customA" 
    customb="child_dynamic_customB" 
  />
   */
  parentDynamicCustomB = 'parent_dynamic_customB';
}

@Component({
  selector: 'CompG_HostCollisionChild',
  imports: [],
  template: `
    <div>
      <div>CompG_HostCollisionChild</div>
      <br />
    </div>
  `,
  host: {
    id: 'child_stat_id',
    '[attr.customA]': 'childDynamicCustomA',
    '[attr.customB]': 'childDynamicCustomB',
  },
})
export class CompG_HostCollisionChild {
  /*
   */
  childDynamicCustomA = 'child_dynamic_customA';
  childDynamicCustomB = 'child_dynamic_customB';
}
