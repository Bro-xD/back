const express = require("express");
const { Server } = require("colyseus");
const { WebSocketTransport } = require("@colyseus/ws-transport");
const { createServer } = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");
const RefugeRoom = require('./rooms/RefugeRoom');

dotenv.config();

const app = express();
app.use(cors());

const server = createServer(app);

// Préparation du serveur Colyseus
const gameServer = new Server({
    transport: new WebSocketTransport({
        server,
        pingInterval: 5000,
        pingMaxRetries: 3,
    }),
});

app.use(express.json());

// Ajout de la route API
app.use('/api', require('./routes/api'));

// Définir les rooms Colyseus
gameServer.define("refuge-room", RefugeRoom);

const PORT = process.env.PORT || 3000;

// Connexion et synchronisation Sequelize
db.sequelize.authenticate()
    .then(() => {
        console.log("✅ Connexion à la base de données réussie");
        return db.sequelize.sync();
    })
    .then(() => {
        console.log("📦 Base de données synchronisée");
        gameServer.listen(PORT, {
            server,
        });
        console.log(`🚀 Colyseus en écoute sur ws://localhost:${PORT}`);
    })
    .catch((err) => {
        console.error("❌ Erreur de démarrage : ", err);
    });