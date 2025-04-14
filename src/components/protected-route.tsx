import { Navigate } from "react-router-dom";
import { auth, CurTeamId, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  if (user == null) return <Navigate to="join" />;
  if (CurTeamId == "") return <Navigate to="projects" />;
  getDoc(doc(db, "profile", user.uid)).then((snapshot) => {
    if (!snapshot.exists() || snapshot.data() === undefined) {
      localStorage.setItem("TeamId", "");
      return;
    }
    const { TeamId } = snapshot.data();
    localStorage.setItem("TeamId", TeamId);
  });
  return children;
}
