import React, { useContext, useEffect, useState } from 'react';
import AreaChart from '../components/AreaChart';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';
import { FaIndianRupeeSign } from "react-icons/fa6";
import RingChart from '../components/RingChart';
import ToolTip from '../components/ToolTip';
import { AuthContext } from '../contexts/auth.jsx';
import Table from '../components/Table';
import { FinancialContext } from '../contexts/finances.jsx';
import { Spinner } from "flowbite-react";
import { useOutletContext } from 'react-router-dom';
import Dropdown from '../components/Dropdown.jsx';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Stats = () => {
    const { isAuthenticated, accessToken } = useContext(AuthContext);
    const { sidebarOpen } = useOutletContext()
    const { choices, fetching } = useContext(FinancialContext)

    const now = new Date()
    const monthIndex = now.getMonth()
    const yearNo = now.getFullYear()
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = [yearNo, yearNo-1, yearNo-2]
    const [month, setMonth] = useState(monthNames[monthIndex])
    const [year, setYear] = useState(yearNo)
    const [finances, setFinances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        monthlyIncome: 0,
        monthlyExpenses: 0,
        transactions: [], // Add this to hold the last 10 transactions
        incomeArray: [],
        expenseArray: [],
        categoryWiseExpense: {},
        categoryWiseIncome: {},
        weeklyIncomeArray: [],
        weeklyExpenseArray: [],
        incomeMethodWise: [],
        expenseMethodWise: [],
    });

    const handleSelectMonth = (selectedItem) => {
        setMonth(selectedItem);
        console.log(typeof selectedItem)
    };
    const handleSelectYear = (selectedItem) => {
        setYear(selectedItem);
        console.log(typeof selectedItem)
    };

    const fetchFinances = async () => {
        if (!isAuthenticated) return;

        try {
            const response = await fetch(`${SERVER_URL}/monthly-finances?month=${month}&year=${year}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(`Error: ${result.message}`);
            }
            setFinances(result.data);
        } catch (err) {
            console.log(err)
        }
    };

    const generateSummary = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const year = now.getFullYear();

        // Get the number of days in the current month
        const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
        const incomeArray = new Array(daysInMonth).fill(0);
        const expenseArray = new Array(daysInMonth).fill(0);

        // Initialize totals for today and for the current month;
        let monthlyIncome = 0;
        let monthlyExpenses = 0;

        // Initialize weekly totals (assume max 5 weeks in a month)
        const weeklyIncomeArray = new Array(5).fill(0);
        const weeklyExpenseArray = new Array(5).fill(0);

        // Initialize category-wise totals based on choices
        const incomeCategoryWise = {};
        const expenseCategoryWise = {};
        const incomeMethodWise = {};
        const expenseMethodWise = {};

        // Initialize categories with 0 sums
        choices.incomeChoices.forEach(choice => {
            incomeCategoryWise[choice] = 0;
        });
        choices.expenseChoices.forEach(choice => {
            expenseCategoryWise[choice] = 0;
        });

        // Initialize method-wise totals
        choices.methods.forEach(method => {
            incomeMethodWise[method] = 0;  // Initialize income method sums
            expenseMethodWise[method] = 0; // Initialize expense method sums
        });

        // Extract the all transactions
        const transactions = finances; 

        finances.forEach(item => {
            const transactionDate = item.transactionDate; // Firebase Timestamp
            const date = new Date(transactionDate._seconds * 1000); // Convert to Date
            const day = date.getDate(); // Get the day of the month

            // Calculate the week of the month (0-indexed, so week 1 is index 0)
            const weekOfMonth = Math.floor((day - 1) / 7);

            // Since the data is already from the current month, populate the arrays
            if (item.incomeAmount) {
                incomeArray[day - 1] += item.incomeAmount; // Add to the income array for that day
                monthlyIncome += item.incomeAmount; // Accumulate monthly income
                weeklyIncomeArray[weekOfMonth] += item.incomeAmount; // Add to the appropriate weekly total

                // Sum by income source
                const incomeSource = item.incomeSource || 'Other';
                if (incomeCategoryWise[incomeSource] !== undefined) {
                    incomeCategoryWise[incomeSource] += item.incomeAmount;
                }

                // Sum by payment method
                const paymentMethod = item.incomeMethod || 'Other';
                if (incomeMethodWise[paymentMethod] !== undefined) {
                    incomeMethodWise[paymentMethod] += item.incomeAmount;
                }
            } else if (item.expenseAmount) {
                expenseArray[day - 1] += item.expenseAmount; // Add to the expense array for that day
                monthlyExpenses += item.expenseAmount; // Accumulate monthly expenses
                weeklyExpenseArray[weekOfMonth] += item.expenseAmount; // Add to the appropriate weekly total

                // Sum by expense source
                const expenseSource = item.expenseSource || 'Other';
                if (expenseCategoryWise[expenseSource] !== undefined) {
                    expenseCategoryWise[expenseSource] += item.expenseAmount;
                }

                // Sum by payment method
                const expenseMethod = item.expenseMethod || 'Other';
                if (expenseMethodWise[expenseMethod] !== undefined) {
                    expenseMethodWise[expenseMethod] += item.expenseAmount;
                }
            }
        });

        // Update summary state
        setSummary(prev => ({
            ...prev,
            incomeArray,
            expenseArray,
            monthlyIncome,
            monthlyExpenses,
            weeklyIncomeArray,
            weeklyExpenseArray,
            categoryWiseIncome: incomeCategoryWise,
            categoryWiseExpense: expenseCategoryWise,
            incomeMethodWise,
            expenseMethodWise,
            transactions,
        }));
    };


    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchFinances();
        }
    }, [isAuthenticated, accessToken, month, year]);

    useEffect(() => {
        if (finances) {
            setLoading(true);
            generateSummary();
            setLoading(false)
        }
    }, [finances])

    if (!choices) {
        return <div className='w-screen h-screen flex items-start py-52 justify-center'><Spinner color="success" size='xl' /></div>;
    }

    return (
        <>
            <div className='w-screen min-h-screen overflow-y-auto flex flex-col items-center'>
                {!loading && <div className='w-full h-full flex flex-col items-center justify-evenly'>

                    <h1 className='text-3xl font-semibold pb-5 text-green-500'>Monthly Stasticts</h1>

                    <div className={`w-full h-full ${sidebarOpen ? 'opacity-20' : ''} flex flex-col items-center pb-10`}>
                        <div className='w-11/12 grid portrait:grid-cols-1 portrait:md:grid-cols-2 grid-cols-3 gap-5 '>
                            <div className='w-full flex flex-col items-center gap-5 col-span-1'>
                                <div className='w-full h-full flex flex-col items-start justify-center gap-3 bg-white dark:bg-gray-800 p-5 rounded-lg shadow'>
                                    <div className='w-full'>
                                        <h1 className='text-xl pb-2 font-semibold'>Select Month</h1>
                                        <div className='w-full border-[1px] border-green-500 rounded-lg p-1'><Dropdown options={monthNames} onSelect={handleSelectMonth} selected={month}/></div>
                                    </div>

                                    <div className='w-full'>
                                        <h1 className='text-xl pb-2 font-semibold'>Select Year</h1>
                                        <div className='w-full border-[1px] border-green-500 rounded-lg p-1'><Dropdown options={years} onSelect={handleSelectYear} selected={year}/></div>
                                    </div>
                                    
                                </div>
                        
                                <div className='w-full h-full flex flex-col items-start gap-3 bg-white dark:bg-gray-800 px-7 py-10 rounded-lg shadow'>
                                    <h1 className='text-3xl dark:text-gray-400 text-gray-700 pb-8'><b>{month}</b> Stats</h1>
                                    
                                    <div className='flex items-center justify-center text-green-500 dark:text-green-400 cursor-pointer hover:scale-105 transition-all ease-in-out'>
                                        <span className='text-xl font-semibold px-5 text-gray-800 dark:text-gray-200'>Total Income</span>
                                        <div className='flex items-center justify-center gap-2 clear-start text-3xl'><FaIndianRupeeSign /><span className='font-semibold'>{summary.monthlyIncome}</span>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-center text-red-500 rounded-xl cursor-pointer hover:scale-105 transition-all ease-in-out'>
                                        <span className='text-xl font-semibold pl-5 pr-3  text-gray-800 dark:text-gray-200'>Total Expense</span>
                                        <div className='flex items-center justify-center gap-2 clear-start text-3xl'><FaIndianRupeeSign /><span className='font-semibold'>{summary.monthlyExpenses}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full col-span-1'>
                                <BarChart hor={true} height={400} width={400} income={summary.weeklyIncomeArray} expense={summary.weeklyExpenseArray} xLabels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']} />

                            </div>

                            <div className='w-full col-span-1'>
                                <RingChart incomeValue={summary.monthlyIncome} expenseValue={summary.monthlyExpenses} incomeGoal={choices.goals.income} expenseGoal={choices.goals.expense} />
                            </div>
                        </div>

                        <div className='w-full flex flex-col items-center gap-5 py-5'>
                            <div className='w-11/12'>
                                <AreaChart income={summary.incomeArray} expense={summary.expenseArray} xAxis={null}/>
                            </div>
                            <div className='w-11/12 grid portrait:grid-cols-1 grid-cols-2 gap-5'>
                                <div className='col-span-1 w-full h-full'>
                                    <DonutChart income={summary.categoryWiseIncome} expense={summary.categoryWiseExpense} text={'Sources'}/>
                                </div>
                                <div className='col-span-1 w-full h-full'>
                                    <DonutChart income={summary.incomeMethodWise} expense={summary.expenseMethodWise} text={'Method'}/>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='w-11/12 pb-10'><Table statements={summary.transactions} /></div>
                </div>}
            </div>


        </>
    );
};

export default Stats;
