import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/UserService';
import { User } from '../models/user';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent {
  validationForm: UntypedFormGroup;
  user: User = new User();
  isFormSubmitted: boolean;
  successMessage: string;
  countdown: number;
  isFormValid: boolean;
  emailExistsError: string | null;
  

  constructor(
    private router: Router,
    private userService: UserService,
    public formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.validationForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      phone: ['', Validators.required],
     
      
    });
  }

  get form() {
    return this.validationForm.controls;
  }

  

  onRegister(e: Event) {
    this.isFormSubmitted = true;
    this.emailExistsError = null;
    e.preventDefault();
    const email = this.form.email.value;
    this.userService.checkEmailExists(email).subscribe((exists) => {
      if (exists) {
        this.emailExistsError = 'Email existe déja';
        this.isFormSubmitted = false;
      } else if (this.validationForm.valid)  {
        this.isFormValid = true;
        // Hash the password with sha256
        const password = sha256(this.form.password.value);
        this.user.motDePasse = password;

       
        this.userService.addUser(this.user).subscribe((response) => {
          localStorage.setItem('isLoggedin', 'true');
          
          if (localStorage.getItem('isLoggedin')) {
            this.successMessage = 'inscription reussite !';
            this.countdown = 5;
            const intervalId = setInterval(() => {
              this.countdown--;
              if (this.countdown === 0) {
                clearInterval(intervalId);
                this.router.navigate(['/connexion']);
              }
            }, 1000);
          }
          this.isFormSubmitted = false;
        });
      }
    });
  }

  
}