import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  // Méthode de récupération des tickets depuis la BDD

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(
        map(postData => {
          return { posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              category: post.category,
              status: post.status,
              response: post.response,
              id: post._id,
              date: post.date,
              creator: post.creator
            };
          }), maxPosts: postData.maxPosts };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
      });
  }

  // Observable des tickets

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // Récupération du ticket avec son ID pour update ou suppression

  getPost(id: string) {
    return this.http.get<{
      _id: string, title: string,
      content: string,
      category: string,
      status: string,
      response: string,
      creator: string }>
    (BACKEND_URL + id);
  }

  // Sauvegarde des tickets dans la BDD

  addPost(title: string, content: string, category: string, status: string, response: string) {
    const post: Post = { id: null, title: title, content: content, category: category, status: status, response: response, creator: null };
    this.http
      .post<{ message: string; postId: string }>(
        BACKEND_URL,
        post
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  // Mise à jour du ticket

  updatePost(id: string, title: string, content: string, category: string, status: string, response: string) {
    const post: Post = { id: id, title: title, content: content, category: category, status: status, response: response, creator: null };
    this.http
      .put(BACKEND_URL + id, post)
      .subscribe(responses => {
        this.router.navigate(['/']);
      });
  }

  // Suppression du ticket

  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId);
  }

}
