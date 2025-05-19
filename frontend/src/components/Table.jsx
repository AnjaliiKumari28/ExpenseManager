import React from 'react';
import { Table } from "flowbite-react";

const TableBox = ({ statements }) => {

    function formatDate(firebaseTimestamp) {
        const date = new Date(firebaseTimestamp._seconds * 1000); // Convert Firebase Timestamp to JavaScript Date
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const day = date.getDate(); // No need for padding if we want "1" instead of "01"
        const month = monthNames[date.getMonth()]; // Full month name
        const year = date.getFullYear(); // Full year

        return `${day} ${month} ${year}`;
    }

    return (
        <div className="w-full bg-white dark:border-gray-700 dark:bg-gray-800 lg:p-5 p-0 rounded-lg overflow-x-scroll">
            <h1 className='text-2xl p-2 font-semibold'>Mini Statements</h1>
            <Table hoverable className='w-full p-2'>
                <Table.Head>
                    <Table.HeadCell className="lg:text-xl md:text-lg text-md">Date</Table.HeadCell>
                    <Table.HeadCell className="lg:text-xl md:text-lg text-md">Source</Table.HeadCell>
                    <Table.HeadCell className="lg:text-xl md:text-lg text-md">Method</Table.HeadCell>
                    <Table.HeadCell className="lg:text-xl md:text-lg text-md">Amount</Table.HeadCell>

                </Table.Head>
                <Table.Body className="divide-y p-0">
                    {statements.map((statement, index) => (
                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="lg:text-lg md:text-md text-sm text-gray-900 dark:text-white ">
                                {formatDate(statement.transactionDate)}
                            </Table.Cell>
                            <Table.Cell className="lg:text-lg md:text-md text-sm ">
                                {statement.incomeSource || statement.expenseSource}
                            </Table.Cell>
                            <Table.Cell className="lg:text-lg md:text-md text-sm">
                                {statement.incomeMethod || statement.expenseMethod}
                            </Table.Cell>
                            <Table.Cell className={`lg:text-lg md:text-md text-sm  ${statement.incomeAmount ? 'text-green-500' : 'text-red-500'}`}>
                                {statement.incomeAmount ? `+ ₹ ${statement.incomeAmount}` : `- ₹ ${statement.expenseAmount}`}
                            </Table.Cell>

                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}

export default TableBox;
