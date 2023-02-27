const express = require('express')
const router = express.Router()


const {
    addUser, 
    editUser,
    selectUser,
    addfriend,
    deletefriend,
    selectfriend
} = require('../controllers/Controller')

router.post('/register', addUser)
router.post('/friend', addfriend)
router.put('/user/:username', editUser)
//router.get('/:user_id?', selectUser)
router.get('/login', selectUser)
router.get('/friend/:username', selectfriend)
router.delete('/friend', deletefriend)

module.exports = router