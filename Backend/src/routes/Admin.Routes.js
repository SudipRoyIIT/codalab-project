import bodyParser from "body-parser";
import express from "express";
import {
  createPublicationJournal,
  createPublicationBooks,
  createPublicationConference,
  getHelloWorld,
  createProjects,
  updateProject,
  DeleteProject,
  createPublicationWorkshops,
  createPublicationPatents,
  UpdatePublicationBooks,
  UpdatePublicationConference,
  UpdatePublicationJournal,
  UpdatePublicationPatents,
  UpdatePublicationWorkshops,
  DeletePublicationConference,
  DeletePublicationPatents,
  DeletePublicationJournal,
  DeletePublicationBooks,
  DeletePublicationWorkshops,
  getSelectedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getSelectedNews,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  getSelectedAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getASinglePublicationOnBasisTitleBooks,
  getASinglePublicationOnBasisTitleConference,
  getASinglePublicationOnBasisTitleJournal,
  getASinglePublicationOnBasisTitlePatents,
  getASinglePublicationOnBasisTitleWorkshops,
  createSemester,
  getSelectedSemester,
  UpdateSelectedSemester,
  deleteSelectedSemester,
  getSelectedResearchArea,
  createResearchArea,
  UpdateResearchArea,
  deleteSelectedResearchArea,
  getSelectedActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getSelectedGallery,
  createMemory,
  updateMemory,
  deleteMemory,
  createStudent,
  getCurrentStudents,
  deleteStudent,
  updateStudent,
  getGraduatedStudents,
  createNewStudent,
  updateNewStudent,
  deleteNewStudent,
  getSelectedAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getSelectedAwardsAndTalks,
  createAwardsAndTalks,
  updateAwardsAndTalks,
  deleteAwardsAndTalks,
  getASingleProjectOnBasisProjects,
  getAllResearchAreas,
  getAllPublicationsJournal,
  getAllPublicationsConference,
  getAllPublicationsPatent,
  getAllPublicationsWorkshops,
  getAllPublicationsBooks,
} from "../controller/Admin/actions/Admin/index.js";
import AdminAutheatioaction from "../middleware/authFromTokenForAdmin/index.js";

const router = express.Router();

// router.use(AdminAutheatioaction);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//This is for Publications
router.post("/createPublication/Journal", createPublicationJournal);
router.post("/createPublication/Books", createPublicationBooks);
router.post("/createPublication/Conference", createPublicationConference);
router.post("/createPublication/Workshops", createPublicationWorkshops);
router.post("/createPublication/Patent", createPublicationPatents);
//for update
router.put("/UpdatePublication/Journal/:id", UpdatePublicationJournal);
router.put("/UpdatePublication/Books/:id", UpdatePublicationBooks);
router.put("/UpdatePublication/Conference/:id", UpdatePublicationConference);
router.put("/UpdatePublication/Workshops/:id", UpdatePublicationWorkshops);
router.put("/UpdatePublication/Patent/:id", UpdatePublicationPatents);

//Get only one document by title
router.get(
  "/getASinglePublication/Journal/:title",
  getASinglePublicationOnBasisTitleJournal
);
// Add this route to get ALL journal publications
router.get("/getAllPublication/Journal", 
  getAllPublicationsJournal);
router.get(
  "/getASinglePublication/Books/:title",
  getASinglePublicationOnBasisTitleBooks
);
router.get(
  "/getASinglePublication/Conference/:title",
  getASinglePublicationOnBasisTitleConference
);
// Add this route to get ALL conference publications
router.get("/getAllPublication/Conference",
  getAllPublicationsConference
);
router.get(
  "/getASinglePublication/Workshops/:title",
  getASinglePublicationOnBasisTitleWorkshops
);
router.get(
  "/getASinglePublication/Patent/:title",
  getASinglePublicationOnBasisTitlePatents
);
// Add this with the other getAllPublication routes (around line 60)
router.get("/getAllPublication/Patent", 
  getAllPublicationsPatent
);
router.get("/getAllPublication/Workshops",
  getAllPublicationsWorkshops
);
router.get("/getAllPublication/Conference", 
  getAllPublicationsConference
);
// Add this route with the other getAllPublication routes (around line 60)
router.get("/getAllPublication/Books", 
  getAllPublicationsBooks
);
//for delete
//for delete
router.delete("/DeletePublication/Journal/:id", DeletePublicationJournal);
router.delete("/DeletePublication/Books/:id", DeletePublicationBooks);
router.delete(
  "/DeletePublication/Conference/:id",
  DeletePublicationConference
);
router.delete(
  "/DeletePublication/Workshops/:id",
  DeletePublicationWorkshops
);
router.delete("/DeletePublication/Patent/:id", DeletePublicationPatents);

