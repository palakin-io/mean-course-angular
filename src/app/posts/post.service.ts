import { Post } from "./post.model"
import { Injectable } from "@angular/core"
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts() {
    this.httpClient.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        }
      })
    })).subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostsUpdated(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string){
    return {...this.posts.find(p => p.id === id)};
  }

  addPost(posteo: Post, image: File) {
    const postData = new FormData();
    postData.append("title", posteo.title);
    postData.append("content", posteo.content);
    postData.append("image", image, posteo.title);
    this.httpClient.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData).subscribe((response) => {
      const post: Post = {id: response.post.id, title: posteo.title, content: posteo.content, imagePath: response.post.imagePath}
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(id: string){
    this.httpClient.delete("http://localhost:3000/api/posts/" + id).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });

  }
}
