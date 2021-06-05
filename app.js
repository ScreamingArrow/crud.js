const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000

app.use(express.urlencoded({extended: true}))

app.use(express.json())

//conexao com o mysql
const pool = mysql.createPool({
    connectionLimit: 10, 
    host           :'localhost',
    user           :'root',
    password       :'password',
    database       :'trabalhocrud'  
})

//Ler todos os usuarios
app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query('SELECT snome, pnome from contatos ORDER BY snome ASC', (err, rows) => {
            connection.release()

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

//Remover usuarios por id
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query('DELETE from contatos WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`Usuario com o ID: ${[req.params.id]} foi removido.`)
            } else {
                console.log(err)
            }

        })
    })
})

//Adicionar um usuario
app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        const params = req.body

        connection.query('INSERT INTO contatos SET ?', params, (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`Usuario foi com o nome: ${params.pnome} foi adicionado.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

//Atualizar um cadastro
app.put('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        const {id, pnome, snome, endereco, fone} = req.body

        connection.query('UPDATE contatos SET endereco = ? WHERE id = ?', [endereco, id], (err, rows) => {
            connection.release()

            if(!err) {
                res.send(`Usuario foi com o ID: ${id} foi atualizado.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})
//listen on enviroment port or 5000
app.listen(port, () => console.log(`Listen on port ${port}`))