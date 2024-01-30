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

app.get('/hello-world', (req, res) => {
  res.send('Hello World!')
});

app.get('/hello-world-2', (req, res) => {
  res.render('pages/hello-world')
});

app.get('/multiplication', (req, res) => {
  let nb1 = 10;
  let nb2 = 5;
  let reponse = nb1*nb2;
  res.render('pages/multiplication', {nb1,nb2,reponse})
});

app.get('/table-multiplication', (req, res) => {
  let nbr = req.query.nbr ?? 1;
  if (nbr < 1 || nbr > 10) {
    res.send(`Erreur de nombre, il doit être compris entre 1 et 10`)
  } else {
    let resultat = '';
    for (i=1; i <= 10; i++) {
      resultat += (`${i} x ${nbr} = ${i*nbr}<br>`)
    }
    res.send(`${resultat}`)
  }
});

app.get('/table-multiplication-web', (req, res) => {
  res.render('pages/table-multiplication', {req})
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