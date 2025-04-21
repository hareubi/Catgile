import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { styled } from "styled-components";
import { auth, CurTeamId, db } from "../../components/firebase";
import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

interface Issue {
  id: string;
  name: string;
  text: string;
  creationTime: number;
  username: string;
  uid: number;
  file?: string;
}
const IssueWrapper = styled.ul`
  gap: 10px;
  margin: 0px 10px 0px 0px;
  min-height: 10vh;
  padding: 10px;
`;
export default function IssueList() {
  let unSubscribe: Unsubscribe | null = null;
  const [issues, setIssues] = useState<Issue[]>([]);
  const fetchIssues = async () => {
    const issueQuery = query(
      collection(db, CurTeamId + "issues"),
      orderBy("creationTime", "desc"),
      limit(25)
    );
    unSubscribe = await onSnapshot(issueQuery, (snapshot) => {
      const newIssues = snapshot.docs.map((doc) => {
        const { name, text, creationTime, username, uid, file } = doc.data();
        return {
          id: doc.id,
          name: name,
          text: text,
          creationTime: creationTime,
          username: username,
          uid: uid,
          file: file,
        };
      });
      if (issues.toString() !== newIssues.toString()) setIssues(newIssues);
    });
  };
  useEffect(() => {
    fetchIssues();
    return () => {
      unSubscribe?.();
    };
  });
  return (
    <IssueWrapper>
      <h1>Issue List </h1>
      {issues.map((issue) => (
        <Issue key={issue.id} {...issue} />
      ))}
    </IssueWrapper>
  );
}

const Column = styled.article`
  background-color: white;
`;
const Username = styled.h1`
  font-weight: 600;
  font-size: 18px;
`;
const Name = styled.h1`
  font-weight: 600;
  font-size: 30px;
`;
const Description = styled.h1`
  margin: 10px 0px;
  font-size: 18px;
`;
const File = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
`;
const CreationTime = styled.h1``;
export function Issue({
  name,
  text,
  creationTime,
  username,
  file,
  uid,
  id,
}: Issue) {
  return (
    <Column>
      <Name>{name}</Name>
      <CreationTime>{creationTime}</CreationTime>
      <Username>{username}</Username>
      <Description>{text}</Description>
      {file ? <File src={file} /> : null}
      {auth.currentUser?.uid === uid.toString() ? (
        <button
          onClick={() => {
            deleteDoc(doc(db, CurTeamId + "issues", id));
          }}
        >
          Delete
        </button>
      ) : null}
    </Column>
  );
}
