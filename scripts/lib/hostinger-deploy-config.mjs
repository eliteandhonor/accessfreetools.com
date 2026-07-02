export const DEFAULT_HOSTINGER_NODE_VERSION = 24;
export const SUPPORTED_HOSTINGER_NODE_VERSIONS = [18, 20, 22, 24];

export function resolveHostingerNodeVersion(env = process.env) {
  const nodeVersion = Number(env.HOSTINGER_NODE_VERSION || env.npm_config_node_version || DEFAULT_HOSTINGER_NODE_VERSION);

  if (!Number.isInteger(nodeVersion) || !SUPPORTED_HOSTINGER_NODE_VERSIONS.includes(nodeVersion)) {
    throw new Error(
      `Unsupported Hostinger Node version: ${nodeVersion}. Expected one of ${SUPPORTED_HOSTINGER_NODE_VERSIONS.join(', ')}.`,
    );
  }

  return nodeVersion;
}
