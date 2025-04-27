<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { AuthService } from '@/services/auth.service';
import { MainService } from '@/services/main.service';

const username = ref<string>('')
const password = ref<string>('')
const router = useRouter()

function doLogin(e: Event) {
    e.preventDefault()

    if (username.value == '' || password.value == '') return

    MainService.login(username.value, password.value)
        .then(rsp => {
            AuthService.createAuth(rsp.data)
            router.push('/')
        })
        .catch(e => alert('Username or password invalid'))
}
</script>

<template>
    <div class="custom-form card">
        <div class="card-body">
            <div class="text-center">
                <h3>Task App</h3>
            </div>
            <form v-on:submit="e => doLogin(e)">
                <div class="mb-3">
                    <label for="username" class="form-label">Username :</label>
                    <input type="text" class="form-control" id="username" v-model="username">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password :</label>
                    <input type="password" class="form-control" id="password" v-model="password">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
</template>