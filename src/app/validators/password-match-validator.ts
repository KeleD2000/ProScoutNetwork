import { AbstractControl, ValidationErrors } from '@angular/forms';
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('password')?.value;
    const confirmPassword = control.get('passwordAccept')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
}