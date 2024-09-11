'use client'
import React, { useRef } from "react";
import * as Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";

const options: Highcharts.Options = {
  title: {
    text: "My chart",
  },
  series: [
    {
      type: "line",
      data: [1, 2, 3,4,5],
    },
  ],
};


 // Chart options with dark theme
    const options1: Highcharts.Options = {
        chart: {
            type: 'bar',
            backgroundColor: '#303030',  // Dark background for the chart
            style: {
                fontFamily: 'Arial'
            }
        },
        title: {
            text: 'Simple Bar Chart Example',
            style: {
                color: '#E0E0E3'  // Light text color for dark background
            }
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges'],
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Fruit eaten',
                style: {
                    color: '#E0E0E3'
                }
            },
            gridLineColor: '#707073'
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            }
        },
        series: [{
            name: 'Jane',
            type: 'bar',
            data: [1, 0, 4],
            color: '#1E90FF'  // Adjusting bar colors for visibility on dark background
        }, {
            name: 'John',
            type: 'bar',
            data: [5, 7, 3],
            color: '#FF6347'
        }],
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#F0F0F3'
                    }
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F3'
            }
        }
    };
   const volumeData: Array<[number, number]> = [
        [Date.UTC(2023, 8, 1), 2000000],  // Represents the volume for September 1, 2023
        [Date.UTC(2023, 8, 2), 1800000],
        [Date.UTC(2023, 8, 3), 2200000],
        [Date.UTC(2023, 8, 4), 2100000],
        [Date.UTC(2023, 8, 5), 2500000]
    ];


    // Chart options for Highcharts
    const options2: Highcharts.Options = {
        chart: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            style: {
                color: '#F0F0F3'
            }
        },
        rangeSelector: {
            selected: 1  // Range selector to adjust range of data displayed
        },
        title: {
            text: 'AAPL Stock Volume',
            style: {
                color: '#A0A0A3'
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Volume',
                style: {
                    color: '#A0A0A3'
                }
            },
            opposite: false
        },
        legend: {
            enabled: false
        },
        series: [{
            type: 'column',
            name: 'AAPL Volume',
            data: volumeData,
            color: '#2b908f',
            tooltip: {
                valueDecimals: 0
            }
        }],
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F3'
            }
        }
    };


const page = (props: HighchartsReact.Props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <>
      <div className="mx-auto m-10 p-20">
        <HighchartsReact
          highcharts={Highcharts}
          options={options2}
          ref={chartComponentRef}
          {...props}
        />
      </div>
    </>
  );
};

export default page;
