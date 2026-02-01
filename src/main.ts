import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// import { createApplication } from '@angular/platform-browser';
// import { createCustomElement } from '@angular/elements';
// import { CompNChildA } from './app/docs-2-components/comp-n-custom-element/comp-n';

// // 1. Tworzymy instancję aplikacji (bez renderowania root componentu)
// createApplication({ providers: [] }).then((appRef) => {
//   // 2. Tworzymy Custom Element z komponentu Angularowego
//   const compN = createCustomElement(CompNChildA, {
//     injector: appRef.injector,
//   });

//   // 3. Rejestrujemy go w przeglądarce pod wybraną nazwą
//   customElements.define('custom-comp-n', compN);
// });
