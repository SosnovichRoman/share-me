import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { categoriesQuery, favoriteCategoriesQuery, feedQuery, searchQuery, searchWithLimitQuery, totalCategoriesQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = ({ user }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryRating, setCategoryRating] = useState([{}]);
  const { categoryId } = useParams();
  const [totalRating, setTotalRating] = useState(0);
  const initialRating = 10;
  const pinsOnPage = 10;

  const [categories, setCategories] = useState([]);

  // fetch all existing categories
  useEffect(() => {
    client.fetch(categoriesQuery).then((categories) => setCategories(categories));
  }, [])

  // Create feed
  useEffect(() => {
    fillFeed();
  }, [categoryId, categories, user]);

  const fillFeed = () =>{
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });

    } else {
      setLoading(true);

      let cancelled = false;
      setPins([]);
      let totalRating = 0;
      let fetchArray = [];

      categories?.map((category) => {
        totalRating += 10;
      })
      user?.favoriteCategories?.map((favoriteCategory) => {
        totalRating += favoriteCategory.rate;
      })
      console.log("totalRating:", totalRating);
      setTotalRating(totalRating);

      // Make pins array
      categories.map((category) => {

        // Find category rate
        let categoryRate = initialRating;
        user?.favoriteCategories?.map((favCategory) => {
          if (favCategory.category._ref == category._id)
            categoryRate += favCategory.rate;
        })
        console.log(category.name, " categoryRate:", categoryRate);

        let pinCount = Math.ceil(categoryRate / totalRating * pinsOnPage);
        let promise = client.fetch(searchWithLimitQuery(category.name, pinCount)).then((data) => {
          if (!cancelled) {
            console.log("Pins of category", category.name, data);
            setPins((pins) => [...pins, ...data]);
            setPins((pins) => [...pins.sort(() => Math.random() - 0.5)]);
            fetchArray = [...fetchArray, promise];
          }
        })
      })
      console.log(fetchArray);
      Promise.all(fetchArray).then(() => setLoading(false));

      return () => {
        setPins([]);
        cancelled = true;
      }
    }
  }

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
