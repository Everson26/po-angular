/// <reference types="resize-observer-browser" />

import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[po-resize-observer]'
})
export class PoResizeObserverDirective implements OnDestroy, OnInit {
  private subscription = new Subscription();
  private observer;
  private chartWidthResize$ = new Subject();

  @Output() resize = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  ngOnDestroy() {
    this.observer.unobserve(this.elementRef.nativeElement);
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.observer = new window.ResizeObserver(() => {
      this.chartWidthResize$.next();
    });

    this.observer.observe(this.elementRef.nativeElement);

    this.subscription.add(
      this.chartWidthResize$.pipe(debounceTime(20)).subscribe(_ => {
        this.resize.emit();
      })
    );
  }
}
