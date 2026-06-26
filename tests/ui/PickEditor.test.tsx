import React from 'react';
import { render, screen } from '@testing-library/react';
import PickEditor from '../../src/web/components/PickEditor';

describe('PickEditor', () => {
  it('disables input when round is in progress and shows banner', () => {
    const now = Date.now();
    const round = {
      id: 'r1',
      start_time: new Date(now - 1000).toISOString(),
      end_time: new Date(now + 100000).toISOString(),
    };
    const pick = { id: 'p1', selection: 'A', roundId: 'r1' };
    render(<PickEditor pick={pick} round={round} />);

    const textarea = screen.getByLabelText('Pick selection') as HTMLTextAreaElement;
    expect(textarea).toBeDisabled();

    expect(screen.getByRole('status')).toHaveTextContent('Picks are locked while the round is in progress');
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('allows editing when round not in progress', () => {
    const now = Date.now();
    const round = {
      id: 'r1',
      start_time: new Date(now + 100000).toISOString(),
      end_time: new Date(now + 200000).toISOString(),
    };
    const pick = { id: 'p1', selection: 'A', roundId: 'r1' };
    render(<PickEditor pick={pick} round={round} />);

    const textarea = screen.getByLabelText('Pick selection') as HTMLTextAreaElement;
    expect(textarea).not.toBeDisabled();
    expect(screen.queryByRole('status')).toBeNull();
  });
});
