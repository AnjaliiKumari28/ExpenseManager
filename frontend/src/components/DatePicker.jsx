import React from 'react'; 
import { Datepicker, Flowbite } from 'flowbite-react';

const DatePicker = ({ onDateChange, onClose, current }) => {
    const handleDateChange = (date) => {
        onDateChange(date);
        onClose();
    };

    const customTheme = {
        datepicker: {
            popup: {
                root: {
                    base: "absolute top-10 z-50 block pt-2",
                    inline: "relative top-0 z-auto",
                    inner: "inline-block rounded-lg bg-white dark:bg-gray-700 p-4 shadow-lg",
                },
                header: {
                    selectors: {
                        base: "mb-2 flex justify-between",
                        button: {
                            base: "rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none dark:text-white",
                            prev: "bg-green-500 text-white dark:bg-green-700",
                            next: "bg-green-500 text-white dark:bg-green-700",
                            view: "border-2 border-gray-300 dark:border-gray-500"
                        }
                    }
                },
                footer: {
                    button: {
                        today: current? "bg-green-500 text-white" : "hidden", // Keeping the 'today' button hidden as per your previous request
                        clear: "bg-green-700 dark:bg-green-500 text-white"
                    },
                },
            },
            views: {
                days: {
                    items: {
                        item: {
                            selected: "bg-green-700 dark:bg-green-500 text-white hover:bg-green-600",
                        },
                    },
                },
                months: {
                    items: {
                        item: {
                            selected: "bg-green-700 dark:bg-green-500 text-white hover:bg-green-600",
                        },
                    },
                },
                years: {
                    items: {
                        item: {
                            selected: "bg-green-700 dark:bg-green-500 text-white hover:bg-green-600",
                        },
                    },
                },
                decades: {
                    items: {
                        item: {
                            selected: "bg-green-700 dark:bg-green-500 text-white hover:bg-green-600",
                        },
                    },
                }
            },
        },
    };

    return (
        <Flowbite theme={{ theme: customTheme }}>
            <Datepicker
                className='absolute' 
                inline language='en-IN'
                onChange={handleDateChange} // Update the state on date change
            />
        </Flowbite>
    );
};

export default DatePicker;
