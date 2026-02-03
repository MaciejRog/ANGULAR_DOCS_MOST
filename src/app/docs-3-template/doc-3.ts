import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TempA } from './temp-a-overview/temp-a';
import { TempB } from './temp-b-binding/temp-b';
import { TempC } from './temp-c-events/temp-c';
import { TempD } from './temp-d-two-way-binding/temp-d';

@Component({
  selector: 'app-doc-3',
  imports: [TempA, TempB, TempC, TempD],
  template: `
    <div class="list">
      <!-- <app-temp-a /> -->
      <!-- <app-temp-b /> -->
      <!-- <app-temp-c /> -->
      <app-temp-d />
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
