const express = require('express');
const db = require('./db.js');
const authUtils = require('./auth_utils.js');
const router = express.Router();


router.post('/users/login', async function(req, res, next){

    let credentials = req.headers.authorization;
    let cred = authUtils.decodeCred(credentials);

    if(cred.username == '' || cred.password == ''){
        res.status(401).json({error: 'No username or password'}).end();
        return;
    }

    try {
        let data = await db.getUser(cred.username);
        if(data.rows.length > 0){

            let userid = data.rows[0].id;
            let username = data.rows[0].username;
            let hash = data.rows[0].password;
            let salt = data.rows[0].salt;


            let passwordVeryfied = authUtils.verifyPassword(cred.password, hash, salt);

            if(!passwordVeryfied){
                res.status(403).json({msg:'The password is not correct'}).end();
                return;
            }

            let tok = authUtils.createToken(username, userid)
            
            res.status(200).json({
                msg: 'The login was successful',
                token: tok
            }).end();
            return;
        }
    } catch (error) {
        console.log(error)
    }
    res.status(200).send('Hello from post - /users/login').end();
})

router.get('/users', async function(req, res, next){

    try {
        let data = await db.getAllUsers();
        res.status(200).send(data.rows).end();
    } catch (err) {
        next(err)
    }
    
})


router.post('/users', async function(req, res, next){

    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if (cred.username == '' || cred.password == ''){
        res.status(401).json({error: 'No username or password'}).end();
        return;
    }

    let hash = authUtils.createHash(cred.password);

    try {
        let data = await db.createUser(cred.username, hash.value, hash.salt);

        if(data.rows.length > 0){
            res.status(200).json({msg: 'The user was successfully created'}).end();
        }else{
            throw 'The user could not be created'
        }
    } catch (err) {
        next(err);
    }
    
})


router.delete('/users', async function(res, req, next){
    res.status(200).send('Hello from delete - /users').end();
})


module.exports = router;