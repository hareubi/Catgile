import { useEffect, useState } from "react";
import { styled } from "styled-components";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { CurTeamId, db } from "../../components/firebase";
import Story from "./story";

const BoardColumn = styled.section`
  display: flex;
  flex-direction: column;
  margin: 5px;
  padding: 10px;
  min-height: 80vh;
  height: fit-content;
  min-width: 300px;
  width: fit-content;
  background-color: white;
  gap: 10px;
`;
const BoardRow = styled.ul`
  display: grid;
  grid-template-columns: 1fr 0fr;
`;
const CardWrapper = styled.ul`
  display: flex;
  flex-direction: row;
`;
const StoryAddButton = styled.button`
  height: 50px;
  width: 50px;
  padding: 0;
  margin-bottom: 10px;
  align-self: flex;
`;
export default function Card() {
  const [cardList, setCardList] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);

  let unSubscribe: Unsubscribe | null = null;
  const fetchIssues = async () => {
    const boardQuery = query(collection(db, CurTeamId + "board"), limit(25));
    unSubscribe = await onSnapshot(boardQuery, (snapshot) => {
      const newCardList = snapshot.docs.map((doc) => {
        const { name } = doc.data();
        return {
          name: name,
          id: doc.id,
        };
      });
      if (cardList.toString() !== newCardList.toString())
        setCardList(newCardList);
    });
  };
  useEffect(() => {
    fetchIssues();
    return () => {
      unSubscribe?.();
    };
  });
  function onStotyAdd(name: string) {
    addDoc(collection(db, CurTeamId + `story/data/${name}`), {
      name: "story",
      description: "storyDescription",
    });
  }

  return (
    <CardWrapper>
      {cardList.map((card) => (
        <BoardColumn key={card.id}>
          <BoardRow>
            <h1>{card.name}</h1>
            <StoryAddButton onClick={() => onStotyAdd(card.name)}>
              <svg
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </StoryAddButton>
            <button
              onClick={() => deleteDoc(doc(db, CurTeamId + "board", card.id))}
            >
              delete
            </button>
          </BoardRow>
          <Story name={card.name} />
        </BoardColumn>
      ))}
    </CardWrapper>
  );
}
