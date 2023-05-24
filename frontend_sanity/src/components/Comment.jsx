import React from 'react'
import { useParams } from 'react-router-dom';
import { AiTwotoneDelete } from 'react-icons/ai';
import { client, urlFor } from '../client';

const Comment = ({ item, user, fetchPinDetails }) => {
    const { pinId } = useParams();
    console.log("posted", item.postedBy)

    const deleteComment = () => {
        console.log(user?._id)

        client
            .patch(pinId)
            .setIfMissing({ comments: [] })
            .unset([`comments[_key == "${item._key}"]`])
            .commit()
            .then(() => {
                fetchPinDetails();
                console.log('done')
            });

    };


    return (
        <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
            <img
                src={item.postedBy?.image}
                className="w-10 h-10 rounded-full cursor-pointer"
                alt="user-profile"
            />
            <div className='flex justify-between gap-3 items-center w-full'>
                <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                </div>
                {item?.postedBy?._id == user?._id &&
                    <button
                        type="button"
                        onClick={(e) => {
                            deleteComment();
                        }}
                        className="bg-slate-300 p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                    >
                        <AiTwotoneDelete />
                    </button>}

            </div>

        </div>
    )
}

export default Comment