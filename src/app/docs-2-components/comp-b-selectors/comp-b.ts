import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-comp-b',
  imports: [],
  template: ` <div>To dziala</div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompB {}
