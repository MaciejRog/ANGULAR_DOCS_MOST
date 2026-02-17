import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DIA } from './DI-a-overview/DI-a';

@Component({
  selector: 'app-doc-5',
  imports: [DIA],
  template: `
    <div class="list">
      <app-DI-a />
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
export class Doc5 {}
