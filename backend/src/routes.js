const express = require('express');
const multer = require('multer');
const multerConfig = require('./multer/config.js')

const routes = express.Router();


const PostsController = require('./controllers/PostsController');
const PostsValidator  = require('./validations/PostsValidator');

routes.get('/',PostsValidator.index,PostsController.index);
routes.get('/search',PostsController.search);
routes.post('/create',multer().single('cover_image'),PostsController.create);
// routes.post('/create',multer(multerConfig).single('cover_image'),(req,res)=>{
//     console.log(req.file);

//     return res.json({hello:'Rocket'});
// });
routes.put('/alter/:id',PostsController.alter);
routes.delete('/delete/:id',PostsController.delete);

module.exports = routes;