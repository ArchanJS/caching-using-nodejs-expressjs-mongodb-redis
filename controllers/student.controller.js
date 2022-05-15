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
        const result=await getOrSetCache('students',async()=>{
            try {
                const students=await Student.find();
                return students;
            } catch (error) {
                throw new Error("Something went wrong while caching!");
            }
        });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

const getOrSetCache=(key,cb)=>{
    return new Promise(async(resolve,reject)=>{
        await redisClient.connect();
        const data=await redisClient.get(key);
        if(data!=null){
            redisClient.quit();
            return resolve(JSON.parse(data));
        }
        else{
            const students=await cb();
            redisClient.setEx(key,process.env.EXPIRES,JSON.stringify(students)); //EXPIRES=3600
            redisClient.quit();
            resolve(students);
        }
    })
}