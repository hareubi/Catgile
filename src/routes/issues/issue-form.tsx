import styled from "styled-components";
import Draw from "../../components/draw.tsx";
import { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, CurTeamId, db } from "../../components/firebase.ts";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0px 20px 0px 0px;
`;
const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 10px;
  font-size: 16px;
  background-color: #eee8d5;
`;
const ImagePreview = styled.img`
  width: 400px;
`;
const DeleteButton = styled.button``;
const SubmitButton = styled.button`
  height: 50px;
  width: 100px;
  padding: 0px;
`;
export default function PostIssue() {
  const [issueName, setIssueName] = useState("");
  const [issueText, setIssueText] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    switch (e.target.name) {
      case "issue-name":
        setIssueName(e.target.value);
        break;
      case "issue-text":
        setIssueText(e.target.value);
        break;
    }
  };
  const onIssueSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (
      !user ||
      isUploading ||
      issueName.trim() === "" ||
      issueText.trim() === ""
    )
      return;
    setUploading(true);
    const doc = await addDoc(collection(db, CurTeamId + "issues"), {
      name: issueName,
      text: issueText,
      creationTime: Date.now(),
      username: user?.displayName ?? "anonymous",
      uid: user.uid,
    });
    if (file) {
      await updateDoc(doc, { file });
    }
    setIssueName("");
    setIssueText("");
    setUploading(false);
  };
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <SubmitButton onClick={onIssueSubmit}>
        {isUploading ? "Uploading..." : "Submit"}
      </SubmitButton>
      <TextArea
        placeholder="issue name"
        value={issueName}
        onChange={onChange}
        name="issue-name"
      ></TextArea>
      <TextArea
        placeholder="issue description"
        value={issueText}
        onChange={onChange}
        name="issue-text"
      ></TextArea>
      <ImagePreview src={file ?? ""} />
      <DeleteButton>Delete Image</DeleteButton>

      <Draw
        onImageAdd={(image) => {
          setFile(image);
        }}
      />
    </Form>
  );
}
