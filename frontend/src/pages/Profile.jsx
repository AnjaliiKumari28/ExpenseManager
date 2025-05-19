import React, { useState, useContext, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import { Spinner } from "flowbite-react";
import { MdEdit } from "react-icons/md";
import ToolTip from '../components/ToolTip';
import { MdCurrencyRupee } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { FinancialContext } from '../contexts/finances';
const Profile = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const { accessToken, data, loading } = useOutletContext();
    const { choices, setChoices, fetching, setUpdate } = useContext(FinancialContext)
    const [editGoals, setEditGoals] = useState(false);
    const [goals, setGoals] = useState({ income: 0, expense: 0 });

    const [editIncome, setEditIncome] = useState(false);
    const [editExpense, setEditExpense] = useState(false);
    const [editMethod, setEditMethod] = useState(false);

    // Add temporary arrays for editing
    const [tempIncomeCategories, setTempIncomeCategories] = useState([]);
    const [tempExpenseCategories, setTempExpenseCategories] = useState([]);
    const [tempPaymentMethods, setTempPaymentMethods] = useState([]);

    const [incomeCategories, setIncomeCategories] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const [textInc, setTextInc] = useState('');
    const [textExp, setTextExp] = useState('');
    const [textPay, setTextPay] = useState('');

    // Default categories
    const [defaultIncCat, setDefaultIncCat] = useState([
        "Salary", "Freelancing", "Investments", "Business", "Rental Income", "Gift", "Others",
    ]);

    const [defaultExpCat, setDefaultExpCat] = useState([
        "Clothing", "Entertainment", "EMI", "Food", "Fees", "Grocery", "Medicine", "Movie",
        "Rents", "Subscription", "Travel", "Investments", "Others",
    ]);

    const [defaultPayMeth, setDefaultPayMeth] = useState([
        'Bank Transfer', 'Cash', 'UPI', 'Wallet', 'Check', 'Cryptocurrency',
    ]);

    useEffect(() => {
        setGoals(choices.goals);
        setExpenseCategories(choices.expenseChoices);
        setIncomeCategories(choices.incomeChoices);
        setPaymentMethods(choices.methods)
    }, [choices])

    const updateChoices = async (field, value) => {
        try {
            const response = await fetch(`${SERVER_URL}/update-choice`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    field: field,
                    value: value,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(`Error: ${result.message}`);
            }
            setUpdate(true);
            setChoices(prev => ({
                ...prev,
                field: value
            }))
        } catch (error) {
            console.log(error);
        }
    };

    // Temporary updates for Income
    const AddIncItem = (cat) => {
        const tempIncCat = [...tempIncomeCategories];
        const choice = [cat];
        const filteredIncCat = defaultIncCat.filter(item => !choice.includes(item));
        setDefaultIncCat(filteredIncCat);
        if (!tempIncCat.includes(cat)) tempIncCat.push(cat);
        setTempIncomeCategories(tempIncCat);
    };

    const removeIncItem = (cat) => {
        const tempIncCat = tempIncomeCategories.filter(item => item !== cat);
        setTempIncomeCategories(tempIncCat);
        setDefaultIncCat([...defaultIncCat, cat]);
    };

    // Save the final changes
    const saveIncomeCategories = () => {
        // Update only if there's a difference
        if (JSON.stringify(tempIncomeCategories) !== JSON.stringify(incomeCategories)) {
            setIncomeCategories(tempIncomeCategories);
            updateChoices('incomeChoices', tempIncomeCategories);
            setEditIncome(false);
        }
    };

    // Cancel and restore the original list
    const cancelIncomeEdit = () => {
        setTempIncomeCategories(incomeCategories);
        setEditIncome(false);
    };

    // Temporary updates for Expense
    const AddExpItem = (cat) => {
        const tempExpCat = [...tempExpenseCategories];
        const choice = [cat];
        const filteredExpCat = defaultExpCat.filter(item => !choice.includes(item));
        setDefaultExpCat(filteredExpCat);
        if (!tempExpCat.includes(cat)) tempExpCat.push(cat);
        setTempExpenseCategories(tempExpCat);
    };

    const removeExpItem = (cat) => {
        const tempExpCat = tempExpenseCategories.filter(item => item !== cat);
        setTempExpenseCategories(tempExpCat);
        setDefaultExpCat([...defaultExpCat, cat]);
    };

    // Save the final changes for Expense
    const saveExpenseCategories = () => {
        // Update only if there's a difference
        if (JSON.stringify(tempExpenseCategories) !== JSON.stringify(expenseCategories)) {
            setExpenseCategories(tempExpenseCategories);
            updateChoices('expenseChoices', tempExpenseCategories);
            setEditExpense(false);
        }
    };

    // Cancel and restore the original list for Expense
    const cancelExpenseEdit = () => {
        setTempExpenseCategories(expenseCategories);
        setEditExpense(false);
    };


    // Temporary updates for pyemnt methods
    // Add Payment Method
    const AddPayMeth = (method) => {
        const tempPayMeth = [...tempPaymentMethods];
        const filteredPayMeth = defaultPayMeth.filter(item => item !== method);
        setDefaultPayMeth(filteredPayMeth);

        if (!tempPayMeth.includes(method)) {
            tempPayMeth.push(method);
            setTempPaymentMethods(tempPayMeth);
        }
    };

    // Remove Payment Method
    const removePayMeth = (method) => {
        const tempPayMeth = tempPaymentMethods.filter(item => item !== method);
        setTempPaymentMethods(tempPayMeth);
        setDefaultPayMeth([...defaultPayMeth, method]);
    };

    // Save Payment Methods
    const savePaymentMethods = () => {
        if (JSON.stringify(tempPaymentMethods) !== JSON.stringify(paymentMethods)) {
            setPaymentMethods(tempPaymentMethods);
            updateChoices('methods', tempPaymentMethods);
            setEditMethod(false);
        }
    };

    // Cancel Payment Method Edit
    const cancelMethodEdit = () => {
        setTempPaymentMethods(paymentMethods);
        setEditMethod(false);
    };

    const saveGoals = () => {
        updateChoices('goals', goals); // Update Firebase
        setEditGoals(false);
    };


    if (!data && !choices && fetching && loading) {
        return <div className='w-screen h-screen bg-inherit flex items-center justify-center'><Spinner color="success" size='xl' /></div>;
    }

    return (
        <>
            {!loading && <div className='w-full min-h-screen flex flex-col items-center'>
                {/* Profile Information */}
                <section className='w-10/12 portrait:w-11/12 flex items-center xl:justify-startlg:justify-start md:justify-start justify-center flex-wrap gap-10 p-5 my-5'>
                    <div className='rounded-full border-8 border-green-500 trxt-green-500 font-semibold text-7xl h-32 w-32 text-center flex items-center justify-center text-green-500 bg-white dark:bg-gray-800'><span>{data.displayName.substring(0, 1)}</span></div>
                    <div className='flex flex-col xl:items-start lg:items-start md:items-start items-center'>
                        <p className='text-4xl font-bold'>{data.displayName}</p>
                        <p className='text-xl text-green-500 font-medium'>{data.email}</p>
                    </div>
                </section>

                <div className='w-10/12 border-[1px] border-gray-500 border-opacity-50'></div>


                <section className='portrait:w-11/12 w-10/12 flex flex-col items-start my-10 gap-5'>
                    <h1 className='text-4xl text-green-500 font-bold'>Preferences</h1>

                    {/* Monthly Goals */}
                    <div className='w-full flex flex-col items-center justify-evenly dark:bg-gray-800 bg-white rounded-lg p-10 my-10 shadow dark:shadow-none'>
                        <div className='w-full flex items-center justify-between px-3 pb-10'>
                            <h1 className='text-2xl font-bold text-gray-700 dark:text-gray-300'>Monthly Goals</h1>
                            <ToolTip children={<button onClick={() => setEditGoals(true)} className='text-2xl'><MdEdit /></button>} content={'Edit Goals'} placement={'top'} />
                        </div>
                        <div className='w-full flex xl:flex-row lg:flex-row md:flex-row flex-col items-center justify-around gap-5'>
                            <div className='flex flex-col items-center gap-2 py-5 px-10 border-2 border-green-500 rounded-lg'>
                                <span className='text-xl font-medium'>Income Goal</span>
                                {editGoals ? <div className='w-full flex items-center justify-between p-1 pl-5 border-[1px] border-green-500 rounded-lg'><MdCurrencyRupee /><input type="number" value={goals.income} className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400' onChange={(event) => setGoals(prevGoals => ({
                                    ...prevGoals,
                                    income: parseFloat(event.target.value)
                                }))} /></div> : <span className='text-2xl font-bold text-green-500'>
                                    ₹ {goals.income}</span>}
                            </div>
                            <div className='flex flex-col items-center gap-2 py-5 px-10 border-2 border-green-500 rounded-lg'>
                                <span className='text-xl font-medium'>Expense Goal</span>
                                {editGoals ? <div className='w-full flex items-center justify-between p-1 pl-5 border-[1px] border-green-500 rounded-lg'><MdCurrencyRupee /><input type="number" value={goals.expense} className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400' onChange={(event) => setGoals(prevGoals => ({
                                    ...prevGoals,
                                    expense: parseFloat(event.target.value)
                                }))} /></div> : <span className='text-2xl font-bold text-green-500'>₹ {goals.expense}</span>}
                            </div>
                        </div>
                        {editGoals && <div className='w-full flex items-center xl:justify-end lg:justify-end md:justify-end justify-center gap-5'>
                            <button onClick={() => setEditGoals(false)} className='bg-red-500 text-white text-xl px-5 py-2 rounded-lg'>Cancel</button>
                            <button onClick={saveGoals} className='text-xl font-medium px-5 py-2 rounded-lg bg-green-500 text-white m-5'>Save</button>
                        </div>}
                    </div>

                    {/* Income Categories */}
                    <div className='w-full flex items-center justify-center gap-5'>
                        <div className='w-full flex flex-col items-center gap-2 bg-white dark:bg-gray-800 p-10 rounded-lg shadow dark:shadow-none'>
                            <div className='w-full flex items-center justify-between pb-10'>
                                <span className='w-full text-2xl font-bold text-gray-700 dark:text-gray-300'>Income Categories</span>
                                <ToolTip children={<button onClick={() => {
                                    setEditIncome(true);
                                    setTempIncomeCategories([...incomeCategories]);
                                }} className='text-2xl'><MdEdit /></button>} content={'Edit Income Categories'} placement={'top'} />
                            </div>
                            {!editIncome && <div className='w-full flex items-center gap-5 flex-wrap justify-start'>
                                {incomeCategories.map((item) => (
                                    <span key={item} className='text-lg font-medium px-5 py-2 rounded-lg border-2 border-green-500 text-green-500'>{item}</span>
                                ))}
                            </div>}

                            {editIncome && <div className='w-full flex-col items-start justify-center'>
                                <p className='text-lg font-medium pb-5'>Selected</p>
                                <div className='w-full flex items-center gap-5 flex-wrap justify-start'>
                                    {tempIncomeCategories.map((item) => (
                                        <div key={item} className='text-lg font-medium px-5 py-2 rounded-lg border-2 text-gray-400 border-gray-400 flex items-center justify-between gap-3'>
                                            <span >{item}</span>
                                            <MdDeleteOutline onClick={() => removeIncItem(item)} className='text-red-500 cursor-pointer text-2xl' />
                                        </div>
                                    ))}

                                    <div className='w-full border-[1px] border-gray-500 border-opacity-50'></div>
                                    <div className='w-full flex items-center justify-between p-2 pl-5 border-[1px] border-green-500 rounded-lg'>
                                        <input type="text" placeholder='Enter a category' value={textInc} className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400' onChange={(event) => setTextInc(event.target.value)} />
                                        <button onClick={() => AddIncItem(textInc)} className='bg-green-500 text-white text-lg px-5 py-1 rounded-lg'>Add</button>
                                    </div>

                                    {defaultIncCat.map((item) => (
                                        <button onClick={() => AddIncItem(item)} key={item} className='text-md px-5 py-2 rounded-lg border-[1px] '>{item}</button>
                                    ))}
                                </div>

                                <div className='w-full flex items-center xl:justify-end lg:justify-end md:justify-end justify-center gap-5'>
                                    <button onClick={cancelIncomeEdit} className='bg-red-500 text-white text-xl px-5 py-2 rounded-lg'>Cancel</button>
                                    <button onClick={saveIncomeCategories} className='text-xl font-medium px-5 py-2 rounded-lg bg-green-500 text-white m-5'>Save</button>
                                </div>
                            </div>}
                        </div>
                    </div>

                    {/* Expense Categories */}
                    <div className='w-full flex items-center justify-center gap-5'>
                        <div className='w-full flex flex-col items-center gap-2 bg-white dark:bg-gray-800 p-10 rounded-lg shadow dark:shadow-none'>
                            <div className='w-full flex items-center justify-between pb-10'>
                                <span className='w-full text-2xl font-bold text-gray-700 dark:text-gray-300'>Expense Categories</span>
                                <ToolTip children={<button onClick={() => {
                                    setEditExpense(true);
                                    setTempExpenseCategories([...expenseCategories]);
                                }} className='text-2xl'><MdEdit /></button>} content={'Edit Expense Categories'} placement={'top'} />
                            </div>
                            {!editExpense && <div className='w-full flex items-center gap-5 flex-wrap justify-start'>
                                {expenseCategories.map((item) => (
                                    <span key={item} className='text-lg font-medium px-5 py-2 rounded-lg border-2 border-green-500 text-green-500'>{item}</span>
                                ))}
                            </div>}

                            {editExpense && <div className='w-full flex-col items-start justify-center'>
                                <p className='text-lg font-medium pb-5'>Selected</p>
                                <div className='w-full flex items-center gap-5 flex-wrap justify-start'>
                                    {tempExpenseCategories.map((item) => (
                                        <div key={item} className='text-lg font-medium px-5 py-2 rounded-lg border-2 text-gray-400 border-gray-400 flex items-center justify-between gap-3'>
                                            <span >{item}</span>
                                            <MdDeleteOutline onClick={() => removeExpItem(item)} className='text-red-500 cursor-pointer text-2xl' />
                                        </div>
                                    ))}

                                    <div className='w-full border-[1px] border-gray-500 border-opacity-50'></div>
                                    <div className='w-full flex items-center justify-between p-2 pl-5 border-[1px] border-green-500 rounded-lg'>
                                        <input type="text" placeholder='Enter a category' value={textExp} className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400' onChange={(event) => setTextExp(event.target.value)} />
                                        <button onClick={() => AddExpItem(textExp)} className='bg-green-500 text-white text-lg px-5 py-1 rounded-lg'>Add</button>
                                    </div>

                                    {defaultExpCat.map((item) => (
                                        <button onClick={() => AddExpItem(item)} key={item} className='text-md px-5 py-2 rounded-lg border-[1px] '>{item}</button>
                                    ))}
                                </div>

                                <div className='w-full flex items-center xl:justify-end lg:justify-end md:justify-end justify-center gap-5'>
                                    <button onClick={cancelExpenseEdit} className='bg-red-500 text-white text-xl px-5 py-2 rounded-lg'>Cancel</button>
                                    <button onClick={saveExpenseCategories} className='text-xl font-medium px-5 py-2 rounded-lg bg-green-500 text-white m-5'>Save</button>
                                </div>
                            </div>}
                        </div>
                    </div>


                    {/* Payment Methods */}
                    <div className='w-full flex items-center justify-center gap-5'>
                        <div className='w-full flex flex-col items-center gap-2 bg-white dark:bg-gray-800 p-10 rounded-lg shadow dark:shadow-none'>
                            <div className='w-full flex items-center justify-between pb-10'>
                                <span className='w-full text-2xl font-bold text-gray-700 dark:text-gray-300'>Payment Methods</span>
                                <ToolTip children={<button onClick={() => {
                                    setEditMethod(true);
                                    setTempPaymentMethods([...paymentMethods]);
                                }} className='text-2xl'><MdEdit /></button>} content={'Edit Payment Methods'} placement={'top'} />
                            </div>

                            {!editMethod && <div className='w-full flex items-center gap-5 flex-wrap justify-start'>
                                {paymentMethods.map((item) => (
                                    <span key={item} className='text-lg font-medium px-5 py-2 rounded-lg border-2 border-green-500 text-green-500'>{item}</span>
                                ))}
                            </div>}

                            {editMethod && <div className='w-full flex-col items-start justify-center'>
                                <p className='text-lg font-medium pb-5'>Selected</p>
                                <div className='w-full flex items-center gap-5 flex-wrap justify-start'>
                                    {tempPaymentMethods.map((item) => (
                                        <div key={item} className='text-lg font-medium px-5 py-2 rounded-lg border-2 text-gray-400 border-gray-400 flex items-center justify-between gap-3'>
                                            <span >{item}</span>
                                            <MdDeleteOutline onClick={() => removePayMeth(item)} className='text-red-500 cursor-pointer text-2xl' />
                                        </div>
                                    ))}

                                    <div className='w-full border-[1px] border-gray-500 border-opacity-50'></div>
                                    <div className='w-full flex items-center justify-between p-2 pl-5 border-[1px] border-green-500 rounded-lg'>
                                        <input type="text" placeholder='Enter a payment method' value={textPay} className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400' onChange={(event) => setTextPay(event.target.value)} />
                                        <button onClick={() => AddPayMeth(textPay)} className='bg-green-500 text-white text-lg px-5 py-1 rounded-lg'>Add</button>
                                    </div>

                                    {defaultPayMeth.map((item) => (
                                        <button onClick={() => AddPayMeth(item)} key={item} className='text-md px-5 py-2 rounded-lg border-[1px] '>{item}</button>
                                    ))}
                                </div>

                                <div className='w-full flex items-center xl:justify-end lg:justify-end md:justify-end justify-center gap-5'>
                                    <button onClick={cancelMethodEdit} className='bg-red-500 text-white text-xl px-5 py-2 rounded-lg'>Cancel</button>
                                    <button onClick={savePaymentMethods} className='text-xl font-medium px-5 py-2 rounded-lg bg-green-500 text-white m-5'>Save</button>
                                </div>
                            </div>}
                        </div>
                    </div>

                </section>
            </div>}
        </>

    )
}


export default Profile