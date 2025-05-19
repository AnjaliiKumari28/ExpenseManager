import React, { useEffect, useState, useContext } from 'react';
import AreaChart from '../components/AreaChart';
import TableBox from '../components/Table';
import { AuthContext } from '../contexts/auth';
import { Spinner } from 'flowbite-react';

const Transactions = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [transactionType, setTransactionType] = useState('both');
  const [duration, setDuration] = useState('15days');
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [chartData, setChartData] = useState({
    incomeArray: [],
    expenseArray: [],
    formattedDateArray: []
  }); 
  const [loading, setLoading] = useState(true);
  const { accessToken } = useContext(AuthContext);

  const transactionTypes = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
    { label: 'Both', value: 'both' },
  ];

  const durations = [
    { label: '15 Days', value: '15days' },
    { label: '1 Month', value: '1month' },
    { label: '3 Months', value: '3month' },
    { label: '6 Months', value: '6month' },
    { label: '1 Year', value: '1year' },
    { label: 'All Time', value: 'all' },
  ];

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/all-finances?duration=${duration}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Error: ${result.status} ${result.message}`);
      }
      setTransactions(result.data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      fetchTransactions();
    }
  }, [duration, accessToken]);

  function convertDates(timestamp) {
    const milliseconds = timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;
    return new Date(milliseconds).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
  }
  const processFinances = () => {
    const incomeArray = transactions.map((item) => item.incomeAmount ? item.incomeAmount : 0);
    const expenseArray = transactions.map((item) => item.expenseAmount ? item.expenseAmount : 0);
    const formattedDateArray = transactions.map((item) => convertDates(item.transactionDate))

    setChartData({
      incomeArray,
      expenseArray,
      formattedDateArray
    })
  }

  useEffect(() => {
    if (transactions.length !== 0) {
      setLoading(true);
      processFinances(transactions);
      setFilteredTransactions(transactions);
      setLoading(false);
    }
  }, [transactions]);

  useEffect(() => {
    const newData = transactions.filter(transaction => {
      if (transactionType === 'income'){
        return transaction.incomeAmount > 0 && transaction.incomeSource !== undefined
      }
      else if (transactionType === 'expense'){
        return transaction.expenseAmount > 0 && transaction.expenseSource !== undefined
      }
      else return true;
    })
    setFilteredTransactions(newData)
  }, [transactionType, transactions]);

  // if (transactions.length === 0) {
  //   return (
  //     <div className="w-screen h-screen bg-inherit flex items-center justify-center">
  //       <p className='text-xl'>No Transactions Found!</p>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="w-screen h-screen bg-inherit flex items-center justify-center">
        <Spinner color="success" size="xl" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="portrait:w-full w-11/12 flex flex-col items-center gap-10 p-5">
        <h1 className="w-full text-4xl font-bold">Transactions</h1>
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex flex-col items-start justify-center gap-5 mb-10">
            {/* Transaction Type Section */}
            <div className="w-full flex flex-col items-center justify-start gap-5 flex-wrap">
              <h1 className="w-full text-xl font-bold text-gray-700 dark:text-gray-300">
                Select Transaction Type
              </h1>
              <div className="w-full flex items-center justify-start flex-wrap gap-5">
                {transactionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setTransactionType(type.value)}
                    className={`text-xl font-semibold text-green-500 border-2 border-green-500 px-5 py-1 rounded-lg ${
                      transactionType === type.value && 'bg-green-500 text-white'
                    } text-nowrap`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Section */}
            <div className="w-full flex flex-col items-center justify-start gap-5 flex-wrap">
              <h1 className="w-full text-xl font-bold text-gray-700 dark:text-gray-300">
                Select Duration
              </h1>
              <div className="w-full flex items-center justify-start flex-wrap gap-5">
                {durations.map((dur) => (
                  <button
                    key={dur.value}
                    onClick={() => setDuration(dur.value)}
                    className={`text-xl font-semibold text-green-500 border-2 border-green-500 px-5 py-1 rounded-lg ${
                      duration === dur.value && 'bg-green-500 text-white'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-5">
            <AreaChart
              income={chartData.incomeArray}
              expense={chartData.expenseArray}
              xAxis={chartData.formattedDateArray}
            />
            <TableBox statements={filteredTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
