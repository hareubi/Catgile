import { styled } from "styled-components";
import { useNavigate } from "react-router";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../components/firebase";
const NewProjectButton = styled.button`
  padding: 0;
  width: 50px;
  height: 50px;
`;
const ProjectsGrid = styled.ul`
  display: grid;
  grid-template-columns: 0fr 0fr 0fr;
  margin-top: 10px;
  gap: 10px;
`;
export default function ProjectSelector() {
  const navigate = useNavigate();
  function NewProject() {
    if (auth.currentUser === null) return;
    localStorage.setItem("TeamId", "NewProject");
    setDoc(doc(db, "profile", auth.currentUser.uid), {
      TeamId: "NewProject",
    });
    navigate("/board");
  }
  return (
    <article>
      <NewProjectButton onClick={NewProject}>
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
            d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
          />
        </svg>
      </NewProjectButton>
      <ProjectsGrid>
        <Project />
        <Project />
        <Project />
        <Project />
      </ProjectsGrid>
    </article>
  );
}
const ProjectBackground = styled.button`
  background-color: white;
  width: 500px;
  height: 300px;
  border: 4px outset #268bd2;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  font-size: 24px;
  justify-content: space-between;
  &:active {
    border: 4px outset #268bd2;
  }
`;
const ProjectColumn = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProjectThumbnail = styled.img`
  margin: 10px;
  min-width: 200px;
  height: 200px;
`;
function Project() {
  return (
    <ProjectBackground>
      <ProjectColumn>
        <p>ProjectName</p>
        <p>ProjectDescription aaaaaa aaaaaaaaaa</p>
      </ProjectColumn>
      <ProjectThumbnail src="" />
    </ProjectBackground>
  );
}
