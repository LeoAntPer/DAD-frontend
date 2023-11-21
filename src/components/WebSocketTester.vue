<script setup>
import { ref, inject } from 'vue'
import {useToast} from 'vue-toast-notification';

const socket = inject('socket')
const toast = useToast()

const message = ref('DAD Intermediate Submission')
const responseData = ref('')

const send = () => {
    socket.emit('sent', message.value)
    
}

socket.on('echo', (received) => {
    responseData.value = received
    toast.success(`${responseData.value} RECEIVED`)
})

        


</script>

<template>
    <div class="my-5">
        <h2>Web Socket Tester</h2>

        <form>
            <div class="mb-3">
                <label for="message" class="form-label">Message:</label>
                <input type="text" class="form-control" id="message" v-model="message">
            </div>
            <button @click.prevent="send" type="submit" class="btn btn-primary">Send</button>
            <div class="my-5" v-if="responseData">
                <label for="exampleFormControlTextarea1" class="form-label">Response</label>
                <textarea :value="responseData" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
        </form>
    </div>
</template>