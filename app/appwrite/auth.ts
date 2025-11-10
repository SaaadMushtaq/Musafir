import { OAuthProvider, Account, Databases } from "appwrite";
import { redirect } from "react-router";

import { account, appwriteConfig, tablesDB } from "./client";

export const loginWithGoogle = async (): Promise<void> => {
  try {
    await account.createOAuth2Session({ provider: OAuthProvider.Google });
  } catch (error) {
    console.error("loginWithGoogle error:", error);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("logoutUser error:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) {
      redirect("/sign-in");
      return null;
    }
    return user;
  } catch (error) {
    console.error("getUser error:", error);
    redirect("/sign-in");
    return null;
  }
};

export const getGooglePicture = async (): Promise<string | null> => {
  try {
    const session = await account.getSession("current");
    const oAuthToken = session.providerAccessToken;

    if (!oAuthToken) return null;

    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      {
        headers: { Authorization: `Bearer ${oAuthToken}` },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.photos?.[0]?.url ?? null;
  } catch {
    return null;
  }
};

export const storeUserData = async (): Promise<any | null> => {
  try {
    const user = await account.get();
    if (!user) return null;

    const existingUser = await getExistingUser(user.$id);
    if (existingUser) return existingUser;

    const avatar = await getGooglePicture();

    const newRow = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: "users",
      rowId: user.$id,
      data: {
        name: user.name || "",
        email: user.email || "",
        avatar,
        createdAt: new Date().toISOString(),
      },
      permissions: [],
    });

    return newRow;
  } catch (error) {
    console.error("storeUserData error:", error);
    return null;
  }
};

export const getExistingUser = async (userId: string): Promise<any | null> => {
  try {
    const row = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: "users",
      rowId: userId,
    });
    return row;
  } catch (error: any) {
    if (error.code === 404) return null;
    console.error("getExistingUser error:", error);
    return null;
  }
};
