import React, { useContext, useEffect, useState, useRef } from 'react';
import Chart from 'react-apexcharts';
import { ThemeContext } from '../contexts/Theme';

const DonutChart = ({ income, expense, text }) => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Expense');
  const { darkTheme } = useContext(ThemeContext);

    const containerRef = useRef(null);
    const [chartHeight, setChartHeight] = useState(320);

  useEffect(() => {
    // Set initial series and labels to expense data
    if(expense.length > 0){
      setSeries(Object.values(expense));
      setLabels(Object.keys(expense));
    }
    
  }, [expense]);

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

  // This effect updates the chart data when the selected category changes
  useEffect(() => {
    if (selectedCategory === 'Expense') {
      setSeries(Object.values(expense));
      setLabels(Object.keys(expense));
    } else {
      setSeries(Object.values(income));
      setLabels(Object.keys(income));
    }
  }, [selectedCategory, income, expense]);

  const getChartOptions = () => {
    return {
      series: series,
      colors: [
        '#1C64F2',  // Blue
        '#16BDCA',  // Cyan
        '#FDBA8C',  // Light Orange
        '#E74694',  // Pink
        '#FF6347',  // Tomato
        '#FFD700',  // Gold
        '#4CAF50',  // Green
        '#FF4500',  // Orange Red
        '#8A2BE2',  // Blue Violet
        '#FF1493',  // Deep Pink
        '#4682B4',  // Steel Blue
        '#7FFF00',  // Chartreuse
        '#D2691E',  // Chocolate
        '#40E0D0',  // Turquoise
        '#FF69B4',  // Hot Pink
        '#DC143C',  // Crimson
        '#2E8B57',  // Sea Green
        '#6A5ACD',  // Slate Blue
        '#FFFF00',  // Yellow
        '#FFB6C1',  // Light Pink
        '#FF8C00',  // Dark Orange
        '#00FA9A',  // Medium Spring Green
        '#A52A2A',  // Brown
        '#20B2AA',  // Light Sea Green
        '#9370DB',  // Medium Purple
        '#FFC0CB',  // Pink
        '#800080',  // Purple
        '#00FF7F',  // Spring Green
        '#4682B4',  // Steel Blue
        '#F0E68C',  // Khaki
      ],      
      chart: {
        height: '100%',
        width: '100%',
        type: 'donut',
      },
      stroke: {
        colors: ['transparent'],
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: 'Inter, sans-serif',
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: 'Total',
                color: darkTheme ? '#d1d5db' : '#1f2937',
                fontFamily: 'Inter, sans-serif',
                formatter: (w) => {
                  const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return '₹' + sum;
                },
              },
              value: {
                show: true,
                fontFamily: 'Inter, sans-serif',
                color: darkTheme ? '#d1d5db' : '#1f2937',
                offsetY: -20,
                formatter: (value) => value,
              },
            },
            size: '70%',
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: labels, // Use dynamic labels
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px',
        labels: {
          colors: darkTheme ? '#d1d5db' : '#1f2937',
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => value,
        },
      },
      xaxis: {
        labels: {
          formatter: (value) => value,
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };

  // Handle radio button change
  const handleCheckboxChange = (event) => {
    setSelectedCategory(event.target.value); // Update selected category
  };

  return (
      <div ref={containerRef} className="h-full w-full bg-white dark:bg-gray-800 rounded-lg shadow p-5">
        <h5 className="text-2xl mb-5 font-bold leading-none text-gray-700 dark:text-gray-300">{text}</h5>

      <div className="flex items-center justify-center mb-4" id="devices">
        {['Expense', 'Income'].map((category) => (
          <div className="flex items-center me-4" key={category}>
            <input
              id={category}
              type="radio"
              value={category}
              checked={selectedCategory === category}
              className="focus:ring-0 w-5 h-5 rounded-full text-blue-600 bg-gray-100 border-gray-300"
              onChange={handleCheckboxChange}
            />
            <label htmlFor={category} className="ms-2 text-xl font-medium text-gray-800 dark:text-gray-200 capitalize cursor-pointer">
              {category}
            </label>
          </div>
        ))}
      </div>

      <Chart className='p-5' options={getChartOptions()} series={series} type="donut" height={chartHeight} />
    </div>
    
  );
};

export default DonutChart;
