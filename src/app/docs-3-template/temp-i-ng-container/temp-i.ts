import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';

@Component({
  selector: 'app-temp-i',
  template: `
    <app-temp-i-child-a />
    <app-temp-i-child-b />
  `,
  imports: [forwardRef(() => TempIChildA), forwardRef(() => TempIChildB)],
})
export class TempI {
  /*
  <ng-container /> 
  to odpowiednik Fragmentu w React taki <></> lub <React.Fragment></React.Fragment>
  czyli w uproszczeniu jest to tag, który grupuje elementy
  można na niego nanieść dyrektywy (strukturalne też)
  nigdy nie zostanie wyrenderowany w DOM

  - pozwala nadać 2 i więcej dyrektyw strukturalnych na element
  - pozwala na niedodawanie miliona div'ow do DOM
  - pozwala pogrupować elementy (zaznaczyć je)
      pogrupowane elementy (te miedzy tagami)
      mogą wstrzykiwać dyrektywy przekazane do <ng-container>

  UWAGA:
    - ignoruje 'attribute binding'
    - ignoruje 'event listeners'
	*/
}

// ###############################
// ############################### ng-container -> dynamiczne renderowanie
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-i-child-a-a',
  template: `<p>TEST_CHILD</p>`,
})
export class TempIChildAA {}

@Component({
  selector: 'app-temp-i-child-a',
  template: `
    <ng-template #tempRef>
      <p>TEST_TEMPLATE</p>
    </ng-template>

    <!-- dynamiczne renderowanie szablonu - dyrektywa 'ngTemplateOutlet' -->
    <ng-container [ngTemplateOutlet]="tempRef" />
    <ng-container [ngComponentOutlet]="componentVar" />
  `,
  imports: [CommonModule],
})
export class TempIChildA {
  /*
  1. Dynamiczne renderowanie szablonu '<ng-template #tempRef>'
  za pomocą dyrektywy 'ngTemplateOutlet'
      <ng-container [ngTemplateOutlet]="tempRef" />

  2. dynamiczne renderowanie komponentu
  za pomocą dyrektywy 'ngComponentOutlet'
      <ng-container [ngComponentOutlet]="componentVar" />   gdzie: componentVar = TempIChildAA;


  powyższe wyrenderuje:
  <app-temp-i-child-a>
    <p>TEST_TEMPLATE</p>
    <app-temp-i-child-a-a>
      <p>TEST_CHILD</p>
    </app-temp-i-child-a-a>
  </app-temp-i-child-a>
	*/
  componentVar = TempIChildAA;
}

// ###############################
// ############################### ng-container -> dyrektywy strukturalne
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-temp-i-child-b',
  template: `
    <ng-container *ngIf="zmienna1">
      <p>zmienna1 JEST TRUE</p>
    </ng-container>
    <ng-container *ngIf="!zmienna1">
      <p>zmienna1 JEST FALSE</p>
    </ng-container>
  `,
  imports: [CommonModule],
})
export class TempIChildB {
  /*
  można dodać do kontenera:
    *ngIf
    *ngFor
	*/
  zmienna1 = true;
}
