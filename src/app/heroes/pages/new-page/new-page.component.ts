import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:        new FormControl<string>(''), 
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img:    new FormControl('')
  })

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
    ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    
    if ( !this.router.url.includes('edit') ) return; //si el endpoint no incluye la palabra edit no se hace nada

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      ).subscribe( hero => {

        if ( !hero ) {
          return this.router.navigateByUrl('/');
        }

        this.heroForm.reset( hero );
        return;
      } )

  }

  onSubmit():void{

    //validacion
    if ( this.heroForm.invalid ) return;

    //si tenemos el id de hero actualizamos información
    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
            this.showSnackbar(`${ hero.superhero } updated!`);
        });

      return;   //si se cumple la linea 43 nos salimos con este return y no ejecuta nada más de nuestro código
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
          // TODO: mostrar snackbar, y navegar a /heroes/edit/ hero.id

          this.router.navigate(['/heroes/edit', hero.id ]);
          this.showSnackbar(`${ hero.superhero } created!`);
      });
  }


  showSnackbar(message: string):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    } )
  }
}
