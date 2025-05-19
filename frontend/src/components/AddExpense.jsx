import React, { useContext, useEffect, useState } from 'react';
import { BsCalendarDateFill } from "react-icons/bs";
import DatePicker from './DatePicker';
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { Alert } from "flowbite-react";
import { MdSource } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { AuthContext } from '../contexts/auth';
import { FinancialContext } from '../contexts/finances';
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";
import Dropdown from './Dropdown';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {    
    const navigate = useNavigate();

    const SERVER_URL = import.meta.env.VITE_SERVER_URL; 
    const { accessToken } = useContext(AuthContext);
    const { choices, setUpdate } = useContext(FinancialContext);

    const [openDate, setOpenDate] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseSource, setExpenseSource] = useState('Select an option');
    const [expenseMethod, setExpenseMethod] = useState('Select an option');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setOpenDate(false);
    };

    const handleSelectSource = (selectedItem) => {
        setExpenseSource(selectedItem);
    };

    const handleSelectMethod = (selectedItem) => {
        setExpenseMethod(selectedItem);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!expenseAmount || !expenseSource || !selectedDate) {
            setMessage('Please fill in all fields.');
            setShowAlert(true);
            setAlertType('failure');
            setTimeout(() => {
                setMessage('');
                setShowAlert(false);
            }, 3000);
            return;
        }

        if (expenseAmount <= 0) {
            setMessage('Expense amount must be a positive number.');
            setShowAlert(true);
            setAlertType('failure');
            setTimeout(() => {
                setMessage('');
                setShowAlert(false);
            }, 3000);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${SERVER_URL}/add-expense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // Ensure token is sent
                },
                body: JSON.stringify({
                    expenseAmount,
                    expenseSource,
                    expenseMethod,
                    date: selectedDate,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to add expense: ${result.message}`);
            }
            setUpdate(true)
            setShowAlert(true);
            setAlertType('success');
            setMessage('Expense added successfully!');
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            console.log(error)
            setShowAlert(true);
            setAlertType('failure');
            setMessage('An error occurred while adding the expense!');
        } finally {
            setExpenseAmount('');
            setExpenseSource('Select an option');
            setExpenseMethod('Select an option');
            setSelectedDate(null);
            setLoading(false);
        }
    };

    const expenseSources = choices.expenseChoices;

    const methods = choices.methods;

    const AlertBox = ({ color, message }) => (
        <Alert color={color} className='my-5 absolute top-20' onDismiss={() => setShowAlert(false)} icon={alertType === 'failure' ? MdOutlineError : FaCheckCircle}>
            <span className="font-medium text-lg">{message}</span>
        </Alert>
    );

    return (
        <div className='w-full min-h-screen flex items-center justify-center pb-10'>
            {showAlert && <AlertBox color={alertType} message={message} />}
            <form className='lg:w-1/3 md:w-2/3 w-10/12 bg-white dark:bg-gray-800 lg:p-10 p-5 rounded-lg shadow-lg flex flex-col items-center gap-2' onSubmit={handleSubmit}>
                <button onClick={() => {navigate('/user/dashboard')}} className='w-full flex items-center justify-end'><IoClose className='text-3xl text-gray-500 dark:text-gray-400' /></button>

                <h1 className='text-5xl font-bold text-green-500 text-center mt-5 mb-10'>Add Expense</h1>

                {/* Expense Amount */}
                <div className='w-full flex flex-col items-start'>
                    <p className='p-2 font-medium'>Expense Amount</p>
                    <div className='w-full flex items-center justify-between p-1 pl-5 border-[1px] border-green-500 rounded-lg'>
                        <RiMoneyRupeeCircleFill className='text-2xl cursor-pointer text-zinc-500 dark:text-zinc-400' />
                        <input
                            placeholder='500'
                            className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                            type="number"
                            required
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                {/* Expense Source */}
                <div className='w-full flex flex-col items-start'>
                    <p className='p-2 font-medium'>Expense Source</p>
                    <div className='w-full flex items-center justify-between p-1 pl-5 border-[1px] border-green-500 rounded-lg'>
                        <MdSource className='text-2xl cursor-pointer text-zinc-500 dark:text-zinc-400' />
                        <Dropdown options={expenseSources} onSelect={handleSelectSource} selected={expenseSource} />
                    </div>
                </div>

                {/* Payment Method */}
                <div className='w-full flex flex-col items-start'>
                    <p className='p-2 font-medium'>Payment Method</p>
                    <div className='w-full flex items-center justify-between p-1 pl-5 border-[1px] border-green-500 rounded-lg'>
                        <MdSource className='text-2xl cursor-pointer text-zinc-500 dark:text-zinc-400' />
                        <Dropdown options={methods} onSelect={handleSelectMethod} selected={expenseMethod} />
                    </div>
                </div>

                {/* Date Picker */}
                <div className='w-full flex flex-col items-start'>
                    <p className='p-2 font-medium'>Date</p>
                    <button
                        type="button"
                        onClick={() => setOpenDate(true)}
                        className='w-full p-2 rounded-lg border-[1px] border-green-500 flex items-center justify-start gap-5 pl-5'
                    >
                        <BsCalendarDateFill className='text-xl text-zinc-500 dark:text-zinc-400' />
                        <span className='text-lg text-zinc-700 dark:text-zinc-300'>
                            {selectedDate ? selectedDate.toDateString() : 'Select Date'}
                        </span>
                    </button>
                    {openDate && <DatePicker onDateChange={handleDateChange} onClose={() => setOpenDate(false)} current={true} />}
                </div>

                <button
                    className='w-full bg-green-500 text-white active:bg-green-700 p-2 text-xl font-semibold rounded-lg my-8'
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AddExpense;
