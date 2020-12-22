import { db } from "./db";
import { useEffect, useState } from "react";

interface Game {
  id: string;
  name: string;
  timestamp: number;
}

export default function useGameList(): null | ReadonlyArray<Game> {
  const [gameList, setGameList] = useState<null | ReadonlyArray<Game>>(null);
  useEffect(() => {
    const cb = (snapshot: any) => {
      const gameList: Array<Game> = [];
      snapshot.forEach((snap: any) => {
        gameList.push(snap.val());
      });
      gameList.reverse();
      setGameList(gameList);
    };
    db.ref("games").orderByChild("timestamp").on("value", cb);
    return () => db.ref("games").off("value", cb);
  }, []);
  return gameList;
}
