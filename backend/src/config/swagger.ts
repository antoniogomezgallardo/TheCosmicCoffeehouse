import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// OpenAPI 3.0 specification
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'The Cosmic Coffeehouse API',
      version: '1.1.0',
      description: `
# The Cosmic Coffeehouse API

Welcome to The Cosmic Coffeehouse API - a comprehensive e-commerce platform for superpower coffee capsules and quantum brewing machines.

## Features
- 🚀 **Authentication**: JWT-based user authentication
- ☕ **Products**: Extensive catalog of superpower coffee capsules and quantum machines
- 🛒 **Cart Management**: Session-based shopping cart functionality
- 📦 **Order Processing**: Complete order lifecycle management
- 📊 **Admin Dashboard**: Comprehensive observability and analytics
- 🔒 **Security**: Rate limiting, input validation, and security monitoring

## Getting Started
1. Register a new account using \`POST /api/auth/register\`
2. Login to get your JWT token using \`POST /api/auth/login\`
3. Explore products using \`GET /api/products/capsules\` or \`GET /api/products/machines\`
4. Add items to cart and create orders

## Authentication
Most endpoints require JWT authentication. Include your token in the Authorization header:
\`Authorization: Bearer <your-jwt-token>\`
      `,
      contact: {
        name: 'Antonio Gomez Gallardo',
        email: 'antonio@cosmiccoffeehouse.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.cosmiccoffeehouse.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for admin endpoints'
        }
      },
      schemas: {
        // Common Response Schemas
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            message: {
              type: 'string',
              description: 'Optional message describing the result'
            }
          },
          required: ['success']
        },
        ApiError: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  enum: [false]
                },
                error: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'string',
                      description: 'Error code'
                    },
                    message: {
                      type: 'string',
                      description: 'Error message'
                    },
                    details: {
                      type: 'object',
                      description: 'Additional error details'
                    }
                  }
                }
              }
            }
          ]
        },

        // Enum Definitions
        PowerType: {
          type: 'string',
          enum: ['mental', 'physical', 'mystical', 'temporal'],
          description: 'Type of superpower provided by the capsule'
        },
        Rarity: {
          type: 'string',
          enum: ['common', 'rare', 'epic', 'legendary'],
          description: 'Rarity level of the capsule'
        },
        MachineType: {
          type: 'string',
          enum: ['quantum', 'plasma', 'temporal', 'neural', 'cosmic', 'physical', 'mystical', 'elemental', 'portable'],
          description: 'Type of brewing machine'
        },
        PowerSource: {
          type: 'string',
          enum: ['quantum-cells', 'plasma-core', 'temporal-flux', 'dark-matter', 'antimatter', 'cosmic', 'bio-neural-cells', 'kinetic-generators', 'ethereal-crystals', 'temporal-cores', 'elemental-stones', 'compact-batteries'],
          description: 'Power source for the machine'
        },
        OrderStatus: {
          type: 'string',
          enum: ['pending', 'confirmed', 'processing', 'quantum-brewing', 'packaging', 'shipped', 'in-transit', 'delivered', 'cancelled', 'refunded'],
          description: 'Current status of the order'
        },

        // User Schema
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            username: {
              type: 'string',
              description: 'Unique username'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            powerLevel: {
              type: 'number',
              minimum: 1,
              maximum: 100,
              description: 'User power level (1-100)'
            },
            favoriteSuperpowers: {
              type: 'array',
              items: { $ref: '#/components/schemas/PowerType' },
              description: 'User favorite superpower types'
            },
            allergies: {
              type: 'array',
              items: { type: 'string' },
              description: 'User allergies'
            },
            maxIntensityTolerance: {
              type: 'number',
              minimum: 1,
              maximum: 10,
              description: 'Maximum intensity tolerance (1-10)'
            },
            registrationDate: {
              type: 'string',
              format: 'date-time',
              description: 'User registration date'
            },
            totalOrders: {
              type: 'number',
              description: 'Total number of orders placed'
            },
            loyaltyPoints: {
              type: 'number',
              description: 'Accumulated loyalty points'
            }
          }
        },

        // Capsule Schema
        Capsule: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique capsule identifier'
            },
            name: {
              type: 'string',
              description: 'Capsule name'
            },
            superpower: {
              type: 'string',
              description: 'Superpower granted by the capsule'
            },
            description: {
              type: 'string',
              description: 'Detailed capsule description'
            },
            powerType: { $ref: '#/components/schemas/PowerType' },
            duration: {
              type: 'string',
              description: 'Effect duration'
            },
            sideEffects: {
              type: 'array',
              items: { type: 'string' },
              description: 'Potential side effects'
            },
            rarity: { $ref: '#/components/schemas/Rarity' },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Price in credits'
            },
            requiredMachines: {
              type: 'array',
              items: { type: 'string' },
              description: 'Compatible machine types'
            },
            flavorProfile: {
              type: 'object',
              properties: {
                primary: { type: 'string' },
                secondary: { type: 'string' },
                notes: {
                  type: 'array',
                  items: { type: 'string' }
                }
              }
            },
            intensity: {
              type: 'number',
              minimum: 1,
              maximum: 10,
              description: 'Intensity level (1-10)'
            },
            energyRating: {
              type: 'number',
              minimum: 1,
              maximum: 10,
              description: 'Energy rating (1-10)'
            },
            quantumStability: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Quantum stability percentage'
            },
            discoveredBy: {
              type: 'string',
              description: 'Discoverer name'
            },
            discoveryDate: {
              type: 'string',
              format: 'date',
              description: 'Discovery date'
            },
            inStock: {
              type: 'number',
              minimum: 0,
              description: 'Available stock quantity'
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: 'Product image URL'
            },
            warnings: {
              type: 'array',
              items: { type: 'string' },
              description: 'Safety warnings'
            },
            views: {
              type: 'number',
              description: 'Number of views'
            },
            purchases: {
              type: 'number',
              description: 'Number of purchases'
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              description: 'Average rating (0-5)'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the capsule is active'
            }
          }
        },

        // Machine Schema
        Machine: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique machine identifier'
            },
            name: {
              type: 'string',
              description: 'Machine name'
            },
            machineModel: {
              type: 'string',
              description: 'Machine model identifier'
            },
            type: { $ref: '#/components/schemas/MachineType' },
            description: {
              type: 'string',
              description: 'Machine description'
            },
            capabilities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Machine capabilities'
            },
            compatibleCapsuleTypes: {
              type: 'array',
              items: { $ref: '#/components/schemas/PowerType' },
              description: 'Compatible capsule types'
            },
            powerSource: { $ref: '#/components/schemas/PowerSource' },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Price in credits'
            },
            dimensions: {
              type: 'object',
              properties: {
                width: { type: 'number' },
                height: { type: 'number' },
                depth: { type: 'number' },
                weight: { type: 'number' }
              }
            },
            specifications: {
              type: 'object',
              properties: {
                brewingPressure: { type: 'string' },
                quantumAmplification: { type: 'number' },
                stabilityField: { type: 'number' },
                maxPowerOutput: { type: 'number' }
              }
            },
            warranty: {
              type: 'string',
              description: 'Warranty period'
            },
            manufacturingDate: {
              type: 'string',
              format: 'date',
              description: 'Manufacturing date'
            },
            manufacturer: {
              type: 'string',
              description: 'Manufacturer name'
            },
            safetyRating: {
              type: 'number',
              minimum: 1,
              maximum: 10,
              description: 'Safety rating (1-10)'
            },
            efficiencyRating: {
              type: 'number',
              minimum: 1,
              maximum: 10,
              description: 'Efficiency rating (1-10)'
            },
            maintenanceInterval: {
              type: 'string',
              description: 'Maintenance interval'
            },
            inStock: {
              type: 'number',
              minimum: 0,
              description: 'Available stock quantity'
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: 'Product image URL'
            },
            manualUrl: {
              type: 'string',
              format: 'uri',
              description: 'Manual PDF URL'
            },
            views: {
              type: 'number',
              description: 'Number of views'
            },
            purchases: {
              type: 'number',
              description: 'Number of purchases'
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              description: 'Average rating (0-5)'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the machine is active'
            }
          }
        },

        // Cart Item Schema
        CartItem: {
          type: 'object',
          properties: {
            product: {
              oneOf: [
                { $ref: '#/components/schemas/Capsule' },
                { $ref: '#/components/schemas/Machine' }
              ]
            },
            productType: {
              type: 'string',
              enum: ['capsule', 'machine'],
              description: 'Type of product'
            },
            quantity: {
              type: 'number',
              minimum: 1,
              description: 'Quantity of items'
            }
          }
        },

        // Order Schema
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique order identifier'
            },
            userId: {
              type: 'string',
              description: 'User identifier or "guest"'
            },
            sessionId: {
              type: 'string',
              description: 'Session identifier'
            },
            orderNumber: {
              type: 'string',
              description: 'Human-readable order number'
            },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
              description: 'Ordered items'
            },
            total: {
              type: 'number',
              minimum: 0,
              description: 'Total order amount'
            },
            shippingAddress: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                street1: { type: 'string' },
                street2: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' },
                phone: { type: 'string' }
              }
            },
            status: { $ref: '#/components/schemas/OrderStatus' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation date'
            }
          }
        },

        // User Schemas
        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            username: {
              type: 'string',
              description: 'User unique username'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            powerLevel: {
              type: 'integer',
              description: 'User cosmic power level',
              default: 1
            }
          },
          required: ['id', 'email', 'username', 'firstName', 'lastName', 'powerLevel']
        },

        // Error Schemas
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Error code'
                },
                message: {
                  type: 'string',
                  description: 'Detailed error message'
                }
              }
            }
          },
          required: ['success', 'message']
        },

        // Admin Schemas
        SystemMetrics: {
          type: 'object',
          properties: {
            requestCount: {
              type: 'number',
              description: 'Total number of requests'
            },
            errorCount: {
              type: 'number',
              description: 'Total number of errors'
            },
            avgResponseTime: {
              type: 'number',
              description: 'Average response time in milliseconds'
            },
            requestsByEndpoint: {
              type: 'object',
              description: 'Request count by endpoint'
            },
            errorsByType: {
              type: 'object',
              description: 'Error count by type'
            },
            businessEvents: {
              type: 'object',
              description: 'Business events count'
            },
            systemInfo: {
              type: 'object',
              properties: {
                nodeVersion: { type: 'string' },
                platform: { type: 'string' },
                uptime: { type: 'number' },
                memoryUsage: { type: 'object' },
                timestamp: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Products',
        description: 'Product catalog management - capsules and machines'
      },
      {
        name: 'Cart',
        description: 'Shopping cart management'
      },
      {
        name: 'Orders',
        description: 'Order processing and management'
      },
      {
        name: 'Admin',
        description: 'Administrative endpoints for monitoring and analytics'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/models/*.ts'
  ]
};

// Generate OpenAPI specification
const specs = swaggerJsdoc(options);

// Custom CSS for Swagger UI
const customCss = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui { font-family: 'Segoe UI', Arial, sans-serif; }
  .swagger-ui .info { margin: 50px 0; }
  .swagger-ui .info .title { color: #4F46E5; font-size: 36px; }
  .swagger-ui .scheme-container { background: linear-gradient(90deg, #4F46E5, #7C3AED); color: white; }
  .swagger-ui .opblock .opblock-summary-method { min-width: 80px; }
  .swagger-ui .opblock.opblock-post { border-color: #10B981; background: rgba(16, 185, 129, 0.1); }
  .swagger-ui .opblock.opblock-get { border-color: #3B82F6; background: rgba(59, 130, 246, 0.1); }
  .swagger-ui .opblock.opblock-put { border-color: #F59E0B; background: rgba(245, 158, 11, 0.1); }
  .swagger-ui .opblock.opblock-delete { border-color: #EF4444; background: rgba(239, 68, 68, 0.1); }
`;

// Swagger UI options
const swaggerOptions = {
  customCss,
  customSiteTitle: 'The Cosmic Coffeehouse API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'none',
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

// Setup function to configure Swagger in Express app
export const setupSwagger = (app: Express): void => {
  // Serve API documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

  // Serve raw OpenAPI JSON
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export { specs };
export default specs;