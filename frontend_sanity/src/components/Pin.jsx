import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { userQuery } from '../utils/data';

import { client, urlFor } from '../client';

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();

  const { postedBy, image, _id, destination, category } = pin;

  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
  const pinSaveRate = 5;

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user?.id);

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.id,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.id,
          },
        }])
        .commit()
        .then(() => {
          //window.location.reload();
          setSavingPost(false);
          console.log(category._ref);
          console.log(pin);
          updateRating(category._ref);
        });
    }
  };

  const updateRating = (categoryId) => {
    if (user) {
      console.log(user);
      let shouldAppend = true;

      client.fetch(userQuery(user?.id)).then((userData) => {
        userData[0]?.favoriteCategories?.map((favCategory) => {
          console.log(favCategory.category._ref, categoryId);
          if (favCategory.category._ref === categoryId) {
            shouldAppend = false;
            console.log("should false");
          }
          console.log("--");
        })
        // Append new item of favorite category if necessary
        if (shouldAppend) {
          client
            .patch(user?._id)
            .insert('after', 'favoriteCategories[-1]', [{ category: { _ref: categoryId, _type: "reference" }, rate: 0 }])
            .commit({ autoGenerateArrayKeys: true })
            .then(() => {
              incrementRating(categoryId);
            })
            .catch((err) => {
              console.error('Insert field to favorite rating failed: ', err.message)
            });
        }
        else incrementRating(categoryId);
      })
    }
  }

  const incrementRating = (categoryId) => {
    client
      .patch(user?.id)
      .inc({ [`favoriteCategories[category._ref == "${categoryId}"].rate`]: pinSaveRate })
      .commit()
      .then(() => {
        console.log("End update rating");
      })
      .catch((err) => {
        console.error('Update failed: ', err.message)
      });
  }

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image && (
          <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />)}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                ><MdDownloadForOffline />
                </a>
              </div>
              {user && (alreadySaved?.length !== 0 ? (
                <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                  {pin?.save?.length}  Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                </button>
              ))}
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              {destination?.slice(8).length > 0 ? (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  {' '}
                  <BsFillArrowUpRightCircleFill />
                  {destination?.slice(8, 17)}...
                </a>
              ) : undefined}
              {
                postedBy?._id === user?.id && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePin(_id);
                    }}
                    className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                  >
                    <AiTwotoneDelete />
                  </button>
                )
              }
            </div>
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
