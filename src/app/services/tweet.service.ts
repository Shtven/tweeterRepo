import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { TweetComment } from '../models/tweets/TweetComment';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  apiURL = 'http://localhost:8080/';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  private getHttpOptions() {
    const token = this.storageService.getSession("token"); // dinámico
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
  }

  getTweets(): Observable<Tweet> {
    return this.http.get<Tweet>(this.apiURL + 'api/tweets/all', this.getHttpOptions())
      .pipe(retry(1), catchError(this.handleError));
  }

  getComments(tweetId: number): Observable<TweetComment[]>{
    return this.http.get<TweetComment[]>(this.apiURL + 'api/comments/commentsByTweet/' + tweetId, this.getHttpOptions())
    .pipe(retry(1), catchError(this.handleError));
  }

  postTweet(myTweet: string): Observable<any> {
    const body = { tweet: myTweet };
    return this.http.post(this.apiURL + 'api/tweets/create', body, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  postReactionsTweets(tweetId: Number, reactionId: Number){
    const body = {
      tweetId: tweetId,
      reactionId: reactionId
    }
    return this.http.post(this.apiURL + 'api/reactions/create', body, this.getHttpOptions())
  }

  addComment(tweetId: number, comment: string){
    const body = {
      comment: comment,
      tweetId: tweetId
    }

    return this.http.post(this.apiURL + 'api/comments/create', body, this.getHttpOptions());
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
