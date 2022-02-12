import AuthService from "./AuthService";
import {
  createProjectEndpoint,
  createSectionEndpoint,
  createTaskEndpoint,
  deleteProjectEndpoint,
  getAllProjectEndpoint,
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
    .replace("{projectId}", project.id);

  return NetworkService.delete(endpoint);
}

export function updateProjectApi(project) {
  let endpoint = updateProjectEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{projectId}", project.id);
  return NetworkService.patch(
    endpoint,
    {},
    {
      title: project.title,
      uid: AuthService.getUserId(),
      _id: project.id,
      to: project.taskOrder,
    }
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
