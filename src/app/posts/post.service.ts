import { Post } from "./post.model"
import { Injectable } from "@angular/core"
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`
    this.httpClient.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return {posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        }
      }),
      maxPosts: postData.maxPosts
     }
    })).subscribe((transformedPostsData) => {
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostsData.maxPosts });
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
      this.router.navigate(["/"]);
    });
  }

  deletePost(id: string){
    return this.httpClient.delete("http://localhost:3000/api/posts/" + id);

  }
}
