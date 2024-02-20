const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const nav = require('./settings/nav_bar.json'); // Liste des liens navigable
const database = require('./databases/database.json'); // Base de données

const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


/////////////////
// Page racine //
/////////////////

app.get('/', (req, res) => {
  let prenom = req.query.prenom
  let nom = req.query.nom
  res.render('pages/index', { 
    prenom,
    nom, 
    nav, 
    title: "Accueil",
    description: "Page d'accueil"
  });
});


///////////////////
// Page A propos //
///////////////////

app.get('/a-propos', function(req, res) {
  res.render('pages/about', { 
    nav, 
    title: "A propos",
    description: "Page A propos"
  });
});


////////////////
// Formulaire //
////////////////

app.get('/formulaire', (req, res) => {
  const uuid = req.query.uuid;
  const nom_invalid = req.query.nom_invalid;
  const prenom_invalid = req.query.prenom_invalid;

  // Retourne les informations de l'utilisateur avec son ID
  let id_user = database.users.find((user) => user.id === uuid);

  // Recupere le nom qui sera afficher sur la page
  let nom = '';
  if (id_user) {
    nom = id_user ? id_user.nom : '';
  } else {
    nom = req.query.nom ? req.query.nom : '';
  }
  // Recupere le prenom qui sera afficher sur la page
  let prenom = '';
  if (id_user) {
    prenom = id_user ? id_user.prenom : '';
  } else {
    prenom = req.query.prenom ? req.query.prenom : '';
  }
  
  // Change le texte du bouton sur la page
  const button_modify = id_user ?  `Modifier` : `Ajouter l'utilisateur`; 

  res.render('pages/formulaire', {
    users: database.users,
    nom,
    prenom,
    uuid,
    button_modify,
    nom_invalid,
    prenom_invalid,
    nav,
    title: "Formulaire",
    description: "Ajouter un utilisateur"
  })
})

app.post('/formulaire-save', (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const uuid = req.query.uuid;
   // Recuperation des informations utilisateur pour les modifiers si l'ID est valide
  let user_exist = database.users.find((user) => user.id === uuid);

  if (nom.length === 0 || prenom.length === 0) {
    // Vérifie lors de l'ajout
    if (nom.length === 0 && prenom.length > 0 && uuid.length === 0) {
      res.redirect(`/formulaire?nom_invalid=true&prenom=${prenom}`);
    } else if (prenom.length === 0 && nom.length > 0 && uuid.length === 0) {
      res.redirect(`/formulaire?prenom_invalid=true&nom=${nom}`);
    } else if (nom.length === 0 && prenom.length === 0 && uuid.length === 0) {
      res.redirect('/formulaire?prenom_invalid=true&nom_invalid=true');
    // Vérifie lors de la modification
    } else if (nom.length === 0 && prenom.length > 0 && uuid.length > 0) {
      res.redirect(`/formulaire?uuid=${uuid}&nom_invalid=true`);
    } else if (prenom.length === 0 && nom.length > 0 && uuid.length > 0) {
      res.redirect(`/formulaire?uuid=${uuid}&prenom_invalid=true`);
    } else if (prenom.length === 0 && nom.length === 0 && uuid.length > 0) {
      res.redirect(`/formulaire?uuid=${uuid}&prenom_invalid=true&nom_invalid=true`);
    }
  } else {
    if (user_exist) { // Si l'utilisateur existe alors on change ses informations
      user_exist.prenom = prenom;
      user_exist.nom = nom;
    } else { // Sinon si il existe pas on ajoute un utilisateur
      database.users.push({
        id: uuidv4(),
        nom,
        prenom
      })
    }
  }
  
  
  res.redirect('/utilisateurs?success=true')
})


//////////////////////
// Page Utilisateur //
//////////////////////

app.get('/utilisateurs', (req, res) => {
  const add_user = req.query.success;
  res.render('pages/utilisateurs', {
    users: database.users,
    add_user,
    nav, 
    title: "Utilisateurs",
    description: "Liste les utilisateurs"
  })
})

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


///////////////
// Page EAFC //
///////////////

app.get('/eafc', (req, res) => {
  res.redirect('https://www.iepsm.be/')
});


//////////////////
// Pages Erreur //
//////////////////

app.use((req, res, next) => {
		res.status(404).render('pages/erreurs/404', { 
      nav, 
      title: "Page non trouvé",
      description: ""
    })
});


////////////////////////////////
// Lancement de l'application //
////////////////////////////////

app.listen(port, () => {
  console.log('Serveur en ligne !')
  console.log(`http://localhost:${port}`)
});

// app.get('/hello-world', (req, res) => {
//   res.send('Hello World!')
// });

// app.get('/hello-world-2', (req, res) => {
//   res.render('pages/hello-world')
// });

// app.get('/multiplication', (req, res) => {
//   let nb1 = 10;
//   let nb2 = 5;
//   let reponse = nb1 * nb2;
//   res.render('pages/multiplication', { nb1, nb2, reponse })
// });

// app.get('/table-multiplication', (req, res) => {
//   let nbr = req.query.nbr ?? 1;
//   if (nbr < 1 || nbr > 10) {
//     res.send(`Erreur de nombre, il doit être compris entre 1 et 10`)
//   } else {
//     let resultat = '';
//     for (i = 1; i <= 10; i++) {
//       resultat += `${i} x ${nbr} = ${i * nbr}<br>`
//     }
//     res.send(`${resultat}`)
//   }
// });

// app.get('/table-multiplication-web', (req, res) => {
//   res.render('pages/table-multiplication', { req })
// });

// app.get('/bonjour', (req, res) => {
//   // const {nom,prenom} = req.query

//   let nom = req.query.nom ?? '-'
//   let prenom = req.query.prenom ?? '-'
//   res.send(`Bonjour ${nom} ${prenom}`)
// });


// app.get('/calculatrice', (req, res) => {
//   let nombre1 = parseInt(req.query.nombre1)
//   let nombre2 = parseInt(req.query.nombre2)
//   let somme = nombre1 + nombre2
//   if (nombre1 && nombre2) {
//     res.send(`${nombre1} + ${nombre2} = ${somme}`)
//   }
//   else {
//     return res.send(`Veuillez compléter ${nombre1 ? '' : 'nombre1'} ${nombre2 ? '' : 'nombre2'}`)
//   }
// });

