/** Isolate private Git transport from inherited configuration, rewrites, helpers, and tracing. */
export function privateStateGitEnvironment({ source = process.env, tokenConfiguration = {}, localFixture = false } = {}) {
  const environment = {};
  for (const [name, value] of Object.entries(source)) {
    if (/^GIT_/i.test(name) || /^(?:GCM_|SSH_ASKPASS|SSH_ASKPASS_REQUIRE|PAGER$)/i.test(name)) continue;
    environment[name] = value;
  }
  Object.assign(environment, {
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_SYSTEM: '/dev/null', GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_COUNT: '0', GIT_TERMINAL_PROMPT: '0', GIT_ALLOW_PROTOCOL: localFixture ? 'file' : 'https',
    GIT_PROTOCOL_FROM_USER: '0', GIT_ATTR_NOSYSTEM: '1', GCM_INTERACTIVE: 'Never',
  });
  if (Object.keys(tokenConfiguration).length) {
    const fields = ['GIT_CONFIG_COUNT', 'GIT_CONFIG_KEY_0', 'GIT_CONFIG_VALUE_0'];
    if (Object.keys(tokenConfiguration).length !== fields.length || !fields.every((name) => Object.hasOwn(tokenConfiguration, name)) ||
      tokenConfiguration.GIT_CONFIG_COUNT !== '1' ||
      !/^http\.https:\/\/github\.com\/[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}\.git\.extraheader$/.test(tokenConfiguration.GIT_CONFIG_KEY_0) ||
      typeof tokenConfiguration.GIT_CONFIG_VALUE_0 !== 'string' || tokenConfiguration.GIT_CONFIG_VALUE_0.length > 16384 ||
      !/^AUTHORIZATION: basic [A-Za-z0-9+/]+={0,2}$/.test(tokenConfiguration.GIT_CONFIG_VALUE_0)) {
      throw Object.assign(new Error('Private Git accepts only its explicitly scoped runtime token configuration.'), { code: 'PRIVATE_STATE_ACCESS_INVALID' });
    }
    Object.assign(environment, tokenConfiguration);
  }
  return environment;
}

/** Command-line settings override repo defaults without persisting private credentials. */
export const PRIVATE_STATE_GIT_ARGUMENTS = Object.freeze([
  '--no-pager', '-c', 'core.hooksPath=/dev/null', '-c', 'http.followRedirects=false',
  '-c', 'protocol.allow=never', '-c', 'protocol.https.allow=always',
]);
