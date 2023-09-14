const express = require('express');
const db = require('./connection').db
const bodyParser = require('body-parser')

const app = express();
const port = 3002;

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
});

app.get('/menu', (req, res) => {
    res.render('menu');
});

app.get('/students',(req,res)=>{
    const query = `SELECT * from student_list`
    db.query(query,(err,result)=>{
        if (err){
            console.error(err)
            return res.json({error:'Error retrieving users'})
        }
        // res.send('data recieved')
        res.render('view',{udata : result})
    })
})

app.get('/students/delete',(req,res)=>{
    const query = `SELECT * from student_list`
    db.query(query,(err,result)=>{
        if (err){
            console.error(err)
            return res.json({error:'Error retrieving users'})
        }
        // res.send('data recieved')
        res.render('delete-student',{udata : result})
    })
})

app.get('/students/new',(req,res)=>{
    res.render('add-student')
})
app.post('/students',(req,res)=>{
    const { name, email, phone, gender } = req.body  // Changed "phone" to "Phone"
    console.log(phone,"phone no.");
    const qry = `INSERT INTO student_list (name, email, phone, gender) VALUES (?, ?, ?, ?)`  // Corrected placeholders and values
    db.query(qry, [name, email, phone, gender], (err,result)=>{
        if(err) {
            console.error(err);
            return res.json({error: err});
        }
        return res.json({message: 'Student Created Successfully'});
    });
});

// Add a route handler for the home button
app.get('/home', (req, res) => {
    res.redirect('/');
});

// ... (previous code)

// Route handler for rendering the search form
app.get('/students/search', (req, res) => {
    res.render('search-student');
});

// Route handler for searching and displaying student information
app.post('/search', (req, res) => {
    const phone = req.body.phone;

    // Query the database to search for the student based on the phone number
    const qry = `SELECT * FROM student_list WHERE phone = ?`;
    db.query(qry, [phone], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ error: err });
        }

        if (results.length === 0) {
            return res.json({ message: 'Student not found' });
        }

        const student = results[0];
        return res.json({ student });
    });
});



app.get('/students/:id/edit', (req, res) => {
    const userID = req.params.id;
    const qry = `SELECT * FROM student_list WHERE id = ?`;
    db.query(qry, [userID], (err, result) => {
        if (err || result.length === 0) {
            console.error(err);
            return res.json({ error: 'User not found' });
        }
        const student = result[0]; // Use result[0] to get the student information
        res.render('edit-user', { student });
    });
});



app.post('/students/:id',(req,res)=>{
    const userID = req.params.id;
    const {name,email,phone,gender}=req.body
    const qry = `UPDATE student_list SET name = ? , email = ? , phone = ? , gender = ? WHERE id = ?`;

    db.query(qry,[name,email,phone,gender,userID],(err,result)=>{
        if(err){
            console.error(err);
            return res.json({error:'user not Updated'});
        }
        return res.json({message:'User Updated Successfully'})
    })
})

app.post('/students/:id/delete',(req,res)=>{
    const userID = req.params.id;
    const qry = `DELETE FROM student_list WHERE id = ?`;
    db.query(qry,[userID],(err,result)=>{
        if(err){
            console.error(err);
            return res.json({error:'Error deleting user'});
        }
        return res.json({message:'User deleted Successfully'})
    })
})

app.get('/students/view',(req,res)=>{
    const query = `SELECT * from student_list`
    db.query(query,(err,result)=>{
        if (err){
            console.error(err)
            return res.json({error:'Error retrieving users'})
        }
        // res.send('data recieved')
        res.render('show-list',{udata : result})
    })
})