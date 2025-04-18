import Home from "@/pages/(users)/home/Home";
import UsersLayout from "@/pages/(users)/layout/UsersLayout";
import { createBrowserRouter } from "react-router";
import Picture from "@/pages/(users)/picture/Picture";
import DashboardLayout from "@/pages/(admin)/layout/DashboardLayout";
import Dashboard from "@/pages/(admin)/dashboard/Dashboard";
import Pictures from "@/pages/(admin)/pictures/Pictures";
import Users from "@/pages/(admin)/users/Users";
import Signin from "@/pages/auth/Signin";
import Signup from "@/pages/auth/Signup";
import About from "@/pages/(users)/about/About";
import AdminPicture from "@/pages/(admin)/picture/AdminPicture";
import PageViews from "@/pages/(admin)/pageViews/PageViews";

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: UsersLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "about",
        Component: About,
      },
      {
        path: "picture/:pictureId",
        Component: Picture,
      },
    ],
  },
  {
    path: "/admin",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "pictures",
        Component: Pictures,
      },
      {
        path: "pictures/:pictureId",
        Component: AdminPicture,
      },
      {
        path: "users",
        Component: Users,
      },
      {
        path: "users/:userId/pageviews",
        Component: PageViews,
      },
    ],
  },
  {
    path: "/auth/signin",
    Component: Signin,
  },
  {
    path: "/auth/signup",
    Component: Signup,
  },
]);
