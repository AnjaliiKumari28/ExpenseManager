import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/Theme';
import Chart from 'react-apexcharts';

const AreaChart = ({ income, expense, xAxis }) => {

    const { darkTheme } = useContext(ThemeContext);
    const month = new Date().toLocaleString('default', { month: 'long' })
    let xLabels = [];
    if(!xAxis){
        for (let i = 0; i < income.length; i++) {
            xLabels.push(`${i + 1} ${month}`);
        }
    }

    const series = [
        {
            name: 'Expense',
            data: expense
        },
        {
            name: 'Income',
            data: income
        }
    ];

    const options = {
        xaxis: {
            categories: xAxis || xLabels,
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: { show: true },
            axisTicks: { show: true }     
        },
        yaxis: {
            show: true,
        },
        chart: {
            sparkline: { enabled: true },
            height: 500,
            width: '100%',
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            dropShadow: { enabled: true },
            toolbar: { show: false }
        },
        tooltip: {
            theme: darkTheme ? 'dark' : 'light',
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.7,
                opacityTo: 0.2,
                shade: darkTheme ? 'dark' : 'light',
                gradientToColors: ['#1C64F2']
            }
        },
        colors: [
            darkTheme ? '#f05252' : '#e02424',  // Expense
            darkTheme ? '#31c48d' : '#0e9f6e'   // Income
        ],
        dataLabels: { enabled:false },
        stroke: { width:5 },
        legend: {
            show: true,
            fontSize: '15px',
            labels: {
                colors: darkTheme ? '#d1d5db' : '#1f2937'
            }
        },
        grid: { show: false }
    };

    return (
        <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800">
            <h1 className='p-5 text-2xl'>Income v/s Expense</h1>
            <Chart className='lg:p-5 p-2' options={options} series={series} type="area" height={400} />
            <div className="grid grid-cols-1 items-center dark:border-gray-700 justify-between pt-10"></div>
        </div>
    );
};

export default AreaChart;
