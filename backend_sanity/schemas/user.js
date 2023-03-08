// eslint-disable-next-line import/no-anonymous-default-export
export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'userName',
      title: 'UserName',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
    {
      name: 'number',
      title: 'Number',
      type: 'number',
    },
    {
      name: 'favoriteCategories',
      title: 'FavoriteCategories',
      type: 'array',
      of: [
        {
          type: 'favoriteCategory',
        },
      ]
    },
  ],
};
