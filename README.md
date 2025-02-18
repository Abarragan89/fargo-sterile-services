# Project Documentation

## Overview

This project is a Next.js application that manages user data, saves state into IndexedDB, and generates PDFs using API routes.

## Pages

- All pages import a save and load utility function that accesses the users indexedDB
- Each page has 1 - 2 state variable objects that is stored as an item in indexedDB
- This is a client side application and all pages and components are client components.

## Components

### `FormInputs`

- `InputLabelEl` - creates an input and label.
  - Can accept a character limit, placeholder, and several othe r props for customization
  - `DropDown`. `RadioInputSection`, `SelectAreaEL`, and `TextareaLabel` are very similar and render different input fields prestyled and customizable

## IndexedDB Storage

- Look in `utils/indexedDBAction` to interact with indexedDB.
- Stores pdfs as blobs in indexedDB
- There will only be one user per session, so functions will search for the first user everytime.

## Styles

- Global styles include:
  - Input browser reset
  - border shadows
  - universal buttons

## PDF

- Two PDFs are rendered from scratch (in components/pdfTemplates)
  - NASUF
  - Payment and Contacts
- Statement of clinical different is a pdf that is written on

## File uploads

- All files uploaded are converted to a PDF.
- files are first compressed before being convereted

## API Routes

1. generatePDF Route - this route does the heaving lifing in generating the pdfs and merging them all together
2. sendMail Route - Takes the merged final PDF and sends it to sales person's name that was present in the opening URL query parameter

## Utils files

- convert image to PDF
- format data
- format phone number so parenthenses and hypen added automatically
- indexDBActions - api to indexDB instance
- mergePDFs - takes and unknown amount of PDFs and merges them into one
