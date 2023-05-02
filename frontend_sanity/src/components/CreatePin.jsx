import React, { useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

// import { categories } from '../utils/data';
import { categoriesQuery, paintTypesQuery, canvasTypesQuery, borderTypesQuery } from '../utils/data';
import { client } from '../client';
import Spinner from './Spinner';

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [time, setTime] = useState(null);
  const [timePrice, setTimePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [paintType, setPaintType] = useState([]);
  const [canvasType, setCanvasType] = useState([]);
  const [borderType, setBorderType] = useState([]);

  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const [categories, setCategories] = useState([]);
  const [paintTypes, setPaintTypes] = useState([]);
  const [canvasTypes, setCanvasTypes] = useState([]);
  const [borderTypes, setBorderTypes] = useState([]);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  useEffect(() => {
    client.fetch(categoriesQuery).then((data) => {
      setCategories(data);
    });
    client.fetch(paintTypesQuery).then((data) => {
      setPaintTypes(data);
    });
    client.fetch(canvasTypesQuery).then((data) => {
      setCanvasTypes(data);
    });
    client.fetch(borderTypesQuery).then((data) => {
      setBorderTypes(data);
    });
  }, [])

  console.log(categories)

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category && width && height && time && timePrice) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        width: Number(width),
        height: Number(height),
        time: Number(time),
        timePrice: Number(timePrice),
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category: { _ref: category },
        paintType: { _ref: paintType },
        canvasType: { _ref: canvasType },
        borderType: { _ref: borderType },
      };
      client.create(doc).then(() => {
        navigate('/');
      });
    } else {
      setFields(true);

      setTimeout(
        () => {
          setFields(false);
        },
        2000,
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">Please add all fields.</p>
      )}
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && (
              <Spinner />
            )}
            {
              wrongImageType && (
                <p>It&apos;s wrong file type.</p>
              )
            }
            {!imageAsset ? (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>

                  <p className="mt-32 text-gray-400">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your Pin is about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="url"
            vlaue={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />

          <div className='flex flex-col sm:flex-row gap-5'>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Enter spended time"
              className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            />
            <input
              type="number"
              value={timePrice}
              onChange={(e) => setTimePrice(e.target.value)}
              placeholder="Enter your time price"
              className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            />
          </div>
          <div className='flex flex-col sm:flex-row gap-5'>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Enter width"
              className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
              className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            />
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Category</p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Category</option>
                (categories.length != 0) && (
                {categories.map((item) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black " key={item.name} value={item._id}>
                    {item.name}
                  </option>
                ))})
              </select>
            </div>
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Paint Type</p>
              <select
                onChange={(e) => {
                  setPaintType(e.target.value);
                }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Paint Type</option>
                (paintTypes.length != 0) && (
                {paintTypes.map((item) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black " key={item.name} value={item._id}>
                    {item.name}
                  </option>
                ))})
              </select>
            </div>
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Canvas Type</p>
              <select
                onChange={(e) => {
                  setCanvasType(e.target.value);
                }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Canvas Type</option>
                (canvasTypes.length != 0) && (
                {canvasTypes.map((item) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black " key={item.name} value={item._id}>
                    {item.name}
                  </option>
                ))})
              </select>
            </div>
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Border Type</p>
              <select
                onChange={(e) => {
                  setBorderType(e.target.value);
                }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Border Type</option>
                (borderTypes.length != 0) && (
                {borderTypes.map((item) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black " key={item.name} value={item._id}>
                    {item.name}
                  </option>
                ))})
              </select>
            </div>

            <div className="flex justify-end items-end">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
