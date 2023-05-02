export default {
  name: 'pin',
  title: 'Pin',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'about',
      title: 'About',
      type: 'string',
    },
    {
      name: 'destination',
      title: 'Destination',
      type: 'url',
    },
    {
      name: 'width',
      title: 'Width',
      type: 'number',
    },
    {
      name: 'height',
      title: 'Height',
      type: 'number',
    },
    {
      name: 'time',
      title: 'Time',
      type: 'number',
    },
    {
      name: 'timePrice',
      title: 'Time Price',
      type: 'number',
    },
    {
      name: 'paintType',
      title: 'Paint type',
      type: 'reference',
      to: [{ type: 'paintTypes' }],
    },
    {
      name: 'canvasType',
      title: 'Canvas Type',
      type: 'reference',
      to: [{ type: 'canvasTypes' }],
    },
    {
      name: 'borderType',
      title: 'Border Type',
      type: 'reference',
      to: [{ type: 'borderTypes' }],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'userId',
      title: 'UserId',
      type: 'string',
    },
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'postedBy',
    },
    {
      name: 'save',
      title: 'Save',
      type: 'array',
      of: [{ type: 'save' }],
    },
    {
      name: 'comments',
      title: 'Comments',
      type: 'array',
      of: [{ type: 'comment' }],
    },
  ],
};
