import { GoogleAuthProvider } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import { useToken } from '../../hooks/useToken';
import Loading from '../../Spinner/Spinner';

const Signup = () => {

    const { register, formState: { errors }, handleSubmit } = useForm();
    const { user, SignUp, updateUser, googleLogin } = useContext(AuthContext)
    const [signUpError, setSignUpError] = useState('');
    const [loader, setLoader] = useState(false)
    const [isloader, setIsloader] = useState(false)

    const [createUserEmail, setCreateUserEmail] = useState('')
    const [token] = useToken(createUserEmail)
    console.log(user)

    const googleProvider = new GoogleAuthProvider();

    let navigate = useNavigate();
    let location = useLocation();

    let from = location.state?.from?.pathname || "/";


    if (token) {
        navigate('/')
    }

    const handleSignUp = data => {

        const registration = {
            name: data.name,
            email: data.email,
            password: data.password
        }

        fetch(`http://localhost:5000/api/registration`, {
            method: 'POST',
            headers: {

                'content-type': 'application/json'

            },
            body: JSON.stringify(registration)
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    console.log(data);
                    setIsloader(false)
                    toast.success('Your Package added successfully')
                    navigate('/login')
                }
            })
            .catch(error => { toast.error(error.message); setIsloader(false) })

    }

    if (loader) {
        return <Loading></Loading>
    }



    //     console.log(data)
    //     setSignUpError('')


    //     SignUp(data.email, data.password)
    //         .then((result) => {
    //             const user = result.user;
    //             console.log(user)

    //             const userInfo = {
    //                 displayName: data.name
    //             }

    //             updateUser(userInfo)
    //                 .then(() => {
    //                     saveUserDasboard(data.name, data.email)
    //                     toast.success('Your account has been successfully create account');
    //                 }).catch((error) => {
    //                     console.log(error)
    //                 });
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             setSignUpError(error.message)
    //         });
    // }

    // const saveUserDasboard = (name, email) => {
    //     const user = { name, email };
    //     fetch('http://localhost:5000/users', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(user)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             setCreateUserEmail(email)
    //         })
    // }




    return (
        <div>
            <div className='h-full flex justify-center items-center'>
                <div className='col-6 mx-auto'>
                    <h2 className='text-xl text-center'>Sign Up</h2>
                    <Form action="" className='p-5' onSubmit={handleSubmit(handleSignUp)}>

                        <FloatingLabel controlId="floatingInputGrid1" label="Enter Your Name">
                            <Form.Control type="text" name='name' placeholder="Enter Your Name" {...register("name", {
                                required: "This field is required (You can't leave this field blank) "

                            })} />
                            {

                                errors.name && <p className='text-danger'>{errors.name.message}</p>
                            }
                        </FloatingLabel>

                        <FloatingLabel className='mt-3' controlId="floatingInputGrid2" label="Email address">
                            <Form.Control type="email" name='email' placeholder="name@example.com" required  {...register("email", {
                                required: "Please enter a valid email address (the data you entered is not in the right format) ",

                            })} />
                            {

                                errors.email && <p className='text-danger'>{errors.email.message}</p>
                            }
                        </FloatingLabel>
                        <FloatingLabel className='mt-4 position-relative' controlId="floatingInputGrid3" label="Enter Password">
                            <Form.Control type='password' placeholder="Enter Password" name='password' {...register("password", {
                                required: "Password is required"
                            })} />
                            <div className='w-100 d-flex justify-content-end position-absolute z-0' style={{ top: '20%', right: '15px', cursor: 'pointer' }}>

                            </div>
                            {

                                errors.password && <p className='text-danger' >{errors.password.message}</p>
                            }
                        </FloatingLabel>

                        <div className='mt-4'>
                            <Button variant="primary" type="submit">
                                Register </Button>
                        </div>
                    </Form>
                    <p className='text-center'>have an Account? <Link to='/login'>Login</Link></p>

                </div>
            </div>



        </div>
    );
};

export default Signup;