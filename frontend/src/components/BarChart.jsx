import React, { useContext, useRef, useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/Theme';
import Chart from 'react-apexcharts';
const BarChart = ({hor, height, width, income, expense, xLabels}) => {
    const {darkTheme} = useContext(ThemeContext)

    const containerRef = useRef(null);
  const [chartHeight, setChartHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
          if (containerRef.current) {
            const width = containerRef.current.offsetWidth - 20;
            setChartHeight(width > 350 ? 350 : width); // Set height equal to the parent width (or apply any ratio)
          }
        };
    
        updateHeight(); // Set initial height
        window.addEventListener("resize", updateHeight); // Update on window resize
    
        return () => {
          window.removeEventListener("resize", updateHeight); // Cleanup listener
        };
      }, []);

    const series = [
        {
            name: 'Income',
            color: darkTheme? '#31c48d': '#0e9f6e',
            data: income,
        },
        {
            name: 'Expense',
            data: expense,
            color: darkTheme? '#f05252' :'#e02424',
        },
    ]
    const options = {
        chart: {
            sparkline: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        fill: {
            opacity: 0.9,
        },
        plotOptions: {
            bar: {
                horizontal: hor,
                columnWidth: '80%',   
                borderRadius: 5,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        legend: {
            show: true,
            position: 'bottom',
            fontSize: '15px', 
            labels: {
                colors: darkTheme ? 'lightgray' : 'gray',
                useSeriesColors: false
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: darkTheme ? 'dark' : 'light',
            formatter: function (value) {
                return '₹' + value;
            },
        },
        xaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
                formatter: function (value) {
                    return '₹' + value;
                },
            },
            categories: xLabels,
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
            },
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -20,
            },
        },
    }



    return (
        <div ref={containerRef} className="w-fulln h-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 flex flex-col items-center justify-center">
            <h1 className='text-xl w-full font-semibold text-gray-700 dark:text-gray-300 p-3'>Weekly Report</h1>

            <Chart className='p-5' options={options} series={series} type="bar" height={height} width={chartHeight}/>


        </div>
    );
};

export default BarChart;
