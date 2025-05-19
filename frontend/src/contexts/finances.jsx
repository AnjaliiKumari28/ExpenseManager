import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth';
export const FinancialContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const FinancialProvider = ({ children }) => {
    const { isAuthenticated, accessToken } = useContext(AuthContext);
    const [finances, setFinances] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [update, setUpdate] = useState(false);
    const [summary, setSummary] = useState({
        monthlyIncome: 0,
        monthlyExpenses: 0,
        todayIncome: 0,
        todayExpenses: 0,
        last10Transactions: [], // Add this to hold the last 10 transactions
        incomeArray: [],
        expenseArray: [],
        categoryWiseExpense: {},
        categoryWiseIncome: {},
        weeklyIncomeArray: [],
        weeklyExpenseArray: [],
        incomeMethodWise: [],
        expenseMethodWise: [],
    });

    const [choices, setChoices] = useState({
        "balance": 0,
        "goals": {
            "income": 0,
            "expense": 0
        },
        "expenseChoices": [],
        "incomeChoices": [],
        "methods": []
    });

    const getChoices = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/choices`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(`Error: ${result.message}`);
            }

            // Error handling while parsing JSON
            let parsedGoals, parsedExpenseChoices, parsedIncomeChoices, parsedMethods, parsedBalance;
            try {
                parsedGoals = JSON.parse(result.data.goals.replace(/'/g, '"'));
                parsedExpenseChoices = JSON.parse(result.data.expenseChoices);
                parsedIncomeChoices = JSON.parse(result.data.incomeChoices);
                parsedMethods = JSON.parse(result.data.methods);
                parsedBalance = result.data.balance;
            } catch (error) {
                console.error("Error parsing JSON: ", error);
                return;
            }

            setChoices({
                goals: parsedGoals,
                expenseChoices: parsedExpenseChoices,
                incomeChoices: parsedIncomeChoices,
                methods: parsedMethods,
                balance: parsedBalance
            });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFinances = async () => {
        if (!isAuthenticated) return;

        try {
            const response = await fetch(`${SERVER_URL}/all-finances?duration=currentMonth`, {
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

        // Initialize totals for today and for the current month
        let todayIncome = 0;
        let todayExpenses = 0;
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

        // Current day for today's calculations
        const today = now.getDate();

        // Extract the last 10 transactions
        const last10Transactions = finances.slice(-10); // Get the last 10 items

        finances.forEach(item => {
            const transactionDate = item.transactionDate; // Firebase Timestamp
            const date = new Date(transactionDate._seconds * 1000); // Convert to Date
            const day = date.getDate(); // Get the day of the month

            // Calculate the week of the month (0-indexed, so week 1 is index 0)
            const weekOfMonth = Math.floor((day - 1) / 7);

            // Check if the transaction is from today
            if (date.toDateString() === now.toDateString()) {
                if (item.incomeAmount) {
                    todayIncome += item.incomeAmount; // Accumulate today's income
                }
                if (item.expenseAmount) {
                    todayExpenses += item.expenseAmount; // Accumulate today's expenses
                }
            }

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
            todayIncome,
            todayExpenses,
            monthlyIncome,
            monthlyExpenses,
            weeklyIncomeArray,
            weeklyExpenseArray,
            categoryWiseIncome: incomeCategoryWise,
            categoryWiseExpense: expenseCategoryWise,
            incomeMethodWise,
            expenseMethodWise,
            last10Transactions, // Add last 10 transactions to the summary
        }));
    };

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            getChoices();
            fetchFinances();
        }
    }, [isAuthenticated, accessToken]);

    useEffect(() => {
        if(update){
            getChoices();
            fetchFinances();
            setUpdate(false);
        }
    }, [update]);

    useEffect(() => {
        if (finances) {
            setFetching(true);
            generateSummary();
            setFetching(false)
        }
    }, [finances])

    return (
        <FinancialContext.Provider value={{ finances, summary, choices, setChoices, fetching, setUpdate }}>
            {children}
        </FinancialContext.Provider>
    );
};
