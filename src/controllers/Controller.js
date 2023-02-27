const { QueryTypes } = require('sequelize')
const w2Database = require('../database/connection')

const addUser = async (req, res) =>{
    let {username, password, nama, alamat, nomerhp} = req.body
    if(await isDup(username))
        return res.status(400).send({
            'message': 'Username is already taken!'
        })


    let [result, metadata] = await w2Database.query(
        `insert into users (username, password, nama, alamat, nomerhp) values(:username, :password, :nama, :alamat, :nomerhp)`,
        {
            replacements: {
                username: username, 
                password: password,
                nama: nama,
                alamat: alamat,
                nomerhp: nomerhp
            }
        }
    )
    return res.status(201).send({
        'message': 'User successfully registered'
    })
}

const addfriend = async (req,res) => {
    let {username, password, usercari} = req.body

    let [result, metadata] = await w2Database.query(
        `insert into friend (user_id, userfriend) values(:user_id, :userfriend)`,
        {
            replacements: {
                user_id: username, 
                userfriend: usercari
            }
        }
    )
    return res.status(201).send({
        'message': 'Friend successfully added'
    })
}

const editUser = async (req,res) => {
    let {username} = req.params
    let {nama, alamat, nomerhp, oldpassword, newpassword} = req.body

    if(!await userExist(username))
        return res.status(404).send({
            'message': 'User not found!'
        })

    let [result, metadata] = await w2Database.query(
        `update users set nama = :nama, alamat = :alamat, nomerhp = :nomerhp, password = :password where username = :username && password = :oldpassword`,
        {
            replacements:{
                nama: nama,
                username: username,
                alamat: alamat,
                nomerhp: nomerhp,
                password: newpassword,
                oldpassword: oldpassword
            }
        }
    )
    let updatedUser = await selectUserByID(username)
    console.log(updatedUser)
    return res.status(200).send({
        'message': 'User successfully updated',
        'user': updatedUser
    })
}

const selectUser = async (req,res) => {
    let {username, password} = req.body
    let keyword = `${username}`
        let [users, metadata] = await w2Database.query(
            `select * from users where username = :temp`,
            {
                replacements: {
                    temp: keyword
                }
            }
        )
        if(!users){
            return res.status(404).send({
                'message': "username tidak ditemukan"
            })
        }else{
            //console.log(users.password)
            return res.status(200).send(users[0])
            if(users.password === password){
            return res.status(200).send(users)
            }else{
                return res.status(400).send({
                    'message': "password salah"
                })
            }
        }
}

const selectfriend = async (req,res) => {
    let {username} = req.params
    let password = req.body

    let [users, metadata] = await w2Database.query(
        `select * from friend where user_id = :temp`,
        {
            replacements: {
                temp: username
            }
        }
    )
    
    return res.status(200).send(users)
}

const deleteUser = async (req,res) => {
    let {user_id} = req.params
    if(await userExist(user_id)){
        let deleteUser = await w2Database.query(
            `delete from users where username = ?`,
            {
                replacements: [user_id]
            }
        )
        return res.status(200).send({
            'message': 'User successfully deleted'
        })
    }else{
        return res.status(404).send({
            'message': 'User does not exist'
        })
    }
}

const deletefriend = async (req,res) =>{
    let {username, password, usercari} = req.body
    let deleteUser = await w2Database.query(
        `delete from friend where user_id = :username && userfriend = :usercari`,
        {
            replacements: {
                username: username,
                usercari: usercari
            }
        }
    )
    return res.status(200).send({
        'message': 'Friendship ended.'
    })
}

module.exports = {
    addUser, editUser, selectUser, deleteUser, addfriend, deletefriend, selectfriend
}


async function isDup(username){
    let dup = await w2Database.query(
        `select * from users where username = ?`,
        {
            type: QueryTypes.SELECT,
            replacements: [username]
        }
    )
    return dup.length > 0
}

async function userExist(username){
    let select = await selectUserByID(username)
    return !!select
}


async function selectUserByID(username){
    let [user, metadata] = await w2Database.query(
        `select * from users where username = :username`,
        {
            replacements:{
                username: username
            }
        }
    )
    return user[0]
}

