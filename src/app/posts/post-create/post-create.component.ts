import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Subscription } from '../../../../node_modules/rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post;
  isLoading = false;
  form: FormGroup;
  mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;

  categories = [
    {name: 'Information'},
    {name: 'Demande'},
    {name: 'Incident'}
  ];

  statusOptions = [
    { name: 'En cours'},
    { name: 'Terminé et validé' },
    { name: 'Terminé non validé'}
  ];

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Création des relations avec le formulaire
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(5), Validators.maxLength(50)]}),
      'content': new FormControl(null, {validators: [Validators.required, Validators.minLength(10)]}),
      'category': new FormControl(null, {validators: [Validators.required]}),
      'status': new FormControl('En cours', {validators: [Validators.required]}),
      'response': new FormControl(null)
    });
    // Définition du mode (création de ticket ou édition )
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // Mode édition
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            category: postData.category,
            status: postData.status,
            response: postData.response,
            creator: postData.creator
           };
          // Récupération des données dans la BDD pour l'édition du ticket
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            category: this.post.category,
            status: this.post.status,
            response: this.post.response
          });
        });
      } else {
        // Mode création
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // Méthode de sauvegarde du ticket

  onSavePost() {
    // Test de validité du ticket soumis
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    // Envoi des données vers le service
    if (this.mode === 'create') {
      // Mode de création
      this.postsService.addPost(this.form.value.title,
        this.form.value.content,
        this.form.value.category,
        this.form.value.status,
        this.form.value.response
      );
    } else {
      // Mode d'édition
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.category,
        this.form.value.status,
        this.form.value.response
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
