import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TempA } from './temp-a-overview/temp-a';
import { TempB } from './temp-b-binding/temp-b';
import { TempC } from './temp-c-events/temp-c';

@Component({
  selector: 'app-doc-3',
  imports: [TempA, TempB, TempC],
  template: `
    <div class="list">
      <!-- <app-temp-a /> -->
      <!-- <app-temp-b /> -->
      <app-temp-c />
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
