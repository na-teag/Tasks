<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {ref} from 'vue';

import {useLogout} from '@/hooks/logout.hook';
import {TaskStatus} from "@/models/TaskStatus.model.ts"
import {TaskService} from '@/services/task.service';

const logout = useLogout()
const router = useRouter()
const task = ref({
	title: "",
	description: "",
	status: TaskStatus.PENDING,
})
const statusOptions = Object.values(TaskStatus)

function doCreate() {
	TaskService.createTask(task.value)
		.then(rsp => router.push('/tasks'))
}
</script>

<template>
	<div class="custom-form">
		<h3>Edit Task</h3>
		<div class="card">
			<div class="card-body">
				<form v-on:submit.prevent="doCreate">
					<div class="mb-3">
						<label for="title" class="form-label">Title :</label>
						<input type="text" class="form-control" id="title" v-model="task.title" required>
					</div>
					<div class="mb-3">
						<label for="description" class="form-label">Description :</label>
						<input type="text" class="form-control" id="description" v-model="task.description" required>
					</div>
					<div class="mb-3">
						<label for="description" class="form-label">Status:</label>
						<select v-model="task.status" required>
							<option v-for="status in statusOptions" :value="status">
								{{ status }}
							</option>
						</select>
					</div>
					<button class="btn btn-primary">
						<i class="fa-solid fa-floppy-disk"></i> Create
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>