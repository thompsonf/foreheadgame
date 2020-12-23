import React from "react";
import "./App.css";
import { Flex, Heading, ChakraProvider } from "@chakra-ui/react";
import Game from "./Game";
import GameList from "./GameList";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Flex direction="column" align="center">
          <Heading marginBottom={8} marginTop={8}>
            Forehead Game
          </Heading>
          <Switch>
            <Route path="/:id">
              <Game />
            </Route>
            <Route path="/">
              <GameList />
            </Route>
          </Switch>
        </Flex>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
