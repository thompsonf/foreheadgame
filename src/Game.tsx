import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "./db";
import {
  Button,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Game as IGame } from "./useGameList";

interface ParamTypes {
  id: string;
}

interface IPlayer {
  forehead: string;
  id: string;
  name: string;
}

function NewPlayer() {
  const { id } = useParams<ParamTypes>();
  const [name, setName] = useState("");
  const [forehead, setForehead] = useState("");
  const onCreate = async () => {
    setName("");
    setForehead("");
    db.ref(`games/${id}/players`).push({
      forehead,
      name,
    });
  };
  return (
    <HStack marginBottom={8} spacing={1}>
      <Input
        placeholder="Player name"
        value={name}
        onChange={(event: any) => setName(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            onCreate();
          }
        }}
      />
      <Input
        placeholder="Forehead"
        value={forehead}
        onChange={(event: any) => setForehead(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            onCreate();
          }
        }}
      />
      <Button colorScheme="teal" variant="solid" onClick={onCreate}>
        Add
      </Button>
    </HStack>
  );
}

function usePlayerList(): null | ReadonlyArray<IPlayer> {
  const { id } = useParams<ParamTypes>();
  const [playerList, setPlayerList] = useState<null | ReadonlyArray<IPlayer>>(
    null
  );
  useEffect(() => {
    const cb = (snapshot: any) => {
      const playerList: Array<IPlayer> = [];
      snapshot.forEach((snap: any) => {
        playerList.push({ id: snap.key, ...snap.val() });
      });
      playerList.reverse();
      setPlayerList(playerList);
    };
    db.ref(`games/${id}/players`).on("value", cb);
    return () => db.ref(`games/${id}/players`).off("value", cb);
  }, [id]);
  return playerList;
}

function useGame(): null | IGame {
  const { id } = useParams<ParamTypes>();
  const [game, setGame] = useState<null | IGame>(null);
  useEffect(() => {
    const cb = (snapshot: any) => {
      setGame({
        id: snapshot.key,
        name: snapshot.val().name,
        timestamp: snapshot.val().timestamp,
      });
    };
    db.ref(`games/${id}`).on("value", cb);
    return () => db.ref(`games/${id}`).off("value", cb);
  }, [id]);
  return game;
}

function Player(props: { player: IPlayer }) {
  const { id } = useParams<ParamTypes>();
  const [isHidden, setIsHidden] = useState(true);
  return (
    <tr>
      <td style={{ padding: 12 }}>
        <Text>{props.player.name}</Text>
      </td>
      <td style={{ padding: 12 }}>
        <Text>{isHidden ? "<Hidden>" : props.player.forehead}</Text>
      </td>
      <td style={{ padding: 12 }}>
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={() => setIsHidden(!isHidden)}
          size="sm"
        >
          {isHidden ? "Show" : "Hide"}
        </Button>
      </td>
      <td style={{ padding: 12 }}>
        <Button
          colorScheme="red"
          variant="solid"
          onClick={() => {
            db.ref(`games/${id}/players/${props.player.id}`).remove();
          }}
          size="sm"
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}

function AllPlayers() {
  const playerList = usePlayerList();
  if (playerList == null) {
    return <Spinner />;
  }
  return (
    <table>
      <tr>
        <th style={{ padding: 12 }}>Player</th>
        <th style={{ padding: 12 }}>Forehead</th>
        <th style={{ padding: 12 }} />
        <th style={{ padding: 12 }} />
      </tr>
      {playerList.map((player) => {
        return <Player key={player.id} player={player} />;
      })}
    </table>
  );
}

export default function Game() {
  const game = useGame();
  if (game == null) {
    return null;
  }
  return (
    <div>
      <Heading as="h4" marginBottom={8} size="md">
        {game.name} - {new Date(game.timestamp).toLocaleString()}
      </Heading>
      <NewPlayer />
      <AllPlayers />
    </div>
  );
}
