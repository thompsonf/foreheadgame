import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, ChakraProvider } from "@chakra-ui/react";
import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBYKOVBqrGg2mVk4RC2_myO_Lc83wJPXqU",
  authDomain: "foreheadgame.firebaseapp.com",
  databaseURL: "https://foreheadgame-default-rtdb.firebaseio.com",
  projectId: "foreheadgame",
  storageBucket: "foreheadgame.appspot.com",
  messagingSenderId: "193886983515",
  appId: "1:193886983515:web:86a00132ea4229e785767e",
};
firebase.initializeApp(config);

function App() {
  const firebaseApp = firebase.apps[0];
  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <Button colorScheme="blue" onClick={() => alert("hi there")}>
            Button
          </Button>
          <code>
            <pre>{JSON.stringify(firebaseApp.options, null, 2)}</pre>
          </code>
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
