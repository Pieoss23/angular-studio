import { Component, ElementRef, afterRenderEffect, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  host: {
    // demo di host binding "statico": un'etichetta di accessibilità sempre
    // presente sull'host element del componente, non nel suo template.
    '[attr.aria-label]': "'grafico a barre'",
  },
  template: `<canvas #canvas width="280" height="120"></canvas>`,
  styles: `canvas { border: 1px solid var(--border); border-radius: 6px; }`,
})
export class BarChart {
  readonly values = input.required<number[]>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  // TODO(19.1): afterRenderEffect gira DOPO ogni render, quando il DOM esiste
  // davvero — l'unico posto sicuro per disegnare su un <canvas>. Leggendo
  // this.values() dentro la callback, l'effect si ri-esegue automaticamente
  // ogni volta che l'input cambia.
  //
  // afterRenderEffect(() => {
  //   this.draw(this.canvasRef().nativeElement, this.values());
  // });

  constructor() {
    afterRenderEffect(() => {
      this.draw(this.canvasRef().nativeElement, this.values())
    })
  }

  private draw(canvas: HTMLCanvasElement, values: number[]): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const max = Math.max(1, ...values);
    const barWidth = canvas.width / Math.max(1, values.length);
    values.forEach((v, i) => {
      const h = (v / max) * (canvas.height - 10);
      ctx.fillStyle = '#4f8cff';
      ctx.fillRect(i * barWidth + 4, canvas.height - h, barWidth - 8, h);
    });
  }
}
