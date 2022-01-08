import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import AddStudent from "../views/AddStudent.vue";
import StudentInfo from "../views/StudentInfo.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/add",
    name: "AddStudent",
    component: AddStudent,
  },
  {
    path: "/student/:id",
    name: "StudentInfo",
    component: StudentInfo,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

const hello = [];

hello.forEach((i) => {
  console.log("");
});
