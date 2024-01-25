import { Component, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import * as AOS from 'aos';
import { StaticsService } from 'src/app/services/statics.service';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.css']
})
export class StaticsComponent {
  public chart: any;
  public chart2: any;
  public chart3: any;
  public chart4: any;
  public chart5: any;
  response4: any
  role: any[] = []
  avg: any[] = [];
  sportPlayer: any[] = [];
  avgPlayer: any[] = [];
  sportScout: any[] = [];
  avgScout: any[] = [];
  topSportPlayerWithName: string[] = [];
  topAdPlayer: number[] = [];
  topSportScoutWithName: string[] = [];
  topAdScout: number[] = [];

  constructor(private staticsService: StaticsService) {
  }

  exportToPDF(chartId: string, chartTitle: string) {
    const chartCanvas = document.getElementById(chartId) as HTMLCanvasElement;

    html2canvas(chartCanvas).then(canvas => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        pdf.save(`statisztika_${chartTitle}.pdf`);
    });
}


  createChart() {
    // Dinamikusan generáljuk a háttérszíneket
    const backgroundColors = this.generateRandomColors(this.role.length);

    this.chart = new Chart("kör", {
      type: 'doughnut',

      data: {
        labels: this.role,
        datasets: [
          {
            label: "Átlagos hirdetés",
            data: this.avg,
            backgroundColor: backgroundColors
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': ' + context.parsed.toFixed(2) + ' db';
              }
            }
          }
        }
      }
    });


    this.chart2 = new Chart("oszlop", {
      type: 'bar',

      data: {
        labels: this.sportPlayer,
        datasets: [
          {
            label: "A hirdetések százalékos aránya játékos hirdetésnél",
            data: ['57.24', '58.79'],
            backgroundColor: this.generateRandomColors(2)
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            callbacks : {
              label : function (context) {
                var label = context.dataset.label || '';
                if(label) {
                  label += ': ';
                }
                label += (context.parsed.y).toFixed(2) + "%";
                return label;
              }
            }
          }
        }
        
      }
    });

    this.chart3 = new Chart("oszlop2", {
      type: 'bar',

      data: {
        labels: this.sportScout,
        datasets: [
          {
            label: "A hirdetések százalékos aránya játékoskereső hirdetésnél",
            data: this.avgScout,
            backgroundColor: this.generateRandomColors(2)
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            callbacks : {
              label : function (context) {
                var label = context.dataset.label || '';
                if(label) {
                  label += ': ';
                }
                label += (context.parsed.y).toFixed(2) + "%";
                return label;
              }
            }
          }
        }
      }
    });

    this.chart4 = new Chart("polar-area", {
      type: 'polarArea',
      data: {
        labels: this.topSportPlayerWithName,
        datasets: [
          {
            label: "Az adott sportból a legtöbb hirdetés feladó játékos",
            data: this.topAdPlayer,
            backgroundColor: this.generateRandomColors(this.topSportPlayerWithName.length) // Random színek generálása
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                var value = typeof context.raw === 'number' ? context.raw : 0;
                return context.dataset.label + ': ' + value.toFixed(2) + ' db';
              }
            }
          }
        }
      }
    });

    this.chart5 = new Chart("polar-area2", {
      type: 'polarArea',
      data: {
        labels: this.topSportScoutWithName,
        datasets: [
          {
            label: "Az adott sportból a legtöbb hirdetés feladó játékoskereső",
            data: this.topAdScout,
            backgroundColor: this.generateRandomColors(this.topSportPlayerWithName.length) // Random színek generálása
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                var value = typeof context.raw === 'number' ? context.raw : 0;
                return context.dataset.label + ': ' + value.toFixed(2) + ' db';
              }
            }
          }
        }
      }
    });

  }

  generateRandomColors(count: number): string[] {
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`;
      colors.push(color);
    }

    return colors;
  }

  async ngOnInit() {
    const response: any = await this.staticsService.avgAdCount().toPromise();

    for (const entry of response) {
      this.role.push(entry[0]);
      this.avg.push(entry[1]);
    }

    const response2: any = await this.staticsService.averagePercentageBySport().toPromise();

    for (const entry of response2) {
      this.sportPlayer.push(entry[0]);
      this.avgPlayer.push(entry[1]);
    }

    const response3: any = await this.staticsService.averagePercentageBySportScout().toPromise();

    for (const entry of response3) {
      this.sportScout.push(entry[0]);
      this.avgScout.push(entry[1]);
    }

    this.response4 = await this.staticsService.topPlayerBySports().toPromise();

    for (const entry of this.response4) {
      const sport = entry[0];
      const player = entry[1];
      const average = entry[2];

      this.topSportPlayerWithName.push(sport + ' - ' + player); // A sportok és játékosok összekapcsolása
      this.topAdPlayer.push(average);
    }

    const response5: any = await this.staticsService.topScoutBySports().toPromise();

    for (const entry of response5) {
      const sport = entry[0];
      const player = entry[1];
      const average = entry[2];

      this.topSportScoutWithName.push(sport + ' - ' + player); // A sportok és játékosok összekapcsolása
      this.topAdScout.push(average);
    }

    this.createChart();
  }

  ngAfterViewInit() {
    AOS.init({
      once: true
    });
  }
}
