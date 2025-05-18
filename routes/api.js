//use require
const express = require("express");
const { User, Refuge } = require("../models");

const router = express.Router();

// Route de test
router.get("/", (req, res) => {
    res.json({ message: "API en ligne 🚀" });
});

// Récupérer tous les utilisateurs
router.get("/users", async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.get("/design/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const design = await Refuge.findOne({
            where: { userId }
        });

        if (!design) {
            return res.status(404).json({ error: "Design refuge not found" });
        }

        res.json(design);
    } catch (error) {
        console.error("Erreur lors de la récupération du design refuge :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Créer un utilisateur (test rapide)
router.post("/users", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/design — enregistre ou met à jour
router.post('/design', async (req, res) => {
  const { userId, elements, background, track } = req.body;

  try {
    // Crée un nouveau Refuge ou remplace l'existant pour cet user
    let refuge = await Refuge.findOne({ where: { userId } });
    if (refuge) {
      refuge = await refuge.update({ elements, background, track });
    } else {
      refuge = await Refuge.create({ userId, elements, background, track });
    }
    res.json(refuge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/create/refuge", async (req, res) => {
    const { username, password, avatar, refugeName, vibe, story } = req.body;
    try {

        //ici on va verifier si le user avec le username existe
        const user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(404).json({ error: "L'utilisateur existe deja" });
        }

        const newUser = await User.create({
            username,
            password,
            avatarConfig: avatar
        });

        const refuge = await Refuge.create({
            title: refugeName,
            emotion: vibe,
            story,
            userId: newUser.id
        });

        res.json({
            //sans mot de passe
            user: {
                id: newUser.id,
                username: newUser.username,
                avatarConfig: newUser.avatarConfig
            },
            refuge
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
