import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DIA } from './DI-a-overview/DI-a';
import { DIB } from './DI-b-service/DI-b';

@Component({
  selector: 'app-doc-5',
  imports: [DIA, DIB],
  template: `
    <div class="list">
      <!-- <app-DI-a /> -->
      <app-DI-b />
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
