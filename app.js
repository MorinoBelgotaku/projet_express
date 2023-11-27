const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine','ejs');

app.get('/', (req, res) => {
  let prenom = req.query.prenom
  let nom = req.query.nom
  res.render('pages/index', {prenom,nom});

});

app.get('/bonjour', (req, res) => {
  // const {nom,prenom} = req.query

  let nom = req.query.nom ?? '-'
  let prenom = req.query.prenom ?? '-'
  res.send(`Bonjour ${nom} ${prenom}`)
});

app.get('/calculatrice', (req, res) => {
  let nombre1 = parseInt(req.query.nombre1)
  let nombre2 = parseInt(req.query.nombre2)
  let somme = nombre1+nombre2
  if (nombre1 && nombre2) {
    res.send(`${nombre1} + ${nombre2} = ${somme}`)
  }
  else {
    return res.send(`Veuillez compléter ${nombre1 ? '' : 'nombre1'} ${nombre2 ? '' : 'nombre2'}`)
  }
});

app.listen(port, () => {
  console.log('Serveur en ligne !')
});