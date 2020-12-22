import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Flex, Heading, ChakraProvider } from "@chakra-ui/react";
import GameList from "./GameList";

function App() {
  return (
    <ChakraProvider>
      <Flex direction="column" align="center">
        <Heading marginBottom={8} marginTop={8}>
          Forehead Game
        </Heading>
        <GameList />
      </Flex>
    </ChakraProvider>
  );
}

export default App;
