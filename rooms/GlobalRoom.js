const {Room} = require('colyseus')
const { State } = require("./MyRoomState"); // Importer l'état de la room
const { Player } = require("./player"); // Importer la classe Player
const { Projectile } = require("./projectile")
const { v4: uuidv4 } = require('uuid');

class GlobalRoom extends Room {
    maxClients = 20; // Nombre max de joueurs

    onCreate() {
        console.log("🌍 Global Room créée");
        this.setState(new State());


        this.onMessage("move", (client, data) => {
            // Diffuser les positions à tout le monde
            this.broadcast("update", { id: client.sessionId, position: data.position });
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

        //quand un utilisateur tire un projectile
        this.onMessage("fireProjectile",(client,data)=>{
            // data doit contenir la position, la vélocité, etc.
            const projectileId = uuidv4();
            const projectile = new Projectile(projectileId);
            // Assigner la position de départ
            projectile.x = data.spawnPosition[0];
            projectile.y = data.spawnPosition[1];
            projectile.z = data.spawnPosition[2];

            // Assigner la vélocité
            projectile.vx = data.velocity[0];
            projectile.vy = data.velocity[1];
            projectile.vz = data.velocity[2];
            // On peut aussi définir d'autres propriétés, par exemple projectile.damage, projectile.lifetime, etc.

            projectile.id  = projectileId
            projectile.sender = client.sessionId

            // Ajouter le projectile dans l'état
            this.state.projectiles.set(projectileId, projectile);
        })

        //quelqu'un a été touché mdr
        this.onMessage("hit",(client,data)=>{

            console.log('Hit !!!')
            const { projectileId, targetId, shooterId } = data;
        
            if(client.sessionId == shooterId){
                // Récupérer la cible depuis l'état
                const target = this.state.players.get(targetId);
                const shooter = this.state.players.get(shooterId)

                if(target && shooter){
                    target.pv -= shooter.base_damage

                    if(target.pv <= 0){
                        target.pv = 0
                    }
                }

                this.state.projectiles.delete(projectileId)
            }

        })



        this.onMessage("chat", (client, message) => {
            this.broadcast("chat", { id: client.sessionId, message });
        });

        //simulation
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));
        
    }

    update(deltaTime){
        //update des projectiles
        for (const [id, projectile] of this.state.projectiles.entries()) {
            projectile.lifetime -= deltaTime / 1000;
            if (projectile.lifetime <= 0) {
                this.state.projectiles.delete(id);
                console.log(`Projectile ${id} supprimé après expiration.`);
            }
        }
    }

    onJoin(client) {
        // Ajouter le joueur à l'état de la room
        this.state.players.set(client.sessionId, new Player(client.sessionId));
        console.log(`👤 Joueur ${client.sessionId} rejoint la Global Room`);
    }

    onLeave(client) {
        this.state.players.delete(client.sessionId);
        console.log(`🚪 Joueur ${client.sessionId} a quitté la Global Room`);
    }

    // Lors de la fermeture de la room
    onDispose() {
        console.log("🔴 La room a été fermée");
    }
}

module.exports = GlobalRoom
