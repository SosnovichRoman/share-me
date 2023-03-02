export default {
    name: 'favoriteCategory',
    title: 'FavoriteCategory',
    type: 'object',
    fields: [
        {name: 'rate', type: 'number', title: 'Rate'},
        {name: 'category', type: 'reference', title: 'Category', to: [{ type: 'category' }]},
      ]
  };
  