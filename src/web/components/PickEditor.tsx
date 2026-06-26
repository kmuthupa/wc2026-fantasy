import React, { useMemo, useState } from 'react';
import axios from 'axios';

type Round = {
  id: string;
  start_time?: string | null;
  end_time?: string | null;
};

type Pick = {
  id: string;
  selection: string;
  roundId: string;
};

type Props = {
  pick: Pick;
  round: Round;
  onSaved?: (pick: Pick) => void;
};

export default function PickEditor({ pick, round, onSaved }: Props) {
  const [selection, setSelection] = useState(pick.selection);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const now = Date.now();
  const start = round.start_time ? Date.parse(round.start_time) : undefined;
  const end = round.end_time ? Date.parse(round.end_time) : undefined;

  const inProgress = useMemo(() => {
    if (!start || !end) return false;
    return now >= start && now < end;
  }, [now, start, end]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      const res = await axios.put(`/api/picks/${pick.id}`, { selection, roundId: pick.roundId });
      setSaving(false);
      if (onSaved) onSaved(res.data);
    } catch (err: any) {
      setSaving(false);
      if (err.response?.status === 403 && err.response?.data?.code === 'ROUND_LOCKED') {
        setError('Picks are locked while the round is in progress. Please try after the round ends.');
      } else {
        setError('Failed to save pick.');
      }
    }
  }

  return (
    <div className="pick-editor">
      {inProgress && end && (
        <div className="locked-banner" role="status">
          Picks are locked while the round is in progress. Reopens at: {new Date(end).toLocaleString()}
        </div>
      )}

      <textarea
        value={selection}
        onChange={(e) => setSelection(e.target.value)}
        disabled={inProgress || saving}
        aria-label="Pick selection"
      />

      <div className="actions">
        <button onClick={save} disabled={inProgress || saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
}
