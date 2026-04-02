import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Footer Component', () => {
  it('renders the 93Moove logo text', () => {
    render(<Footer />);
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Moove')).toBeInTheDocument();
  });

  it('contains the description text', () => {
    render(<Footer />);
    const description = screen.getByText(/Association d'activités sportives, manuelles et culturelles/i);
    expect(description).toBeInTheDocument();
  });

  it('has navigation links for Resources', () => {
    render(<Footer />);
    expect(screen.getByText('Sessions')).toHaveAttribute('href', '/sessions');
    expect(screen.getByText('À propos')).toHaveAttribute('href', '/propos');
  });

  it('displays the correct copyright year', () => {
    render(<Footer />);
    // The component hardcodes © 2026
    expect(screen.getByText(/© 2026/i)).toBeInTheDocument();
  });
});
