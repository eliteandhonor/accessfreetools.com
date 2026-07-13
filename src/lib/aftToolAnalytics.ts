export const AFT_TOOL_ACTION_EVENT = 'aft:tool-action';

export interface AftToolActionDetail {
  action: string;
  category: string;
  clarityEvent?: string;
  toolName: string;
  toolSlug: string;
}

interface AnalyticsEventTarget {
  dispatchEvent: (event: Event) => boolean;
}

export function emitAftToolAction(
  detail: AftToolActionDetail,
  target: AnalyticsEventTarget | null | undefined = globalThis.document,
) {
  if (!target) return false;

  return target.dispatchEvent(
    new CustomEvent<AftToolActionDetail>(AFT_TOOL_ACTION_EVENT, { detail }),
  );
}
