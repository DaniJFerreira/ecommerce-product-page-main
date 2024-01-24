
import { changeQuantityCart } from "../app/utils/changeQuantityCart";

describe('changeQuantityCart', () => {
    test('should increase the quantity of the product in the cart when the plus button is clicked', () => {
      const product_id = 'abc123';
      const cart = [{ product_id, quantity: 1 }];
  
      changeQuantityCart(product_id, 'plus');
  
      expect(cart).toEqual([{ product_id, quantity: 2 }]);
    });
  
    test('should decrease the quantity of the product in the cart when the minus button is clicked', () => {
      const product_id = 'abc123';
      const cart = [{ product_id, quantity: 2 }];
  
      changeQuantityCart(product_id, 'minus');
  
      expect(cart).toEqual([{ product_id, quantity: 1 }]);
    });
  
    test('should remove the product from the cart when the quantity is decreased to zero', () => {
      const product_id = 'abc123';
      const cart = [{ product_id, quantity: 1 }];
  
      changeQuantityCart(product_id, 'minus');
  
      expect(cart).toEqual([]);
    });
  });