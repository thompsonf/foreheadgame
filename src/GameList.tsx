import useGameList from "./useGameList";
import { db } from "./db";
import {
  Button,
  Input,
  Link,
  ListItem,
  HStack,
  Spinner,
  Heading,
  UnorderedList,
} from "@chakra-ui/react";
import { useState } from "react";

function NewGame() {
  const [name, setName] = useState("");
  return (
    <HStack marginBottom={8} spacing={1}>
      <Input
        placeholder="Create a new game"
        value={name}
        onChange={(event: any) => setName(event.target.value)}
      />
      <Button
        colorScheme="teal"
        variant="solid"
        onClick={() => {
          db.ref("games").push({
            timestamp: Date.now(),
            name,
          });
          setName("");
        }}
      >
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
            <Link color="teal.500">
              {game.name} - {date.toLocaleString()}
            </Link>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
}

export default function GameList() {
  const gameNames = useGameList();
  const list =
    gameNames == null ? <div>Loading...</div> : <div>{gameNames}</div>;
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
