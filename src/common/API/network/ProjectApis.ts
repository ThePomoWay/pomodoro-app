import AuthService from "./AuthService";
import {
  createProjectEndpoint,
  createSectionEndpoint,
  createTaskEndpoint,
  deleteProjectEndpoint,
  deleteSectionEndpoint,
  getAllProjectEndpoint,
  projectChangeEndpoint,
  rearrangeTasksInProjectEndpoint,
  updateProjectEndpoint,
} from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function getAllProjectsApi() {
  let endpoint = getAllProjectEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );

  return NetworkService.get(endpoint, {});
}

export function createProjectApi(project) {
  let endpoint = createProjectEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );

  let body = {
    uid: AuthService.getUserId(),
    title: project.title,
    fid: project.fid,
  };

  return NetworkService.post(endpoint, {}, body);
}

export function deleteProjectApi(project) {
  let endpoint = deleteProjectEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{projectId}", project._id);

  return NetworkService.delete(endpoint);
}

export function updateProjectApi(project) {
  let endpoint = updateProjectEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{projectId}", project._id);
  return NetworkService.patch(
    endpoint,
    {},
    { ...project, uid: AuthService.getUserId() }
  );
}

export function createSectionApi(project, section) {
  let endpoint = createSectionEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{projectId}", project._id);
  return NetworkService.post(
    endpoint,
    {},
    { title: section.title, to: [], fid: section.fid }
  );
}

export function rearrangeTaskApi(obj) {
  let endpoint = rearrangeTasksInProjectEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{projectId}", obj.projectId)
    .replace("{taskId}", obj.taskId);
  return NetworkService.patch(
    endpoint,
    {},
    { source: obj.source, destination: obj.destination, isSame: obj.isSame }
  );
}

export function projectChangeApi(oldProjectId, newProjectId, taskId) {
  let endpoint = projectChangeEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{projectId}", newProjectId)
    .replace("{taskId}", taskId);
  return NetworkService.patch(
    endpoint,
    {},
    {
      source: { pid: oldProjectId },
      destination: { pid: newProjectId },
    }
  );
}

export function deleteSectionApi(projectId, sectionId) {
  let endpoint = deleteSectionEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{projectId}", projectId)
    .replace("{sectionId}", sectionId);
  return NetworkService.delete(endpoint, {}, {});
}
