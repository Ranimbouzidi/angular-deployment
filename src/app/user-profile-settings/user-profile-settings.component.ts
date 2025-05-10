import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { sha256 } from 'js-sha256';
import { UserService } from '../services/UserService';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-user-profile-settings',
  templateUrl: './user-profile-settings.component.html',
  styleUrls: ['./user-profile-settings.component.scss']
})
export class UserProfileSettingsComponent implements OnInit {
  validationForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  isFormSubmitted = false;
  isFormValid = false;
  PasswordisFormValid = false;
  successMessage: string | null = null;
  ErrorMessage: string | null = null;
  emailExistsError: string | null;
  currentUser: User;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    public formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }

    this.validationForm = this.formBuilder.group({
      id: [this.currentUser.id, Validators.required],
      lastName: [this.currentUser.nom, Validators.required],
      firstName: [this.currentUser.prenom, Validators.required],
      phone: [this.currentUser.numeroDeTelephone, Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]]
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadAndSave() {
    console.log('▶️ Formulaire soumis');
    this.successMessage = null;
    this.ErrorMessage = null;
    this.isFormSubmitted = true;
    this.emailExistsError = null;

    const email = this.form.email.value;

    if (!this.validationForm.valid) {
      console.warn('⚠️ Formulaire invalide', this.validationForm.value);
      return;
    }

    // Mise à jour des données utilisateur depuis le formulaire
    this.currentUser.nom = this.form.lastName.value;
    this.currentUser.prenom = this.form.firstName.value;
    this.currentUser.numeroDeTelephone = this.form.phone.value;
    this.currentUser.email = email;

    console.log('📥 currentUser prêt pour update', this.currentUser);

    if (this.selectedFile) {
      console.log('📸 Upload image en cours...');
      this.userService.uploadPhoto(this.selectedFile).subscribe({
        next: (res) => {
          console.log('✅ Upload terminé :', res.filename);
          this.currentUser.photo = res.filename;
          this.saveUser();
        },
        error: (err) => {
          console.error('❌ Erreur upload image', err);
          this.ErrorMessage = 'Erreur lors de l\'upload de la photo.';
        }
      });
    } else {
      this.saveUser();
    }
  }

  private saveUser() {
    console.log('📤 Envoi PUT avec user =', this.currentUser);

    this.userService.UpdateUser(this.currentUser).subscribe({
      next: (response) => {
        console.log('✅ Backend a répondu :', response);
        this.successMessage = 'Mise à jour réussie';
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.selectedFile = null;
        this.imagePreview = null;
      },
      error: (error) => {
        console.error('❌ Erreur API UpdateUser :', error);
        this.ErrorMessage = 'Impossible de mettre à jour les informations.';
      }
    });
  }

  changePassword() {
    this.successMessage = null;
    this.ErrorMessage = null;

    if (this.passwordForm.valid) {
      const currentPassword = this.passwordForm.value.currentPassword;
      const newPassword = this.passwordForm.value.newPassword;
      const confirmPassword = this.passwordForm.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        this.ErrorMessage = 'Les mots de passe ne correspondent pas!';
        return;
      }

      const hashedCurrentPassword = sha256(currentPassword);
      if (hashedCurrentPassword !== this.currentUser.motDePasse) {
        this.ErrorMessage = 'Mot de passe incorrect!';
        return;
      }

      const hashedNewPassword = sha256(newPassword);
      this.currentUser.motDePasse = hashedNewPassword;

      this.userService.UpdateUser(this.currentUser).subscribe(() => {
        this.successMessage = 'Mot de passe changé avec succès!';
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


