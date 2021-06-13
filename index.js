const fs = require('fs')
const express = require('express')
const zoauth = require('zoauth')
const app = express()

let projects = JSON.parse(fs.readFileSync('projects.json'))
fs.readdirSync('../').forEach(file => {
    if(!projects.initialized.includes(file)){
        console.log(file)
    }
})

app.listen(5210)
zoauth.setCredentials({
    github: {
        client_id: '',
        scope: ['repo']
    }
})

app.get('/', (req, resp) => {
    resp.redirect(zoauth.getAuthUrl('github'))
})

app.get('/callback/github', (req, resp) => {
    zoauth.getToken('github', {code: req.query.code}, {'headers': {'Accept': 'application/json'}})
        .then(r1 => {
            console.log(r1)
            zoauth.postApi('https://api.github.com/user/repos', {
                name: 'Test Repo',
                description: 'Something something...',
                private: true
            }, r1)
                .then(r2 => resp.send(r2))
                .catch(err2 => resp.send(err2))
        }).catch(err1 => resp.send(err1))
})