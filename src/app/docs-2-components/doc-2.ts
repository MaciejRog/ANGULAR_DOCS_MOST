import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CompA } from './comp-a-overview/comp-a';

@Component({
  selector: 'app-doc-2',
  imports: [CompA],
  template: `
    <div class="list">
      <app-comp-a></app-comp-a>
    </div>
  `,
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
export class Doc2 {}
