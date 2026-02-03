import { Component, forwardRef, input, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-temp-b',
  template: `
    <app-temp-b-child-a />
    <hr />
    <app-temp-b-child-c />
    <hr />
    <app-temp-b-child-d />
    <hr />
    <app-temp-b-child-e />
  `,
  imports: [
    forwardRef(() => TempChildA),
    forwardRef(() => TempChildD),
    forwardRef(() => TempChildC),
    forwardRef(() => TempChildE),
  ],
})
export class TempB {}

// ###############################
// ############################### BINDOWANIE
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-b-child-a',
  template: `
    <p>{{ valueA() }}</p>
    <button [disabled]="valueB">Save</button>
    <div [attr.custom-text]="valueB"></div>
    <app-temp-b-child-b [name]="valueC" />
    <button disabled="{{ valueB }}">Save</button>
  `,
  imports: [forwardRef(() => TempChildB)],
})
export class TempChildA {
  /*
	Bindowanie 
	to tworzenie połączenia między zmienną w klasie a szablonem, może dotyczyć:
			- tekstów, poprzez znaki '{{}}' np: 	
					<p>{{ valueA }}</p>
				to jest TEXT INTERPOLATION
				korzysta z metody toString() dla obiektów i tablic

			- atrybutów tagów HTML lub inputów komponentów, poprzez znaki '[]' np:
					<button [disabled]="isFormValid()">Save</button> 	
					<div [attr.custom-text]="valueB"></div>
    			<app-temp-b-child-b [name]="valueC" />

					UWAGA 
					dzięki składni
					<p [attr.nazwa]="valueB"></p> 		=>  <p nazwa="valueB"></p>
					można przypisać atrybut 'nazwa' do tagu, nawet gdy nie jest on okreslony w typie tagu

					UWAGA
					dla wartości 'null' atrybut jest usuwany z tagu
			
					UWAGA 
					text interpolation na atrybucie jest traktowane jako property binding !
					<button disabled="{{ valueB }}">Save</button>
					traktowane tak samo jak
					<button [disabled]="valueB">Save</button>

	*/
  // valueA = 'valueA';
  valueA = signal('valueA'); // można bindować zwykłe pola, ale lepiej 'signals'
  valueB = true;
  valueC = 'valueC';
}

@Component({
  selector: 'app-temp-b-child-b',
  template: ``,
})
export class TempChildB {
  name = input<string>();
}

// ###############################
// ############################### CSS class
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-b-child-c',
  template: `
    <div [class.active]="isActive()">ELEMENT_1</div>
    <div [class]="classVal1()">ELEMENT_2</div>
    <div [class]="classVal2()">ELEMENT_3</div>
    <div [class]="classVal3()">ELEMENT_4</div>
    <div class="base-css" [class.active]="isActive()" [class]="classVal1()">ELEMENT_5</div>
    <!--
		<div 
			class="active"														| [class.active]="isActive()"
		>ELEMENT_1</div>
		<div 
			class="css-1a css-2a"											| [class]="classVal1()"
		>ELEMENT_2</div>
		<div 
			class="css-2 css-3"												| [class]="classVal2()"
		>ELEMENT_3</div>
		<div 
			class="css-4"															| [class]="classVal3()"
		>ELEMENT_4</div>
		<div 
			class="base-css css-1a css-2a active"			| class="base-css" [class.active]="isActive()" [class]="classVal1()"
		>ELEMENT_5</div>														| gdy jest wiele to Angular je łączy
		-->
  `,
  styles: `
    .active {
      border: 3px solid red;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class TempChildC {
  /*
	BINDOWANIE DO CLASS:
			- konkretna klasa. [class.nazwa-klasy]:
						[class.active]="isActive()"
						jeśli 'isActive()' zwróci 'true' to element będzie miał klasę CSS 'active'
						jeśli false to klasy tej nie będzie
			- bindowanie do 'class' [class]="classVal()", gdzie wartość to :
						- 'string'
									'css-1a css-2a'			-> doda te 2 klasy elementowi

						- 'string[] Array'					UPDATE WYMAGA NOWEJ REFERENCJI
									['css-2', 'css-3']	-> doda te 2 klasy elementowi

						- object										UPDATE WYMAGA NOWEJ REFERENCJI
									{
										'css-4': true,		-> doda klasę 'css-4'
										'css-5': false,		-> klasy css-5 NIE_DODA
									}
	UWAGA
			- nie ma gwarancji kolejności klasCss
			- gdy jest wiele atrybutów clss angular łączy je w 1
	*/
  isActive = signal(true);
  classVal1 = signal('css-1a css-2a');
  classVal2 = signal(['css-2', 'css-3']);
  classVal3 = signal({
    'css-4': true,
    'css-5': false,
  });
}

// ###############################
// ############################### CSS & style
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-b-child-d',
  template: `
    <div [style.display]="styleVal1() ? 'block' : 'none'">ELEMENT_1</div>
    <div [style.height.px]="classVal2()">ELEMENT_2</div>
    <div [style]="classVal3()">ELEMENT_3</div>
    <div [style]="classVal4()">ELEMENT_4</div>
    <!--
		<div 
			style="display: block;"
		>ELEMENT_1</div>
		<div 
			style="height: 120px;"
		>ELEMENT_2</div>
		<div 
			style="display: flex; font-weight: bold; margin: 8px;"
		>ELEMENT_3</div>
		<div 
			style="display: flex; font-weight: bold; margin: 8px;"
		>ELEMENT_4</div>
-->
  `,
  styles: `
    .active {
      border: 3px solid red;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class TempChildD {
  /*
	BINDOWANIE DO STYLE:
			- konkretny styl
						[style.display]="styleVal1() ? 'block' : 'none'"
						[style.height.px]="classVal2()"										| można wskazać jednostkę 
			- bindowanie do 'style' [style]="styleVal()", gdzie wartość to :
						- 'string'
									'margin: 8px; font-weight: bold''			-> doda te 2 style elementowi

						- object										UPDATE WYMAGA NOWEJ REFERENCJI
									{
										margin: '8px',
   									'font-weight': 'bold',
									}
	UWAGA
			- nie ma gwarancji kolejności klasCss
			- gdy jest wiele atrybutów clss angular łączy je w 1
	*/
  styleVal1 = signal(true);
  classVal2 = signal(120);
  classVal3 = signal('display: flex; margin: 8px; font-weight: bold');
  classVal4 = signal({
    display: 'flex',
    margin: '8px',
    'font-weight': 'bold', // wszystkie style tak jak w CSS
  });
}

// ###############################
// ############################### ARIA
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-b-child-e',
  template: `
    <div [aria-label]="ariaValue()">{{ ariaValue() }}</div>
    <!--
		<div aria-label="tekst-aria">tekst-aria</div>
-->
  `,
})
export class TempChildE {
  /*
	można też bindować wartości dla atrybutów 'aria'
	aby usunąć taki atrybut trzeba mu przekazać 'null'
	*/
  ariaValue = signal('tekst-aria');
}
