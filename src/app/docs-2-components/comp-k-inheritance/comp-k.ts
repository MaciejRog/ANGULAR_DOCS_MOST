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
  imports: [
    forwardRef(() => CompK_Parent), //
    forwardRef(() => CompK_Child),
  ],
  template: `
    <!--  -->
    <CompK_Parent [parentInput]="1">
      <span #parentContent>parent kontent</span>
    </CompK_Parent>
    <br />
    <hr />

    <!--  -->
    <CompK_Child [parentInput]="1" [childInput]="1">
      <span #childContent>child kontent</span>
    </CompK_Child>
    <br />
    <hr />
  `,
})
export class CompK {}

// ###############################
// ############################### DZIEDZICZENIE (INHERITANCE)
// ############################### komponent RODZICA
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'CompK_Parent',
  imports: [],
  template: `
    <div>
      <div #parent>CompK_Parent</div>
      <br />
      <div>
        <ng-content />
      </div>
    </div>
  `,
  host: {
    '(click)': 'handleClick()',
  },
})
export class CompK_Parent implements OnInit {
  /*
  DZIEDZICZENIE (INHERITANCE) między komponentami

  klasa/komponent dziecka DZIEDZICZY od klasy/komponentu rodzica:
  - bindingi [property] [attributes]
  - inputy
  - outputy
  - metody lifecycle
    
  klasa/komponent dziecka NADPISUJE/OVERWRITE od klasy/komponentu rodzica:
  - selector
  - template/szablon

  UWAGA
  W konstruktorze podklasy/dziecka w 1 linii musi być wywołany konstruktor nadklasy/rodzica czyli 'super()'

  UWAGA, można nadpisać pola i metody
  - nadpisanie pola
    override parentPole = 'CHILD';
  -	nadpisanie metod
    override ngOnInit() {                   <-- metoda 'ngOnInit' istnieje w klasie rodzica
      super.ngOnInit();	                    <-- wywołanie metody z nadklasy
      console.warn(`CHILD | ngOnInit`);
    }
  */
  parentPole = 'PARENT';
  parentInput = input.required<number>();
  parentOutput = output<string>();
  parentView = viewChild('parent');
  parentContent = contentChild('parentContent');

  handleClick = () => {
    console.warn('PARENT | CLICK');
  };

  constructor(private element: ElementRef) {
    afterEveryRender({
      read: () => {
        console.warn(`PARENT | parentPole = `, this.parentPole);
        console.warn(`PARENT | parentInput = `, this.parentInput());
        console.warn(`PARENT | parentOutput = `, this.parentOutput);
        console.warn(`PARENT | parentView = `, this.parentView());
        console.warn(`PARENT | parentContent = `, this.parentContent());
      },
    });
  }
  ngOnInit() {
    console.warn(`PARENT | ngOnInit`);
  }
}

// ###############################
// ############################### DZIEDZICZENIE (INHERITANCE)
// ############################### komponent DZIECKA
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'CompK_Child',
  template: `
    <div>
      <div #child>CompK_Child</div>
      <br />
      <div>
        <ng-content />
      </div>
    </div>
  `,
})
export class CompK_Child extends CompK_Parent implements OnInit {
  override parentPole = 'CHILD';
  childInput = input.required<number>();
  childOutput = output<string>();
  childView = viewChild('child');
  childContent = contentChild('childContent');

  // argument 'element' jest w nadklasie 'CompKParent'
  // constructor(private element: ElementRef) {
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
    super.ngOnInit(); // <- wywołanie 'ngOnInit' z nadklasy/rodzica
    console.error(`CHILD | ngOnInit`);
  }
}
