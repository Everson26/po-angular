import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { from, Observable, timer } from 'rxjs';
import { concatMap, mapTo, scan, tap } from 'rxjs/operators';

import { isIE } from '../../../../../utils/util';

import { PoChartPointsCoordinates } from '../../../interfaces/po-chart-points-coordinates.interface';

const RADIUS_DEFAULT_SIZE = 5;
const RADIUS_HOVER_SIZE = 10;
const ANIMATION_DURATION_TIME = 700;

@Component({
  selector: '[po-chart-series-point]',
  templateUrl: './po-chart-series-point.component.svg'
})
export class PoChartSeriesPointComponent {
  radius: number = RADIUS_DEFAULT_SIZE;
  coordinates$: Observable<Array<PoChartPointsCoordinates>>;

  private _coordinates: Array<PoChartPointsCoordinates> = [];
  private animationState: boolean = true;

  @Input('p-animate') animate: boolean;

  @Input('p-color') color?: string;

  @Input('p-coordinates') set coordinates(value: Array<PoChartPointsCoordinates>) {
    this._coordinates = value;

    this.coordinates$ = this.displayPointsWithDelay(this._coordinates);
  }

  get coordinates() {
    return this._coordinates;
  }

  // Referência para o svgPathGroup ao qual pertence o ponto. Necessário para reordenação dos svgElements no DOM para tratamento onHover
  @Input('p-relative-to') relativeTo: string;

  @Output('p-point-click') pointClick = new EventEmitter<any>();

  @Output('p-point-hover') pointHover = new EventEmitter<any>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  trackBy(index) {
    return index;
  }

  onClick(point: PoChartPointsCoordinates) {
    const selectedItem = { label: point.label, data: point.data, category: point.category };

    this.pointClick.emit(selectedItem);
  }

  onMouseEnter(event: any, point: PoChartPointsCoordinates) {
    this.setPointAttribute(event.target, true);

    const selectedItem = { label: point.label, data: point.data, category: point.category };
    this.pointHover.emit({ relativeTo: this.relativeTo, ...selectedItem });
  }

  onMouseLeave(event: any) {
    this.setPointAttribute(event.target, false);
  }

  private displayPointsWithDelay(
    coordinates: Array<PoChartPointsCoordinates>
  ): Observable<Array<PoChartPointsCoordinates>> {
    if (this.animationState && !isIE()) {
      const animationTimer = ANIMATION_DURATION_TIME / coordinates.length;

      return from(coordinates).pipe(
        concatMap((item, index) => timer(index === 0 || !this.animate ? 0 : animationTimer).pipe(mapTo(item))),
        scan((acc, curr: PoChartPointsCoordinates) => acc.concat(curr), []),
        tap(() => (this.animationState = false))
      );
    } else {
      return from([coordinates]);
    }
  }

  private setPointAttribute(target: SVGElement, isHover: boolean) {
    if (isHover) {
      this.renderer.setAttribute(target, 'r', RADIUS_HOVER_SIZE.toString());
      this.renderer.setStyle(target, 'fill', this.color);
      return;
    }

    this.renderer.setAttribute(target, 'r', RADIUS_DEFAULT_SIZE.toString());
    this.renderer.removeStyle(target, 'fill');
  }
}
