import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TempA } from './temp-a-overview/temp-a';
import { TempB } from './temp-b-binding/temp-b';
import { TempC } from './temp-c-events/temp-c';
import { TempD } from './temp-d-two-way-binding/temp-d';
import { TempE } from './temp-e-control-flow/temp-e';
import { Tempf } from './temp-f-pipes/temp-f';
import { TempG } from './temp-g-ng-content/temp-g';
import { TempH } from './temp-h-ng-template/temp-h';
import { TempI } from './temp-i-ng-container/temp-i';
import { TempJ } from './temp-j-variables/temp-j';
import { TempK } from './temp-k-defer/temp-k';

@Component({
  selector: 'app-doc-3',
  imports: [TempA, TempB, TempC, TempD, TempE, Tempf, TempG, TempH, TempI, TempJ, TempK],
  template: `
    <div class="list">
      <!-- <app-temp-a /> -->
      <!-- <app-temp-b /> -->
      <!-- <app-temp-c /> -->
      <!-- <app-temp-d /> -->
      <!-- <app-temp-e /> -->
      <!-- <app-temp-f /> -->
      <!-- <app-temp-g /> -->
      <!-- <app-temp-h /> -->
      <!-- <app-temp-i /> -->
      <!-- <app-temp-j /> -->
      <app-temp-k />
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
export class Doc3 {}
