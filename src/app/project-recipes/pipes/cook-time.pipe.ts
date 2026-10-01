import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cookTime' })
export class CookTimePipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    if (minutes === null || minutes === undefined || minutes < 0) {
      return '';
    }
    if (minutes === 0) return '0 min';

    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;

    const hoursStr = hours > 0 ? `${hours} h` : '';
    const minutesStr = min > 0 ? `${min} min` : '';

    // Il filter rimuove le stringhe vuote, il join le unisce lasciando un solo spazio se servono entrambe
    return [hoursStr, minutesStr].filter(Boolean).join(' ');
  }
}
