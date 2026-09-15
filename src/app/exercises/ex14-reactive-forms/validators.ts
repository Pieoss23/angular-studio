import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// TODO(14.1): validatore di campo. Deve tornare:
//  - null se il valore ha almeno 8 caratteri E contiene almeno una cifra
//  - { passwordStrength: true } altrimenti
// Suggerimento: control.value è una string (grazie a nonNullable sul FormControl).
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) {
      return null;
    }

    const hasMinLength = value.length >= 8;
    const hasNumber = /\d/.test(value);

    return hasMinLength && hasNumber
      ? null
      : { passwordStrength: true };
  };
}

// TODO(14.2): validatore incrociato su un FormGroup con i campi
// 'password' e 'confirmPassword'. Deve tornare:
//  - null se i due campi coincidono (o se uno dei due è ancora vuoto)
//  - { passwordMismatch: true } altrimenti
// Suggerimento: group.get('password')?.value / group.get('confirmPassword')?.value
export const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd = group.get('password')?.value;
  const cnfPwd = group.get('confirmPassword')?.value;

  if (!pwd || !cnfPwd) {
    return null;
  }

  return pwd === cnfPwd ? null : { passwordMismatch: true }
};
