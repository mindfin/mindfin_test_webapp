const express = require ('express');
const router = express.Router();
var sha1 = require('sha1');
// var generator = require('generate-password');
// const format = require ('date-format');
const multer = require('multer');
// var convertRupeesIntoWords = require('convert-rupees-into-words');
const knex = require('../knex/knex.js');
// var DateDiff = require('date-diff');
// var zeropad = require('zeropad');
// const format = require('date-format');
var now = new Date()


  const storage=multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './President/');
  },
  filename: function(req, file, cb) {
    cb(null,  Date.now()+""+ file.originalname);
  // cb(null, new Date().toISOString() + file.originalname);
 //console.log(cb);
  }
  
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
 fileFilter: fileFilter
});



router.get('/adminlogin/:username/:password',(req,res)=>{
    console.log(req.params);
    console.log("hiii");

username=req.params.username;
const password = (sha1(req.params.password));

  knex.select()
  .from('employee')
  .join('usertype','usertype.idusertype','employee.iduser')
  .where({email:username,password:password})
  .then(function(result){  

if(result[0].user=='ADMIN')
{
res.json({result:result[0],
    message:'ADMIN'
})
}
else
{
res.json({result,
    message:'EXECUTIVE'
})
}
  })
  })


  


  module.exports = router;