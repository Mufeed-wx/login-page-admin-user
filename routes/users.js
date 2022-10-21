var express = require('express');
var router = express.Router();
const userhelper = require('../helpers/userhelper')

var session;

/* GET users listing. */
// router.get('/login', function(req, res, next) {
//   let products=[
//     {
//     name:"Lenovo Yoga-6",
//     category:'Laptop',
//     description:"8 GB/512 GB SSD/Windows 10 Home/2 GB Graphics  ",
//     image:"https://www.lenovo.com/medias/Yoga-6-SS-Hero.png?context=bWFzdGVyfHJvb3R8Njg1MDl8aW1hZ2UvcG5nfGhlZS9oZWEvMTI4NDE3NzYwMjE1MzQucG5nfDRhYzAyMjBjODNlM2MzNDIyNzAzYjBiNzQ3NzNkNTVhNjlhNWQ0YjlmYzIzZTc3ZTZmYTFkNzRhODI4ZDU3YjU",
        
//   },
// {
//   name:"Legion 5 Gen",
//     category:'Laptop',
//     description:"16 GB/512 GB SSD/Windows 11 Home",
//     image:"https://www.lenovo.com/medias/lenovo-laptop-legion-5-15-amd-subseries-hero.png?context=bWFzdGVyfHJvb3R8MTYyNjIwfGltYWdlL3BuZ3xoNTIvaDU1LzE0MTkwNDY2NjI5NjYyLnBuZ3wwNTQ1YjQxMzI0ZGJiODc2YmIwNWE3YzRiMzNlZWEzNjg1ODJkZjljNDRhOGVhYTY2YzE1N2Q5OGVhNTlhYWUw",
  
// },
// {
//   name:"Think pad X1 Yoga",
//     category:'Laptop',
//     description:"8 GB/512 GB SSD/Windows home",
//     image:"https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-yoga-gen-6-14-intel-subseries-hero.png?context=bWFzdGVyfHJvb3R8Mjg4ODM5fGltYWdlL3BuZ3xoNjUvaDIzLzE0MDYxOTExOTMyOTU4LnBuZ3xjMjU2ZTllOWQ2YWNhMDI3ZGE5NDdmNWVjOTJlOWMwMWZhODgzZGRmM2YwZTZiM2ZmYzAwMTU4NjQ3OGFmM2Rj",
//   },
// {
//   name:"Ideapad slim 5pro",
//     category:'Laptop',
//     description:"8 GB/1 TB HDD/256 GB SSD/Windows 11 Home",
//     image:"https://www.lenovo.com/medias/Subseries-Hero-image.png?context=bWFzdGVyfHJvb3R8NTgzMzR8aW1hZ2UvcG5nfGhjYS9oZDAvMTM0NDMxNzUxNTM2OTQucG5nfDZiNGU0YjM2ZDUzNDhmMDE1MzAyYjIxYWVkNzA2YWFlMjQwNTEyZmE1ZGUwYWVjMDJhNDJmN2Y3MmU1ZDY4Zjk",
// },

// ]

//   res.render('userhome',{products,admin:true})  
//});
router.get('/', function (req, res, next) {
  
  if (req.session.user) {
   let username=req.session.user.fname
    res.render('user/userhome',{username})
  }
  else {
    res.redirect('/loginpage')
  }

});

router.get('/loginpage', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/')
  } else {
    session=req.session
    res.render('user/userlogin',{session})
    

  }

});

router.get('/signuppage', function (req, res, next) {         //signup page

  if(req.session.user){
    res.redirect('/')
  }else{
    

session=req.session

console.log(session.userAlreadyExist);
  res.render('user/usersignup',{session})

  }


});

router.post('/signup', function (req, res, next) {             //signup action
  userhelper.usersignup(req.body).then((state) => {
    if(state.userexist){
      req.session.userAlreadyExist=true;
      res.redirect('/signuppage')
      
    }else{
      
      req.session.user=state.user;
      console.log(state.user);
      res.redirect('/')
      
    } 

    
  })

});
router.post('/login', function (req, res, next) {                      //login action
  userhelper.userlogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      // console.log(req.session.user);
      // console.log('success');
      res.redirect('/')

    }else if(response.usernotfound) {
      console.log('usernotfound');
      req.session.usernotfound=true;
      req.session.wrongpassword=false;
      res.redirect('/loginpage')
      
    }else{
      console.log('failed login');
      req.session.wrongpassword=true;
      req.session.usernotfound=false;
      res.redirect('/loginpage')

    }

  })                                                             

});


router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})


module.exports = router;
