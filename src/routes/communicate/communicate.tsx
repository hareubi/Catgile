import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { CurTeamId, db } from "../../components/firebase";

const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
`;

const CommunityWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const SubmitButton = styled.button`
  height: 50px;
  width: 50px;
  padding: 0px;
  align-self: start;
`;
const CommunityCard = styled.article`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const CommunityTitle = styled.h2`
  font-size: 1.5em;
  color: #222;
  margin: 0;
`;

const CommunityDescription = styled.p`
  font-size: 1em;
  color: #696969;
  margin: 10px 0;
`;

const CommunityInfo = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const Members = styled.span`
  font-size: 0.9em;
  color: #888;
`;

const JoinButton = styled.button`
  padding: 8px 16px;
  font-size: 0.9em;
  background-color: #859900;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #859900;
  }
`;

const TransparentInput = styled.input`
  border: none;
`;
export default function Communicate() {
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");
  const [newCommunityLink, setNewCommunityLink] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [communities, setCommunities] = useState<
    {
      id: string;
      name: string;
      description: string;
      link: string;
    }[]
  >([]);
  async function a() {
    const docs = await getDocs(
      query(collection(db, CurTeamId + "communities"), orderBy("id"), limit(25))
    );
    setCommunities(
      docs.docs.map((snapshot) => {
        return {
          id: snapshot.id,
          name: snapshot.data().name,
          description: snapshot.data().description,
          link: snapshot.data().link,
        };
      })
    );
    setIsLoaded(true);
  }
  if (!isLoaded) {
    a();
  }

  async function onCommunityAdd() {
    const doc = await addDoc(collection(db, CurTeamId + "communities"), {
      id: communities.length,
      name: newCommunityName,
      description: newCommunityDescription,
      link: newCommunityLink.includes("http")
        ? newCommunityLink
        : "http://" + newCommunityLink,
    });
    setCommunities([
      {
        id: doc.id,
        name: newCommunityName,
        description: newCommunityDescription,
        link: newCommunityLink.includes("http")
          ? newCommunityLink
          : "http://" + newCommunityLink,
      },
      ...communities,
    ]);
  }
  function onDelete(id: string) {
    deleteDoc(doc(db, CurTeamId + "communities", id));
    setIsLoaded(false);
  }
  return (
    <Wrapper>
      <SubmitButton onClick={onCommunityAdd}>
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
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
      </SubmitButton>
      <Header>Communities</Header>
      <CommunityWrapper>
        <CommunityCard key={1}>
          <CommunityTitle>
            <TransparentInput
              placeholder="Name"
              value={newCommunityName}
              onChange={(e) => {
                setNewCommunityName(e.target.value);
              }}
            />
          </CommunityTitle>
          <CommunityDescription>
            <TransparentInput
              placeholder="Description"
              value={newCommunityDescription}
              onChange={(e) => {
                setNewCommunityDescription(e.target.value);
              }}
            />
          </CommunityDescription>
          <CommunityInfo>
            <Members>
              <TransparentInput
                placeholder="Link"
                value={newCommunityLink}
                onChange={(e) => {
                  setNewCommunityLink(e.target.value);
                }}
              />
            </Members>
          </CommunityInfo>
        </CommunityCard>
        {communities.map((community) => (
          <CommunityCard key={community.id}>
            <CommunityTitle>{community.name} </CommunityTitle>
            <CommunityDescription>{community.description}</CommunityDescription>
            <CommunityInfo>
              <Members>{community.link}</Members>
              <form>
                <JoinButton
                  onClick={(event) => {
                    event.preventDefault();
                    window.open(`${community.link}`);
                  }}
                >
                  Join
                </JoinButton>
                <JoinButton
                  onClick={(event) => {
                    event.preventDefault();
                    onDelete(community.id);
                  }}
                >
                  Delete
                </JoinButton>
              </form>
            </CommunityInfo>
          </CommunityCard>
        ))}
      </CommunityWrapper>
    </Wrapper>
  );
}
