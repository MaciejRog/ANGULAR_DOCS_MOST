import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CompA } from './comp-a-overview/comp-a';
import { CompB } from './comp-b-selectors/comp-b';
import { CompC } from './comp-c-styles/comp-c';
import { CompD } from './comp-d-input/comp-d';

@Component({
  selector: 'app-doc-2',
  imports: [CompA, CompB, CompC, CompD],
  template: `
    <div class="list">
      <!-- <app-comp-a></app-comp-a> -->
      <!-- <app-comp-b></app-comp-b> -->
      <!-- <app-comp-c></app-comp-c> -->
      <app-comp-d></app-comp-d>
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
