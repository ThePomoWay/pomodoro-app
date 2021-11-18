// Task APIs
export const createTaskEndpoint = 'v1/user/{userId}/task';
export const getTodaysTaskEndpoint = 'v1/user/{userId}/tasks';
export const updateTaskEndpoint = 'v1/user/{userId}/task/{taskId}';
export const deleteTaskEndpoint = 'v1/user/{userId}/task/{taskId}';

//Project APIs
export const createProjectEndpoint = 'v1/user/{userId}/project';
export const deleteProjectEndpoint = 'v1/user/{userId}/project/{projectId}';
export const updateProjectEndpoint = deleteProjectEndpoint;
export const createSectionEndpoint = 'v1/user/{userId}/project/{projectId}/section';
export const deleteSectionEndpoint = 'v1/user/{userId}/project/{projectId}/section/{sectionId}';
export const updateSectionEndpoint = deleteSectionEndpoint;
export const rearrangeTasksInProjectEndpoint = 'v1/user/{userId}/project/{projectId}/task/{taskId}/rearrange';
