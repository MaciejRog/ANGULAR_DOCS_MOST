import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CompA } from './comp-a-overview/comp-a';
import { CompB } from './comp-b-selectors/comp-b';
import { CompC } from './comp-c-styles/comp-c';
import { CompD } from './comp-d-input/comp-d';
import { CompDOld } from './comp-d-input/comp-d-old-decorator';
import { CompE } from './comp-e-output/comp-e';
import { CompEOld } from './comp-e-output/comp-e-old-decorator';
import { CompF } from './comp-f-content/comp-f';
import { CompG } from './comp-g-host/comp-g';
import { CompH } from './comp-h-lifecycle/comp-h';

@Component({
  selector: 'app-doc-2',
  imports: [CompA, CompB, CompC, CompD, CompDOld, CompE, CompEOld, CompF, CompG, CompH],
  template: `
    <div class="list">
      <!-- <app-comp-a></app-comp-a> -->
      <!-- <app-comp-b></app-comp-b> -->
      <!-- <app-comp-c></app-comp-c> -->
      <!-- <app-comp-d></app-comp-d> -->
      <!-- <app-comp-d-old></app-comp-d-old> -->
      <!-- <app-comp-e /> -->
      <!-- <app-comp-e-old /> -->
      <!-- <app-comp-f /> -->
      <!-- <app-comp-g /> -->
      <app-comp-h />
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
