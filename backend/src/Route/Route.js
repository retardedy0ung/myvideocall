import { Router } from "express";
import { createmeeting, login, middle, registering, saveparticipants } from "../contorller/contoller.js";

const router=Router()
router.post("/register",registering)
router.post("/login",login)
router.post("/create",middle,createmeeting)
router.post("/addparticipant",middle,saveparticipants)
export default router;