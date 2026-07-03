export const DEFAULT_HOSTINGER_NODE_VERSION = 24;
export const SUPPORTED_HOSTINGER_NODE_VERSIONS = [24];

export function resolveHostingerNodeVersion(env = process.env) {
  const nodeVersion = Number(env.HOSTINGER_NODE_VERSION || env.npm_config_node_version || DEFAULT_HOSTINGER_NODE_VERSION);

  if (!Number.isInteger(nodeVersion) || !SUPPORTED_HOSTINGER_NODE_VERSIONS.includes(nodeVersion)) {
    throw new Error(
      `HOSTINGER_NODE_VERSION must be 24 for Access Free Tools deploys. Got: ${env.HOSTINGER_NODE_VERSION ?? env.npm_config_node_version ?? 'default'}.`,
    );
  }

  return nodeVersion;
}
