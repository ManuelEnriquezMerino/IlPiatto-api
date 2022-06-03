const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Il Piatto API",
        version: "1.0",
        description:
          "API para clientes de Il Piatto",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Manuel Enriquez Merino",
          email: "manuel_em7@hotmail.com",
        },
      },
      components:{
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      servers: [
        {
          url: "http://il-piatto-api.herokuapp.com/",
        },
      ],
    },
    apis: ["./src/routes/pedido.routes.js","./src/routes/plato.routes.js","./src/routes/usuario.routes.js"],
  };

module.exports = options