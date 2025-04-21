import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../../components/firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 490px;
  padding: 50px 25px;
`;
const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 15px;
  border-top: 1px inset #93a1a1;
  border-left: 1px inset #93a1a1;
  border-bottom: 4px inset #002b36;
  border-right: 4px inset #002b36;
  width: 100%;
  font-size: 16px;
`;
const TextButton = styled.a`
  margin-left: auto;
  margin-right: 0px;
  color: #6c71c4;
  font-size: 20px;
  font-weight: 900;
`;
const Title = styled.h1`
  font-size: 42px;
`;
const Error = styled.span`
  font-weight: 600;
  color: #dc322f;
`;
const Button = styled.button`
  padding: 10px 20px;
  border-radius: 15px;
  border-top: 1px inset #93a1a1;
  border-left: 1px inset #93a1a1;
  border-bottom: 4px inset #002b36;
  border-right: 4px inset #002b36;
  font-size: 16px;
  cursor: pointer;
  &:active {
    border-top: 2px inset #002b36;
    border-left: 2px inset#002b36;
    border-bottom: 1px inset #93a1a1;
    border-right: 1px inset #93a1a1;
  }
`;

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [isSignIn, setSignIn] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === "" || password === "" || isLoading) return;
    try {
      setLoading(true);
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(credentials.user, {
          displayName: name === "" ? email : name,
        });
      }
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
        switch (error.message) {
          case "Firebase: Error (auth/invalid-credential).": {
            setError(
              "Invaild Password. if you dont have account, create one! "
            );
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Catgile</Title>
      <Form onSubmit={onSubmit}>
        {isSignIn ? null : (
          <Input
            onChange={onChange}
            name="name"
            value={name}
            placeholder="name"
            type="text"
            required
          />
        )}
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="password"
          type="password"
          required
        />
        <Button>
          {isLoading ? "Loading" : isSignIn ? "Login" : "CreateAccount"}
        </Button>
        <ul style={{ marginLeft: "auto", flexDirection: "row-reverse" }}>
          {error !== "" ? <Error>{error}</Error> : null}
          <TextButton
            onClick={() => {
              setSignIn(!isSignIn);
            }}
          >
            {isSignIn ? "Create Account" : "Login"}
          </TextButton>
        </ul>
      </Form>
      <Button
        style={{ padding: "5px" }}
        onClick={async () => {
          try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
          } catch (error) {
            if (error instanceof FirebaseError) setError(error.message);
          }
          navigate("/");
        }}
      >
        {"Login With Github "}
        <img src="github-mark.svg" height="16px" />
      </Button>
    </Wrapper>
  );
}
