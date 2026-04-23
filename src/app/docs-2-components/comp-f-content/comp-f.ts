import { Component, forwardRef } from '@angular/core';

@Component({
  selector: 'app-comp-f',
  imports: [
    forwardRef(() => CompF_NgContent), //
  ],
  template: `
    <!--  -->
    <CompF_NgContent />
    <br />
    <hr />
  `,
})
export class CompF {
  /*
   */
}

// ###############################
// ############################### Przekazywanie dzieci do komponentu
// ############################### <ng-content>
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompF_NgContent',
  imports: [
    forwardRef(() => CompF_NgContentBase),
    forwardRef(() => CompF_NgContentAdvance),
    forwardRef(() => ContentTitle),
  ],
  template: `
    <div>
      <p>CompF_NgContent</p>
      <br />

      <!--  -->
      <CompF_NgContentBase>
        <p>Kontent Base</p>
      </CompF_NgContentBase>
      <br />

      <!--  -->
      <CompF_NgContentAdvance>
        <app-content-title />
        <div>TAG_bez_select</div>
        <div footer>TAG_select_footer</div>
        <div ngProjectAs="app-content-alias">TAG_alias</div>
      </CompF_NgContentAdvance>
      <br />
    </div>
  `,
})
export class CompF_NgContent {
  /*
   */
}

// ###############################
// ############################### podstawa dla <ng-content />
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompF_NgContentBase',
  imports: [],
  template: `
    <div>
      <p>CompF_NgContentBase</p>
      <br />

      <div>
        <ng-content />
      </div>
    </div>
  `,
})
export class CompF_NgContentBase {
  /*
  Content Projection <ng-content> -> projektowanie treści, odpowiednik 'props.children' w React
  pokazuje gdzie wyrenerowac treść przekazaną między tagami hosta, bez tego nie będzie contentu w DOM

  <CompF_NgContentBase>       // HOST     -> odpowiednik w DOM selectora komponentu
    <p>Kontent Base</p>       // CONTENT  -> to co między tagami HOSTA, zastąpi tag <ng-content /> w szablonie
  </CompF_NgContentBase>      // HOST

  Po wyrederowaniu będzie:
  <compf_ngcontentbase>               // HOST
    <div>                             // VIEW - z TEMPLATE (szablonu)
      <p>CompF_NgContentBase</p>      // VIEW - z TEMPLATE (szablonu)
      <br>                            // VIEW - z TEMPLATE (szablonu)
      <div>                           // VIEW - z TEMPLATE (szablonu)
        <p>Kontent Base</p>           // zmiast <ng-content /> wyrenderuje to co przekazano między tagami komponentu
      </div>                          // VIEW - z TEMPLATE (szablonu)
    </div>                            // VIEW - z TEMPLATE (szablonu)
  </compf_ngcontentbase>              // HOST
  
  INFORMACJE o 'content'
  - tag <ng-content> nie tworzy dodatkowego elementu w HTML-u
    zostaje w całości zastąpiony przez content
  - content, czyli '<p>Kontent Base</p>' jest utworzony w kontekście komponentu
    <CompF_NgContent /> -> czyli tam gdzie znajduje się jego tag,
    a nie w kontekście komponentu, który go projektuje czyli <CompF_NgContentBase />
  - <ng-content> nie może miec properties i dyrektyw 
  
  UWAGA
  NIE uzywać <ng-content/> w condition rendering (@if, @for, or @switch) do tego stosować <ng-template />
  */
}

// ###############################
// ############################### zaawansowany <ng-content />
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
@Component({
  selector: 'CompF_NgContentAdvance',
  imports: [],
  template: `
    <div>
      <p>CompF_NgContentAdvance</p>
      <br />

      <div>
        <div>
          <ng-content select="app-content-title" />
          <!-- ZAMINI_SIE_NA | komponent 'ContentTitle' 
              <app-content-title>
                <div>TAG_component</div>
              </app-content-title> 
          -->
        </div>
        <div>
          <ng-content />
          <!-- ZAMINI_SIE_NA | <div>TAG_bez_select</div> -->
        </div>
        <div>
          <ng-content select="[footer]" />
          <!-- ZAMINI_SIE_NA | <div footer>TAG_select_footer</div> -->
        </div>
        <div>
          <ng-content select="app-content-alias" />
          <!-- ZAMINI_SIE_NA | <div ngProjectAs="app-content-alias">TAG_alias</div> 
          dzięki atrybutowi 'ngProjectAs' -> który wskazuje pod jaki 'select' ma trafić element
          -->
        </div>
        <div>
          <ng-content select="[placeholder]"><div>TAG_placeholder</div></ng-content>
          <!-- ZAMINI_SIE_NA | <div>TAG_placeholder</div> 
          u rodzica brak tagu pasującego do 'select' więc wyświetli to co między <ng-content></ng-content> 
          -->
        </div>
      </div>
    </div>
  `,
})
export class CompF_NgContentAdvance {
  /*
  <ng-content /> może wystąpić wiele razy w 'template', ale każdy musi mieć unikalny atrybut 'select',
  który określa selektor CSS dla kontentu, które zostaną w nim wyrenderowane

  <ng-content /> może posiadać domyślną wartość (placeholder), która zostanie wyświetlona gdy nie znajdzie się 
  'content', który odpowiada selektorowi danego <ng-content />

  kontent moża aliasować za pomocą atrybutu 'ngProjectAs' i wtedy trafi
  do <ng-content/>, którego 'select' odpowiada alasowanej wartości

  <compf_ngcontentadvance>
    <div>
      <p>CompF_NgContentAdvance</p>
      <br>
      
      <div>
        <div>
          <app-content-title>
            <div>TAG_component</div>
          </app-content-title>
        </div>
        <div>
          <div>TAG_bez_select</div>
        </div>
        <div>
          <div footer="">TAG_select_footer</div>
        </div>
        <div>
          <div ngprojectas="app-content-alias">TAG_alias</div>
        </div>
        <div>
          <div>TAG_placeholder</div>
          <!--container-->
        </div>
      </div>
    </div>
  </compf_ngcontentadvance>
  */
}

@Component({
  selector: 'app-content-title',
  template: `<div>TAG_component</div>`,
})
export class ContentTitle {}
