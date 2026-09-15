import { Pipe, PipeTransform } from '@angular/core';

// Stessa logica di ElapsedPipe, ma PURA (default, niente pure: false).
// Serve solo da confronto nel template: dato lo stesso timestamp (che non
// cambia mai riferimento/valore), questa versione non si aggiorna più dopo
// il primo render, mentre ElapsedPipe (impura) sì.
@Pipe({ name: 'elapsedPure' })
export class ElapsedPurePipe implements PipeTransform {
  transform(timestamp: number): string {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    return `${diffSec}s fa`;
  }
}
