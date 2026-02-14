import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DirectiveA } from './directive-a-overview/directive-a';
import { DirectiveB } from './directive-b-attribute/directive-b';

@Component({
  selector: 'app-doc-4',
  imports: [DirectiveA, DirectiveB],
  template: `
    <div class="list">
      <!-- <app-directive-a /> -->
      <app-directive-b />
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
