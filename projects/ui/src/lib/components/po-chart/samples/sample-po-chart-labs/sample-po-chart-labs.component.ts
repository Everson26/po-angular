import { Component, OnInit } from '@angular/core';

import { PoChartSerie, PoChartType, PoSelectOption, PoChartOptions } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-chart-labs',
  templateUrl: './sample-po-chart-labs.component.html'
})
export class SamplePoChartLabsComponent implements OnInit {
  combinedTypes: PoChartType;
  label: string;
  totalValues: Array<number> = [];
  event: string;
  height: number;
  series: Array<PoChartSerie>;
  title: string;
  tooltip: string;
  data: number;
  type: PoChartType;
  lineValues: number;
  categories: string;
  allCategories: Array<string> = [];
  inputDataSeries: string;
  options: PoChartOptions = {
    axis: {
      minRange: undefined,
      maxRange: undefined,
      gridLines: undefined
    }
  };

  readonly combinedTypesOptions: Array<PoSelectOption> = [
    { label: 'Line', value: PoChartType.Line },
    { label: 'Column', value: PoChartType.Column }
  ];

  readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Donut', value: PoChartType.Donut },
    { label: 'Pie', value: PoChartType.Pie },
    { label: 'Line', value: PoChartType.Line },
    { label: 'Column', value: PoChartType.Column },
    { label: 'Bar', value: PoChartType.Bar }
  ];

  ngOnInit() {
    this.restore();
  }

  get isCircularType(): boolean {
    return this.type === PoChartType.Pie || this.type === PoChartType.Donut;
  }

  addOptions() {
    this.options = { ...this.options };
  }

  addCategories() {
    this.allCategories = this.convertToArray(this.categories);
  }

  addData() {
    const data = this.isCircularType ? this.data : this.convertToArray(this.inputDataSeries);

    this.series = [
      ...this.series,
      { label: this.label, data, tooltip: this.tooltip, type: this.combinedTypes || this.type }
    ];

    this.combinedTypes = undefined;
  }

  changeEvent(eventName: string, serieEvent: PoChartSerie): void {
    this.event = `${eventName}: ${JSON.stringify(serieEvent)}`;
  }

  restore() {
    this.label = undefined;
    this.categories = undefined;
    this.event = undefined;
    this.height = undefined;
    this.series = [];
    this.title = undefined;
    this.tooltip = undefined;
    this.data = undefined;
    this.allCategories = [];
    this.inputDataSeries = undefined;
    this.lineValues = undefined;
    this.options = {
      axis: {
        minRange: undefined,
        maxRange: undefined,
        gridLines: undefined
      }
    };
  }

  private convertToArray(value: string): Array<any> {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
}
