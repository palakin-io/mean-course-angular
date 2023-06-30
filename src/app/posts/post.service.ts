import { Post } from "./post.model"
import { Injectable } from "@angular/core"
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs";


@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) { }

  getPosts() {
    this.httpClient.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
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

  addPost(post: Post) {
    this.httpClient.post<{message: string, id: string}>('http://localhost:3000/api/posts', post).subscribe((response) => {
      const postId = response.id;
      post.id = postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
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
