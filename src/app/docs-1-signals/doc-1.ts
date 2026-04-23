import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalA } from './signal-a-overview/signal-a';
import { SignalAA } from './signal-a-overview/signal-aa';
import { SignalB } from './signal-b-linkedSignal/signal-b';
import { SignalC } from './signal-c-resource/signal-c';
import { SignalD } from './signal-d-effects/signal-d';

@Component({
  selector: 'app-doc-1',
  imports: [SignalA, SignalAA, SignalB, SignalC, SignalD],
  template: `
    <div class="list">
      <app-signal-a></app-signal-a>
      <!-- <app-signal-aa></app-signal-aa> -->
      <!-- <app-signal-b></app-signal-b> -->
      <!-- <app-signal-c></app-signal-c> -->
      <!-- <app-signal-d></app-signal-d> -->
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
export class Doc1 {}
