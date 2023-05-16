import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import { contentGraphView } from "sanity-plugin-graph-view"

export default defineConfig({
  name: 'default',
  title: 'shareme_jsm',

  projectId: '3c4515v3',
  dataset: 'production',

  plugins: [deskTool(), visionTool(), contentGraphView()],

  schema: {
    types: schemaTypes,
  },
})
