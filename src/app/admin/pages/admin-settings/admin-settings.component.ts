
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/UserService';
import { User } from '../../../models/user';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { sha256 } from 'js-sha256';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {
  validationForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  isFormSubmitted: boolean;
  successMessage: string | null = null;
  ErrorMessage: string | null = null;
  countdown: number;
  isFormValid: boolean;
  PasswordisFormValid: boolean;
  emailExistsError: string | null;
  currentUser: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    public formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    }
    this.validationForm = this.formBuilder.group({
      id: [this.currentUser.id, Validators.required],
      nom: [this.currentUser.nom, Validators.required],
      prenom: [this.currentUser.prenom, Validators.required],
      role: [this.currentUser.role, Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      password: [this.currentUser.motDePasse, Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  get form() {
    return this.validationForm.controls;
  }



  UpdateUser() {
    this.successMessage = null;
    this.ErrorMessage = null;
    this.isFormSubmitted = true;
    this.emailExistsError = null;

    const email = this.form.email.value;
    this.userService.checkEmailExists(email).subscribe((exists) => {
      if (exists && (this.currentUser.email !== this.form.email.value)) {
        this.emailExistsError = 'Email existe déja';
        this.isFormSubmitted = false;
      } else if (this.validationForm.valid) {
        this.isFormValid = true;

        // Update the current user with the form values
        this.currentUser.nom = this.form.nom.value;
        this.currentUser.prenom = this.form.prenom.value;
        this.currentUser.role = this.form.role.value;
        this.currentUser.email = this.form.email.value;


        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.userService.UpdateUser(this.currentUser).subscribe((response) => {
          localStorage.setItem('isLoggedin', 'true');
          location.reload();

          this.isFormSubmitted = false;
        });
      }
    });
  }


  changePassword() {
    this.successMessage = null;
    this.ErrorMessage = null;

    if (this.passwordForm.valid) {
      this.PasswordisFormValid = true;



      const currentPassword = this.passwordForm.value.currentPassword;
      const newPassword = this.passwordForm.value.newPassword;
      const confirmPassword = this.passwordForm.value.confirmPassword;

      // Check if the new password and confirm password fields match
      if (newPassword !== confirmPassword) {
        // Display an error message and return
        this.ErrorMessage = 'les mots de passe ne correspondent pas!';
        return;
      }

      // Hash the current password for comparison
      const hashedCurrentPassword = sha256(currentPassword);

      // Compare the hashed current password with the stored password
      if (hashedCurrentPassword !== this.currentUser.motDePasse) {
        // Display an error message and return
        this.ErrorMessage = 'mot de passe incorrect!';
        return;
      }

      // Hash the new password and update the current user's password
      const hashedNewPassword = sha256(newPassword);
      this.currentUser.motDePasse = hashedNewPassword;

      // Save the updated user to local storage and send the update request to the server
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.userService.UpdateUser(this.currentUser).subscribe((response) => {
        this.successMessage = 'Mot de passe a été changé avec succée!';
        this.passwordForm.reset();

      });
    }
  }

  hideSuccessMessage() {


    this.successMessage = null;

  }
  hideErrorMessage() {


    this.ErrorMessage = null;

  }







}




