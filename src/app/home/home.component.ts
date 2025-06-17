import { Component } from '@angular/core';
import { StorageService } from "../services/storage.service";
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { TweetComment } from '../models/tweets/TweetComment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    username : string = "";
    tweetText : string = "";
    tweets:Tweet[] = [];
    tweetComments: TweetComment[] = [];
    comentariosVisibles: { [key: number]: boolean } = {};
    nuevoComentario: { [key: number]: string } = {};
    comentariosPorTweet: { [key: number]: TweetComment[] } = {};
    constructor( private storageService : StorageService,
                 private tweetService: TweetService,
                 private router: Router
               )
    {
       this.username = this.storageService.getSession("user");
       console.log(this.username);
       this.getTweets();
    }

    private getTweets()
 {
  this.tweetService.getTweets().subscribe((tweets: any) => {
     this.tweets = tweets.content;
     console.log(this.tweets);

   });
 }

   public addTweet()
 {
  this.tweetService.postTweet(this.tweetText).subscribe((tweet: any) => {
     console.log(tweet);
     this.getTweets();
     this.tweetText = '';

   });

 }

 public logout(){
   this.storageService.localDeleteAll();
   this.router.navigate(['/login']);
 }

 tiposReaccion: string[] = ['REACTION_LIKE', 'REACTION_LOVE', 'REACTION_HATE', 'REACTION_SAD', 'REACTION_ANGRY'];

getEmoji(tipo: string): string {
  switch (tipo) {
    case 'REACTION_LIKE': return '👍';
    case 'REACTION_LOVE': return '❤️';
    case 'REACTION_HATE': return '😠';
    case 'REACTION_SAD': return '😢';
    case 'REACTION_ANGRY': return '😠';
    default: return '❓';
  }
}

react(tweet: Tweet, tipo: string) {
  this.tweetService.postReactionsTweets(tweet.id, this.convertReaction(tipo)).subscribe(() => {
    tweet.reactionSelected = tipo;
  });
}


convertReaction(tipo: string): number {
  const mapa: any = {
    LIKE: 1,
    LOVE: 2,
    HATE: 3,
    SAD: 4,
    ANGRY: 5
  };
  return mapa[tipo];
}

public toggleComentarios(tweetId: number) {
  this.comentariosVisibles[tweetId] = !this.comentariosVisibles[tweetId];
  
  if (this.comentariosVisibles[tweetId] && !this.comentariosPorTweet[tweetId]) {
    this.tweetService.getComments(tweetId).subscribe({
      next: (comentarios) => {
        this.comentariosPorTweet[tweetId] = comentarios;
      },
      error: (err) => {
        console.error("Error al obtener comentarios:", err);
      }
    });
  }
}

public comentar(tweetId: number) {
  const contenido = this.nuevoComentario[tweetId]?.trim();
  if (!contenido) return;

  this.tweetService.addComment(tweetId, contenido).subscribe({
    next: () => {
      this.nuevoComentario[tweetId] = '';
      this.toggleComentarios(tweetId);
    }
  });
}



}
