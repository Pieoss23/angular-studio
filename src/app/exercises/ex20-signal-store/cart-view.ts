import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartStore } from './cart-store';

@Component({
  selector: 'app-cart-view',
  imports: [DecimalPipe],
  template: `
    <div class="card">
      <h3>carrello ({{ store.count() }})</h3>
      @if (store.items().length === 0) {
        <p class="hint">vuoto</p>
      }
      <ul>
        @for (i of store.items(); track i.id) {
          <li>
            {{ i.name }} × {{ i.qty }} — {{ i.qty * i.price | number: '1.2-2' }}€
            <button class="btn" (click)="store.remove(i.id)">-</button>
          </li>
        }
      </ul>
      <p><strong>totale: {{ store.total() | number: '1.2-2' }}€</strong></p>
      @if (store.items().length > 0) {
        <button class="btn" (click)="store.clear()">svuota</button>
      }
    </div>
  `,
})
export class CartView {
  protected readonly store = inject(CartStore);
}
