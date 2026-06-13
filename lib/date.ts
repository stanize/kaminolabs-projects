// Returns a date string (YYYY-MM-DD) for "today" in local time.
export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Number of whole days between a stored date (YYYY-MM-DD) and today.
export function daysAgo(dateString: string): number {
  const [y, m, d] = dateString.split('-').map(Number);
  const then = new Date(y, (m || 1) - 1, d || 1);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = todayMidnight.getTime() - then.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

// Human-readable label for the "days ago" badge.
export function daysAgoLabel(dateString: string): string {
  const n = daysAgo(dateString);
  if (n === 0) return 'today';
  if (n === 1) return '1 day ago';
  return `${n} days ago`;
}

// Color band: green (fresh), amber (getting stale), red (neglected).
export type StalenessBand = 'fresh' | 'aging' | 'stale';

export function stalenessBand(dateString: string): StalenessBand {
  const n = daysAgo(dateString);
  if (n <= 2) return 'fresh';
  if (n <= 6) return 'aging';
  return 'stale';
}
