import {
  Component,
  forwardRef,
  HostAttributeToken,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-comp-g',
  template: `
    <p>HOST 1</p>
    <app-comp-g-child-a />
    <p>HOST 2</p>
    <app-comp-g-child-a class="active" />
    <p>HOST 3</p>
    <app-comp-g-child-b />
    <app-comp-g-child-d />
  `,
  imports: [
    forwardRef(() => CompGChildA),
    forwardRef(() => CompGChildB),
    forwardRef(() => CompGChildD),
  ],
})
export class CompG {
  /*
	HOST to obiekt DOM który odzwierciedla instancję komponentu (dopasowanie selectora komponentu)
	komponent 	-> CompGChild
	Host 				-> <app-comp-g-child />

	Właściwości
			- można go ostylować w CSS za pomocą specjalnej pseudoklasy | :host { ...style }
			- można go opisać w konstruktorze w polu 'host', tj:
					- nadać mu atrybuty / właściwości
					- klasę CSS i style
					- eventy, które ma nasłuchiwać
					bardzo podobne do bindowania szablonu (template binding)
			- można opisać pojedyńcze atrybury/właściwości hosta poprzez
					- HostBinding('class')
			- można dodać obsługę eventów przez Hosta
					- 
	

	elegancko propaguje 
	Łapie event wywołany na click hosta 'app-comp-g-child-c'
	*/
  @HostListener('click', ['$event'])
  handleClick = (event: Event) => {
    console.warn(`@HOST COMP_G handle CLICK | event = `, event);
  };
}

// ###############################
// ############################### stylowanie hosta
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-g-child-a',
  template: ``,
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
export class CompGChildA {
  /*
	można odczytać wartości przekazane do atrybutów / property HOSTA z poziomu RODZICA 
	za pomocą 'HostAttributeToken'
     <app-comp-g-child-a />                     -> hostClass === null
     <app-comp-g-child-a class="active" />      -> hostClass === 'active'
	*/
  hostClass = inject(new HostAttributeToken('class'), { optional: true });

  constructor() {
    console.warn(`hostClass = `, this.hostClass);
  }
}

// ############################### ZALECANE
// ############################### konfiguracja hosta w konstruktorze
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-comp-g-child-b',
  template: `TO JEST template `,
  host: {
    role: 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive',
    '[style.background]': `hasError ? 'red' : 'green'`,
    '[style.--color]': '"blue"', // bind do CSS custom property (CSS var )
    '[tabIndex]': 'disabled ? -1 : 0',
    '(click)': 'handleClick($event)',
  },
})
export class CompGChildB {
  /*
	<app-comp-g-child-b 
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
    console.warn(`handleClick | event = `, event);
  };
}

// ############################### NIE ZALECANE (TYLKO DO WSTECZNEJ KOMPATYBILNOŚCI)
// ############################### konfiguracja hosta Dekoratory
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV @HostBinding i

@Component({
  selector: 'app-comp-g-child-c',
  template: `TO JEST template `,
})
export class CompGChildC {
  /*
	@HostBinding(nazwaAtrybutu)
	pozwala ustawić wartość atrybutu/property dla HOSTA
   */
  @HostBinding('class')
  value = 'ala_ma_kota';

  @HostBinding('tabIndex')
  get tabIndex() {
    return 0;
  }

  /*
	@HostListener(nazwaEventu, [tablicaArgumentow])
	pozwala nasłuchiwać eventów na host
   */
  @HostListener('click', ['$event'])
  handleClick = (event: Event) => {
    console.warn(`@HOST handle CLICK | event = `, event);
  };
}

// ###############################
// ############################### KOLIZJA
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
OSTATECZNY WYNIK

<app-comp-g-child-d-child 
	id="statyczna1" 
	customa="dynamiczna1" 
	customb="dynamiczna3"
>
	<div>KOLIZJE !</div><
/app-comp-g-child-d-child>

										RODZIC			DZIECKO
	id 								static			static 		-> RODZIC static
	attr.customa			static			dynamic		-> DZIECKO dynamic 
	attr.customb			dynamic			dynamic		-> DZIECKO dynamic 
*/
@Component({
  selector: 'app-comp-g-child-d',
  template: `
    <app-comp-g-child-d-child id="statyczna1" customA="statyczna3" [attr.customB]="dynamiczna2" />
  `,
  imports: [forwardRef(() => CompGChildDChild)],
})
export class CompGChildD {
  dynamiczna2 = 'dynamiczna2';
}

@Component({
  selector: 'app-comp-g-child-d-child',
  template: `<div>KOLIZJE !</div>`,
  host: {
    id: 'statyczna2',
    '[attr.customA]': 'dynamiczna1',
    '[attr.customB]': 'dynamiczna3',
  },
})
export class CompGChildDChild {
  dynamiczna1 = 'dynamiczna1';
  dynamiczna3 = 'dynamiczna3';
}
