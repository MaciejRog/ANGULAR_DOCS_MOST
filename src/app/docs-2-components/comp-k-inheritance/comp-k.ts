import {
  afterEveryRender,
  Component,
  contentChild,
  ElementRef,
  forwardRef,
  input,
  OnInit,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-comp-k',
  template: `
    <app-comp-k-parent [parentInput]="1"
      ><span #parentContent>parent kontent</span></app-comp-k-parent
    >
    <app-comp-k-child [parentInput]="1" [childInput]="1"
      ><span #childContent>child kontent</span></app-comp-k-child
    >
  `,
  imports: [forwardRef(() => CompKParent), forwardRef(() => CompKPChild)],
})
export class CompK {}

// ###############################
// ############################### Inheritance dziedziczenie
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
DZIEDZICZENIE:

		klasa dziecka od rodzica dziedziczy:
				- host bindings
				- inputs 
				- outputs
				- lifecycle methods.

			
		NADPISYWANE SA DOMYŚLNIE:
				- selector
				- template 'szablon'

		W konstruktorze podklasy/dziecka w 1 linii musi być wywołany 
		konstruktor nadklasy/rodzica 'super()'

		można nadpisać pola i metody
				- NADPISANIE POLA 
					override parentPole = 'CHILD';
				-	NADPISANIE METODY
					override ngOnInit() {
						// super.ngOnInit();	<-- wywołanie metody z nadklasy
						console.warn(`------- CHILD | ON_INIT`);
					}
*/
@Component({
  selector: 'app-comp-k-parent',
  template: `<div #parent>parent</div>
    <ng-content />`,
  host: {
    '(click)': 'handleClick()',
  },
})
export class CompKParent implements OnInit {
  parentPole = 'PARENT';
  parentInput = input.required<number>();
  parentOutput = output<string>();
  parentView = viewChild('parent');
  parentContent = contentChild('parentContent');

  handleClick = () => {
    console.warn('CLICK');
  };

  constructor(private element: ElementRef) {
    afterEveryRender({
      read: () => {
        console.warn(`PARENT | parentPole = `, this.parentPole);
        console.warn(`PARENT | parentInput = `, this.parentInput());
        console.warn(`PARENT | parentOutput = `, this.parentOutput);
        console.warn(`PARENT | parentView = `, this.parentView());
        console.warn(`PARENT | parentContent = `, this.parentContent());
        console.log('\n\n');
      },
    });
  }
  ngOnInit() {
    console.warn(`------- PARENT | ON_INIT`);
  }
}

@Component({
  selector: 'app-comp-k-child',
  template: `<div #child>child</div>
    <ng-content />`,
})
export class CompKPChild extends CompKParent implements OnInit {
  override parentPole = 'CHILD';
  childInput = input.required<number>();
  childOutput = output<string>();
  childView = viewChild('child');
  childContent = contentChild('childContent');

  // pole 'element' jest w nadklasie 'CompKParent'
  //                       constructor(private element: ElementRef) {
  constructor(element: ElementRef) {
    super(element);
    afterEveryRender({
      read: () => {
        console.error(`CHILD PARENT @OVERDRIVE | parentPole = `, this.parentPole);
        console.error(`CHILD PARENT | parentInput = `, this.parentInput());
        console.error(`CHILD PARENT | parentOutput = `, this.parentOutput);
        console.error(`CHILD PARENT | parentView = `, this.parentView());
        console.error(`CHILD PARENT | parentContent = `, this.parentContent());
        console.error(`CHILD | childInput = `, this.childInput());
        console.error(`CHILD | childOutput = `, this.childOutput);
        console.error(`CHILD | childView = `, this.childView());
        console.error(`CHILD | childContent = `, this.childContent());
      },
    });
  }

  override ngOnInit() {
    // super.ngOnInit();	<--
    console.warn(`------- CHILD | ON_INIT`);
  }
}
