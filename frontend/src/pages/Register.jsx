import React, { useState } from 'react';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser, FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";
import { Alert } from "flowbite-react";
import { auth } from '../firebase.jsx';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.jsx'; // Make sure to import your Firestore instance
import { Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [alertType, setAlertType] = useState('');
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || password !== confirmPassword) {
            setMessage('Please fill in all fields correctly.');
            setAlertType('failure');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                setMessage('');
            }, 3000);
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            await sendEmailVerification(user);
            await addUser(user); // Call the addUser function here
            setMessage('Registration successful. Please verify your email before login.');
            setAlertType('success');
            setShowAlert(true);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setIsChecked(false);
        } catch (error) {
            setAlertType('failure');
            setShowAlert(true);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setMessage('Email already exists');
                    break;
                case 'auth/weak-password':
                    setMessage('Password should be at least 6 characters');
                    break;
                case 'auth/invalid-email':
                    setMessage('Invalid email format. Please enter a valid email address.');
                    break;
                default:
                    setMessage('Registration failed. Please try again.');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to add user details to Firestore
    const addUser = async (user) => {
        const userDocRef = doc(db, 'users', user.uid); // Create a document reference
        const templateData = {
            balance: 0,
            email: email,
            expenseChoices: JSON.stringify(["Clothing", "Food", "Grocery", "Others"]),
            incomeChoices: JSON.stringify(["Salary"]),
            methods: JSON.stringify(["Cash", "UPI"]),
            goals: JSON.stringify({ income: 0, expense: 0 }),
        };

        try {
            await setDoc(userDocRef, templateData); // Create the user document in Firestore
            console.log("User document created successfully!");
        } catch (error) {
            console.error("Error adding user document: ", error);
            alert("Error occurred while adding user document.");
        }
    };

    const AlertBox = ({ color, message }) => {
        return (
            <Alert color={color} className='my-5' onDismiss={() => setShowAlert(false)} icon={alertType === 'failure' ? MdOutlineError : FaCheckCircle}>
                <span className="font-medium text-lg">{message}</span>
            </Alert>
        );
    };

    return (
        <div className='w-screen min-h-screen flex flex-col items-center'>
            <div className='w-full h-full flex items-center justify-center py-10'>
                <form className='lg:w-1/3 md:w-2/3 w-11/12 bg-white dark:bg-gray-800 lg:p-10 p-5 rounded-lg shadow-lg flex flex-col items-center gap-3' onSubmit={handleSubmit}>
                    {showAlert && (
                        <AlertBox color={alertType} message={message} />
                    )}
                    <h1 className='text-5xl font-bold text-green-500 text-center mt-5 mb-10'>Join Us!</h1>

                    <div className='w-full flex flex-col items-start'>
                        <p className='p-2 font-medium'>Name</p>
                        <div className='w-full flex items-center justify-between p-1 pl-5 border-[1px] border-green-500 rounded-lg'>
                            <FaUser className='text-xl cursor-pointer text-zinc-500 dark:text-zinc-400' />
                            <input
                                placeholder='John Doe'
                                className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='w-full flex flex-col items-start'>
                        <p className='p-2 font-medium'>Email</p>
                        <div className='w-full flex items-center justify-between p-1 pl-5 border-[1px] border-green-500 rounded-lg'>
                            <MdEmail className='text-2xl cursor-pointer text-zinc-500 dark:text-zinc-400' />
                            <input
                                placeholder='johndoe@gmail.com'
                                className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='w-full flex flex-col items-start'>
                        <p className='p-2 font-medium'>Password</p>
                        <div className='w-full flex items-center justify-between p-1 px-5 border-[1px] border-green-500 rounded-lg'>
                            <RiLockPasswordFill className='text-2xl cursor-pointer text-zinc-500 dark:text-zinc-400' />
                            <input
                                placeholder='********'
                                className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='w-full flex flex-col items-start'>
                        <p className='p-2 font-medium'>Confirm Password</p>
                        <div className='w-full flex items-center justify-between p-1 px-5 border-[1px] border-green-500 rounded-lg'>
                            <RiLockPasswordFill className='text-2xl cursor-pointer text-zinc-500 dark:text-zinc-400' />
                            <input
                                placeholder='********'
                                className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <label htmlFor="check" className='flex items-center justify-start gap-2 mt-5 cursor-pointer focus:outline-none'>
                        <input
                            type="checkbox"
                            className='h-5 w-5 rounded-md checked:bg-green-500 dark:checked:bg-green-500 focus:outline-none focus:ring-0 dark:focus:ring-0'
                            id="check"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)} // Toggle checkbox state
                        />
                        <p className='text-lg'>I Accept to <strong>terms & conditions</strong></p>
                    </label>

                    <button
                        className='w-full bg-green-500 text-white active:bg-green-700 my-5 p-3 text-xl font-semibold rounded-lg'
                        type="submit"
                        disabled={loading || !isChecked} 
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <Link to={'/log-in'} className='text-xl font-medium w-full flex justify-center'>Already have an account? <b className='text-green-500 px-2'> Log In</b></Link>
                </form>
            </div>
        </div>
    );
}

export default Register;
