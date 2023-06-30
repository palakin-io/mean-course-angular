import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { PostService } from '../post.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'first post', content: 'This is the first post content'},
  //   {title: 'second post', content: 'This is the second post content'},
  //   {title: 'third post', content: 'This is the third post content'},
  // ]

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit(): void {
      this.postService.getPosts();
      this.postsSub = this.postService.getPostsUpdated().subscribe((posts) => {
        this.posts = posts;
      });
  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
  }

  onDelete(id: string){
    this.postService.deletePost(id);
  }
}
