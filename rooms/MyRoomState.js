const schema = require("@colyseus/schema");
const { Player } = require("./player");

class RefugeElement extends schema.Schema {
    constructor(id, type, value, positionX, positionY, positionZ, size) {
        super();
        this.id = id;
        this.type = type;
        this.value = value;
        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;
        this.size = size;
    }
}

schema.defineTypes(RefugeElement, {
    id: "number",
    type: "string",
    value: "string",
    positionX: "number",
    positionY: "number",
    positionZ: "number",
    size: "number",
});

class Refuge extends schema.Schema {
    constructor(data) {
        super();
        this.userId = data.userId;
        this.title = data.title;
        this.emotion = data.emotion;
        this.primaryColor = data.primaryColor;
        this.secondaryColor = data.secondaryColor;
        this.emoji = data.emoji;
        this.sceneType = data.sceneType;
        this.soundUrl = data.soundUrl;
        this.story = data.story;
        this.backgroundUrl = data.backgroundUrl;
        this.logoGradient = data.logoGradient;
    }
}

schema.defineTypes(Refuge, {
    userId: "string",
    title: "string",
    emotion: "string",
    primaryColor: "string",
    secondaryColor: "string",
    emoji: "string",
    sceneType: "string",
    soundUrl: "string",
    story: "string",
    backgroundUrl: "string",
    logoGradient: ["string"], // Tableau de chaînes pour les gradients
});

class State extends schema.Schema {
    constructor() {
        super();
        this.players = new schema.MapSchema(); // MapSchema pour les joueurs
        this.elements = new schema.ArraySchema(); // ArraySchema pour les éléments
        this.refuge = null; // RefugeSchema pour les données du refuge
    }
}

schema.defineTypes(State, {
    players: { map: Player },
    elements: [RefugeElement],
    refuge: Refuge,
});

module.exports = { State, RefugeElement, Refuge };