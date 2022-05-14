const Student=require('../models/Student');
const redis=require('redis');

const redisClient=redis.createClient();

// Create student
exports.createStudent=async(req,res)=>{
    try {
        const {name,email,department,roll}=req.body;
        const student=new Student({name,email,department,roll});
        await student.save();
        res.status(201).json({message:"Student created!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

// Get all students
exports.getAllStudents=async(req,res)=>{
    try {
        await redisClient.connect();
        let result=await redisClient.get('students');
        if(result==null){
            const students=await Student.find();
            redisClient.setEx('students',process.env.EXPIRES,JSON.stringify(students)); //EXPIRES=3600
            redisClient.quit();
            res.status(200).send(students);
        }
        else{
            result=JSON.parse(result);
            redisClient.quit();
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}