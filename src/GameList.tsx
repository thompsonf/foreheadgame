import useGameList from "./useGameList";
import { db } from "./db";
import {
  Button,
  Input,
  Link as CLink,
  ListItem,
  HStack,
  Spinner,
  Heading,
  UnorderedList,
} from "@chakra-ui/react";
import { Link as RLink, useHistory } from "react-router-dom";
import { useState } from "react";

function NewGame() {
  const history = useHistory();
  const [name, setName] = useState("");
  const onCreate = async () => {
    const result = await db.ref("games").push({
      timestamp: Date.now(),
      name,
    });
    history.push(`/${result.key}`);
  };
  return (
    <HStack marginBottom={8} spacing={1}>
      <Input
        placeholder="Create a new game"
        value={name}
        onChange={(event: any) => setName(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            onCreate();
          }
        }}
      />
      <Button colorScheme="teal" variant="solid" onClick={onCreate}>
        Create
      </Button>
    </HStack>
  );
}

function AllGames() {
  const gameList = useGameList();
  if (gameList == null) {
    return <Spinner />;
  }
  return (
    <UnorderedList stylePosition="inside">
      {gameList.map((game) => {
        const date = new Date(game.timestamp);
        return (
          <ListItem>
            <CLink color="teal.500">
              <RLink to={`/${game.id}`}>
                {game.name} - {date.toLocaleString()}
              </RLink>
            </CLink>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
}

export default function GameList() {
  return (
    <div>
      <NewGame />
      <Heading as="h4" size="md">
        Past games
      </Heading>
      <AllGames />
    </div>
  );
}
