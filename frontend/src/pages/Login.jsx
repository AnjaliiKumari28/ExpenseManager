import React, { useEffect, useState } from 'react';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";
import { Alert } from "flowbite-react";
import { auth } from '../firebase.jsx';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom'
import { IoMdClose } from "react-icons/io";


const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [alertType, setAlertType] = useState('')
    const [resetPassword, setResetPassword] = useState(false)
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState("A password reset link will be sent to your registered email.")

    useEffect(() => {
        const data = localStorage.getItem('credentials')
        if (data) {
            const userCredentials = JSON.parse(data)
            setEmail(userCredentials.email)
            setPassword(userCredentials.password)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setMessage('Please fill in all fields');
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (isChecked) {
                const data = { email: email, password: password }
                localStorage.setItem('credentials', JSON.stringify(data))
            }
            if (!user.emailVerified) {
                await sendEmailVerification(user);
                setMessage('Please verify your email before login. Verification mail has been sent to your registered email.');
                setAlertType('failure');
                setShowAlert(true);
            }
            else {
                navigate('/user/dashboard')
            }
            setEmail('');
            setPassword('');
            setIsChecked(false);
        } catch (error) {
            console.log(error)
            setAlertType('failure');
            setShowAlert(true);
            switch (error.code) {
                
                case 'auth/invalid-email':
                    setMessage('Invalid email format. Please enter a valid email address.');
                    break;
                default:
                    setMessage('Login failed. Please try again.');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetpassword = async () => {
        if (!resetEmail) {
        }
        else {
            try {
                await sendPasswordResetEmail(auth, resetEmail)
                setResetMessage("Email sent, please check your inbox")
            } catch (error) {
                window.alert(`An error occured! ${error}`)
            }
        }
    }


    const AlertBox = ({ color, message }) => {
        return (
            <Alert color={color} className='my-5' onDismiss={() => setShowAlert(false)} icon={alertType === 'failure' ? MdOutlineError : FaCheckCircle}>
                <span className="font-medium text-lg">{message}</span>
            </Alert>
        )
    }

    return (
        <div className='w-screen h-screen min-h-screen flex flex-col items-center'>
            <div className={`w-full h-full flex items-center justify-center py-10`}>
                <section className='lg:w-1/3 md:w-2/3 w-11/12 bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg gap-5 flex flex-col items-center'>
                    {showAlert && (
                        <AlertBox color={alertType} message={message} />
                    )}
                    <h1 className='text-4xl font-bold text-green-500 text-center mt-5 mb-10'>Welcome Back!</h1>


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



                    <div className='w-full flex justify-end text-lg text-green-500'><button onClick={() => setResetPassword(true)}>Forgot Password</button></div>

                    <label htmlFor="check" className='w-full flex items-center justify-start gap-2 cursor-pointer focus:outline-none'>
                        <input
                            type="checkbox"
                            className='h-5 w-5 rounded-md checked:bg-green-500 dark:checked:bg-green-500 focus:outline-none focus:ring-0 dark:focus:ring-0'
                            id="check"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)} // Toggle checkbox state
                        />
                        <p className='text-lg'>Remember Me</p>
                    </label>

                    <button
                        className='w-full bg-green-500 text-white active:bg-green-700 my-5 p-3 text-xl font-semibold rounded-lg'
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>

                    <Link to={'/register'} className='text-lg w-full text-center'>Don't have an account? <b className='text-green-500'> Register</b></Link>
                </section>
            </div>

            {resetPassword &&
                <div className='w-screen h-screen bg-white dark:bg-zinc-800 bg-opacity-50 dark:bg-opacity-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
                    <div style={{ animation: "softLoad 0.3s ease" }} className={`lg:w-1/3 md:w-1/3 portrait:md:w-8/12 portrait:w-11/12  rounded-lg bg-white dark:bg-gray-800 lg:p-10 p-5 text-gray-700 dark:text-gray-300  font-semibold tracking-wide flex flex-col items-center justify-center gap-10 border-2 border-green-500 border-opacity-25`}>
                        <button onClick={() => { setResetPassword(false); setResetMessage("A password reset link will sent to your email.") }} className='w-11/12 flex items-center justify-end text-3xl text-inherit'><IoMdClose /></button>
                        <h1 className='text-green-500 text-5xl font-bold text-center'>Reset Password</h1>

                        <p className='w-full text-center p-2 font-medium bg-purple bg-opacity-20 text-xl rounded-lg'>{resetMessage}</p>
                        <div className='w-full flex flex-col items-start'>
                            <p className='p-2 font-medium text-lg'>Registered Email</p>
                            <div className='w-full flex items-center justify-between p-1 pl-5 border-[1px] border-green-500 rounded-lg'>
                                <MdEmail className='text-2xl cursor-pointer text-zinc-500 dark:text-zinc-400' />
                                <input
                                    placeholder='johndoe@gmail.com'
                                    className='bg-transparent w-full focus:ring-0 border-0 py-1 text-xl text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                                    type="email"

                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                            </div>
                        </div>


                        <button disabled={resetEmail === ''} onClick={handleResetpassword} className='w-full text-xl m-5 bg-green-500 text-white py-2 px-10 rounded-lg'>Send Email</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default Login;
