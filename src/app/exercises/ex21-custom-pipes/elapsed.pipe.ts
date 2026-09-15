import { Pipe, PipeTransform } from '@angular/core';

// Pipe IMPURA (pure: false, già pronta): torna "3s fa" / "2min fa" / "1h fa"
// da un timestamp. Una pipe pura verrebbe ricalcolata solo se cambia il
// riferimento dell'input; questa deve invece rigirare ad ogni ciclo di
// change detection, anche se `timestamp` resta lo stesso numero — per
// questo serve `pure: false`. Il resto dell'esercizio (21.3, nel file
// principale) ti chiede di dimostrare la differenza con una pipe pura.
@Pipe({ name: 'elapsed', pure: false })
export class ElapsedPipe implements PipeTransform {
  transform(timestamp: number): string {
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec}s fa`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}min fa`;
    const diffH = Math.floor(diffMin / 60);
    return `${diffH}h fa`;
  }
}
