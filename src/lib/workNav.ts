/**
 * Where a project detail was opened from.
 *
 * The detail page has two very different ways back:
 *
 * - It was opened from the home carousel, so "Back" is a shared-element flight
 *   into the card that is still sitting in the track.
 * - It was opened from another project ("Next project"), so "Back" is the
 *   previous detail and must slide sideways, with no card to wait for.
 *
 * The origin travels in the history entry's own state (`location.state`), so
 * each entry keeps the right answer even after a back/forward hop or a reload.
 * `workHomeSteps` counts how many pushes away from home the entry sits, which
 * lets "Back to selected work" pop straight home from a chain of projects in
 * one transition instead of replaying every intermediate detail.
 */
export interface WorkNavState {
  workFrom: "home" | "work";
  workFromPath: string;
  workHomeSteps?: number;
}

export function readWorkNavState(state: unknown): WorkNavState | null {
  if (!state || typeof state !== "object") return null;
  const value = state as Partial<WorkNavState>;
  if (value.workFrom !== "home" && value.workFrom !== "work") return null;
  if (typeof value.workFromPath !== "string") return null;
  return {
    workFrom: value.workFrom,
    workFromPath: value.workFromPath,
    workHomeSteps:
      typeof value.workHomeSteps === "number" && value.workHomeSteps > 0
        ? value.workHomeSteps
        : undefined,
  };
}

/** State for a card clicked in the home carousel. */
export function workOpenedFromHome(homePath: string): WorkNavState {
  return {
    workFrom: "home",
    workFromPath: homePath,
    workHomeSteps: 1,
  };
}

/** State for "Next project", one entry deeper than the current one. */
export function workOpenedFromWork(
  fromPath: string,
  current: WorkNavState | null,
): WorkNavState {
  return {
    workFrom: "work",
    workFromPath: fromPath,
    workHomeSteps:
      typeof current?.workHomeSteps === "number"
        ? current.workHomeSteps + 1
        : undefined,
  };
}
