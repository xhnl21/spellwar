<template>
    <div id="game">
        <ion-button v-if="showButton" @click="handleClickStart">Start</ion-button>
    </div>
</template>

<script lang="ts">
import { launch } from '../game/game.js';
import { defineComponent } from 'vue';
export default defineComponent({
    components: {},
    data() {
        return {
            showButton: true,
        }
    },
    created() { },
    mounted() { },
    methods: {
        handleClickStart() {
            // hides launch button
            this.showButton = false;

            // Runs the launch function
            launch();
        }
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