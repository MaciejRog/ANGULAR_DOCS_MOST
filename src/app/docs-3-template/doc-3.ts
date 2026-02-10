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

@Component({
  selector: 'app-doc-3',
  imports: [TempA, TempB, TempC, TempD, TempE, Tempf, TempG, TempH, TempI],
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
      <app-temp-i />
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
