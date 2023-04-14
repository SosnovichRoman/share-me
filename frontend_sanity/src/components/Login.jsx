import React from 'react';
import axios from 'axios';
import { googleLogout, useGoogleLogin, } from '@react-oauth/google';

import { AiOutlineLogout } from 'react-icons/ai';
// import GoogleLogin from 'react-google-login';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

import { client } from '../client';

const Login = () => {
    const navigate = useNavigate();

    const setUser = (codeResponse) => {

        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
            headers: {
                Authorization: `Bearer ${codeResponse.access_token}`,
                Accept: 'application/json'
            }
        }).then((res) => {
            localStorage.setItem('user', JSON.stringify(res.data));
            console.log(res.data);
            const { name, id, picture } = res.data;
            console.log(name, id, picture);
            const doc = {
                _id: id,
                _type: 'user',
                userName: name,
                image: picture,
            };
            client.createIfNotExists(doc).then(() => {
                navigate('/', { replace: true });
            });
            console.log(res.data);
        })
            .catch((err) => console.log(err));
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    return (
        <div className="flex justify-start items-center flex-col h-screen">
            <div className=" relative w-full h-full">
                <video
                    src={shareVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className="w-full h-full object-cover"
                />
                <div className="absolute flex flex-col gap-5 justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
                    <div className="">
                        <img src={logo} width="130px" />
                    </div>
                    <div className="shadow-2xl">
                        <button
                            type="button"
                            className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                            onClick={() => login()}
                        >
                            <FcGoogle className="mr-4" /> Sign in with google
                        </button>
                    </div>
                    <div className="shadow-2xl bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none">
                        <Link to="/">Enter without login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
