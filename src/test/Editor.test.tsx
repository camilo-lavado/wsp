import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Editor } from '../components/Editor';
import { db } from '../db';

// Mock DB and Toast
vi.mock('../db', () => ({
  db: {
    getCampaign: vi.fn(),
    getTemplates: vi.fn(),
    updateCampaign: vi.fn(),
    saveTemplate: vi.fn(),
    isBlacklisted: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}));

// Mock sub-components
vi.mock('../components/EditorHeader', () => ({
    EditorHeader: ({ campaignName }: any) => <div>Header: {campaignName}</div>
}));
vi.mock('../components/MessageEditor', () => ({
    MessageEditor: () => <textarea data-testid="message-editor"></textarea>
}));

describe('Editor Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders and loads campaign data', async () => {
        (db.getCampaign as any).mockResolvedValue({
            id: 1,
            name: 'Test Campaign',
            contacts: [],
            template: 'Hello'
        });
        (db.getTemplates as any).mockResolvedValue([]);

        render(<Editor campaignId={1} onBack={vi.fn()} />);

        expect(db.getCampaign).toHaveBeenCalledWith(1);
        expect(await screen.findByText('Header: Test Campaign')).toBeInTheDocument();
    });
});
