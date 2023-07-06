import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'
import { PageEvent } from '@angular/material/paginator';

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
  totalPosts = 0;
  postsPerPage = 5;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;

  constructor(public postService: PostService) {}

  ngOnInit(): void {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
      this.postsSub = this.postService.getPostsUpdated().subscribe((postData : {posts : Post[], postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
  }

  onDelete(id: string){
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangePage(event: PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
