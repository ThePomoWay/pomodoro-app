// Task APIs
export const createTaskEndpoint = "v1/user/{userId}/task";
export const getTodaysTaskEndpoint = "v1/user/{userId}/tasks";
export const updateTaskEndpoint = "v1/user/{userId}/task/{taskId}";
export const deleteTaskEndpoint = "v1/user/{userId}/task/{taskId}";
export const markTaskAsCompleteEndpoint =
  "v1/user/{userId}/task/{taskId}/complete";
export const markTaskAsIncompleteEndpoint =
  "v1/user/{userId}/task/{taskId}/incomplete";
export const getAllTasksEndpoint = "v1/user/{userId}/tasks";
export const createMultipleTasksEndpoint = "v1/user/{userId}/multiple-tasks";

//Todays Task APIs
export const addToTodaysTasksEndpoint = "v1/user/{userId}/today/{taskId}";
export const updateTodaysTasksEndpoint = "v1/user/{userId}/today/update";
export const getTodaysTasksEndpoint = "v1/user/{userId}/today";
export const removeFromTodaysTasksEndpoint = "v1/user/{userId}/today/{taskId}";

//Project APIs
export const createProjectEndpoint = "v1/user/{userId}/project";
export const deleteProjectEndpoint = "v1/user/{userId}/project/{projectId}";
export const updateProjectEndpoint = deleteProjectEndpoint;
export const rearrangeTasksInProjectEndpoint =
  "v1/user/{userId}/project/{projectId}/task/{taskId}/rearrange";
export const getAllProjectEndpoint = "v1/user/{userId}/project";
export const projectChangeEndpoint =
  "v1/user/{userId}/project/{projectId}/task/{taskId}/project-change";

//Section APIs
export const createSectionEndpoint =
  "v1/user/{userId}/project/{projectId}/section";
export const deleteSectionEndpoint =
  "v1/user/{userId}/project/{projectId}/section/{sectionId}";
export const updateSectionEndpoint = deleteSectionEndpoint;

//Login APIs
export const googleLoginEndpoint = "v1/google-login";
export const facebookLoginEndpoint = "v1/facebook-login";
export const registerEndpoint = "v1/register";
export const loginEndpoint = "v1/login";
export const requestPasswordChangeOTP = "v1/forgot-password";
export const resetPassword = "v1/reset-password";
export const registerCheckEndpoint = "v1/get-email-info";

//Stats APIs
export const updateStatsEndpoint = "v1/users/{userId}/stats";
export const updateMultipleStatsEndpoint = "v1/users/{userId}/multiple-stats";
export const getStatsEndpoint = updateStatsEndpoint;

//User APIs
export const getUserEndpoint = "v1/users/{userId}";
export const updateUserEndpoint = "v1/users/{userId}/update";

//Tags APIs
export const getAllTagsEndpoint = "v1/users/{userId}/labels";
export const createTagEndpoint = "v1/users/{userId}/labels";
export const updateTagEndpoint = "v1/users/{userId}/labels/{labelId}";
export const deleteTagEndpoint = "v1/users/{userId}/labels/{labelId}";

// sync APIs
export const syncEndpoint = "v1/users/{userId}/sync";

export const syncOfflineDataEndpoint = "v1/users/{userId}/sync-offline-data";
