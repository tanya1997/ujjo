## Project Info: 
**Ujjo** is a web application that allows you to create wallets and write them to NFC cards, as well as read information from previously written cards.

## Main features of the application:

- Creating a new wallet and writing various tokens to it (TRC-20, TRX, TRC-721)
- Wallet export via private key
- Real-time wallet balance display
- Possibility to protect the wallet with a password when writing using the AES encryption algorithm
- Write and read wallet to NFC card
- Verification of the integrity of the private key when reading with crc
- The ability to send tokens to other wallets after reading the NFC card

## Project Website:
https://ujjo.netlify.app/

## Available Scripts

In the project directory, you can run:

## `.env` file

REACT_APP_TRON_PRO_API_KEY=**your_api_key**

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

