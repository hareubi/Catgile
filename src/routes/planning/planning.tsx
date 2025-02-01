import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../components/firebase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CollapseToggleButton = styled.button`
  height: 50px;
  width: 50px;
  padding: 0;
  margin-bottom: 10px;
  align-self: start;
`;

const Header = styled.div`
  text-align: center;
  background-color: white;
`;

const Title = styled.h1`
  font-size: 2em;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1em;
  color: #666;
`;

const CardOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background-color: #bdbbbb;
`;

const Card = styled.div`
  width: 50px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const PlayerList = styled.div`
  text-align: left;
  margin: 20px;
  background-color: white;
  min-width: 45vw;
  min-height: 20vh;
`;

const PlayerTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const Player = styled.li`
  list-style-type: none;
  margin: 5px 0;
`;

const SelectedCardDisplay = styled.ul`
  margin-top: 20px;
  text-align: center;
`;

const SelectedTitle = styled.h3`
  font-size: 1.2em;
`;

const SelectedPlaceholder = styled.p`
  font-size: 1em;
  color: #888;
`;

const RevealButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #859900;
  color: white;
  border-radius: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #859900;
  }
`;

export default function Planning() {
  const [estimateList, setEstimateList] = useState<
    {
      name: string;
      id: string;
      estimate: number;
    }[]
  >([]);
  const [estimate, setEstimate] = useState(0);
  const cards = [0, 1, 3, 5, 8, 999];
  const [isJoined] = useState(true);

  let unSubscribe: Unsubscribe | null = null;
  const fetchIssues = async () => {
    const boardQuery = query(collection(db, "planning"), limit(25));
    unSubscribe = onSnapshot(boardQuery, (snapshot) => {
      const newCardList = snapshot.docs.map((doc) => {
        const { name, estimate } = doc.data();
        return {
          name: name,
          id: doc.id,
          estimate: estimate,
        };
      });
      if (estimateList !== newCardList) {
        setEstimateList(newCardList);
      }
    });
  };
  useEffect(() => {
    fetchIssues();
    return () => {
      unSubscribe?.();
    };
  });
  return (
    <Container>
      <CollapseToggleButton
        hidden={!isJoined}
        onClick={() =>
          estimateList.map((estimateData) =>
            deleteDoc(doc(db, "planning", estimateData.id))
          )
        }
      >
        <svg
          data-slot="icon"
          fill="none"
          stroke-width="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          ></path>
        </svg>
      </CollapseToggleButton>
      {isJoined ? (
        <>
          <Header>
            <Title>Planning Poker</Title>
            <Subtitle>Select your estimate below</Subtitle>
          </Header>

          <PlayerList>
            <PlayerTitle>Players</PlayerTitle>
            <ul>
              {estimateList.map((estimateData) => (
                <Player>
                  {estimateData.name} - Selected: {cards[estimateData.estimate]}
                </Player>
              ))}
            </ul>
          </PlayerList>

          <CardOptions>
            {cards.map((card, index) => (
              <Card key={index} onClick={() => setEstimate(index)}>
                {card}
              </Card>
            ))}
          </CardOptions>

          <SelectedCardDisplay>
            <SelectedTitle>Your Selection</SelectedTitle>
            <SelectedPlaceholder>{cards[estimate]}</SelectedPlaceholder>
          </SelectedCardDisplay>

          {/* Reveal Button */}
          <RevealButton
            onClick={() =>
              setDoc(doc(db, "planning", auth.currentUser?.uid ?? " "), {
                name: auth.currentUser?.displayName,
                estimate: estimate,
              })
            }
          >
            Reveal Cards
          </RevealButton>
        </>
      ) : (
        <h1>aaa</h1>
      )}
    </Container>
  );
}
