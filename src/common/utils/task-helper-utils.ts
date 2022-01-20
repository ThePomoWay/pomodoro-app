export function processBETask(task) {
    return {
        ...task,
        labels: task.labels || []
    }
}