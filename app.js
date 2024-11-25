const express = require('express');
const empresasRoutes = require('./src/routes/empresas');
const freelancersRoutes = require('./src/routes/Freelancers');  // Importa las rutas de freelancers

const app = express();
app.use(express.json());

// Rutas
app.use('/empresas', empresasRoutes);  // Rutas de empresas
app.use('/freelancers', freelancersRoutes);  // Rutas de freelancers

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
