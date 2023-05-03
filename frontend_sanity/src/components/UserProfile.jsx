import React, { useEffect, useState } from 'react';
import { AiOutlineLogout, AiOutlineShoppingCart } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { HiShoppingCart } from 'react-icons/hi'

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { googleLogout } from '@react-oauth/google';

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-32 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-32 outline-none';

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  const User = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleOrder = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const orderInfo = {
      orderName,
      orderPhone,
      orderAddress
    }


    console.log(orderInfo);
  }

 

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === 'My pictures') {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    googleLogout();
    console.log("execute orig logout");
    localStorage.clear();

    navigate('/login');
  };

  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === User?.id && (

              <button
                type="button"
                className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                onClick={() => { logout() }}

              >
                <AiOutlineLogout color="red" fontSize={21} />
              </button>

              // <GoogleLogout
              //   clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              //   render={(renderProps) => (
              //     <button
              //       type="button"
              //       className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
              //       onClick={renderProps.onClick}
              //       disabled={renderProps.disabled}
              //     >
              //       <AiOutlineLogout color="red" fontSize={21} />
              //     </button>
              //   )}
              //   onLogoutSuccess={logout}
              //   onFailure={(m) => console.log(m)}
              //   cookiePolicy="single_host_origin"
              // />
            )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            My pictures
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Shopping cart
          </button>
        </div>

        <div className="px-2">
          <MasonryLayout pins={pins} />
        </div>

        {pins?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            No Pins Found!
          </div>
        )}
        {text === "Shopping cart" && <div className='py-20 px-5'>
          <div className='max-w-[1200px] mx-auto'>
            <h2 className='text-4xl font-bold flex gap-10 items-center'>Make an order<HiShoppingCart /> </h2>
            <form onSubmit={(e) => handleOrder(e)} className='mt-10 space-y-5 flex flex-col'>
              <input
                type="text"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                placeholder="Enter your name"
                className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                required
              />
              <input
                type="text"
                value={orderPhone}
                onChange={(e) => setOrderPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                required
              />
              <input
                type="text"
                value={orderAddress}
                onChange={(e) => setOrderAddress(e.target.value)}
                placeholder="Enter your address"
                className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                required
              />
              <button
                type="submit"
                disabled={submitted}
                className={`text-white font-bold p-2 rounded-full w-36 outline-none ${submitted ? 'bg-red-400' : 'bg-red-500'}`}
              >
                {submitted && <span>Done!</span>}
                {!submitted && <span>Make an order</span>}
              </button>
            </form>
          </div>
        </div>}


      </div>

    </div>
  );
};

export default UserProfile;
