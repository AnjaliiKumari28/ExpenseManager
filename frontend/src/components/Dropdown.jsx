import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

const Dropdown = ({ options, onSelect, selected }) => {
    const [openOptions, setOpenOptions] = useState(false);
    const [selectedValue, setSelectedValue] = useState(selected || 'Select an option');

    useEffect(() => {
        setSelectedValue(selected);
    }, [selected]);

    const handleChange = (item) => {
        setSelectedValue(item);
        setOpenOptions(false);
        if (onSelect) {
            onSelect(item); // Send selected value to the parent
        }
    };

    return (
        <div className='relative w-full flex flex-col items-center'>
            {/* Dropdown trigger */}
            <div
                onClick={() => setOpenOptions(!openOptions)}
                className='w-full px-3 py-1 bg-inherit rounded-lg text-lg text-gray-700 dark:text-gray-300 flex items-center justify-between cursor-pointer'
            >
                <span>{selectedValue}</span>
                <IoMdArrowDropdown />
            </div>

            {/* Dropdown options */}
            {openOptions && (
                <div
                    className='absolute z-10 w-full mt-2 flex flex-col items-start gap-2 bg-white dark:bg-gray-700 p-2 cursor-pointer shadow-lg'
                    style={{ top: '100%', left: 0 }} // Position options container below the trigger
                >
                    {options.map((item) => (
                        <p
                            key={item}
                            onClick={() => handleChange(item)}
                            className={`w-full hover:bg-gray-200 dark:hover:bg-gray-800 p-2 text-lg font-medium active:bg-green-500 dark:active:bg-green-500 ${
                                selectedValue === item && 'bg-green-500'
                            } rounded-md`}
                        >
                            {item}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
