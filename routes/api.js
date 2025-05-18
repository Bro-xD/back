//use require
const express = require("express");
const { User, Refuge } = require("../models");

const { Sequelize, Op } = require('sequelize');

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
    const { userId, elements, background, soundUrl } = req.body;

    try {
        // Crée un nouveau Refuge ou remplace l'existant pour cet user
        let refuge = await Refuge.findOne({ where: { userId } });
        if (refuge) {
            refuge = await refuge.update({ elements, background, soundUrl });
        } else {
            refuge = await Refuge.create({ userId, elements, background, soundUrl });
        }
        res.json(refuge);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/reaction/:refugeId', async (req, res) => {
    const { refugeId } = req.params;
    try {
        const refuge = await Refuge.findOne({ where: { id: refugeId } });
        if (!refuge) {
            return res.status(404).json({ error: "Refuge not found" });
        }

        res.json(refuge.reactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.get('/refuges/top', async (req, res) => {
    try {
        // Récupérer tous les refuges avec les utilisateurs associés
        const refuges = await Refuge.findAll({
            attributes: ['id', 'title', 'reactions'], // Limiter les champs récupérés
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'avatarConfig'],
                }
            ]
        })

        // Vérifier si des refuges existent
        if (!refuges.length) {
            return res.status(404).json({ message: 'No refuges found' });
        }

        // Formater et trier dans une boucle
        const formattedRefuges = refuges
            .map(refuge => ({
                id: refuge.id,
                name: refuge.title,
                reactionCount: Object.keys(JSON.parse(refuge.reactions) || {}).length, // Compter les réactions
                reactions: refuge.reactions || {},
                user: {
                    id: refuge.User.id,
                    username: refuge.User.username,
                    avatarConfig: refuge.User.avatarConfig
                }
            }))
            .sort((a, b) => b.reactionCount - a.reactionCount) // Trier par reactionCount décroissant
            .slice(0, 3); // Limiter aux 3 premiers

        res.json(formattedRefuges);
    } catch (err) {
        console.error('Erreur lors de la récupération des refuges :', err);
        res.status(500).json({ error: 'Failed to fetch refuges' });
    }
});

//sauvegarder une reaction
router.post('/reaction', async (req, res) => {
    console.log(req.body);
    const { emoji, userId, refugeId } = req.body;
    try {
        const refuge = await Refuge.findOne({ where: { id: refugeId } });
        if (!refuge) {
            return res.status(404).json({ error: "Refuge not found" });
        }

        let reactions = JSON.parse(refuge.reactions) || {};
        reactions[userId] = emoji;

        console.log(reactions);
        refuge.reactions = JSON.stringify(reactions);

        await refuge.save();

        res.json(refuge);
    } catch (err) {
        console.error("Erreur lors de la sauvegarde de la reaction :", err);
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
