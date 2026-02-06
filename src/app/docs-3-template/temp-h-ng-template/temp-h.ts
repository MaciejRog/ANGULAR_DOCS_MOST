import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  forwardRef,
  inject,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: `app-temp-h`,
  template: `
    <app-temp-h-child-a />
    <hr />
    <hr />
    <hr />
    <app-temp-h-child-b />
  `,
  imports: [forwardRef(() => TempHChildA), forwardRef(() => TempHChildB)],
})
export class TempH {
  /*
	<ng-template />
	pozwala deklarować FRAGMENTY SZABLONU, które mogą być dynamicznie lub
	programistycznie renderowane

	<ng-template> to taki "szablon w poczekalni". To fragment kodu HTML, 
	który Angular zna, ale którego nie wyświetli, dopóki wyraźnie go o to nie poprosisz.
	
	reprezentowany przez obiekt 'TemplateRef'

	Co warto zapamiętać? (Podsumowanie)
			Niewidzialność: 		<ng-template> sam z siebie nigdy nie pojawi się w DOM.
			Referencja: 				Zawsze używaj #nazwa, aby móc się do niego odwołać.
			Cukier składniowy: 	Pamiętaj, że kiedy piszesz gwiazdkę (np. *ngIf), 
													Angular pod spodem i tak tworzy dla Ciebie <ng-template>. 
													To jest "magia", która dzieje się za kulisami.
			Porządek: 					Używanie fragmentów szablonu pozwala uniknąć powtarzania kodu 
													(zasada DRY) i sprawia, że Twój HTML jest bardziej czytelny.
	*/
}

// ###############################
// ############################### <ng-template>
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: `app-temp-h-child-a`,
  template: `
    <p>A_NORMALNY_P</p>
    <ng-template #templateRef1>
      <p>A_TEMPLATE_P_1 {{ zmiennaA }}</p>
    </ng-template>
    <!-- 
			          #templateRef2			-> zmienna referencyjna szablonu 
		-->
    <ng-template #templateRef2>
      <p>A_TEMPLATE_P_2 {{ zmiennaA }}</p>
    </ng-template>

    <ng-template myTemplateDirective>
      <p>A_TEMPLATE_P_3 {{ zmiennaA }}</p>
    </ng-template>

    <hr />
    <div *ngTemplateOutlet="templateRef2"></div>
    <div *ngTemplateOutlet="viewChildTemplateRef1()"></div>

    <hr />
    <button (click)="addTemplates()">DODAJ DYNAMICZNIE przez 'ViewContainerRef'</button>
  `,
  imports: [forwardRef(() => MyTemplateDirective), NgTemplateOutlet],
})
export class TempHChildA {
  /*
	przy wyrenderowaniu komponentu treść między tagami <ng-template>, czyli
	<ng-template>
		<p>A_TEMPLATE_P_1 {{ zmiennaA }}</p>			// zmiennaA - BINDING jest brany z miejsca 
	</ng-template>																 DEKLARACJI fragmentu, nie renderu
	NIE SA OD RADU WYRENDEROWANE
	angular je widzi i zapisuje jako obiekt w pamięci, ale
	aby go wyrenderować trzeba pobrać do niego referencję i zrobić to dynamicznie


	DOSTĘP DO SZABLONOW
	1. zmienna referencyjna 
	<ng-template #templateRef2>... </ng-template>
							 #templateRef2		->. zmienna referencyjna szablonu 
			pozwala dobrać się do KONKRETNEGO template przez zmienną 'templateRef2'
			
	2. query 'ViewQuery' 
			templateRef1 = viewChild<TemplateRef<undefined>>(TemplateRef);

	3. Inject 'TemplateRef'
			<ng-template myTemplateDirective>
				<p>A_TEMPLATE_P_3 {{ zmiennaA }}</p>
			</ng-template>

			@Directive({
				selector: '[myTemplateDirective]',
			})
			export class MyTemplateDirective {
				private fragment = inject(TemplateRef);
			}

	STOSOWANIE / REDNEROWANIE szablonów:
	1. wewnątrz szablonu - dyrektywa 'NgTemplateOutlet' 
		wymaga importu 'CommonModules' lub 'NgTemplateOutlet'
		dyrektywa strukturalna '*ngTemplateOutlet' przyjmuje obiekt 'TemplateRef'
		zalecane stosowanie na <ng-container>, ale może być inny tag html
		po prostu np: poniższe divy nigdy nie trafią do DOM i zostaną zastąpione templatami

		<div *ngTemplateOutlet="templateRef2"></div>
		<div *ngTemplateOutlet="viewChildTemplateRef1()"></div>

	2. wewnątrz klasy TS - ViewContainerRef
		ViewContainerRef to „miejsce na szablon"
		Potrafi przyjmować, wyświetlać, a nawet usuwać fragmenty HTML w sposób dynamiczny.
		Inaczej: element/node w drzewie komponentów który może zawierać coś
		każdy komponent/dyrektywa może wstrzykąć go sb i dostanie referencję do swojego widoku
		np: wywołanie 'addTemplates()'
					<app-temp-h>
						<app-temp-h-child-a>{...}</app-temp-h-child-a>
						<p>A_TEMPLATE_P_1 Aga</p>															<<-- tutaj doda template
					</app-temp-h> 
				czyli metoda 'createEmbeddedView' robi append na DOM względem hosta
				inaczej - dodaje za nim template jako rodzeństwo
		UWAGA mozna dostać VCR dla konkretnego miejsca
					@ViewChild('container', { read: ViewContainerRef }) vcr!: ViewContainerRef;
	*/
  zmiennaA = 'Aga';

