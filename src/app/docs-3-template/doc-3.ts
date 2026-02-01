import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TempA } from './temp-a-overview/temp-a';

@Component({
  selector: 'app-doc-3',
  imports: [TempA],
  template: ` <div class="list"><app-temp-a /></div> `,
  styles: `
    .list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Doc3 {}
