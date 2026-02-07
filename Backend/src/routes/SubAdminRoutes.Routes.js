import bodyParser from 'body-parser';
import express from 'express';
import subAdminAutheatioaction from '../middleware/authFromTokenForSAdmin/index.js'

import {
    createPublicationJournal,
    createPublicationBooks,
    createPublicationConference,
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
    getASinglePublicationOnBasisTitleBooks,
    getASinglePublicationOnBasisTitleConference,
    getASinglePublicationOnBasisTitleJournal,
    getASinglePublicationOnBasisTitlePatents,
    getASinglePublicationOnBasisTitleWorkshops,
    getCurrentStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getSelectedAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getGraduatedStudents,
  createNewStudent,
  updateNewStudent,
  deleteNewStudent
} from '../controller/Admin/actions/Admin/index.js';
const router = express.Router();


router.use(subAdminAutheatioaction)
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());



//This is for Publications
router.post('/createPublication/Journal', createPublicationJournal);
router.post('/createPublication/Books', createPublicationBooks);
router.post('/createPublication/Conference', createPublicationConference);
router.post('/createPublication/Workshops', createPublicationWorkshops)
router.post('/createPublication/Patent', createPublicationPatents);
//Get only one document by title
router.get('/getASinglePublication/Journal/:title',getASinglePublicationOnBasisTitleJournal);
router.get('/getASinglePublication/Books/:title',getASinglePublicationOnBasisTitleBooks);
router.get('/getASinglePublication/Conference/:title',getASinglePublicationOnBasisTitleConference);
router.get('/getASinglePublication/Workshops/:title',getASinglePublicationOnBasisTitleWorkshops);
router.get('/getASinglePublication/Patent/:title',getASinglePublicationOnBasisTitlePatents);
//for update
router.put('/UpdatePublication/Journal/:id', UpdatePublicationJournal);
router.put('/UpdatePublication/Books/:id', UpdatePublicationBooks);
router.put('/UpdatePublication/Conference/:id', UpdatePublicationConference);
router.put('/UpdatePublication/Workshops/:id', UpdatePublicationWorkshops)
router.put('/UpdatePublication/Patent/:id', UpdatePublicationPatents);

//for delete
router.delete('/DeletePublication/Journal/:id', DeletePublicationJournal);
router.delete('/DeletePublication/Books/:id', DeletePublicationBooks);
router.delete('/DeletePublication/Conference/:id', DeletePublicationConference);
router.delete('/DeletePublication/Workshops/:id', DeletePublicationWorkshops)
router.delete('/DeletePublication/Patent/:id', DeletePublicationPatents);

//This is for  CurrentStudents
router.get("/getCurrentStudents", getCurrentStudents);
router.post("/createStudent", createStudent);
router.put("/updateStudent/:id", updateStudent);
router.delete("/deleteStudent/:id", deleteStudent);


//This is for GraduatedStudents
router.get("/getGraduatedStudents", getGraduatedStudents);
router.post("/createNewStudent", createNewStudent);
router.put("/updateNewStudent/:id", updateNewStudent);
router.delete("/deleteNewStudent/:id", deleteNewStudent);




// This is for Achievement

router.get("/getSelectedAchievement", getSelectedAchievement);
router.post("/createAchievement", createAchievement);
router.put("/updateAchievement/:id", updateAchievement);
router.delete("/deleteAchievement/:id", deleteAchievement);


export default router;






