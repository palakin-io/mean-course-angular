import { Component, OnDestroy, OnInit } from "@angular/core"
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"

import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validaror";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredContent= '';
  enteredTitle = '';
  private mode = "create";
  private postId: string;
  post: Post;
  form: FormGroup;
  imagePreview: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators:[mimeType]})
    })
    this.route.paramMap.subscribe((params) => {
      if (params.has('postId')) {
        this.mode = 'edit';
        this.postId = params.get('postId');
        this.post = this.postService.getPost(this.postId);
      } else {
        this.mode = 'create';
      }
    });
  }

  onAddPost(){
    if (this.form.invalid) {
      return;
    }
    const post: Post = {
      id: '',
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: null
    }
    this.postService.addPost(post, this.form.value.image);
    this.form.reset();
  };

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
}
