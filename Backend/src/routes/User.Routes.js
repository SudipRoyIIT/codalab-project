import bodyParser from 'body-parser';
import express from 'express';
import {
  getPublication,
  getAllStudents,
  getStudentById,
  getEvents,
  getAllNews,
  getAllMemories,
  getAllAchievements,
  getNewStudents,
  getResearchArea,
} from "../controller/User/CodaLabData/index.js";
import {
  getHelloWorld,
  getNews,
  getAnnouncements,
  getPublicationsOfSudipRoy,
  getProjects, getAutumnSemester, getSpringSemester, getAllActivity, getAllHonors

} from "../controller/User/SudipRoySirData/SudiPindex.js";
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//This routes from Sudip sir lab
router.get('/getHelloWorld', getHelloWorld);
router.get('/getProjects', getProjects);
router.get('/PublicationsOfSudipRoySir', getPublicationsOfSudipRoy);
router.get("/getNews", getNews);
router.get('/getAnnouncements', getAnnouncements);
router.get('/getAutumnsemester', getAutumnSemester);
router.get('/getSpringsemester', getSpringSemester);
router.get('/getAllActivity', getAllActivity);
router.get('/getAllHonors', getAllHonors);

//This routes from coda lab
router.get('/publication', getPublication);
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.get('/gallery', getAllMemories);
router.get('/events', getEvents);
router.get("/getallnews", getAllNews);
router.get('/achievements', getAllAchievements);
router.get('/newstudents', getNewStudents);
router.get('/research', getResearchArea);



export default router;