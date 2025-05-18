const schema = require("@colyseus/schema");

class Projectile extends schema.Schema {
    constructor(id) {
        super();
        this.x = 0;         // Position X initiale
        this.y = 0;         // Position Y initiale
        this.z = 0;         // Position Z initiale
        this.vx = 0;        // Vélocité en X
        this.vy = 0;        // Vélocité en Y
        this.vz = 0;        // Vélocité en Z
        this.id = id;       // Identifiant unique
        this.rotation = 0;  // Rotation (si nécessaire)
        this.damage = 50;   // Exemple de dégâts
        this.lifetime = 2;  // Durée de vie en secondes
        this.sender = "" // l'ID de la session du joueur qui a envoyer la projectile
        this.speed = 30 // 30 unités par seconde
    }
}

// Définir les types pour Projectile
schema.defineTypes(Projectile, {
    x: "number",
    y: "number",
    z: "number",
    vx: "number",
    vy: "number",
    vz: "number",
    id: "string",
    rotation: "number",
    damage: "number",
    lifetime: "number",
    sender:"string",
    speed:"number"
});

module.exports = { Projectile };
