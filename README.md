# Take home test

Built with React & Redux, bundled with Webpack.

### Demo
  - Download the repo
  - Double click *build/index.html*
  - Magic


### Install and test locally
    $ Clone the repo
    $ npm install
    $ npm start

### Some explanation
  - Scaffold with *create-react-app*
  - *AntDesign* is used for UI
  - *index.js* is the entry point of the app, with *index.css* injected as global CSS
  - All view layers, and relevant actions & reducers are written in a single file *pages/home/home.js* to fasten development. In production we would separate it into multiple components and files.
  - *store/reducers.js* and *store/store.js* contains the redux setup
  - *utils/helpers.js* contains global helper functions
  - *utils/initialUsers.js* contains a list of predefined users, is served as dummy database
  - *utils/request.js* simulates HTTP request on a dummy server, with delay on response
  - ES6 operators are used when possible, along with async/await

### Features
  - Dummy database
  - Dummy HTTP request module (that returns a promise)
  - Dummy server and database operations
  - List available contacts
  - View contact
  - Create contact
  - Edit contact
  - Delete contact
  - All AJAX requests are logged on console and are purposely delayed to give visual effects
  - All AJAX requests will trigger a loader to be displayed on-screen for a short interval
  - Beautiful, clean user interface :)

### Breakdown of components
  - Home component (parent wrapper, with loader that displays when AJAX is in process)
  - Add contact button
  - Search bar to filter contacts by name
  - Contact list
  - Modal to display a contact's detailed info
  - Modal to edit contact
  - Modal to create a new contact