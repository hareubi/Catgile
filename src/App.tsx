import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/Home/home";
import Issues from "./routes/issues/issues";
import CreateAccount from "./routes/join/join";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import { auth } from "./components/firebase";
import styled from "styled-components";
import ProtectedRoute from "./components/protected-route";
import Profile from "./routes/profile/profile";
import Communicate from "./routes/communicate/communicate";
import Board from "./routes/board/board";
import Planning from "./routes/planning/planning";
import ProjectSelector from "./routes/projects/projects";
import ProtectedRouteProject from "./components/protected-route-project";
import ProtectedRouteJoin from "./components/protected-route-join";

const GlobalStyle = createGlobalStyle`
${reset};
*
{
  box-sizing:border-box;
}
  body
{
  background-color: #eee8d5;
  color:#002b36;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SegoeUI'
  , Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
  sans-serif
}
  button{
      padding: 10px 20px;
  border-radius: 15px;
  border-top: 1px inset #93a1a1;
  border-left: 1px inset #93a1a1;
  border-bottom: 4px inset #002b36;
  border-right: 4px inset #002b36;
  font-size: 16px;
  cursor: pointer;
   &:active {
      border-top: 3px inset #002b36;
      border-left: 3px inset#002b36;
      border-bottom: 1px inset #93a1a1;
      border-right: 1px inset #93a1a1;
    }
  }
  input{
      padding: 10px 20px;
  border-radius: 15px;
  border-top: 1px inset #93a1a1;
  border-left: 1px inset #93a1a1;
  border-bottom: 4px inset #002b36;
  border-right: 4px inset #002b36;
  width: 100%;
  font-size: 16px;
  }
  div, nav, article, section{
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
      background-color:#fdf6e3;
      border-radius:10px;
      padding:10px;
  }
`;
const Wrapper = styled.ul`
  height: 100vh;
  display: flex;
  justify-content: center;
`;
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "communicate",
        element: <Communicate />,
      },
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "issues",
        element: <Issues />,
      },
      {
        path: "planning",
        element: <Planning />,
      },
    ],
  },
  {
    path: "/join",
    element: (
      <ProtectedRouteJoin>
        <CreateAccount />
      </ProtectedRouteJoin>
    ),
  },
  {
    path: "projects",
    element: (
      <ProtectedRouteProject>
        <ProjectSelector />
      </ProtectedRouteProject>
    ),
  },
]);

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const init = async () => {
    await auth.authStateReady();
    setIsLoaded(true);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyle />
      {isLoaded ? <RouterProvider router={router} /> : <Loading />}
    </Wrapper>
  );
}

export default App;
