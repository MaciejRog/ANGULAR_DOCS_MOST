import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DIA } from './DI-a-overview/DI-a';
import { DIB } from './DI-b-service/DI-b';
import { DIC } from './DI-c-dependency-providers/DI-c';

@Component({
  selector: 'app-doc-5',
  imports: [DIA, DIB, DIC],
  template: `
    <div class="list">
      <!-- <app-DI-a /> -->
      <!-- <app-DI-b /> -->
      <app-DI-c />
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
