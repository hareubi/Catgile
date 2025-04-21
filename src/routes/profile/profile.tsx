import styled from "styled-components";
import Draw from "../../components/draw";
import { useState } from "react";
import { auth, db } from "../../components/firebase";
import { updateProfile } from "firebase/auth";
import {
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const ProfileWrapper = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 15px;
`;
const Row = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;
const UserName = styled.input`
  width: 100px;
`;
const SubmitButton = styled.button`
  height: 50px;
  width: 50px;
  padding: 0px;
  align-self: start;
`;
const ProfileImage = styled.img`
  width: 200px;
`;
const UserID = styled.h1``;
export default function Profile() {
  const [image, setImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [defaultUrl, setDefaultUrl] = useState("");
  if (userName === null) {
    if (auth.currentUser === null) return;
    setDefaultUrl(auth.currentUser.photoURL ?? "");
    setUserName(auth.currentUser.displayName ?? "");
    const docRef = doc(db, "profile", auth.currentUser.uid);
    const docSnapshot = getDoc(docRef);
    docSnapshot.then((snapshot) => {
      if (!snapshot.exists() || snapshot.data() === undefined) return;
      const { image } = snapshot.data() as DocumentData;
      setImage(image);
    });
  }

  async function onSubmit() {
    if (auth.currentUser === null) return;
    updateProfile(auth.currentUser, { displayName: userName });
    const docRef = doc(db, "profile", auth.currentUser.uid);
    const docSnapshot = await getDoc(docRef);
    if (image === null) {
      if (docSnapshot.exists()) deleteDoc(docRef);
      return;
    }
    if (docSnapshot.exists()) {
      updateDoc(docRef, {
        image: image,
      });
    } else {
      setDoc(docRef, {
        image: image,
      });
    }
    updateProfile(auth.currentUser, { displayName: userName });
  }
  function onImageAdd(imageDataUrl: string): void {
    setImage(imageDataUrl);
  }
  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  return (
    <ProfileWrapper>
      <SubmitButton onClick={onSubmit}>
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
      <ProfileImage src={image ? image : defaultUrl} />

      <Row>
        <UserName
          type="name"
          onChange={onUsernameChange}
          value={userName ?? ""}
        />
        <button
          onClick={() => {
            setImage(null);
          }}
        >
          Reset
        </button>
      </Row>
      <UserID>UID: {auth.currentUser?.uid}</UserID>
      <Draw onImageAdd={onImageAdd} />
    </ProfileWrapper>
  );
}
