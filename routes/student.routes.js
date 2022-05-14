const router=require('express').Router();
const {createStudent,getAllStudents}=require('../controllers/student.controller');

router.post('/create',createStudent);
router.get('/get',getAllStudents);

module.exports=router;