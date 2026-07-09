# Proyecto_Integrador

TREE

PROYECTO_INTEGRADOR/
│
├── public/                    # Archivos estáticos globales
│   ├── favicon.svg          
│   └── icons.svg            
│
└── src/                       # Código fuente de la SPA
    ├── assets/              
    │   └── images/            # Logos e ilustraciones de ZOE-CARE
    │
    ├── components/            # Componentes HTML compartidos
    │   ├── Sidebar.js         
    │   └── PatientCard.js     
    │
    ├── controllers/           # Lógica de comportamiento y eventos
    │   ├── login.controller.js
    │   ├── registroPaciente.controller.js
    │   ├── paciente.controller.js
    │   ├── cuidador.controller.js
    │   └── profesional.controller.js
    │
    ├── router/              
    │   └── router.js          # Cambia de URL y gestiona qué CSS inyectar
    │
    ├── services/              # Peticiones al backend (Fetch API)
    │   ├── auth.service.js    
    │   └── paciente.service.js 
    │
    ├── styles/                # ORGANIZACIÓN DE ESTILOS CSS PURO
    │   ├── global.css         # Estilos compartidos (fuentes, reset, colores base)
    │   ├── login.css          # Tu diseño moderno Lila Galáctico
    │   ├── registro.css       # Estilos para formularios de ingreso de datos
    │   ├── paciente.css       # Estilos de la ficha clínica del paciente
    │   ├── cuidador.css       # Panel de alertas y medicación del cuidador
    │   └── profesional.css    # Interfaz médica avanzada
    │
    ├── views/                 # Funciones JS que retornan el HTML modular
    │   ├── loginView.js       
    │   ├── registroPacienteView.js 
    │   ├── pacienteView.js    
    │   ├── cuidadorView.js    
    │   ├── profesionalView.js 
    │   └── notFoundView.js    
    │
    ├── index.html             # HTML base único de la SPA
    └── main.js                # Archivo de arranque del proyecto
