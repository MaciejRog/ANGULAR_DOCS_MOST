import { Component, signal } from '@angular/core';
import { Doc1 } from './docs-1-signals/doc-1';
import { Doc2 } from './docs-2-components/doc-2';
import { Doc3 } from './docs-3-template/doc-3';

@Component({
  selector: 'app-root',
  imports: [Doc1, Doc2, Doc3],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
