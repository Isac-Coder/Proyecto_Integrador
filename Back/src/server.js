const { app } = require('./app');

// Permite cambiar el puerto desde el entorno sin modificar el código.
const PORT = process.env.PORT || 3001;

// Inicia el servidor HTTP que expone la API configurada en app.js.
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
