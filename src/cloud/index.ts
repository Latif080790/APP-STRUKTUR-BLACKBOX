/**
 * Cloud Features Module
 * Entry point for multi-user collaboration and cloud storage capabilities
 */

export { 
  CloudServiceEngine, 
  createCloudServiceEngine,
  CloudUtils
} from './CloudServiceEngine';

export type {
  CloudConfig,
  CloudUser,
  CloudPermissions,
  CloudProject,
  CloudProjectMetadata,
  CollaborationEvent,
  ProjectComment,
  SyncUpdate,
  CloudFile,
  CloudResponse,
  CloudListResponse
} from './CloudServiceEngine';

export { default as CloudCollaborationInterface } from './CloudCollaborationInterface';