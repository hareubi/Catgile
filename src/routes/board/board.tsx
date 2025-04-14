import { useState } from "react";
import { styled } from "styled-components";
import Card from "./card";
import { addDoc, collection } from "firebase/firestore";
import { CurTeamId, db } from "../../components/firebase";

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 90vh;
  padding-top: 90px;
`;
const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  align-self: start;
  position: fixed;
  transform: translateY(-80px);
`;
const CardAddButton = styled.button`
  height: 50px;
  width: 50px;
  padding: 0;
`;
export default function Board() {
  const [cardName, setCardName] = useState("");
  function onStoryAdd() {
    if (cardName.trim() == "") return;
    addDoc(collection(db, CurTeamId + "board"), { name: cardName });
    setCardName("");
  }
  return (
    <BoardWrapper>
      <TopRow>
        <CardAddButton onClick={onStoryAdd}>
          <svg
            data-slot="icon"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 4.5v15m7.5-7.5h-15"></path>
          </svg>
        </CardAddButton>
        <ul>
          <h1>
            <input
              type="text"
              placeholder="BoardName"
              value={cardName}
              onChange={(event) => {
                setCardName(event.target.value);
              }}
            />
          </h1>
        </ul>
      </TopRow>

      <Card />
    </BoardWrapper>
  );
}
