import { Component, forwardRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-comp-cc',
  template: `
    <div class="comp-cc">CompCC</div>
    <button>Comp CC przycisk</button>
  `,
  // (inline) style można określać w metadanych dekoratora komponentu
  styles: `
    .comp-cc {
      width: 80px;
      height: 80px;
      border: 2px solid green;
      border-radius: 50%;
    }

    :host {
      display: block;
      padding: 16px;
      margin: 16px;
      border: 2px solid red;
      border-radius: 8px;
    }

    :host-context(.dark) button {
      padding: 16px;
      margin: 16px;
      background-color: black;
      color: white;
      border: 2px solid blue;
    }
  `,
})
export class CompCC {}

@Component({
  selector: 'app-comp-ccc-scope',
  template: `
    <!-- style które sa w <style> w 'template' też są objęte ENKAPSULACJĄ  -->
    <style>
      p {
        background-color: purple;
      }
    </style>
    <p>Comp CCC SCOPE</p>
    <app-comp-ccc-scope-child />
  `,
  styles: `
    p {
      color: red;
    }

    :host ::ng-deep p {
      background-color: yellow;
    }
  `,
  encapsulation: ViewEncapsulation.Emulated,
  // encapsulation: ViewEncapsulation.ShadowDom,
  // encapsulation: ViewEncapsulation.ExperimentalIsolatedShadowDom,
  // encapsulation: ViewEncapsulation.None,
  imports: [forwardRef(() => CompCCCScopeChild)],
})
export class CompCCCScope {
  /*
	Style Scoping (zakres styli) realizowany przez View Encapsulation.
	Wyobraź sobie, że każdy komponent żyje w "bańce". i to co przepuszcza w wyglądzie zależy od nas

	Emulated i ShadowDom nie gwarantuje w 100%, 
	że style komponentu zawsze będą miały pierwszeństwo przed stylami pochodzącymi spoza niego. 
	Zakłada się, że style te mają taką samą ważność jak style Twojego komponentu w przypadku kolizji.

	View Encapsulation
			- Emulated (DOMYŚLNY)
						- style ograniczone tylko do komponentu 
						- style komponentu mają zastosowanie tylko do elementów zdefiniowanych w szablonie tego komponentu
						- style globalne zdefiniowane poza komponentem DZIAŁAJĄ
						- generuje unikalny atrybut HTML dla każdej instancji komponentu (np. _ngcontent-c15)
						- dodaje do selektorów CSS ten sam atrybut
									.title { color: blue; }
									.title[_ngcontent-c15] { color: blue; }			-> zadziała tylko tam, gdzie element ma atrybut _ngcontent-c15
						- obsługuje pseudoklasę :host i :host-context() [ta przestarzała] -> zamienia na atrybuty HTML
						- OBSŁUGUJE ::ng-deep ORADZANE UŻYCIE !!!!
									Angular przestaje stosować enkapsulacji widoku po tym miejscu w selektorze. 
									część następująca po ::ng-deep może pasować do elementów spoza szablonu komponentu.
			- ShadowDom [raczej unikać]
						- najbardziej rygorystyczna izolacja. na 100% tylko do komponentu
							Wykorzystuje natywną funkcję przeglądarki (Shadow DOM)
							Style z zewnątrz (nawet globalne) nie wejdą do środka komponentu 
            - style globalne zdefiniowane poza komponentem NIE DZIAŁAJĄ
							style ze środka nigdy nie wyjdą na zewnątrz.
							UWAGA wpływa na propagację zdarzeń
			- ExperimentalIsolatedShadowDom
						- Style globalne zdefiniowane poza komponentem NIE DZIAŁAJĄ
							style wewnątrz drzewa cieni nie mogą wpływać na elementy poza tym drzewem cieni.
			- None
						- Całkowity brak izolacji style globalne. 
							Twoje style z pliku komponentu zostaną dołączone do nagłówka <head> strony i staną się .
	*/
}
@Component({
  selector: 'app-comp-ccc-scope-child',
  template: `<p>Comp CCC SCOPE CHILD</p>`,
})
export class CompCCCScopeChild {}

@Component({
  selector: 'app-comp-c',
  imports: [CompCC, CompCCCScope],
  template: `
    <div class="comp-c">CompC</div>
    <div class="light">
      <!-- 
			:host -> działa na '<app-comp-cc />	
			-->
      <app-comp-cc />
    </div>
    <div class="dark">
      <!-- 
			:host-context() -> działa na '<div class="dark">' czyli rodzica '<app-comp-cc />'
			-->
      <app-comp-cc />
    </div>
    <app-comp-ccc-scope />
  `,
  // (zalecane) można style podać też w osobnym stylu
  // pozwalan na SCSS, Sass
  styleUrl: './comp-c.css',
  encapsulation: ViewEncapsulation.None,
})
export class CompC {
  /*
	stylowanie komponentu:
			Podczas renderowania komponentu Angulara uwzględnia powiązane z nim style, nawet podczas lazy-load
			DOMYŚLNIE
					style są powiązane wyłącznie z danym komponentem

	WAŻNE
	:host: 				
			Służy do stylowania całego elementu, który reprezentuje nasz komponent
	:host-context():  [przestarzałe]
			Pozwala stylować komponent w zależności od jego rodzica np: jego klasy

	<div>									// :host-context() [przestarzałe]
		<app-comp>					// :host
			<div>							// reszta ze styli w 'styles' lub 'styleUrl
				Wartość div			// reszta ze styli w 'styles' lub 'styleUrl
			</div>						// reszta ze styli w 'styles' lub 'styleUrl
		</app-comp>					// :host
	</div>								// :host-context() [przestarzałe]

	*/
}