  viewChildTemplateRef1 = viewChild.required<TemplateRef<HTMLElement>>('templateRef1');

  constructor(private viewContainer: ViewContainerRef) {}

  addTemplates = () => {
    if (this.viewChildTemplateRef1()) {
      this.viewContainer.createEmbeddedView(this.viewChildTemplateRef1());
    }
  };
}

@Directive({
  selector: '[myTemplateDirective]',
})
export class MyTemplateDirective {
  private fragment = inject(TemplateRef);
}

// ###############################
// ############################### PARAMETRY W <ng-template>
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: `app-temp-h-child-b`,
  template: `
    <p>B_NORMALNY_P</p>
    <ng-template #tempRef let-nazwaParametru="nazwaZmiennej">
      <p>B_TEMPLATE_P {{ nazwaParametru }}</p>
    </ng-template>

    <hr />
    <ng-container
      [ngTemplateOutlet]="tempRef"
      [ngTemplateOutletContext]="{ nazwaZmiennej: 'AGUŚ' }"
    />

    <hr />
    <button (click)="handleDodaj()">Dodaj</button>
    <ng-container #containerRef />
  `,
  imports: [CommonModule],
})
export class TempHChildB {
  /*
	aby dodać parametry do fragmentów szablonu 
	piszemy						let-dowolnaNazwaCamelCasem="nazwaZmiennej"
	co tworzy nam 		zmienną odczytu			-> dowolnaNazwaCamelCasem
										zmineną ustawienia 	-> nazwaZmiennej
	<ng-template let-nazwaParametru="nazwaZmiennej">
		<p>B_TEMPLATE_P {{ nazwaParametru }}</p>			// nazwaParametru -> to argument/ parametr
	</ng-template>
	
	PRZEKAZANIE WARTOŚĆI:
	1. dyrektywa	ngTemplateOutlet
		poprzez dyrektywę ngTemplateOutletContext, gdzie 
		podajemy obiekt, a w nim property to zminene ustawienia 'nazwaZmiennej'
		
				<ng-container
					[ngTemplateOutlet]="tempRef"
					[ngTemplateOutletContext]="{ nazwaZmiennej: 'AGUŚ' }"
				/>
	2. ViewContainerRef
			jako 2 argument, metody createEmbeddedView
			też w postaci obiektu, a w nim property to zminene ustawienia 'nazwaZmiennej'

			createEmbeddedView(this.templateRef(), { nazwaZmiennej: 'LUBIĘ PLACKI' });
	*/

  templateRef = viewChild.required<TemplateRef<undefined>>('tempRef');
  containerRef = viewChild.required('containerRef', { read: ViewContainerRef });
  handleDodaj = () => {
    if (this.templateRef()) {
      this.containerRef().createEmbeddedView(this.templateRef(), { nazwaZmiennej: 'LUBIĘ PLACKI' });
    }
  };
}

// ###############################
// ############################### DYREKTYWY STRUKTURALNE wstęp
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: `app-temp-h-child-c`,
  template: ``,
})
export class TempHChildC {
  /*
	Dyrektywę 'ngTemplateOutlet' można zapisac na 2 rodzaje:
		1) jako binding
		2) z * poprzedzającą

		<ng-container
			[ngTemplateOutlet]="tempRef"
		/>

		<ng-container
			*ngTemplateOutlet="tempRef"
		/>

	Dyrektywa strukturalna to taka, która:
		- stosuje 'templateRef'
		- stosuje 'ViewContainerRef' i renderuje 'templateRef'
	
	UWAGA
	Oznaczenie z '*' to specjalna skłądnia, która mówi, że element na którym jest
	dyrektywą z * to jest 'template' tej dyrektywy z * !!!!
			WIĘC TAKI ZAPIS
					<section *myDirective>
						<p>This is a fragment</p>
					</section>

			JEST ROZUMIANY JAKO
					<ng-template myDirective>
						<section>
							<p>This is a fragment</p>
						</section>
					</ng-template>
   */
}
