import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../models/pack';
import { PacksService } from '../../../services/packs.service';
import { MessagesModalService } from '../../../messages-modal.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.component.scss']
})
export class AbonnementComponent implements OnInit {
  stats: any = {};
  packForm: FormGroup;
  abonnements: Pack[] = [];
  filterText = '';
  filteredAbonnements: Pack[] = [];
  filteredAbonnementsCount: number = 0;
  currentUser: any;
  editMode = false;
  currentPack: Pack | null = null;
  modal: any;

  constructor(
    private packService: PacksService,
    private fb: FormBuilder,
    public messageService: MessagesModalService,
    private router: Router
  ) {
    this.packForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      description: [''],
      prixMensuel: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      prixAnnuel: [{ value: '', disabled: true }],
      duree: [0, Validators.required],
      type: ['SILVER', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllPack();
    this.loadStats();
    this.initializeFormListeners();
  }

  private initializeFormListeners() {
    this.packForm.get('prixMensuel')?.valueChanges.subscribe(value => {
      if (value && !isNaN(value)) {
        const prixMensuel = parseFloat(value);
        const prixAnnuel = (prixMensuel * 12 * 0.8).toFixed(2);
        this.packForm.patchValue({ prixAnnuel }, { emitEvent: false });
      }
    });
  }

  editPack(pack: Pack): void {
    this.editMode = true;
    this.currentPack = { ...pack };
    this.packForm.reset();
    this.packForm.patchValue({
      ...this.currentPack,
      prixMensuel: this.currentPack.prixMensuel.toString(),
      prixAnnuel: (this.currentPack.prixMensuel * 12 * 0.8).toFixed(2)
    });
    this.showModal();
  }

  addAbonnement() {
    this.editMode = false;
    this.currentPack = null;
    this.packForm.reset();
    this.packForm.patchValue({
      type: 'SILVER',
      duree: 0
    });
    this.showModal();
  }

  private showModal() {
    if (this.modal) {
      this.modal.show();
    } else {
      this.modal = new (window as any).bootstrap.Modal(document.getElementById('addPackModal'));
      this.modal.show();
    }
  }

  submitEditAbonnement() {
    if (this.packForm.valid) {
      const formValue = this.packForm.value;
      const packToUpdate: Pack = {
        ...formValue,
        prixMensuel: parseFloat(formValue.prixMensuel),
        prixAnnuel: parseFloat(formValue.prixMensuel) * 12 * 0.8
      };
      
      this.packService.updatePack(packToUpdate.id, packToUpdate).subscribe({
        next: () => {
          this.messageService.toastSuccess("Abonnement mis à jour avec succès !");
          this.loadAllPack();
          this.closeModal();
        },
        error: () => {
          this.messageService.toastError("Erreur lors de la mise à jour !");
        }
      });
    }
  }

  submitAddAbonnement() {
    if (this.packForm.valid) {
      const formValue = this.packForm.value;
      const newPack: Pack = {
        ...formValue,
        prixMensuel: parseFloat(formValue.prixMensuel),
        prixAnnuel: parseFloat(formValue.prixMensuel) * 12 * 0.8
      };
      
      this.packService.createPack(newPack).subscribe({
        next: () => {
          this.messageService.toastSuccess("Abonnement ajouté avec succès !");
          this.loadAllPack();
          this.closeModal();
        },
        error: () => {
          this.messageService.toastError("Erreur lors de l'ajout !");
        }
      });
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.hide();
    }
    this.editMode = false;
    this.currentPack = null;
    this.packForm.reset();
    this.packForm.patchValue({
      type: 'SILVER',
      duree: 0
    });
  }

  loadAllPack() {
    this.packService.getAllPacks().subscribe(
      (abonnements: Pack[]) => {
        this.abonnements = abonnements.reverse();
        this.filterAbonnements();
      },
      (error) => {
        console.error('Error fetching abonnements:', error);
      }
    );
  }

  loadStats() {
    this.packService.getPackStats().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
      error: (err) => {
        console.error("Erreur récupération statistiques", err);
        this.messageService.toastError("Erreur chargement statistiques");
      }
    });
  }

  filterAbonnements(): void {
    if (!this.filterText) {
      this.filteredAbonnements = this.abonnements; // No filter
    } else {
      const lowerFilter = this.filterText.toLowerCase();
      this.filteredAbonnements = this.abonnements.filter(pack => {
        const values = Object.values(pack).join(' ').toLowerCase();
        return values.includes(lowerFilter);
      });
    }
  }

  deletePack(id: number) {
    // Prompt the user for confirmation
    const confirmed = confirm('Are you sure you want to delete this abonnement?');
  
    if (confirmed) {
      // Call the service to delete the pack
      this.packService.deletePack(id).subscribe({
        next: () => {
          // On success, show a toast message
          this.messageService.toastSuccess("Abonnement a été supprimé avec succès");
  
          // Reload all packs
          this.loadAllPack();
        },
        error: (err) => {
          // Handle any errors that occur during the deletion
          this.messageService.toastError("Erreur lors de la suppression de l'abonnement");
          console.error(err);
        }
      });
    }
  }
  
  get filteredAbonnement(): Pack[] {
    return this.abonnements.filter(pack => {
      const values = Object.values(pack).join(' ').toLowerCase();
      return values.includes(this.filterText.toLowerCase());
    });
  }
  get filteredAbonnementCount(): number {
    return this.filteredAbonnements.length;
  }
}
