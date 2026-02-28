import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DIA } from './DI-a-overview/DI-a';
import { DIB } from './DI-b-service/DI-b';
import { DIC } from './DI-c-dependency-providers/DI-c';
import { DID } from './DI-d-incjection-context/DI-d';
import { DIE } from './DI-e-DI-hierarchy/DI-e';

@Component({
  selector: 'app-doc-5',
  imports: [DIA, DIB, DIC, DID, DIE],
  template: `
    <div class="list">
      <!-- <app-DI-a /> -->
      <!-- <app-DI-b /> -->
      <!-- <app-DI-c /> -->
      <!-- <app-DI-d /> -->
      <app-DI-e />
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
