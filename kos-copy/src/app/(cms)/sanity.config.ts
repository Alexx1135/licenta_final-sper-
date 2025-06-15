import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'kos-imperial-management',

  projectId: 'fiucugy8', // Directly set from sanity.cli.ts
  dataset: 'production',   // Directly set from sanity.cli.ts

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
