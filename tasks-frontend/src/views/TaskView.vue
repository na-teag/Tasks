<script setup lang="ts">
import Loading from '@/components/Loading.vue';
import {useLogout} from '@/hooks/logout.hook';
import type {TaskModel} from '@/models/task.model';
import {TaskService} from '@/services/task.service';
import {TaskStatus} from "@/models/TaskStatus.model.ts";
import {ref} from 'vue';
import Router from "@/router";

const logout = useLogout()

	const tasks = ref<TaskModel[]>()
	TaskService.getTask()
		.then(rsp => tasks.value = rsp.data)
		.catch(e => logout(e))

	function doDelete(task: TaskModel) {
		if (!confirm(`Are you sure you want to delete ${task.title} ?`)) return
		TaskService.deleteTask(task.taskId)
			.then(rsp => tasks.value = tasks.value?.filter(t => t.taskId !== task.taskId))
			//.catch(e => logout(e))
	}
</script>

<template>
	<div class="container">
		<h3>Tasks</h3>
		<button class="btn btn-sm btn-primary" @click="Router.push('/task/create')">Create a task</button>
		<div v-if="tasks && tasks.length===0">
			<p style="margin: 100px">You do not have any task for the moment.</p>
		</div>
		<div class="wrapper mb-3" v-if="tasks" style="margin-left: 5%">
			<div class="card mb-3" v-for="task of tasks" :key="task.taskId">
				<div class="cursor card-body" @click="Router.push(`/task/modify/${task.taskId}`)">
					<h5 class="card-title">{{ task.title }}</h5>
					<p>{{ task.status }}</p>
					<p class="card-text" v-if="task.description">{{ task.description }}</p>
				</div>
				<div class="delete" v-if="task.status === TaskStatus.DONE">
					<i class="cursor fa-solid fa-trash fa-xl" @click="doDelete(task)"></i>
				</div>
			</div>
		</div>
		<Loading v-else />
	</div>
</template>

<style scoped>
	.container {
		margin-left: 10%;
		margin-right: 20%;
		margin-top: 10px
	}

	.card {
		display: grid;
		grid-template-columns: 1fr 50px;
	}

	.delete {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 15px;
	}

	.btn {
		margin-left: 5%;
		margin-bottom: 10px;
	}

	.cursor:hover {
		cursor: pointer;
	}
</style>