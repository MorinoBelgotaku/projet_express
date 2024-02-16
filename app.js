const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const port = 3000;

app.set('view engine', 'ejs');

const database = {
  users: []
}

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  let prenom = req.query.prenom
  let nom = req.query.nom
  res.render('pages/index', { prenom, nom });

});

app.get('/about', function(req, res) {
  res.render('pages/about');
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
  let reponse = nb1 * nb2;
  res.render('pages/multiplication', { nb1, nb2, reponse })
});

app.get('/table-multiplication', (req, res) => {
  let nbr = req.query.nbr ?? 1;
  if (nbr < 1 || nbr > 10) {
    res.send(`Erreur de nombre, il doit être compris entre 1 et 10`)
  } else {
    let resultat = '';
    for (i = 1; i <= 10; i++) {
      resultat += `${i} x ${nbr} = ${i * nbr}<br>`
    }
    res.send(`${resultat}`)
  }
});

app.get('/table-multiplication-web', (req, res) => {
  res.render('pages/table-multiplication', { req })
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
  let somme = nombre1 + nombre2
  if (nombre1 && nombre2) {
    res.send(`${nombre1} + ${nombre2} = ${somme}`)
  }
  else {
    return res.send(`Veuillez compléter ${nombre1 ? '' : 'nombre1'} ${nombre2 ? '' : 'nombre2'}`)
  }
});

app.get('/eafc', (req, res) => {
  res.redirect('https://www.iepsm.be/')
});

app.get('/supprimer', (req, res) => {
  const uuid = req.query.uuid;
  if (uuid != null) {
    const index = database.users.findIndex(function (user) {
      return user.id === uuid
    });
    if (index !== -1) {
      database.users.splice(index, 1);
    }
  }
  res.redirect('/utilisateurs')
});

// Créer une nouvelle route /utilisateurs
// avec un tpl html qui permet de lister les utilisateurs

app.get('/formulaire', (req, res) => {
  const uuid = req.query.uuid
  let id_user = database.users.find((user) => {
    return user.id === uuid
  });

  const nom = id_user == null ? '' : id_user.nom;
  const prenom = id_user == null ? '' : id_user.prenom;
  const button_modify = id_user == null ? `Ajouter l'utilisateur` : `Modifier`;

  res.render('pages/formulaire', {
    users: database.users,
    nom,
    prenom,
    uuid,
    button_modify
  })
})

app.post('/formulaire-save', (req, res) => {
  const nom = req.body.nom
  const prenom = req.body.prenom
  const uuid = req.query.uuid
  let user_exist = database.users.find((user) => {
    return user.id === uuid
  });

  if (user_exist) {
    user_exist.prenom = prenom;
    user_exist.nom = nom;
  } else {
    database.users.push({
      id: uuidv4(),
      nom,
      prenom
    })
  }
  res.redirect('/utilisateurs')
})

app.get('/utilisateurs', (req, res) => {
  res.render('pages/utilisateurs', {
    users: database.users
  })
})

app.listen(port, () => {
  console.log('Serveur en ligne !')
  console.log(`http://localhost:${port}`)
});