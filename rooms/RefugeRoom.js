const { Room } = require('colyseus');
const { State, RefugeElement, Refuge } = require("./MyRoomState");
const { Player } = require("./player");
const db = require("../models");

class RefugeRoom extends Room {
    maxClients = 20;

    onCreate(options) {
        console.log(`🌍 Refuge Room créée pour userId: ${options.userId}`);
        this.setState(new State());
        this.state.refugeId = options.userId; // Stocké séparément car non sérialisé

        this.loadRefugeData(options.userId);

        this.onMessage("update-element", (client, data) => {
            this.broadcast("update-element", { id: client.sessionId, ...data });
        });

        this.onMessage("add-element", async (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (player && player.isOwner) {
                try {
                    const refuge = await db.Refuge.findOne({ where: { userId: this.state.refugeId } });
                    const element = await db.RefugeElement.create({
                        refugeId: refuge.id,
                        type: data.type,
                        value: data.value,
                        positionX: data.positionX,
                        positionY: data.positionY,
                        positionZ: data.positionZ,
                        size: data.size,
                    });
                    const elementData = new RefugeElement(
                        element.id,
                        element.type,
                        element.value,
                        element.positionX,
                        element.positionY,
                        element.positionZ,
                        element.size
                    );
                    this.state.elements.push(elementData);
                    this.broadcast("element-added", elementData);
                } catch (error) {
                    console.error("❌ Erreur lors de l'ajout d'élément :", error);
                }
            }
        });

        this.onMessage("playerMove", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.x = data.x;
                player.y = data.y;
                player.z = data.z;
                player.vx = data.vx;
                player.vy = data.vy;
                player.vz = data.vz;
                player.rotation = data.rotation;
            }
        });
    }

    async loadRefugeData(userId) {
        try {
            const refuge = await db.Refuge.findOne({ where: { userId } });
            if (!refuge) throw new Error("Refuge non trouvé");

            // Initialiser refuge dans l'état
            this.state.refuge = new Refuge({
                userId: refuge.userId,
                title: refuge.title,
                emotion: refuge.emotion,
                primaryColor: refuge.primaryColor,
                secondaryColor: refuge.secondaryColor,
                emoji: refuge.emoji,
                sceneType: refuge.sceneType,
                soundUrl: refuge.soundUrl,
                story: refuge.story,
                backgroundUrl: refuge.backgroundUrl,
            });
        } catch (error) {
            console.error("❌ Erreur lors du chargement du refuge :", error);
        }
    }

    async onJoin(client, options) {
        const userId = options.currentUserId;
        try {
            const user = await db.User.findOne({ where: { id: userId }, include: [db.Refuge] });
            if (!user) throw new Error("Utilisateur non trouvé");

            const player = new Player(client.sessionId, userId, user.username, userId === this.state.refugeId);
            player.avatarConfig = user.avatarConfig;
            player.vibe = user.Refuge.emotion;
            this.state.players.set(client.sessionId, player);

            console.log(`👤 Joueur ${client.sessionId} (${player.username}) rejoint la Refuge Room ${this.state.refugeId}`);
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout du joueur :", error);
            client.send("error", "Impossible de rejoindre la room");
            client.leave();
        }
    }

    onLeave(client) {
        this.state.players.delete(client.sessionId);
        console.log(`🚪 Joueur ${client.sessionId} a quitté la Refuge Room ${this.state.refugeId}`);
    }

    onDispose() {
        console.log(`🔴 Refuge Room ${this.state.refugeId} fermée`);
    }
}

module.exports = RefugeRoom;