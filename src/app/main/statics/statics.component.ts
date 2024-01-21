import { Component } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, ChartEvent } from 'chart.js';


@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.css']
})
export class StaticsComponent {
  ngOnInit() {
    // Chart.js kód itt
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Monthly Sales',
          data: [10, 25, 18, 30, 22],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      }
    });
  }
}
