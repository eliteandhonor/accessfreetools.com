// Native details keep the server-rendered links usable when JavaScript is unavailable.
export function enhanceSiteNavigation(navigation: HTMLElement) {
  if (navigation.dataset.navigationReady) return;
  const trigger = navigation.querySelector<HTMLButtonElement>('.site-menu-toggle');
  const panel = navigation.querySelector<HTMLElement>('[data-navigation-panel]');
  if (!trigger || !panel) return;

  const groups = [...navigation.querySelectorAll<HTMLDetailsElement>('[data-navigation-group]')];
  const mobile = window.matchMedia('(max-width: 900px)');
  let expanded = false;
  let focusedControl: Element | null = null;

  const closeGroups = () => groups.forEach((group) => { group.open = false; });
  const setExpanded = (next: boolean) => {
    expanded = next && mobile.matches;
    trigger.setAttribute('aria-expanded', String(expanded));
    panel.hidden = mobile.matches && !expanded;
    if (!expanded) closeGroups();
  };

  trigger.addEventListener('click', () => setExpanded(!expanded));
  navigation.addEventListener('focusin', (event) => {
    if (event.target instanceof Element) focusedControl = event.target;
  });
  navigation.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a[href]')) setExpanded(false);
  });
  navigation.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    if (mobile.matches && expanded) {
      event.preventDefault();
      setExpanded(false);
      trigger.focus();
      return;
    }
    const group = event.target instanceof Element
      ? event.target.closest<HTMLDetailsElement>('[data-navigation-group][open]')
      : null;
    if (group) {
      event.preventDefault();
      group.open = false;
      group.querySelector<HTMLElement>('summary')?.focus();
    }
  });

  groups.forEach((group) => {
    group.addEventListener('toggle', () => {
      if (group.open) groups.forEach((other) => { if (other !== group) other.open = false; });
    });
    group.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && !group.contains(event.relatedTarget)) group.open = false;
    });
  });
  navigation.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof Node && !navigation.contains(event.relatedTarget)) {
      focusedControl = null;
      setExpanded(false);
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (!event.composedPath().includes(navigation)) {
      focusedControl = null;
      setExpanded(false);
    }
  });
  mobile.addEventListener('change', () => {
    // Responsive CSS may hide the focused toggle before this event is delivered.
    const focused = document.activeElement === document.body ? focusedControl : document.activeElement;
    const focusWillHide = mobile.matches && focused instanceof Node && panel.contains(focused);
    const focusedGroup = focused instanceof Element
      ? focused.closest<HTMLDetailsElement>('[data-navigation-group][open]')
      : null;
    setExpanded(false);
    if (focusWillHide) trigger.focus();
    else if (!mobile.matches && focused === trigger) panel.querySelector<HTMLAnchorElement>('a')?.focus();
    else if (focusedGroup) focusedGroup.querySelector<HTMLElement>('summary')?.focus();
  });

  setExpanded(false);
  navigation.dataset.navigationReady = 'true';
  trigger.hidden = false;
}
