<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {ref} from 'vue';

import {useLogout} from '@/hooks/logout.hook';
import type {TaskModel} from '@/models/task.model';
import {TaskStatus} from "@/models/TaskStatus.model.ts"
import {TaskService} from '@/services/task.service';
import Loading from "@/components/Loading.vue";

const route = useRoute()
const logout = useLogout()
const router = useRouter()
const taskId = Number(route.params.id)
const task = ref<TaskModel>()
const statusOptions = Object.values(TaskStatus)
const isNewTask = isNaN(taskId)


TaskService.getTaskById(taskId)
	.then(rsp => task.value = rsp.data)
	.catch(e => logout(e))

function doUpdate() {
	TaskService.updateTask(taskId, task.value)
		.then(rsp => router.push('/tasks'))
		.catch(e => logout(e))
}

function doCreate() {
	TaskService.createTask(task.value)
		.then(rsp => router.push('/tasks'))
}

function doSubmit() {
	if (isNewTask) {
		doCreate()
	} else {
		doUpdate()
	}
}
</script>

<template>
	<div class="custom-form">
		<h3>Edit Task</h3>
		<div class="card" v-if="task">
			<div class="card-body">
				<form v-on:submit.prevent="doSubmit">
					<div class="mb-3" v-if="!isNewTask">
						<input type="hidden" class="form-control" id="id" :value="task.taskId" disabled>
					</div>
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
						<i class="fa-solid fa-floppy-disk"></i> Save
					</button>
				</form>
			</div>
		</div>
		<Loading v-else/>
	</div>
</template>

<style scoped>

</style>