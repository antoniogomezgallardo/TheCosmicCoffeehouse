import request from 'supertest';
import express from 'express';
import cartRoutes from '../../routes/cart.routes';

describe('Cart Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/cart', cartRoutes);
  });

  describe('GET /api/cart/:sessionId', () => {
    describe('Happy Path', () => {
      it('should return empty cart for new session', async () => {
        const sessionId = 'new_session_123';

        const response = await request(app)
          .get(`/api/cart/${sessionId}`)
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          data: []
        });
      });

      it('should return cart contents for existing session', async () => {
        const sessionId = 'existing_session_456';

        // First add an item to the cart
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: 'capsule_123',
              productType: 'capsule',
              name: 'Test Capsule'
            },
            quantity: 2
          });

        // Then retrieve the cart
        const response = await request(app)
          .get(`/api/cart/${sessionId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toMatchObject({
          product: {
            id: 'capsule_123',
            productType: 'capsule',
            name: 'Test Capsule'
          },
          productType: 'capsule',
          quantity: 2
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle special characters in session ID', async () => {
        const sessionId = 'session_with_special-chars_123!@#';

        const response = await request(app)
          .get(`/api/cart/${encodeURIComponent(sessionId)}`)
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          data: []
        });
      });

      it('should handle very long session ID', async () => {
        const sessionId = 'a'.repeat(1000);

        const response = await request(app)
          .get(`/api/cart/${sessionId}`)
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          data: []
        });
      });
    });
  });

  describe('POST /api/cart/add', () => {
    describe('Happy Path', () => {
      it('should add new item to empty cart', async () => {
        const sessionId = 'test_session_add_1';
        const product = {
          id: 'capsule_456',
          productType: 'capsule',
          name: 'Cosmic Blend',
          price: 15.99
        };

        const response = await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product,
            quantity: 1
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toMatchObject({
          product,
          productType: 'capsule',
          quantity: 1
        });
      });

      it('should add multiple items to cart', async () => {
        const sessionId = 'test_session_add_2';

        // Add first item
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: 'capsule_1',
              productType: 'capsule',
              name: 'Capsule 1'
            },
            quantity: 2
          });

        // Add second item
        const response = await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: 'machine_1',
              productType: 'machine',
              name: 'Coffee Machine 1'
            },
            quantity: 1
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      it('should increase quantity when adding existing item', async () => {
        const sessionId = 'test_session_add_3';
        const product = {
          id: 'capsule_789',
          productType: 'capsule',
          name: 'Energy Boost'
        };

        // Add item first time
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product,
            quantity: 2
          });

        // Add same item again
        const response = await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product,
            quantity: 3
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].quantity).toBe(5); // 2 + 3
      });

      it('should default quantity to 1 if not provided', async () => {
        const sessionId = 'test_session_add_4';
        const product = {
          id: 'capsule_default',
          productType: 'capsule',
          name: 'Default Quantity Capsule'
        };

        const response = await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product
          })
          .expect(200);

        expect(response.body.data[0].quantity).toBe(1);
      });

      it('should default productType to capsule if not provided', async () => {
        const sessionId = 'test_session_add_5';
        const product = {
          id: 'product_no_type',
          name: 'Product Without Type'
        };

        const response = await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product
          })
          .expect(200);

        expect(response.body.data[0].productType).toBe('capsule');
      });
    });

    describe('Error Cases', () => {
      it('should handle missing sessionId gracefully', async () => {
        const response = await request(app)
          .post('/api/cart/add')
          .send({
            product: {
              id: 'test_product',
              productType: 'capsule'
            }
          })
          .expect(200);

        // When sessionId is undefined, it creates a cart with undefined key
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
      });

      it('should handle missing product', async () => {
        const response = await request(app)
          .post('/api/cart/add')
          .send({
            sessionId: 'test_session'
          })
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
      });

      it('should handle invalid JSON', async () => {
        const response = await request(app)
          .post('/api/cart/add')
          .send('invalid json')
          .expect(500);

        expect(response.body.success).toBe(false);
      });
    });

    describe('Business Logic', () => {
      it('should distinguish between same product with different types', async () => {
        const sessionId = 'test_session_types';
        const productId = 'same_id_123';

        // Add as capsule
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: productId,
              productType: 'capsule',
              name: 'Product as Capsule'
            },
            quantity: 2
          });

        // Add as machine (same ID, different type)
        const response = await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: productId,
              productType: 'machine',
              name: 'Product as Machine'
            },
            quantity: 1
          })
          .expect(200);

        expect(response.body.data).toHaveLength(2);
        expect(response.body.data.find((item: any) => item.productType === 'capsule')?.quantity).toBe(2);
        expect(response.body.data.find((item: any) => item.productType === 'machine')?.quantity).toBe(1);
      });

      it('should handle large quantities', async () => {
        const sessionId = 'test_session_large_qty';
        const largeQuantity = 999;

        const response = await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: 'bulk_product',
              productType: 'capsule'
            },
            quantity: largeQuantity
          })
          .expect(200);

        expect(response.body.data[0].quantity).toBe(largeQuantity);
      });
    });
  });

  describe('PUT /api/cart/update', () => {
    describe('Happy Path', () => {
      it('should update item quantity', async () => {
        const sessionId = 'test_session_update_1';
        const productId = 'product_to_update';

        // Add item first
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: productId,
              productType: 'capsule'
            },
            quantity: 3
          });

        // Update quantity
        const response = await request(app)
          .put('/api/cart/update')
          .send({
            sessionId,
            productId,
            quantity: 5
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data[0].quantity).toBe(5);
      });

      it('should remove item when quantity is 0', async () => {
        const sessionId = 'test_session_update_2';
        const productId = 'product_to_remove';

        // Add item first
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: productId,
              productType: 'capsule'
            },
            quantity: 2
          });

        // Update quantity to 0 (should remove)
        const response = await request(app)
          .put('/api/cart/update')
          .send({
            sessionId,
            productId,
            quantity: 0
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });

      it('should remove item when quantity is negative', async () => {
        const sessionId = 'test_session_update_3';
        const productId = 'product_negative_qty';

        // Add item first
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: {
              id: productId,
              productType: 'capsule'
            },
            quantity: 3
          });

        // Update quantity to negative (should remove)
        const response = await request(app)
          .put('/api/cart/update')
          .send({
            sessionId,
            productId,
            quantity: -1
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });
    });

    describe('Edge Cases', () => {
      it('should handle updating non-existent item', async () => {
        const sessionId = 'test_session_update_4';

        const response = await request(app)
          .put('/api/cart/update')
          .send({
            sessionId,
            productId: 'non_existent_product',
            quantity: 5
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });

      it('should handle updating item in non-existent cart', async () => {
        const response = await request(app)
          .put('/api/cart/update')
          .send({
            sessionId: 'non_existent_session',
            productId: 'some_product',
            quantity: 2
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });
    });

    describe('Error Cases', () => {
      it('should handle missing required fields gracefully', async () => {
        const response = await request(app)
          .put('/api/cart/update')
          .send({
            sessionId: 'test_session'
            // Missing productId and quantity
          })
          .expect(200);

        // The route handles undefined values gracefully
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });
    });
  });

  describe('DELETE /api/cart/remove/:sessionId/:productId', () => {
    describe('Happy Path', () => {
      it('should remove specific item from cart', async () => {
        const sessionId = 'test_session_remove_1';
        const productId1 = 'product_keep';
        const productId2 = 'product_remove';

        // Add two items
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: { id: productId1, productType: 'capsule' },
            quantity: 2
          });

        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: { id: productId2, productType: 'capsule' },
            quantity: 3
          });

        // Remove one item
        const response = await request(app)
          .delete(`/api/cart/remove/${sessionId}/${productId2}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].product.id).toBe(productId1);
      });

      it('should handle removing all items individually', async () => {
        const sessionId = 'test_session_remove_2';
        const productId = 'only_product';

        // Add item
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: { id: productId, productType: 'capsule' },
            quantity: 1
          });

        // Remove the only item
        const response = await request(app)
          .delete(`/api/cart/remove/${sessionId}/${productId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });
    });

    describe('Edge Cases', () => {
      it('should handle removing non-existent item', async () => {
        const sessionId = 'test_session_remove_3';

        const response = await request(app)
          .delete(`/api/cart/remove/${sessionId}/non_existent_product`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });

      it('should handle removing from non-existent session', async () => {
        const response = await request(app)
          .delete('/api/cart/remove/non_existent_session/some_product')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });

      it('should handle special characters in parameters', async () => {
        const sessionId = 'session-with-special!@#$%';
        const productId = 'product_with_special!@#$%';

        const response = await request(app)
          .delete(`/api/cart/remove/${encodeURIComponent(sessionId)}/${encodeURIComponent(productId)}`)
          .expect(200);

        expect(response.body.success).toBe(true);
      });
    });

    describe('Error Cases', () => {
      it('should handle server errors gracefully', async () => {
        // Test with malformed parameters that might cause errors
        await request(app)
          .delete('/api/cart/remove//') // Empty parameters
          .expect(404); // Route not found due to empty params
      });
    });
  });

  describe('POST /api/cart/clear', () => {
    describe('Happy Path', () => {
      it('should clear cart with items', async () => {
        const sessionId = 'test_session_clear_1';

        // Add multiple items
        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: { id: 'product1', productType: 'capsule' },
            quantity: 2
          });

        await request(app)
          .post('/api/cart/add')
          .send({
            sessionId,
            product: { id: 'product2', productType: 'machine' },
            quantity: 1
          });

        // Clear cart
        const response = await request(app)
          .post('/api/cart/clear')
          .send({ sessionId })
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          message: 'Cart cleared'
        });

        // Verify cart is empty
        const getResponse = await request(app)
          .get(`/api/cart/${sessionId}`)
          .expect(200);

        expect(getResponse.body.data).toHaveLength(0);
      });

      it('should clear empty cart without errors', async () => {
        const sessionId = 'test_session_clear_2';

        const response = await request(app)
          .post('/api/cart/clear')
          .send({ sessionId })
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          message: 'Cart cleared'
        });
      });

      it('should clear non-existent session without errors', async () => {
        const response = await request(app)
          .post('/api/cart/clear')
          .send({ sessionId: 'non_existent_session' })
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          message: 'Cart cleared'
        });
      });
    });

    describe('Error Cases', () => {
      it('should handle missing sessionId', async () => {
        const response = await request(app)
          .post('/api/cart/clear')
          .send({})
          .expect(200); // Route doesn't validate sessionId, just tries to delete undefined

        expect(response.body.success).toBe(true);
      });
    });
  });

  describe('Integration Tests - Full Cart Workflow', () => {
    it('should handle complete shopping cart lifecycle', async () => {
      const sessionId = 'full_workflow_session';

      // 1. Start with empty cart
      let response = await request(app)
        .get(`/api/cart/${sessionId}`)
        .expect(200);
      expect(response.body.data).toHaveLength(0);

      // 2. Add first item
      response = await request(app)
        .post('/api/cart/add')
        .send({
          sessionId,
          product: { id: 'capsule1', productType: 'capsule', name: 'Energy Blend' },
          quantity: 3
        })
        .expect(200);
      expect(response.body.data).toHaveLength(1);

      // 3. Add second item
      response = await request(app)
        .post('/api/cart/add')
        .send({
          sessionId,
          product: { id: 'machine1', productType: 'machine', name: 'Coffee Machine Pro' },
          quantity: 1
        })
        .expect(200);
      expect(response.body.data).toHaveLength(2);

      // 4. Update first item quantity
      response = await request(app)
        .put('/api/cart/update')
        .send({
          sessionId,
          productId: 'capsule1',
          quantity: 5
        })
        .expect(200);
      expect(response.body.data.find((item: any) => item.product.id === 'capsule1')?.quantity).toBe(5);

      // 5. Remove second item
      response = await request(app)
        .delete(`/api/cart/remove/${sessionId}/machine1`)
        .expect(200);
      expect(response.body.data).toHaveLength(1);

      // 6. Add same item again (should increase quantity)
      response = await request(app)
        .post('/api/cart/add')
        .send({
          sessionId,
          product: { id: 'capsule1', productType: 'capsule', name: 'Energy Blend' },
          quantity: 2
        })
        .expect(200);
      expect(response.body.data[0].quantity).toBe(7); // 5 + 2

      // 7. Clear entire cart
      response = await request(app)
        .post('/api/cart/clear')
        .send({ sessionId })
        .expect(200);

      // 8. Verify cart is empty
      response = await request(app)
        .get(`/api/cart/${sessionId}`)
        .expect(200);
      expect(response.body.data).toHaveLength(0);
    });

    it('should handle concurrent session operations', async () => {
      const session1 = 'concurrent_session_1';
      const session2 = 'concurrent_session_2';

      // Add items to both sessions simultaneously
      const [response1, response2] = await Promise.all([
        request(app)
          .post('/api/cart/add')
          .send({
            sessionId: session1,
            product: { id: 'product1', productType: 'capsule' },
            quantity: 2
          }),
        request(app)
          .post('/api/cart/add')
          .send({
            sessionId: session2,
            product: { id: 'product2', productType: 'machine' },
            quantity: 1
          })
      ]);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      // Verify sessions are isolated
      const [cart1, cart2] = await Promise.all([
        request(app).get(`/api/cart/${session1}`),
        request(app).get(`/api/cart/${session2}`)
      ]);

      expect(cart1.body.data).toHaveLength(1);
      expect(cart2.body.data).toHaveLength(1);
      expect(cart1.body.data[0].product.id).toBe('product1');
      expect(cart2.body.data[0].product.id).toBe('product2');
    });
  });

  describe('Performance Tests', () => {
    it('should handle rapid cart operations', async () => {
      const sessionId = 'performance_test_session';
      const operations = [];

      // Create 10 rapid add operations
      for (let i = 0; i < 10; i++) {
        operations.push(
          request(app)
            .post('/api/cart/add')
            .send({
              sessionId,
              product: { id: `product_${i}`, productType: 'capsule' },
              quantity: 1
            })
        );
      }

      const responses = await Promise.all(operations);

      // All operations should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // Final cart should have all items
      const finalCart = await request(app)
        .get(`/api/cart/${sessionId}`)
        .expect(200);

      expect(finalCart.body.data).toHaveLength(10);
    });
  });
});