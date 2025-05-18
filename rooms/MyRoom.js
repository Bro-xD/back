const {Room} = require('colyseus')

class MyRoom extends Room {
    onCreate(options) {
        console.log("🚀 Room créée :", this.roomId);
    }

    onJoin(client) {
        console.log(`📌 Joueur connecté : ${client.sessionId}`);
    }

    onLeave(client) {
        console.log(`❌ Joueur déconnecté : ${client.sessionId}`);
    }

    onDispose() {
        console.log("🗑️ Room supprimée !");
    }
}

module.exports = MyRoom
