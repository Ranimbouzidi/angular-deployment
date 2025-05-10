import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessagesModalService {

  private defaultToastParams: SweetAlertOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000
  };
  constructor() {
  }
  public toastSuccess(message: string): Promise<SweetAlertResult> {
    return Swal.mixin(this.getSuccessToastParams()).fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000
    })
  }


  public toastError(message: string): Promise<SweetAlertResult> {
    return Swal.mixin(this.getErrorToastParams()).fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000
    })
  }

  public getSuccessToastParams(): SweetAlertOptions {
    const params = { ...this.defaultToastParams };
    params.customClass = {
      popup: 'bg-success',
      title: 'text-white'
    };
    return params;
  }


  public getErrorToastParams(): SweetAlertOptions {
    const params = { ...this.defaultToastParams };
    params.customClass = {
      popup: 'bg-danger',
      title: 'text-white'
    };
    return params;
  }


  public modalError(message: string, error?: any, title?: string): void {
    Swal.fire({
      icon: 'error',
      title: message,
      showConfirmButton: true,
    })
  }
  ngOnInit(): void {

  }

}
