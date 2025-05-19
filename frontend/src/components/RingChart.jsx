import React, { useContext } from 'react';
import Chart from 'react-apexcharts';
import { ThemeContext } from '../contexts/Theme';


const RingChart = ({incomeValue, expenseValue, incomeGoal, expenseGoal}) => {

    const income = Math.round((incomeValue / incomeGoal) * 100); 
    const expense = Math.round((expenseValue / expenseGoal) * 100);

    const series = [expense , income];
    const { darkTheme } = useContext(ThemeContext)

    const getChartOptions = () => {
        return {
            colors: [darkTheme ? '#f05252' : '#e02424', darkTheme ? '#31c48d' : '#0e9f6e'],
            chart: {
                height: "380px",
                width: "100%",
                type: "radialBar",
            },
            plotOptions: {
                radialBar: {
                    track: {
                        background: darkTheme ? '#374151' : '#E5E7EB',
                    },
                    hollow: {
                        margin: 0,
                        size: "30%",
                    },
                },
                datalabels: {
                    show: false
                }

            },
            grid: {
                show: false,
            },
            labels: ["Expense", "Income"],
            legend: {
                show: true,
                position: "bottom",
                fontFamily: "Inter, sans-serif",
                onItemClick: {
                    toggleDataSeries: false
                },
                fontSize: '15px',
                labels: {
                    colors: darkTheme ? '#d1d5db' : '#1f2937'
                },
            },
            tooltip: {
                enabled: true,
            },

        }
    }

    return (
        <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-5">
            <div className="w-full flex justify-between">
                <div className="w-full flex flex-col items-start">
                    <h5 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 p-2">Financial Goals</h5>

                    <div className='w-full flex items-center justify-between'>
                        <span className='text-lg text-gray-700 dark:text-gray-300 p-2'><p>Income</p><strong>{incomeValue} / {incomeGoal}</strong>
                        </span>
                        <span className='text-lg text-gray-700 dark:text-gray-300 p-2'><p>Expense</p><strong>{expenseValue} / {expenseGoal}</strong>
                        </span>
                    </div>

                </div>
            </div>

            <Chart options={getChartOptions()} series={series} type="radialBar" height={400} />
        </div>
    );
};

export default RingChart;
