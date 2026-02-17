import { Component, signal } from '@angular/core';
import { Doc1 } from './docs-1-signals/doc-1';
import { Doc2 } from './docs-2-components/doc-2';
import { Doc3 } from './docs-3-template/doc-3';
import { Doc4 } from './docs-4-directive/docs-4';
import { Doc5 } from './docs-5-DI-dependency-injection/docs-5';

@Component({
  selector: 'app-root',
  imports: [Doc1, Doc2, Doc3, Doc4, Doc5],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
