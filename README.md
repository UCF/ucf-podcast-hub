# UCF Podcast Hub

The UCF Podcast Hub project is a Firebase-backed React project for aggregating and displaying podcast content created at the University of Central Florida. It utilizes various Firebase components to store the podcast data, allow access for administrators to edit certain pieces of information, and caches the show images and audio files. To run this project locally, you can take advantage of the `firebase-tools` package included in the developer dependencies to emulate the Firebase products. However, you want to run this on Firebase, you will need to create a project and activate the following features:

- Authentication
- Firestore
- Storage
- Hosting
- Functions

## Local Dependencies

- NodeJS 18
- JRE 11+ (for firebase emulators)

## Project Setup

1. Clone the project into your desired dev directory and cd into the directory: `git clone git@github.com:UCF/ucf-podcast-hub.git` - `cd ucf-podcast-hub`.
2. Ensure you're running Node 18. If using nvm, install and/or switch to 18: `nvm install 18 && nvm use 18`.
3. Run the first time setup script: `npm run fts`. This will install all dependencies, setup the project, and build everything.
4. Start the development server by running `npm run dev`. This will run the project in watch mode, rebuilding the project whenever a file changes.

## Local Data

Data for the local emulators is stored in the `localdata` directory. These files should never be tracked, as they act as a local cache of data for testing purposes only. To get started, you will want to add one or more podcasts, and trigger the import functions using the Function emulator.
