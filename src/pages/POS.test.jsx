// src/pages/POS.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import POS from './POS';

// 1. MOCK THE DATABASE: Intercept Supabase calls and return fake data
vi.mock('../services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            { id: 1, name: 'Paracetamol', price: 10, stock: 5, type: 'Medicine' },
            { id: 2, name: 'Blood Pressure Check', price: 15, stock: 0, type: 'Service' }
          ],
          error: null
        }))
      }))
    }))
  }
}));

describe('POS Component', () => {
  
  // 2. THE TEST: Check if products load and cart math works
  it('adds items to the cart and calculates the correct grand total', async () => {
    
    // Arrange: Render the POS page
    render(<POS />);

    // Wait for the fake products to load onto the screen
    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    });

    // Act: Find the "Add" buttons
    const addButtons = screen.getAllByText('Add');
    
    // Click "Add" on Paracetamol (Price: 10)
    fireEvent.click(addButtons[0]); 
    // Click "Add" on Blood Pressure Check (Price: 15)
    fireEvent.click(addButtons[1]); 

    // Assert: Verify the Cart Total is exactly $25.00
    // We expect the text "$25.00" to be on the screen (10 + 15)
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  // 3. THE "UNHAPPY PATH" TEST: Out of stock prevention
  it('prevents adding medicines that are out of stock', async () => {
    
    // We mock window.alert because our POS uses an alert box for out-of-stock items
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<POS />);

    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Add');
    
    // Paracetamol has a stock of 5. Let's click it 6 times!
    for (let i = 0; i < 6; i++) {
      fireEvent.click(addButtons[0]);
    }

    // Verify the alert was triggered with our exact error message
    expect(alertMock).toHaveBeenCalledWith('Cannot add more than available stock!');
    
    // Clean up our mock so it doesn't mess up other tests
    alertMock.mockRestore();
  });

});