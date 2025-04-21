import { styled } from "styled-components";
import PostIssue from "./issue-form";
import { useState } from "react";
import IssueList from "./issue-list";

const CollapseToggleButton = styled.button`
  height: 50px;
  width: 50px;
  padding: 0;
  margin-bottom: 10px;
`;
const IssuesFormWrapper = styled.section`
  background-color: white;
`;
export default function Issues() {
  const [isFormOpen, setFromOpen] = useState(false);
  return (
    <div>
      <CollapseToggleButton
        onClick={() => {
          setFromOpen(!isFormOpen);
        }}
      >
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          ></path>
        </svg>
      </CollapseToggleButton>
      <IssuesFormWrapper hidden={!isFormOpen}>
        <PostIssue />
      </IssuesFormWrapper>
      <ul hidden={isFormOpen}>
        <IssueList />
      </ul>
    </div>
  );
}
