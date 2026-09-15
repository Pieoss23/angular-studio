import { Pipe, PipeTransform } from '@angular/core';

// TODO(21.1): pipe PURA (default). Deve tornare `value` intatto se è più
// corto o uguale a `limit`, altrimenti i primi `limit` caratteri seguiti da
// '…'. `limit` di default è 20 se non passato.
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20): string {
    return value;
  }
}