//This is for project
router.get("/getASingleProjectOnBasisProjects/:title",getASingleProjectOnBasisProjects)
router.post("/createProject", createProjects);
router.put("/updateProject/:id", updateProject);
router.delete("/DeleteProject/:id", DeleteProject);
router.get("/helloWorld", getHelloWorld);

// This is for events

router.get("/getselectevents", getSelectedEvents);
router.post("/createEvent", createEvent);
router.put("/updateEvent/:id", updateEvent);
router.delete("/deleteEvent/:id", deleteEvent);

// This is for announcements

router.get("/getselectedannouncements", getSelectedAnnouncements);
router.post("/createAnnouncement", createAnnouncement);
router.put("/updateAnnouncement/:id", updateAnnouncement);
router.delete("/deleteAnnouncement/:id", deleteAnnouncement);

// This is for news

router.get("/getselectnews", getSelectedNews);
router.post("/createNews", createNews);
router.put("/updateNews/:id", updateNews);
router.delete("/deleteNews/:id", deleteNews);

//This is for All News

router.get("/getallnews", getAllNews);
router.post("/createNews", createNews);
router.put("/updateNews/:id", updateNews);
router.delete("/deleteNews/:id", deleteNews);

// This is for teaching 

router.post("/createSemester/:semester",createSemester);
router.get("/getSemester/:year",getSelectedSemester);
router.put("/UpdateSelectedSemester/:id/:semester",UpdateSelectedSemester);
router.delete("/deleteSelectedSemester/:id",deleteSelectedSemester);

// This is for ResearchArea
router.post("/createResearchArea",createResearchArea);
router.get("/getSelectedResearchArea/:title",getSelectedResearchArea);
router.put("/UpdateResearchArea/:id",UpdateResearchArea);
router.delete("/deleteSelectedResearchArea/:id",deleteSelectedResearchArea);
router.get("/getAllResearchAreas", getAllResearchAreas);


// This is for Current Students

router.get("/getCurrentStudents", getCurrentStudents);
router.post("/createStudent", createStudent);
router.put("/updateStudent/:id", updateStudent);
router.delete("/deleteStudent/:id", deleteStudent);

// This is for Graduate Students

router.get("/getGraduatedStudents", getGraduatedStudents);
router.post("/createNewStudent", createNewStudent);
router.put("/updateNewStudent/:id", updateNewStudent);
router.delete("/deleteNewStudent/:id", deleteNewStudent);

// This is for Gallery

router.get("/getSelectedGallery", getSelectedGallery);
router.post("/createMemory", createMemory);
router.put("/updateMemory/:id", updateMemory);
router.delete("/deleteMemory/:id", deleteMemory);

// This is for Activities

router.get("/getSelectedActivity", getSelectedActivity);
router.post("/createActivity", createActivity);
router.put("/updateActivity/:id", updateActivity);
router.delete("/deleteActivity/:id", deleteActivity);



// This is for Achievement

router.get("/getSelectedAchievement", getSelectedAchievement);
router.post("/createAchievement", createAchievement);
router.put("/updateAchievement/:id", updateAchievement);
router.delete("/deleteAchievement/:id", deleteAchievement);

// This is for AwardsAndTalks

router.get("/getSelectedAwardsAndTalks", getSelectedAwardsAndTalks);
router.post("/createAwardsAndTalks", createAwardsAndTalks);
router.put("/updateAwardsAndTalks/:id", updateAwardsAndTalks);
router.delete("/deleteAwardsAndTalks/:id", deleteAwardsAndTalks);


export default router;











