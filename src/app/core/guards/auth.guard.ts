import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { getAuth } from 'firebase/auth';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    // Check if we run in browser to avoid issues with SSR/hydration
    if (typeof window !== 'undefined' && window.localStorage) {
        const role = localStorage.getItem('userRole');
        if (role) {
            return true; // Authenticated
        } else {
            router.navigate(['/login']);
            return false; // Not authenticated
        }
    }

    // Si está en el servidor (ej. SSR), en este caso bloqueamos para evitar flasheos 
    // o según convenga, aunque lo usual es permitir y el cliente redirige de ser necesario
    return false;
};
