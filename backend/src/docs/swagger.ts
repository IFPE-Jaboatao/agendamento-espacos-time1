import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API - Agendamento de Espaços",
      version: "1.0.0",
      description: "Documentação da API do sistema"
    },

    servers: [
      {
        url: "http://localhost:3000/api"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: [
    "./src/routes/*.ts"
  ]
};

export const swaggerSpec = swaggerJsdoc(options);