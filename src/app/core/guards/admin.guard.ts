import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId) && window.localStorage) {
        const role = localStorage.getItem('userRole');
        if (role === 'admin') {
            return true; // Authenticated as Admin
        } else {
            router.navigate(['/home']);
            return false; // Not admin
        }
    }

    return false;
};
