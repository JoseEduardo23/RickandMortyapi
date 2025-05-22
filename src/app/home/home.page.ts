import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonButton } from '@ionic/angular';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule, FormsModule]
})
export class HomePage implements OnInit {
  characters: any[] = [];
  filteredCharacters: any[] = [];
  page = 1;
  loading = false;
  searchTerm = '';

  comentario: string='';

  constructor(private http: HttpClient, private router: Router) {}


  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters() {
    if (this.loading) return;
    this.loading = true;
    this.http
      .get<any>(`https://rickandmortyapi.com/api/character?page=${this.page}`)
      .subscribe(res => {
        this.characters = res.results;
        this.filteredCharacters = this.characters;
        this.loading = false;
      });
  }

  filterCharacters() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCharacters = this.characters.filter(character =>
      character.name.toLowerCase().includes(term)
    );
  }

  goToDetails(id: number) {
    this.router.navigate(['/detalles', id]);
  }
}