import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { paintTypesPriceQuery, canvasTypesPriceQuery, borderTypesPriceQuery, categoryPriceQuery, pinDetailMorePinQuery, pinDetailQuery, userQuery } from '../utils/data';
import Spinner from './Spinner';
import Comment from './Comment';

const PinDetail = ({ user }) => {
	const { pinId } = useParams();
	const [pins, setPins] = useState();
	const [pinDetail, setPinDetail] = useState();
	const [comment, setComment] = useState('');
	const [addingComment, setAddingComment] = useState(false);
	const pinDetailRate = 2;

	const [savingPost, setSavingPost] = useState(false);

	const fetchPinDetails = () => {
		const query = pinDetailQuery(pinId);

		if (query) {
			client.fetch(`${query}`).then((data) => {
				setPinDetail(data[0]);

				console.log(data);
				updateRating(data[0]?.category?._ref);
				if (data[0]) {
					const query1 = pinDetailMorePinQuery(data[0]);
					client.fetch(query1).then((res) => {
						setPins(res);
					});
				}
			});
		}
	};

	useEffect(() => {
		fetchPinDetails();
	}, [pinId, user]);

	const updateRating = (categoryId) => {
		if (user) {
			console.log(user);
			let shouldAppend = true;

			client.fetch(userQuery(user?._id)).then((userData) => {
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
			.patch(user?._id)
			.inc({ [`favoriteCategories[category._ref == "${categoryId}"].rate`]: pinDetailRate })
			.commit()
			.then(() => {
				console.log("End update rating");
			})
			.catch((err) => {
				console.error('Update failed: ', err.message)
			});
	}

	const addComment = () => {
		if (comment) {
			setAddingComment(true);

			client
				.patch(pinId)
				.setIfMissing({ comments: [] })
				.insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
				.commit()
				.then(() => {
					fetchPinDetails();
					setComment('');
					setAddingComment(false);
				});
		}
	};

	let alreadySaved = pinDetail?.save;

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
					window.location.reload();
					setSavingPost(false);
					console.log(pinDetail.category._ref);
					console.log(pinDetail);
					updateRating(pinDetail.category._ref);
				});
		}
	};

	if (!pinDetail) {
		return (
			<Spinner message="Showing pin" />
		);
	}

	return (
		<>
			{pinDetail && (
				<div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
					<div className="flex justify-center items-center md:items-start flex-initial">
						<img
							className="rounded-t-3xl rounded-b-lg"
							src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
							alt="user-post"
						/>
					</div>
					<div className="w-full p-5 flex-1 xl:min-w-620">
						<div className="flex items-center justify-between">
							<div className="flex gap-2 items-center">
								<a
									href={`${pinDetail.image.asset.url}?dl=`}
									download
									className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
								>
									<MdDownloadForOffline />
								</a>
							</div>
							{user && (alreadySaved?.length !== 0 ? (
								<button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
									{pinDetail?.save?.length}  Added to cart
								</button>
							) : (
								<button
									onClick={(e) => {
										e.stopPropagation();
										savePin(pinDetail._id);
									}}
									type="button"
									className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
								>
									{savingPost ? 'Adding...' : 'Add to cart'}
								</button>
							))}
						</div>
						<div className='space-y-3'>
							<h1 className="text-4xl font-bold break-words mt-3">
								{pinDetail.title}
							</h1>
							<p className="">{pinDetail.about}</p>
							<div className='flex flex-wrap gap-5'>
								<p>Width: {pinDetail.width}</p>
								<p>Height: {pinDetail.height}</p>
							</div>
							<p>Paint type: {pinDetail.paintType.name}</p>
							<p>Canvas type: {pinDetail.canvasType.name}</p>
							<p>Border type: {pinDetail.borderType.name}</p>
							<h2 className='text-3xl font-semibold py-4'>Price: {pinDetail.price}</h2>
						</div>
						<Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
							<img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
							<p className="font-bold">{pinDetail?.postedBy.userName}</p>
						</Link>
						<h2 className="mt-5 text-2xl">Comments</h2>
						<div className="max-h-370 overflow-y-auto">
							{pinDetail?.comments?.map((item) => (
								<Comment item={item} user={user} fetchPinDetails={fetchPinDetails} />
							))}
						</div>
						{user &&
							<div className="flex flex-wrap mt-6 gap-3">
								<Link to={`/user-profile/${user?._id}`}>
									<img src={user?.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
								</Link>
								<input
									className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
									type="text"
									placeholder="Add a comment"
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
								<button
									type="button"
									className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
									onClick={addComment}
								>
									{addingComment ? 'Doing...' : 'Done'}
								</button>
							</div>
						}

					</div>
				</div>
			)}
			{pins?.length > 0 && (
				<h2 className="text-center font-bold text-2xl mt-8 mb-4">
					More like this
				</h2>
			)}
			{pins ? (
				<MasonryLayout pins={pins} />
			) : (
				<Spinner message="Loading more pins" />
			)}
		</>
	);
};

export default PinDetail;
