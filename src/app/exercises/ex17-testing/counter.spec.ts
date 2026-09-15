import { TestBed } from '@angular/core/testing';
import { Counter } from './counter';

describe('Counter', () => {
  // Sostituisci ogni it.todo(...) con un it(...) vero che scrive davvero il test.
  // `npm test` deve passare in verde con i 4 test scritti.

  // TODO(17.1): crea il componente e verifica che count() parta da 0.
  //
  it('parte da 0', () => {

    const fixture = TestBed.createComponent(Counter);
    fixture.detectChanges();
    const counter = fixture.componentInstance;
    expect(counter.count()).toBe(0);
  });

  // TODO(17.2): chiama increment() due volte e verifica che count() sia 2.
  it('increment() aumenta count di 1 ogni volta', () => {
    const fixture = TestBed.createComponent(Counter);
    fixture.detectChanges();
    const counter = fixture.componentInstance; counter.increment();
    counter.increment();
    expect(counter.count()).toBe(2);
  });
  // TODO(17.3): verifica che decrement() non fa scendere count() sotto 0
  // (chiamalo quando count() è già 0, il risultato deve restare 0).
  it('decrement() non va sotto zero', () => {
    const fixture = TestBed.createComponent(Counter);
    fixture.detectChanges();
    const counter = fixture.componentInstance;
    counter.decrement();
    counter.decrement();
    counter.decrement();
    expect(counter.count()).toBe(0)
  });

  // TODO(17.4): verifica il TEMPLATE, non solo lo stato: dopo increment() +
  // fixture.detectChanges(), l'elemento [data-testid="count"] deve avere
  // textContent '1'
  it('il DOM mostra il valore aggiornato dopo detectChanges()', () => {
    const fixture = TestBed.createComponent(Counter);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const counter = fixture.componentInstance;
    counter.increment();
    fixture.detectChanges();
    const span = el.querySelector('[data-testid="count"]');
    expect(span?.textContent).toContain('1');
  });
});
