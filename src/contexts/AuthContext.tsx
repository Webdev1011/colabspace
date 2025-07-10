import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { services } from "../firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

interface AuthContextValue {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const { auth, db } = services;

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const u = res.user;

    const uDoc = doc(db, "users", u.uid);
    const snap = await getDoc(uDoc);

    if (!snap.exists()) {
      await setDoc(uDoc, {
        uid: u.uid,
        name: u.displayName,
        email: u.email,
        role: "student",
        online: true,
        createdAt: serverTimestamp(),
      });
    } else {
      await setDoc(uDoc, { online: true }, { merge: true });
    }

    setUser({
      uid: u.uid,
      name: u.displayName || "",
      email: u.email || "",
      role: (snap.data()?.role as string) || "student",
      online: true,
    });
  };

  const logout = async () => {
    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        { online: false },
        { merge: true }
      );
    }
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) await login();
      else setUser(null);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
