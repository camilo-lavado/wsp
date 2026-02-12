import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactTable } from '../components/ContactTable';
import { Contact } from '../db';

// Mock Lucide icons to avoid rendering issues
vi.mock('lucide-react', () => ({
  Send: () => <span data-testid="icon-send" />,
  CheckCircle: () => <span data-testid="icon-check" />,
  Clock: () => <span data-testid="icon-clock" />,
  AlertCircle: () => <span data-testid="icon-alert" />,
  Ban: () => <span data-testid="icon-ban" />,
  XCircle: () => <span data-testid="icon-x" />,
  MoreVertical: () => <span data-testid="icon-more" />,
  ChevronLeft: () => <span data-testid="icon-left" />,
  ChevronRight: () => <span data-testid="icon-right" />,
}));

const mockContacts: Contact[] = [
  { 
      id: '1', 
      data: { name: 'John Doe', _phoneDisplay: '+1 234 567', _isValid: true, _phoneE164: '+1234567' }, 
      status: 'pending', 
      sentAt: null 
  },
  { 
      id: '2', 
      data: { name: 'Jane Smith', _phoneDisplay: '+1 987 654', _isValid: true, _phoneE164: '+1987654' }, 
      status: 'sent', 
      sentAt: '2023-01-01T12:00:00Z' 
  }
];

describe('ContactTable Component', () => {
  it('renders contacts correctly', () => {
    render(
      <ContactTable 
        contacts={mockContacts} 
        onSend={vi.fn()} 
        onBlock={vi.fn()} 
        onBounce={vi.fn()} 
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('+1 234 567')).toBeInTheDocument();
  });

  it('handles send action', () => {
    const onSend = vi.fn();
    render(
      <ContactTable 
        contacts={mockContacts} 
        onSend={onSend} 
        onBlock={vi.fn()} 
        onBounce={vi.fn()} 
      />
    );

    // Find the send button for the first contact (pending)
    const sendBtns = screen.getAllByText('Send');
    fireEvent.click(sendBtns[0]);

    expect(onSend).toHaveBeenCalledWith(mockContacts[0]);
  });

  it('renders empty state', () => {
     render(
      <ContactTable 
        contacts={[]} 
        onSend={vi.fn()} 
        onBlock={vi.fn()} 
        onBounce={vi.fn()} 
      />
    );
    expect(screen.getByText('No contacts loaded.')).toBeInTheDocument();
  });
});
