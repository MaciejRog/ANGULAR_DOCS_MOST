import { Component, resource, signal, forwardRef, computed } from '@angular/core';

@Component({
  selector: 'app-signal-c',
  imports: [forwardRef(() => SignalC_Resource)],
  template: `
    <SignalC_Resource />
    <br />
    <hr />
  `,
})
export class SignalC {}

// ###############################
// ############################### SYGNAŁ DO OBSŁUGI WARTOŚCI ASYNCHRONICZNYCH
// ############################### resource
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'SignalC_Resource',
  template: ` <div>
    <div>
      <div>userId = {{ userId() }}</div>
      <button (click)="updateUserId()">update userId</button>
    </div>
    <br />
    <hr />
    <!--  -->
    <div>
      <div>
        @if (userResource.isLoading()) {
          <p>Ładowanie...</p>
        } @else if (userResource.error()) {
          <p>Wystąpił błąd: {{ userResource.error()?.cause }}</p>
        } @else {
          @if (userResource.hasValue()) {
            <div>Użytkownik: {{ userResource.value().name }}</div>
          } @else {
            <div>brak wartości</div>
          }
        }
      </div>
      <div>
        <button (click)="reloadUserResource()">reload</button>
        <button (click)="setUserResource()">local_set</button>
        <button (click)="updateUserResource()">local_update</button>
      </div>
      <div style="display: grid; grid-template-columns: 105px 1fr;">
        <div>hasValue =</div>
        <div>{{ userResource.hasValue() }}</div>
        <div>value =</div>
        <div>{{ userResource.value()?.name }}</div>
        <div>isLoading =</div>
        <div>{{ userResource.isLoading() }}</div>
        <div>error =</div>
        <div>{{ userResource.error() }}</div>
        <div>status =</div>
        <div>{{ userResource.status() }}</div>
      </div>
    </div>
    <div>
      {{ this.computedLogger() }}
    </div>
  </div>`,
})
export class SignalC_Resource {
  /*
  sygnał 'resource' do obsługi wartości asynchronicznych!
  w RxJS odpowiednikiem jest rxResource
  */
  /*
  statusy/stany, w których może być 'resource'
      status() 	    value() 	            opis
      ------------------------------------------------------------------------------
      'idle' 	      undefined 	          'resource' nie zaczął jeszcze ładować danych
      'error' 	    undefined 	          Wystąpił błąd
      'loading' 	  undefined 	          trwa ładowanie, wywołane na zmianę wartości sygnałów z 'params'
      'reloading' 	prev value     	      trwa ładowanie, wowłane metodą 'reload'
      'resolved' 	  new resolved value    ładowanie sie zakończyło
      'local' 	    new local value    	  wartość 'resource' ustawiona lokalnie przez 'set' lub 'update'
  */
  /*
  metody 'resource'
    userResource.hasValue()         - [true / false] true gdy 'loader' zwrócił wartość (skończył się przetwarzać)
    userResource.value()            - wartość sygnału 'resource'
    userResource.isLoading()        - [true / false] true na status() 'loading'/'reloading'
    userResource.error()            - wartość błędu gdy wystąpi błąd w 'loader'
    userResource.status()           - któryś z powyższych statusów 'idle' itp..
  */

  userId = signal(1);
  updateUserId = () => {
    this.userId.update((prev) => prev + 1);
  };

  /*
  resource jako obiekt z konfiguracją
    - params    (zależności / producentci) sygnały, których zmiana ma wykonać 'loader'
                działa trochę jak 'linkedSignal' 
                tylko zwracamy to co ma się znaleźć w argumencie 'loader' jako 'params'
    - loader    obliczenie nowej wartości asynchronicznej
                zwraca wartość asynchroniczną np: Promise
                wykona się za każdym razem gdy zmieni się params (to z góry)
  */
  userResource = resource({
    params: () => {
      const userId = this.userId();
      // wartość zwrócona w argumencie 'loader' jako 'params'
      return { id: userId };
    },
    loader: ({ params, abortSignal, previous }): Promise<{ name: string }> => {
      /*
      params         -> wartość zwrócona w 'params'     { id: userId }
      abortSignal    -> sygnał, który można przekazać asynchronicznej funkcji by ją przerwać
      previous       -> status, w którym poprzednio był resource    { status: ResourceStatus }
      */
      console.log(`resource | params      = `, params);
      console.log(`resource | abortSignal = `, abortSignal);
      console.log(`resource | previous    = `, previous); // 'idle', 'resolved'
      return new Promise((mainResolve, mainReject) => {
        let canResolve = true;
        if (canResolve) {
          mainResolve(
            fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`, {
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
              }),
          );
        } else {
          mainReject(new Error('to jest treść błędu'));
        }
      });
    },
  });

  reloadUserResource = () => {
    this.userResource.reload();
  };

  setUserResource = () => {
    /*
    set - pozwala ustawić wartość 'resource' ręcznie 
    zmienia status 'resource' na 'local'
    UWAGA
      - przydatne np: przy formularzach lub optymistycznym aktualizowaniu UI.
      - ustawiamy już na wartość sunchroniczną
    */
    this.userResource.set({ name: 'wartość z SET' });
  };

  updateUserResource = () => {
    /*
    update - pozwala ustawić wartość 'resource' ręcznie 
    zmienia status 'resource' na 'local'
    UWAGA
      - przydatne np: przy formularzach lub optymistycznym aktualizowaniu UI.
      - ustawiamy już na wartość sunchroniczną
    */
    this.userResource.update((prev) => {
      return {
        name: prev?.name + '1',
      };
    });
  };

  /*
  POMIJAĆ - tylko logger
  */
  computedLogger = computed(() => {
    const userRes = this.userResource;
    console.log();
    console.warn(`res | hasValue  = `, userRes.hasValue());
    console.warn(`res | value     = `, userRes.value());
    console.warn(`res | status    = `, userRes.status());
    console.warn(`res | error     = `, userRes.error());
    console.warn(`res | isLoading = `, userRes.isLoading());

    return '';
  });
}
