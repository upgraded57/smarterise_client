/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError, ImgType, PageView, User } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;
const fetcher = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: any
) => {
  return await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      Sessionid: sessionStorage.getItem("sessionId") || "",
    },
  });
};

export function useFetchImgs() {
  const [imgs, setImgs] = useState<ImgType[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPics = async () => {
      setIsLoading(true);
      const res = await fetcher(`${baseUrl}/pictures`, "GET");
      if (res.ok) {
        const data = await res.json();
        setImgs(data.pictures);
      }
      setIsLoading(false);
    };

    fetchPics();
  }, []);
  return { imgs, isLoading };
}

export function useFetchSingleImg(pictureId: string) {
  const [img, setImg] = useState<ImgType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPic = async () => {
      setIsLoading(true);
      const res = await fetcher(`${baseUrl}/pictures/${pictureId}`, "GET");
      if (res.ok) {
        const data = await res.json();
        setImg(data.picture);
      }
      setIsLoading(false);
    };

    fetchPic();
  }, [pictureId]);
  return { img, isLoading };
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const userSignin = async (data: { email: string }) => {
    setIsLoading(true);
    await fetcher(`${baseUrl}/auth/signin`, "POST", data)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setError(null);
        } else {
          const errData = await res.json();
          setError(errData);
        }
      })
      .catch((error) => {
        setUser(null);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  };

  const userSignup = async (data: { email: string; name: string }) => {
    setIsLoading(true);
    await fetcher(`${baseUrl}/auth/signup`, "POST", data)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setError(null);
        } else {
          const errData = await res.json();
          setError(errData);
        }
      })
      .catch((error) => {
        setUser(null);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  };

  const adminSignin = async (data: { email: string }) => {
    setIsLoading(true);
    await fetcher(`${baseUrl}/auth/admin/signin`, "POST", data)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setError(null);
        } else {
          const errData = await res.json();
          setError(errData);
        }
      })
      .catch((error) => {
        setUser(null);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  };

  return { userSignin, userSignup, adminSignin, isLoading, error, user };
}

export function useGetAdminSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalPictures: 0,
    totalPictureViews: 0,
  });

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetcher(`${baseUrl}/admin/summary`, "GET");
      if (res.ok) {
        const data = await res.json();
        setSummary(() => ({
          totalUsers: data.data.totalUsers,
          totalPictures: data.data.totalPictures,
          totalPictureViews: data.data.totalPictureViews,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { isLoading, summary, setSummary };
}

export function useGetAdminPicturesSummary() {
  const [pictures, setPictures] = useState<ImgType[] | null>(null);

  const fetchPicturesSummary = useCallback(async () => {
    try {
      const res = await fetcher(`${baseUrl}/admin/picturesSummary`, "GET");
      if (res.ok) {
        const data = await res.json();
        setPictures(data.pictures);
      }
    } catch (err) {
      console.error("Failed to fetch pictures:", err);
    }
  }, []);

  useEffect(() => {
    fetchPicturesSummary();
  }, [fetchPicturesSummary]);

  return { pictures, setPictures };
}

export function useGetUsers() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetcher(`${baseUrl}/admin/users`, "GET");
      if (res.ok) {
        const resData = await res.json();
        setUsers(resData.users);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { isLoading, users, error, fetchUsers };
}

export function useGetPagesSummary() {
  const [pagesSummary, setPagesSummary] = useState<{
    about: number;
    home: number;
    pictures: number;
  } | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchPageSummary = async () => {
      try {
        const res = await fetcher(`${baseUrl}/admin/pages`, "GET");
        if (res.ok) {
          const resData = await res.json();
          setPagesSummary(resData.summary);
        }
      } catch (error: any) {
        setError(error);
      }
    };
    fetchPageSummary();
  }, []);

  return { pagesSummary, error };
}

export function useGetPictureViewers(pictureId: string) {
  const [viewers, setViewers] = useState<User[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchPictureViewers = async () => {
      setIsLoading(true);
      try {
        const res = await fetcher(
          `${baseUrl}/admin/pictureViewers/${pictureId}`,
          "GET"
        );
        if (res.ok) {
          const resData = await res.json();
          setViewers(resData.viewers);
        }
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPictureViewers();
  }, [pictureId]);

  return { viewers, isLoading, error };
}

export function useGetUserPageViews(userId: string) {
  const [pages, setPages] = useState<PageView[] | null>(null);
  const [imgs, setImgs] = useState<ImgType[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchUserPageViews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetcher(`${baseUrl}/admin/pageviews/${userId}`, "GET");
      if (res.ok) {
        const resData = await res.json();
        setPages(resData.views.pages);
        setImgs(resData.views.pictures);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    fetchUserPageViews();
  }, [fetchUserPageViews]);

  return { pages, imgs, isLoading, error, fetchUserPageViews };
}
