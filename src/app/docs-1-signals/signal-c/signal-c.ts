import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';

@Component({
  selector: 'app-signal-c',
  imports: [],
  // templateUrl: './signal-c.html',
  // styleUrl: './signal-c.css',
  template: `
    <div class="wrapper">
      <p>resuource</p>
      <br /><br />
      <p>userId = {{ userId() }}</p>
      <button (click)="updateUserId()">update user id</button>
      <br /><br />
      <p>
        userResource =
        {{ userResource.hasValue() ? userResource.value()?.name : 'Jeszcze nie ma wartości' }}
      </p>
      <button (click)="reloadUserResource()">reload User Resource</button>
      <button (click)="setUserResource()">SET User Resource</button>
      <button (click)="updateUserResource()">UPDATE User Resource</button>

      <br /><br />
      <p>userResource.hasValue = {{ userResource.hasValue() }}</p>
      <p>userResource.value = {{ userResource.value() }}</p>
      <p>userResource.isLoading = {{ userResource.isLoading() }}</p>
      <p>userResource.error = {{ userResource.error() }}</p>
      <p>userResource.status = {{ userResource.status() }}</p>

      <br /><br />
      @if (userResource.isLoading()) {
        <p>Ładowanie...</p>
      } @else if (userResource.error()) {
        <p>Wystąpił błąd: {{ userResource.error() }}</p>
      } @else {
        <div>Użytkownik: {{ userResource.value()?.name }}</div>
      }
    </div>
  `,
  styles: `
    .wrapper {
      margin: 16px;
    }

    p {
      margin: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalC {
  /*
  resource (odpowiednik RxJS – rxResource) 
      łączy asynchroniczne operacje bezpośrednio z sygnałami.
  
  resource to funkcja, która tworzy "zasób" 
      – specjalny sygnał reprezentujący wynik operacji asynchronicznej. 
      automatycznie reaguje na zmiany sygnałów, od których zależy, i 
      samodzielnie zarządza procesem pobierania danych
  */
  /*
  status jaki może przyjmować zasób
  Status 	      value() 	              Description
  'idle' 	      undefined 	          Zasób nie zaczął jeszcze ładować danych.
  'error' 	    undefined 	          Wystąpił błąd.
  'loading' 	  undefined 	          trwa ładowanie, na zmianę wartości 'params'
  'reloading' 	Previous value 	      trwa ładowanie, na wywołanie 'reload'
  'resolved' 	  Resolved value 	      ładowanie sie zakończyło
  'local' 	    Locally set value 	  wartość Zasóbu ustawiona przez 'set' lub 'update'
  */

  userId = signal(1);
  updateUserId = () => {
    this.userId.update((prev) => prev + 1);
  };

  // Definicja zasobu
  userResource = resource({
    // 1. param -> dane, których zmiana ma wykonać loader
    // wykonuje się na zmienę 'userId'
    params: () => {
      const userId = this.userId();
      return { id: userId };
    },
    // 2. funkcja asynchroniczna -
    //    wykona się za każdym razem gdy zmieni się params (to z góry)
    loader: ({ params, abortSignal, previous }): Promise<{ name: string }> => {
      console.log(`resource Loader | params = `, params);
      console.log(`resource Loader | abortSignal = `, abortSignal);
      console.log(`resource Loader | previous = `, previous); // 'idle', 'resolved'
      return fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`, {
        signal: abortSignal,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Błąd pobierania');
          }
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(res.json());
            }, 2000);
          });
        })
        .then((data) => {
          return data as { name: string };
        });
    },
  });
  reloadUserResource = () => {
    this.userResource.reload();
  };
  setUserResource = () => {
    this.userResource.set({ name: 'wartość z SET' });
    // Np przy formularzach lub optymistycznym aktualizowaniu UI.
    // zmienia status na 'local'
  };
  updateUserResource = () => {
    this.userResource.update((prev) => {
      return {
        name: prev?.name + '1',
      };
    });
    // Np przy formularzach lub optymistycznym aktualizowaniu UI.
    // zmienia status na 'local'
  };
}
