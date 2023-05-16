export const categoriesQuery = `*[_type == "category"]`;
export const paintTypesQuery = `*[_type == "paintTypes"]`;
export const canvasTypesQuery = `*[_type == "canvasTypes"]`;
export const borderTypesQuery = `*[_type == "borderTypes"]`;

export const paintTypesPriceQuery = (id) => {
  const query = `*[_type == "paintTypes" && _id == "${id}"]`;
  return query;
}
export const canvasTypesPriceQuery = (id) => {
  const query = `*[_type == "canvasTypes" && _id == "${id}"]`;
  return query;
}
export const borderTypesPriceQuery = (id) => {
  const query = `*[_type == "borderTypes" && _id == "${id}"]`;
  return query;
}
export const categoryPriceQuery = (id) => {
  const query = `*[_type == "category" && _id == "${id}"]`;
  return query;
}

export const favoriteCategoriesQuery = (userId, categoryId) => {
  const query = `*[_type == "user" && _id == '${userId}' ]{
    favoriteCategories[category._ref == "${categoryId}"]{
      category,
      rate,
    }
  }`;
  return query;
}

export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
  category,
  image{
    asset->{
      url
    }
  },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        _key,
        postedBy->{
          _id,
          userName,
          image
        },
      },
    } `;

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    category,
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    width,
    height,
    time,
    timePrice,
    paintType->{name},
    canvasType->{name},
    borderType->{name},
    customPrice,
    price,
    category,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
   save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && category._ref == '${pin.category._ref}' && _id != '${pin._id}' ]{
    category,
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const searchQuery = (searchTerm) => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category._ref in *[_type=="category" && name=='${searchTerm}']._id  || about match '${searchTerm}*']{
    category,
        image{
          asset->{
            url
          }
        },
            _id,
            destination,
            postedBy->{
              _id,
              userName,
              image
            },
            save[]{
              _key,
              postedBy->{
                _id,
                userName,
                image
              },
            },
          }`;
  return query;
};

export const searchWithLimitQuery = (searchTerm, limit) => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category._ref in *[_type=="category" && name=='${searchTerm}']._id  || about match '${searchTerm}*'][0...${limit}]{
    category,
        image{
          asset->{
            url
          }
        },
            _id,
            destination,
            postedBy->{
              _id,
              userName,
              image
            },
            save[]{
              _key,
              postedBy->{
                _id,
                userName,
                image
              },
            },
          }`;
  return query;
};

export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}']`;
  return query;
};

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    category,
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    category,
    title,
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};
