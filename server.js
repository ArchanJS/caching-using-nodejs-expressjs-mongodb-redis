const express=require('express');
const morgan=require('morgan');
const cors=require('cors');
require('dotenv').config({path:'config.env'});

const app=express();

const port=process.env.PORT || 8000;

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

require('./db/conn');

app.use('/api/student',require('./routes/student.routes'));

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})