import React, { useContext, useEffect, useState } from 'react';
import AreaChart from '../components/AreaChart';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import RingChart from '../components/RingChart';
import ToolTip from '../components/ToolTip';
import Table from '../components/Table';
import { FinancialContext } from '../contexts/finances.jsx';
import { Spinner } from "flowbite-react";
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate();
    const { sidebarOpen } = useOutletContext()
    const { summary, choices, fetching } = useContext(FinancialContext)

    if (!summary && !choices) {
        return <div className='w-screen h-screen flex items-start py-52 justify-center'><Spinner color="success" size='xl' /></div>;
    }

    return (
        <>
            <div className='w-screen min-h-screen overflow-y-auto flex flex-col items-center'>
                {fetching && <Spinner color="success" size='xl' />}
                {!fetching && <div className='w-full h-full flex flex-col items-center justify-evenly'>

                    <div className={`w-full h-full ${sidebarOpen ? 'opacity-20' : ''} flex flex-col items-center pb-10`}>
                        <div className='w-11/12 grid portrait:grid-cols-1 portrati:md:grid-cols-2 grid-cols-3 gap-5 '>
                            <div className='w-full flex flex-col items-center gap-5 col-span-1'>
                                <div className='w-full h-full flex flex-col items-start bg-white dark:bg-gray-800 p-10 rounded-lg shadow gap-3'>
                                    <h1 className='text-2xl dark:text-gray-400 text-gray-700 pb-8'>Today's Stats</h1>
                                    <div className='w-full flex items-center justify-between flex-wrap text-green-500 dark:text-green-400 cursor-pointer '>
                                        <div className='flex items-center justify-start hover:scale-105 transition-all ease-in-out'>
                                            <span className='text-xl font-semibold px-5 text-gray-800 dark:text-gray-200'>Income</span>
                                            <div className='flex items-center justify-center gap-2 clear-start text-3xl'><FaIndianRupeeSign /><span className='font-semibold'>{summary.todayIncome}</span>
                                            </div>
                                        </div>
                                        <ToolTip
                                            children={
                                                <button onClick={() => navigate('/user/dashboard/add-income')} className='text-white p-2 text-xl rounded-full bg-green-500'><FaPlus />
                                                </button>
                                            } content={'Add Income'} placement='top' />
                                    </div>

                                    <div className='w-full flex items-center justify-between text-red-500 cursor-pointer '>
                                        <div className='flex items-center justify-start hover:scale-105 transition-all ease-in-out'>
                                            <span className='text-xl font-semibold pl-5 pr-3 text-gray-800 dark:text-gray-200'>Expense</span>
                                            <div className='flex items-center justify-center gap-2 clear-start text-3xl'><FaIndianRupeeSign /><span className='font-semibold'>{summary.todayExpenses}</span>
                                            </div>
                                        </div>
                                        <ToolTip children={<button onClick={() => navigate('/user/dashboard/add-expense')} className='text-white p-2 text-xl rounded-full bg-red-500'><FaPlus /></button>} content={"Add Expense"} placement={'bottom'} />
                                    </div>
                                </div>
                                <div className='w-full h-full flex flex-col items-start gap-3 bg-white dark:bg-gray-800 p-10 rounded-lg shadow'>
                                    <h1 className='text-3xl dark:text-gray-400 text-gray-700 pb-8'><b>{new Date().toLocaleString('default', { month: 'long' })}</b> Stats</h1>
                                    <div className='flex items-center justify-center  text-blue-500 dark:text-blue-400 cursor-pointer hover:scale-105 transition-all ease-in-out'>
                                        <span className='text-xl font-semibold pl-5 pr-7 text-gray-800 dark:text-gray-200'>Balance Left</span>
                                        <div className='flex items-center justify-center gap-2 clear-start text-3xl'><FaIndianRupeeSign /><span className='font-semibold'>{choices.balance}</span>
                                        </div>
                                    </div>

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
                                    <DonutChart income={summary.categoryWiseIncome} expense={summary.categoryWiseExpense} text={'Income & Expense Sources'}/>
                                </div>
                                <div className='col-span-1 w-full h-full'>
                                    <DonutChart income={summary.incomeMethodWise} expense={summary.expenseMethodWise} text={'Transaction Methods'}/>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='w-11/12 pb-10'><Table statements={summary.last10Transactions} /></div>
                </div>}
            </div>


        </>
    );
};

export default Dashboard;
