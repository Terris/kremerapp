"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface User {
  id: Id<"users">;
  isAdmin?: boolean;
  firstName?: string;
}

interface MeContextProps {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  meId: Id<"users"> | null;
  me: User | null;
  isAdmin?: boolean;
}

const initialProps = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
  me: null,
  meId: null,
  isAdmin: false,
};

export const MeContext = createContext<MeContextProps>(initialProps);

interface MeProviderProps {
  children: ReactNode;
}

export const MeProvider = ({ children }: MeProviderProps) => {
  const { isAuthenticated, isLoading: convexAuthIsLoading } = useConvexAuth();
  const { user: clerkUser, isLoaded: clerkUserIsLoaded } = useUser();

  const [loadingDBUser, setLoadingDBUser] = useState<boolean>(
    initialProps.isLoading
  );
  const [meId, setMeId] = useState<Id<"users"> | null>(initialProps.meId);
  const [dbError, setDBError] = useState<string | null>(initialProps.error);

  const saveUser = useMutation(api.users.store);
  const dbUserQueryArgs = meId ? { id: meId as Id<"users"> } : "skip";
  const dbUserData = useQuery(api.users.get, dbUserQueryArgs);

  // Check for db user and store new user if user doesn't exist
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    async function createUser() {
      try {
        setLoadingDBUser(true);
        const id = await saveUser();
        setMeId(id);
      } catch (error: any) {
        setDBError(error.message);
      } finally {
        setLoadingDBUser(false);
      }
    }
    createUser();
    return () => setMeId(null);
  }, [isAuthenticated, saveUser, clerkUser?.id]);

  const me = dbUserData
    ? {
        firstName: clerkUser?.firstName ?? "Guest",
        id: dbUserData._id,
        isAdmin: dbUserData.isAdmin,
      }
    : null;

  const isAdmin = me?.isAdmin;

  return (
    <MeContext.Provider
      value={{
        isAuthenticated,
        me,
        meId,
        isAdmin,
        isLoading:
          !dbUserData ||
          !clerkUserIsLoaded ||
          loadingDBUser ||
          convexAuthIsLoading,
        error: dbError,
      }}
    >
      {children}
    </MeContext.Provider>
  );
};

export const useMe = () => {
  const meContext = useContext(MeContext);
  return meContext;
};
