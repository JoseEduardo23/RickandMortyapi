import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-detalles',
  standalone: true,
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
  imports: [CommonModule, IonicModule, RouterModule, FormsModule]
})
export class DetallesComponent implements OnInit {
  characteres: any;
  image: string = 'url'
  episodeNames: string[] = [];
  species: string = ''
  status: string = '';
  location: string = '';
  gender: string= '';
  loading = true;
  comentario = ''
  constructor(private firestore:Firestore, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchCharacter(id);
    }
  }

    async subirComentario(){
    if (!this.comentario) {
      alert('Por favor ingresa un comentario')
      return;
    }
    try{
      const comentarios = collection(this.firestore, 'Comentarios')
      await addDoc(comentarios,{
        comentario: this.comentario,
        image: this.characteres.image,
        species: this.species,
        status: this.status,
        location: this.location,
        gender: this.gender
      })
      alert('Comentario subido exitosamente a Firebase')
      this.comentario = ''
    }catch(error){
      console.error('Error al subir el comentario', error)
      alert('Error al subir el comentario')
    }
  }

  fetchCharacter(id: string) {
    this.loading = true;
    this.http.get<any>(`https://rickandmortyapi.com/api/character/${id}`).subscribe({
      next: (data) => {
        this.characteres = data;
        this.species = data.species;
        this.status = data.status
        this.location = data.location?.name
        this.gender = data.gender
        this.fetchEpisodeNames(data.episode.slice(0, 3));
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  fetchEpisodeNames(episodeUrls: string[]) {
    const requests = episodeUrls.map(url => this.http.get<any>(url));
    Promise.all(requests.map(req => req.toPromise()))
      .then(responses => {
        this.episodeNames = responses.map(ep => ep.name);
        this.loading = false;
      })
      .catch(() => {
        this.episodeNames = ['No episodes found'];
        this.loading = false;
      });
  }

  getLocation(): string {
    return this.characteres?.location?.name || 'Unknown';
  }

  getImageUrl(): string {
    return this.characteres?.image || '';
  }
}