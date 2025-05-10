import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User, Role } from '../models/user';
import { UserService } from '../services/UserService';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MessagesModalService } from '../messages-modal.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  signInEmail: string = '';
  signInPassword: string = '';
  alert: string = '';
  users: User[] = [];
  returnUrl: any;
  validationForm: UntypedFormGroup;
  user: User = new User();
  isFormSubmitted: boolean = false;
  successMessage: string = '';
  isFormValid: boolean = false;
  emailExistsError: string | null = null;
  roles = Object.values(Role);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    public formBuilder: UntypedFormBuilder,
    public messageService: MessagesModalService
  ) {}

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['CLIENT', Validators.required],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/compte';

    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton?.addEventListener('click', () => container?.classList.add('right-panel-active'));
    signInButton?.addEventListener('click', () => container?.classList.remove('right-panel-active'));
  }

  login() {
    this.alert = '';
    this.userService.login(this.signInEmail, this.signInPassword).subscribe(
      (userData) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id.toString());
        localStorage.setItem('role', userData.role);
        if (userData.role === 'ADMIN') {
          this.router.navigate(['/compte/admin/dashboard']);
        } else {
          this.router.navigate(['/mon-compte']);
        }
      },
      (error) => {
        if (error.status === 401) {
          this.alert = error.error?.error || 'Email ou mot de passe incorrect';
        } else {
          this.alert = 'Erreur serveur, réessayez plus tard.';
        }
      }
    );
  }

  onRegister(e: Event) {
    this.isFormSubmitted = true;
    this.emailExistsError = null;
    e.preventDefault();
  
    const email = this.form.email.value;
  
    this.userService.checkEmailExists(email).subscribe((exists) => {
      if (exists) {
        this.emailExistsError = 'Email existe déjà';
        this.isFormSubmitted = false;
      } else if (this.validationForm.valid) {
        this.isFormValid = true;
  
        // Créer l'objet dans le même format que Postman
        const userData = {
          nom: this.form.lastName.value,
          prenom: this.form.firstName.value,
          email: this.form.email.value,
          motDePasse: this.form.password.value,
          role: 'CLIENT'
        };
  
        this.userService.addUser(userData).subscribe(() => {
          localStorage.setItem('verifyEmail', userData.email);
          this.messageService.toastSuccess('Inscription réussie !');
          this.isFormSubmitted = false;
          this.router.navigate(['/verify-code']);
          document.getElementById('container')?.classList.remove('right-panel-active');
        });
      }
    });
  }

  get form() {
    return this.validationForm.controls;
  }
}
