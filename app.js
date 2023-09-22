const port = 4000;
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
// set up  express app
const app = express();
// connect to Mongodb
const dbURI = 'mongodb+srv://abassdb:Kolawole10@firstcluster.situuzh.mongodb.net/Nodedb?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => {
        app.listen(port)
        console.log('connected to db')
    })
    .catch((err) => {
        console.log(err, "db not connected")
    });
//middleware and static files
app.use(express.static('css'));
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'))
// mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res)=>{
//     const blog = new Blog({
//         title: 'new blog2', 
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });
//     blog.save()
//     .then((result)=>{
//         res.send(result)
//     })
//     .catch(err=>console.log(err));
// })
// app.get('/all-blog', (req, res)=>{
//     Blog.find()
//     .then(result=>res.send(result))
//     .catch(err=>console.log(err))
// })
// find by id
// app.get('/single-blog', (req, res)=>{
//     Blog.findById('64ed0012a1864cffc271fbea')
//     .then(result=>res.send(result))
//     .catch(err=>console.log(err))
// })
// Handling Middelware code 
// app.use((req, res, next)=>{
//     console.log(`New request made`);
//     console.log(`HostName: ${req.hostname}`);
//     console.log(`path: ${req.url}`);
//     console.log(`Method: ${req.method}`);
//     next() 
// })
// app.use((req, res, next)=>{
//     console.log(`The next middleware`);
//     next()
// })
// Register View engine
app.set('view engine', 'ejs')
// listen for requests

app.get('/', (req, res) => {

    res.redirect('/blogs/create')
})
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' })
})
app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then(result=>res.render('index', {title: 'All blogs', blog: result}))
    .catch(err=>console.log(err))
})
app.post('/blogs', (req, res)=>{
    // console.log(req.body);
    const blog = new Blog(req.body)
    blog.save()
    .then(result=>res.redirect('/blogs'))
    .catch(err=>console.log(err))
})
// listen for Get request
app.get('/about', (req, res) => {
    console.log(`Path is ${req.url}  while method is  ${req.method}`);
    // send back Html content
    // res.send('<h1>Welcome</h1>')
    // send back some html file
    // res.sendFile('/views/about.html', {root: __dirname})
    // Another way to send back some html file
    // res.sendFile(__dirname + '/views/about.html')
    res.render('about', { title: 'About' })
})
app.get('/blogs/:id', (req, res)=>{
    const {id} = req.params;
    console.log(id)
    Blog.findById(id)
    .then((result)=>{
        res.render('details', {title : 'Blogs details', arr: result})
    }).catch(err => console.log(err));
})
// redirects
// app.get('/aboutme', (req, res)=>{
//     // res.redirect('/about')
// })
app.delete('/delete/:id', (req, res)=>{
    const id = req.params.id
    Blog.findByIdAndDelete(id).then((result)=>{
        res.json({redirect: '/blogs'})
    }).catch(err=> console.log(err))
})
// 404 page
app.use(function (req, res) {
    // res.status(404).sendFile(__dirname + '/404.html')
    res.render('404', { title: '404' })
})