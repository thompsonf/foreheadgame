import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "./db";
import { LockIcon, UnlockIcon } from "@chakra-ui/icons";
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
  timeCreated: number;
  timeFinished: null | number;
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
      timeCreated: Date.now(),
      timeFinished: null,
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
      setPlayerList(playerList);
    };
    db.ref(`games/${id}/players`).orderByChild("timeCreated").on("value", cb);
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
  const [isLocked, setIsLocked] = useState(false);
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
          isDisabled={isLocked}
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
          isDisabled={isLocked}
          variant="solid"
          onClick={() => {
            db.ref(`games/${id}/players/${props.player.id}`).remove();
          }}
          size="sm"
        >
          Delete
        </Button>
      </td>
      <td style={{ padding: 12 }}>
        <Button
          colorScheme="blue"
          isDisabled={isLocked}
          variant="solid"
          onClick={() => {
            db.ref(`games/${id}/players/${props.player.id}/timeFinished`).set(
              Date.now()
            );
          }}
          size="sm"
        >
          Done
        </Button>
      </td>
      <td style={{ padding: 12 }}>
        <Button
          colorScheme="gray"
          leftIcon={isLocked ? <UnlockIcon /> : <LockIcon />}
          variant="solid"
          onClick={() => setIsLocked(!isLocked)}
          size="sm"
        >
          {isLocked ? "Unlock" : "Lock"}
        </Button>
      </td>
    </tr>
  );
}

function FinishedPlayer(props: { player: IPlayer }) {
  const { id } = useParams<ParamTypes>();
  const [isLocked, setIsLocked] = useState(true);
  return (
    <tr>
      <td style={{ padding: 12 }}>
        <Text>{props.player.name}</Text>
      </td>
      <td style={{ padding: 12 }}>
        <Text>{props.player.forehead}</Text>
      </td>
      <td style={{ padding: 12 }}>
        <Button
          colorScheme="red"
          isDisabled={isLocked}
          variant="solid"
          onClick={() => {
            db.ref(`games/${id}/players/${props.player.id}/timeFinished`).set(
              null
            );
          }}
          size="sm"
        >
          Undo
        </Button>
      </td>
      <td style={{ padding: 12 }}>
        <Button
          colorScheme="gray"
          leftIcon={isLocked ? <UnlockIcon /> : <LockIcon />}
          variant="solid"
          onClick={() => setIsLocked(!isLocked)}
          size="sm"
        >
          {isLocked ? "Unlock" : "Lock"}
        </Button>
      </td>
    </tr>
  );
}

function RemainingPlayers(props: { players: ReadonlyArray<IPlayer> }) {
  return (
    <>
      <Heading as="h5" marginBottom={8} size="sm">
        Remaining
      </Heading>
      <table>
        <tr>
          <th style={{ padding: 12 }}>Player</th>
          <th style={{ padding: 12 }}>Forehead</th>
          <th style={{ padding: 12 }} />
          <th style={{ padding: 12 }} />
          <th style={{ padding: 12 }} />
        </tr>
        {props.players.map((player) => {
          return <Player key={player.id} player={player} />;
        })}
      </table>
    </>
  );
}

function FinishedPlayers(props: { players: ReadonlyArray<IPlayer> }) {
  const sorted = [...props.players];
  sorted.sort((a, b) => (a.timeFinished ?? 0) - (b.timeFinished ?? 0));
  return (
    <>
      <Heading as="h5" marginBottom={8} marginTop={8} size="sm">
        Finished
      </Heading>
      <table>
        <tr>
          <th style={{ padding: 12 }}>Player</th>
          <th style={{ padding: 12 }}>Forehead</th>
          <th style={{ padding: 12 }} />
        </tr>
        {sorted.map((player) => {
          return <FinishedPlayer key={player.id} player={player} />;
        })}
      </table>
    </>
  );
}

export default function Game() {
  const game = useGame();
  const playerList = usePlayerList();
  if (game == null || playerList == null) {
    return <Spinner />;
  }
  return (
    <div>
      <Heading as="h4" marginBottom={8} size="md">
        {game.name} - {new Date(game.timestamp).toLocaleString()}
      </Heading>
      <NewPlayer />
      <RemainingPlayers
        players={playerList.filter((p) => p.timeFinished == null)}
      />
      <FinishedPlayers
        players={playerList.filter((p) => p.timeFinished != null)}
      />
    </div>
  );
}
