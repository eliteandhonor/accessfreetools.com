function npmConfigName(name) {
  return `npm_config_${name.replace(/^-+/, '').replaceAll('-', '_')}`;
}

export function optionValue(name, {
  argv = process.argv.slice(2),
  env = process.env,
} = {}) {
  const inline = argv.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);

  const index = argv.indexOf(name);
  if (index >= 0) return argv[index + 1] ?? '';

  return env[npmConfigName(name)] ?? '';
}

export function hasFlag(name, {
  argv = process.argv.slice(2),
  env = process.env,
} = {}) {
  if (argv.includes(name)) return true;

  const value = String(env[npmConfigName(name)] ?? '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(value)) return true;

  if (name.startsWith('--no-')) {
    const positiveConfigName = npmConfigName(`--${name.slice('--no-'.length)}`);
    if (Object.hasOwn(env, positiveConfigName)) {
      const positiveValue = String(env[positiveConfigName] ?? '').trim().toLowerCase();
      return ['', '0', 'false', 'no', 'off'].includes(positiveValue);
    }
  }

  return false;
}
