import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DirectiveA } from './directive-a-overview/directive-a';
import { DirectiveB } from './directive-b-attribute/directive-b';
import { DirectiveC } from './directive-c-structural/directive-c';
import { DirectiveD } from './directive-d-api/directive-d';

@Component({
  selector: 'app-doc-4',
  imports: [DirectiveA, DirectiveB, DirectiveC, DirectiveD],
  template: `
    <div class="list">
      <!-- <app-directive-a /> -->
      <!-- <app-directive-b /> -->
      <!-- <app-directive-c /> -->
      <app-directive-d />
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
