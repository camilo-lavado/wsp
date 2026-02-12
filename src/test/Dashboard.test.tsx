import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard';
import { db } from '../db';
import { BrowserRouter } from 'react-router-dom';

// Mock DB
vi.mock('../db', () => ({
  db: {
    getAllCampaigns: vi.fn(),
    createCampaign: vi.fn(),
    deleteCampaign: vi.fn(),
  }
}));

// Mock child components that are not focus of this test but needed for render
vi.mock('../components/DashboardHeader', () => ({
  DashboardHeader: ({ onNewCampaign, onOpenBlacklist }: any) => (
    <div data-testid="dashboard-header">
      <button onClick={onNewCampaign}>New Campaign</button>
      <button onClick={onOpenBlacklist}>Blacklist</button>
    </div>
  )
}));

vi.mock('../components/CampaignCard', () => ({
  CampaignCard: ({ campaign }: any) => <div data-testid="campaign-card">{campaign.name}</div>
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders properties and loads campaigns', async () => {
    // Mock return value
    (db.getAllCampaigns as any).mockResolvedValue([
      { id: 1, name: 'Campaign 1', contacts: [] },
      { id: 2, name: 'Campaign 2', contacts: [] }
    ]);

    render(<Dashboard onSelectCampaign={vi.fn()} onOpenBlacklist={vi.fn()} />);

    // Check if loading happened (useEffect)
    expect(db.getAllCampaigns).toHaveBeenCalled();
    
    // Since it's async, valid campaigns might take a tick. 
    // Wait for them to appear
    const items = await screen.findAllByTestId('campaign-card');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Campaign 1')).toBeInTheDocument();
  });

  it('opens modal on new campaign', async () => {
    (db.getAllCampaigns as any).mockResolvedValue([]);
    
    render(<Dashboard onSelectCampaign={vi.fn()} onOpenBlacklist={vi.fn()} />);
    
    const newBtn = screen.getByText('New Campaign');
    fireEvent.click(newBtn);
    
    expect(screen.getByText('Create New Campaign')).toBeInTheDocument();
  });
});
