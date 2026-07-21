import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({ standalone: false,
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  user$: Observable<any>;
  private unsubscribe: Subscription[] = [];

  constructor(
    
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    
  }

  logout() {
    
    document.location.reload();
  }

  openChangePassword(): void {
    this.modalService.open(ChangePasswordComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: true,
    });
  }

  getInitials(user: any): string {
    const first = user?.firstname?.charAt(0) || '';
    const last = user?.lastname?.charAt(0) || '';
    if (first || last) return (first + last).toUpperCase();
    if (user?.fullname) return user.fullname.charAt(0).toUpperCase();
    return 'U';
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
