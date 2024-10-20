<template>
    <div id="game">
        <ion-button v-if="showButton" @click="handleClickStart">Start</ion-button><br>
        <!-- <ion-input v-model="text"></ion-input><br>
        <ion-button @click="send">send</ion-button> -->
    </div>
</template>

<script lang="ts">
import { io } from 'socket.io-client';
import { launch } from '../game/game.js';
import clientSocketIO from '../game/clientSocket.js';
import { defineComponent } from 'vue';
export default defineComponent({
    components: {},
    data() {
        return {
            showButton: true,
            text:'',
            socket: null as any,
        }
    },
    created() {
        // this.init();
    },
    mounted() { 
        console.log('mounted');
        
        let socketClientGame = new clientSocketIO();
        socketClientGame.connectionGame();
    },
    methods: {
        handleClickStart() {
            // hides launch button
            this.showButton = false;

            // Runs the launch function
            launch();
        },
        init() {
            this.socket = io('http://192.168.31.79:3000'); // Cambia esto al puerto de tu servidor
            // console.log(this.socket);


            // Eliminar el evento 'message' del socket
            this.socket.off('message');
                            
            // Agregar el evento 'chat message' al socket
            this.socket.on('message', (msg) => {
                console.log('Received message:', msg);
            });  
        },
        send() {
            console.log(this.text);
            
            this.socket.emit('message', this.text);
            this.text = '';
        },
    },
    computed: {},
    watch: {},
});
</script>

<style scoped>
#game {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
}
</style>