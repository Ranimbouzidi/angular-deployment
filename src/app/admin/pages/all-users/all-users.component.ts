import { Component, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { sha256 } from 'js-sha256';
import { DataTable } from 'simple-datatables';
import { User, Role } from '../../../models/user';
import { UserService } from '../../../services/UserService';
import { MessagesModalService } from '../../../messages-modal.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  validationForm: UntypedFormGroup;
  user: User = new User();
  isFormSubmitted: boolean;
  successMessage: string;
  countdown: number;
  isFormValid: boolean;
  emailExistsError: string | null;
  currentUser: User;
  filteredUsers: User[] = [];
  roles = Object.values(Role);

  users: User[] = [];
  filterText : string= '';
  editForm: UntypedFormGroup;
  selectedUser: User | null = null;
  constructor(private router: Router,
    private userService: UserService,
    public formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    public messageService: MessagesModalService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadAllUsers();

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    }
    this.route.queryParams.subscribe(params => {
      if (params.role) {
        this.filterText = params.role;
      }
    });

    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users.reverse();
      }
    );

    this.validationForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.editForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }
  openEditModal(user: User, modalRef: TemplateRef<any>) {
    this.selectedUser = user;
  
    this.editForm.patchValue({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    });
  
    this.modalService.open(modalRef, { centered: true });
  }
  onEditSubmit(modal: any) {
    if (this.editForm.valid && this.selectedUser) {
      const updatedUser: User = {
        ...this.selectedUser,
        ...this.editForm.value,
      };
  
      this.userService.UpdateUser(updatedUser).subscribe({
        next: () => {
          this.messageService.toastSuccess("L'utilisateur a été modifié avec succès");
          this.loadAllUsers();
          modal.close();
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.messageService.toastError("Erreur lors de la modification de l'utilisateur");
        }
      });
    }
  }
  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      (user.nom?.toLowerCase() ?? '').includes(this.filterText.toLowerCase()) ||
      (user.prenom?.toLowerCase() ?? '').includes(this.filterText.toLowerCase()) ||
      (user.email?.toLowerCase() ?? '').includes(this.filterText.toLowerCase()) ||
      (user.role?.toLowerCase() ?? '').includes(this.filterText.toLowerCase())
    );
  }
  
  
  get filteredUsersCount(): number {
    return this.filteredUsers.length;
  }
  loadAllUsers() {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users.reverse();
        this.filterUsers(); // Appliquez le filtrage dès que les utilisateurs sont chargés
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  



  deleteUser(id: number) {
    // Prompt the user for confirmation
    const confirmed = confirm('Are you sure you want to delete this user?');

    if (confirmed) {
      // Call the service to delete the pack
      this.userService.deleteUserById(id).subscribe({
        next: () => {
          // On success, show a toast message
          this.messageService.toastSuccess("l'utilisateur a été supprimé avec succès");

          // taaml load ll users lkol 
          this.loadAllUsers();
        },
        error: (err) => {
          // Handle any errors that occur during the deletion
          this.messageService.toastError("Erreur lors de la suppression de l'utilisateur");
          console.error(err);
        }
      });
    }
  }

//mazelt tekhdemch
  AddUser(content: TemplateRef<any>) {
    // Reset form
    this.validationForm.reset();
    this.isFormSubmitted = false;
    this.isFormValid = false;
    this.emailExistsError = null;
    
    // Open the modal
    this.modalService.open(content, { centered: true });
  }

  get form() {
    return this.validationForm.controls;
  }

//lform mtaa ladd
  onRegister(e: Event) {
    this.isFormSubmitted = true;
    this.emailExistsError = null;
    e.preventDefault();
    
    if (this.validationForm.valid) {
      const email = this.form.email.value;
      this.userService.checkEmailExists(email).subscribe((exists) => {
        if (exists) {
          this.emailExistsError = 'Email existe déja';
          this.isFormSubmitted = false;
        } else {
          // Create a new user object from form values
          const newUser = new User();
          newUser.nom = this.form.lastName.value;
          newUser.prenom = this.form.firstName.value;
          newUser.email = this.form.email.value;
          newUser.role = this.form.role.value as Role;
          
          // Hashage mtaa lmdp
          const password = sha256(this.form.password.value);
          newUser.motDePasse = password;
          
          console.log('Submitting user data:', newUser);

          this.userService.addUser(newUser).subscribe({
            next: (response) => {
              console.log('User added successfully:', response);
              this.messageService.toastSuccess("L'utilisateur a été ajouté avec succès");
              this.modalService.dismissAll();
              this.loadAllUsers();
              this.isFormSubmitted = false;
              this.validationForm.reset();
            },
            error: (error) => {
              console.error('Error adding user:', error);
              this.messageService.toastError("Erreur lors de l'ajout de l'utilisateur");
              this.isFormSubmitted = false;
            }
          });
        }
      });
    } else {
      this.isFormValid = false;
    }
  }

  getInitials(nom: string, prenom: string): string {
    const nomInitial = nom ? nom.charAt(0) : '';
    const prenomInitial = prenom ? prenom.charAt(0) : '';
    return `${nomInitial}${prenomInitial}`;
  }

  openChat(user: User) {
    // Navigate to chat component with the user's ID
    this.router.navigate(['/chat'], { 
      queryParams: { 
        userId: user.id,
        userName: `${user.prenom} ${user.nom}`,
        userEmail: user.email
      }
    });
  }
}