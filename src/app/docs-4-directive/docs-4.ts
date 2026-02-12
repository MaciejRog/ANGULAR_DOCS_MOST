import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DirectiveA } from './directive-a-overview/directive-a';

@Component({
  selector: 'app-doc-4',
  imports: [DirectiveA],
  template: `
    <div class="list">
      <app-directive-a />
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
export class Doc4 {}
