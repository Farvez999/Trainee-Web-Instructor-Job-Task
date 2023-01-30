import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthProvider';
import { useToken } from '../../hooks/useToken';
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Login = () => {

    const { register, formState: { errors }, handleSubmit } = useForm();
    const { logIN, googleLogin } = useContext(AuthContext)
    const [loginError, setLoginError] = useState('')
    const [loader, setLoader] = useState(false)
    const [isloader, setIsloader] = useState(false)

    const [loginUserEmail, setLoginUserEmail] = useState('')
    const [token] = useToken(loginUserEmail)

    const googleProvider = new GoogleAuthProvider();

    let navigate = useNavigate();
    let location = useLocation();

    let from = location.state?.from?.pathname || "/";

    if (token) {
        navigate(from, { replace: true });
    }

    const handleLogin = data => {


        const loginEmail = data.email;
        const loginPass = data.password;

        fetch(`http://localhost:5000/api/login`, {

        })
            .then(res => res.json())
            .then(data => {
                const result = data.find(userData => userData?.email === loginEmail);
                if (result.email !== loginEmail) {
                    toast.error('Email is incorrect')
                }
                if (result.password !== loginPass) {
                    toast.error('Password is incorrect')
                    return
                }
                const user = result.email
                console.log(user)
                setLoginUserEmail(result.email)
                toast.success('Login successful')
                //     navigate('/')
            })
            .catch(error => {
                toast.error(error.message);
                setIsloader(false)
            })
    }





    return (
        <div className=' flex justify-center '>
            {/* items-center */}
            <div className='col-6 mx-auto'>
                <h1 className='text-3xl font-bold text-center my-5'>Login</h1>
                <Form onSubmit={handleSubmit(handleLogin)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control {...register("email", { required: "Email Address is required" })} type="email" placeholder="Enter email" />
                        {errors.email && <p className='text-red-500' role="alert">{errors.email?.message}</p>}

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control {...register("password", { required: "Password Address is required" })} type="password" placeholder="Password" />
                        {errors.password && <p className='text-red-500' role="alert">{errors.password?.message}</p>}
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    {
                        loginError && <p className='text-red-500'>{loginError}</p>
                    }
                </Form>
                <p className='text-center'>Don't have an Account? <Link to='/register'>Register</Link></p>
                {/* <form >

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input {...register("email", { required: "Email Address is required" })} type="text" className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className='text-red-500' role="alert">{errors.email?.message}</p>}
                    </div>


                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input {...register("password", { required: "Password Address is required", minLength: { value: 6, message: 'Passwor must be 6 characters or longer' } })} type="password" className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className='text-red-500' role="alert">{errors.password?.message}</p>}
                        <label className="label">
                            <span className="label-text">Forgot Password ?</span>
                        </label>
                    </div>


                    <input className='btn btn-accent w-full text-white' value="Login" type="submit" />
                    {
                        loginError && <p className='text-red-500'>{loginError}</p>
                    }
                    <p>New to Doctors Portal <Link className='text-secondary' to="/signup">Create new Account</Link></p>
                    <div className="divider">OR</div>
                    <button onClick={handleGoogleLogin} className='btn btn-outline w-full'>CONTINUE WITH GOOGLE</button>
                </form> */}
            </div>
        </div>
    );
};

export default Login;