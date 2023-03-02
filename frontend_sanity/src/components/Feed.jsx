import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery, userQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = ({ user }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });

    } else {
      setLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
        // makeFeed(data);
      });
    }
  }, [categoryId]);

  // function makeFeed(data){

  //   // client.fetch(categoriesQuery).then((categories) => {
  //   //   categories.map()





  //   // });
  //   //console.log(user);
  //   console.log(user._id);
  //   client.fetch(userQuery(user._id)).then((userData) => {
  //     console.log(userData);
  //   });


  //   let pinList = [];
  //   for(var i =0; i <10; i++){
  //     pinList.push(data[i]);
  //   }
  //   setPins(pinList);
  // }

  const ideaName = categoryId || 'new';
  if (loading) {
    return (
      <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
    );
  }

  return (
    <div>
      {pins && (
        <MasonryLayout pins={pins} />
      )}
    </div>
  );
};

export default Feed;
