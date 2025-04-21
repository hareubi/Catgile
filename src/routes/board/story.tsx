import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";
import { CurTeamId, db } from "../../components/firebase";
import { useEffect, useState } from "react";

export default function Story(name: { name: string }) {
  const [storyList, setStoryList] = useState<
    {
      name: string;
      id: string;
      description: string;
    }[]
  >([]);

  let unSubscribe: Unsubscribe | null = null;
  const fetchIssues = async () => {
    const storyQuery = query(
      collection(db, CurTeamId + `story/data/${name.name}`)
    );
    unSubscribe = await onSnapshot(storyQuery, (snapshot) => {
      const newStoryList = snapshot.docs.map((doc) => {
        const { name, description } = doc.data();
        return {
          name: name,
          description: description,
          id: doc.id,
        };
      });
      if (storyList.toString() !== newStoryList.toString())
        setStoryList(newStoryList);
    });
  };
  useEffect(() => {
    fetchIssues();
    return () => {
      unSubscribe?.();
    };
  });
  function onNameChange(
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) {
    updateDoc(doc(db, CurTeamId + `story/data/${name.name}`, id), {
      name: event.target.value,
    });
  }
  function onDescriptionChange(
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) {
    updateDoc(doc(db, CurTeamId + `story/data/${name.name}`, id), {
      description: event.target.value,
    });
  }
  return (
    <>
      {storyList.map((story) => {
        return (
          <section key={story.id}>
            <input
              value={story.name}
              onChange={(event) => {
                onNameChange(event, story.id);
              }}
            />
            <input
              value={story.description}
              onChange={(event) => {
                onDescriptionChange(event, story.id);
              }}
            />
            <button
              onClick={() =>
                deleteDoc(
                  doc(db, CurTeamId + `story/data/${name.name}`, story.id)
                )
              }
            >
              delete
            </button>
          </section>
        );
      })}
    </>
  );
}
