import { afterEveryRender, Component, forwardRef, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-temp-d',
  template: `
    <app-temp-d-child-a />
    <app-temp-d-child-b />
  `,
  imports: [forwardRef(() => TempDChildA), forwardRef(() => TempDChildB)],
})
export class TempD {
  /*
	2-WAY data binding
	polega na tym, że zmienną możemy ustawiać na obu końcach 
	(zmiana nie płynie tylko z góry na dół, ale może też pójść z dołu na górę)

	UZYSKIWANE PRZEZ ZNAKI '[()]' tzw: 'banan w pudełku", co łączy
		- poperty binding '[]'	-> Dane płyną z klasy do szablonu.
		- event binding   '()'	-> Zdarzenie/event płynie z szablonu do klasy.
   */
}

// ###############################
// ############################### 2-way binding FORM
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-d-child-a',
  template: ` <input [(ngModel)]="userName" placeholder="Imię..." />
    <button (click)="handleClick()">USTAW</button>`,
  imports: [FormsModule],
})
export class TempDChildA {
  /*
	najczęśniej stosowane by zachować synchronizację w ramach pól formularz
	wymaga importu 'FormsModule'

	Angular zamienia:
			[(ngModel)]="userName"
	NA																			przypisuje nową wartość do naszej zmiennej.
			[ngModel]="userName" (ngModelChange)="userName = $event"
   */
  userName: string = 'Aloha';

  constructor() {
    afterEveryRender({
      read: () => {
        console.log(`[(ngModel)]="userName" | userName = `, this.userName);
      },
    });
  }

  handleClick = () => {
    this.userName = 'Agnieszka';
  };
}

// ###############################
// ############################### 2-way binding COMPONENTS
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-d-child-b',
  template: `
    <p>
      PARENT | size = {{ size }}
      <button (click)="updateSize()">CHANGE</button>
    </p>
    <hr />
    <!-- <app-temp-d-child-b-a [size]="size" (sizeChange)="handleSizeChange($event)" /> -->
    <app-temp-d-child-b-a [(size)]="size" />
  `,
  imports: [forwardRef(() => TempDChildBA)],
})
export class TempDChildB {
  /*
	można utworzyć własny 2-WAY data binding 
	ale pole muszą mieć właściwe nazwy:
			- property 		-> inputName					np: size
			- event				-> inputName+Change		np: sizeChange

   */

  size = 11;
  handleSizeChange = (newSize: number) => {
    this.size = newSize;
  };

  updateSize = () => {
    this.size += 1;
  };
}

@Component({
  selector: 'app-temp-d-child-b-a',
  template: `<p>CHILD | size = {{ size() }} <button (click)="updateSize()">CHANGE</button></p>`,
  imports: [],
})
export class TempDChildBA {
  /*
   */

  size = input<number>(1);
  sizeChange = output<number>();

  updateSize = () => {
    this.sizeChange.emit(this.size() + 5);
  };
}
