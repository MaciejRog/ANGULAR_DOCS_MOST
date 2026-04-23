import {
  afterEveryRender,
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  forwardRef,
  Input,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-comp-m',
  imports: [
    forwardRef(() => CompM_ChangeDetectionWrapper), //
    forwardRef(() => CompM_Whitespaces),
    forwardRef(() => CompM_CustomElementSchema),
  ],
  template: `
    <!--  -->
    <CompM_ChangeDetectionWrapper />
    <br />
    <hr />

    <!--  -->
    <CompM_Whitespaces />
    <br />
    <hr />

    <!--  -->
    <CompM_CustomElementSchema />
    <br />
    <hr />
  `,
})
export class CompM {}

// ###############################
// ############################### jak komponent reaguje na zmiany
// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompM_ChangeDetectionWrapper',
  imports: [
    forwardRef(() => CompM_ChangeDetectionBase),
    forwardRef(() => CompM_ChangeDetectionPush),
  ],
  template: `
    <div>
      <div>CompM_ChangeDetectionWrapper</div>
      <br />
      <div>
        <div>object {{ this.classicObject.name }}</div>
        <div>
          <button (click)="updateObjectName()">update_object_name</button>
          <button (click)="updateObjectRef()">update_object_ref</button>
        </div>
        <div>signal {{ this.signalObject().name }}</div>
        <div>
          <button (click)="updateSignalName()">update_signal_name</button>
          <button (click)="updateSignalRef()">update_signal_ref</button>
        </div>
      </div>
      <br />
      <div>
        <CompM_ChangeDetectionBase
          [classicObject]="this.classicObject"
          [signalObject]="this.signalObject()"
        />
        <CompM_ChangeDetectionPush
          [classicObject]="this.classicObject"
          [signalObject]="this.signalObject()"
        />
      </div>
    </div>
  `,
})
export class CompM_ChangeDetectionWrapper {
  /*
   */
  classicObject = { name: 'obj_Aga' };
  updateObjectName = () => {
    this.classicObject.name += '_1';
  };
  updateObjectRef = () => {
    if (this.classicObject.name.startsWith('obj_Aga')) {
      this.classicObject = { name: 'obj_Maciej' };
    } else {
      this.classicObject = { name: 'obj_Aga' };
    }
  };

  signalObject = signal({ name: 'signal_Aga' });
  updateSignalName = () => {
    this.signalObject.update((prev) => {
      prev.name += '_1';
      return prev;
    });
  };
  updateSignalRef = () => {
    if (this.signalObject().name.startsWith('signal_Aga')) {
      this.signalObject.set({ name: 'signal_Maciej' });
    } else {
      this.signalObject.set({ name: 'signal_Aga' });
    }
  };

  /*
	ChangeDetection, czyli Strategie wykrywania zmian (co powoduje rerender dla komponentu)
  - ChangeDetectionStrategy.Default (DOMYŚLNE)
    sprawdza komponent i całe jego poddrzewo, przy każdym cyklu wykrywania zmian.
    wywoływane przez KAŻDE ZDARZENIE W APLIKACJI

  - ChangeDetectionStrategy.OnPush -> restrykcyjne i zalecane dla poprawy wydajności
    sprawdza czy komponent nie potrzebuje aktualizacji DOM, wywoływane TYLKO NA:
    - zmianę referencji 'inputów'
    - 'output' komponentu:
    - 'pipe async' Gdy Observable powiązany z szablonem wyemituje nową wartość.
    - ręczne wywołanie za pomocą 'markForCheck()' z DI 'ChangeDetectorRef'
          constructor(private cdr: ChangeDetectorRef) {}
          updateData() {
            //... 
            this.cdr.markForCheck();    // <- Mówimy: "Przy najbliższej okazji sprawdź ten komponent"
          }
	*/
}

// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompM_ChangeDetectionBase',
  imports: [],
  template: `
    <div>
      <div>CompM_ChangeDetectionBase</div>
      <div>
        <span>object = {{ this.classicObject().name }}</span>
        &nbsp;
        <span>signal = {{ this.signalObject().name }}</span>
      </div>
    </div>
  `,
  // changeDetection: ChangeDetectionStrategy.Default   // <- domyślna wartość
})
export class CompM_ChangeDetectionBase {
  /*
   */
  classicObject = input.required<{ name: string }>();
  signalObject = input.required<{ name: string }>();

  constructor() {
    afterEveryRender(() => {
      console.log(`changeDetection | Default |`);
    });
  }
}

// ###############################
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompM_ChangeDetectionPush',
  imports: [],
  template: `
    <div>
      <div>CompM_ChangeDetectionPush</div>
      <div>
        <span>object = {{ this.classicObject().name }}</span>
        &nbsp;
        <span>signal = {{ this.signalObject().name }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompM_ChangeDetectionPush {
  /*
   */
  classicObject = input.required<{ name: string }>();
  signalObject = input.required<{ name: string }>();

  constructor() {
    afterEveryRender(() => {
      console.log(`changeDetection | OnPush |`);
    });
  }
}

// ###############################
// ############################### zachowanie lub niezachowanie spacji i enterów w
// ############################### PreserveWhitespaces
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompM_Whitespaces',
  imports: [],
  template: `
    <div>
      <div>CompM_Whitespaces</div>
      <div>
        <p>Par_1</p>

        <p>Par_2</p>
      </div>
    </div>
  `,
  preserveWhitespaces: true,
  // preserveWhitespaces: false, // <- DOMYŚLNIE
})
export class CompM_Whitespaces {
  /*
	Domyślnie Angular usuwa i kompresuje zbędne spacje w szablonach,

  preserveWhitespaces: true, -> WYRENDERUJE SZABLON JAKO:
  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  <CompM_Whitespaces>
    <<div>
      <div>CompM_Whitespaces</div>
      <div>
        <p>Par_1</p>

        <p>Par_2</p>
      </div>
    </div>
  </CompM_Whitespaces

  preserveWhitespaces: false,   -> WYRENDERUJE SZABLON JAKO:
  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
	<compm_whitespaces><div><div>CompM_Whitespaces</div><div><p>Par_1</p><p>Par_2</p></div></div></compm_whitespaces>
	*/
}

// ###############################
// ############################### Brak błedu na tagi html, o których Angular nie wie!
// ############################### Custom element schemas
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompM_CustomElementSchema',
  imports: [],
  template: `
    <div>
      <div>CompM_CustomElementSchema</div>
      <br />
      <div>
        <takiego-taga-to-na-bank-nie-ma />
      </div>
    </div>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompM_CustomElementSchema {
  /*
	DOMYŚLNIE ANGULAR rzuci BŁĘDEM gdy napotka nieznany tag HTML
	można to wyłączyć, dzieki opcji
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
	*/
}
