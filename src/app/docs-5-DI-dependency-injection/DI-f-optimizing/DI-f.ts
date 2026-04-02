import { Component, forwardRef } from '@angular/core';

@Component({
  selector: 'app-DI-f',
  template: `<app-DI-f-child-a />`,
  imports: [forwardRef(() => DIFChildA)],
})
export class DIF {
  /*
   */
}

// ###############################
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

@Component({
  selector: 'app-DI-f-child-a',
  template: ``,
})
export class DIFChildA {}
