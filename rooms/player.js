const schema = require("@colyseus/schema");

class Player extends schema.Schema {
    constructor(sessionId, userId, username, isOwner) {
        super();
        this.sessionId = sessionId;
        this.userId = userId;
        this.username = username;
        this.isOwner = isOwner;
        this.avatarConfig = '';
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.rotation = 0;
        this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Couleur aléatoire
    }
}

// Définir les types pour Player
schema.defineTypes(Player, {
    sessionId: "string",
    userId: "string",
    username: "string",
    isOwner: "boolean",
    avatarConfig: "string",
    x: "number",
    y: "number",
    z: "number",
    vx: "number",
    vy: "number",
    vz: "number",
    rotation: "number",
    color: "string",
});

module.exports = { Player };