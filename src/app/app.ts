import { Component, signal } from '@angular/core';
import { Doc1 } from './docs-1-signals/doc-1';

@Component({
  selector: 'app-root',
  imports: [Doc1],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
