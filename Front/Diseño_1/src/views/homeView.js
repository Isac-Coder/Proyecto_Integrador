// src/views/homeView.js

export function HomeView() {
    if (!document.getElementById('home-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'home-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = './styles/styles.css';
        document.head.appendChild(styleLink);
    }

    return `
        <div class="home-container">
            <!-- Barra de navegación pública superior -->
            <header class="public-nav">
                <div class="logo">Zoe Care</div>
                <nav class="nav-links">
                    <a href="#/">Acerca de</a>
                    <a href="#/">Servicios</a>
                    <a href="#/">Equipo</a>
                    <a href="#/">Contacto</a>
                </nav>
                <a href="#/login" class="btn-reservar">RESERVAR CITA</a>
            </header>

            <!-- Sección de Presentación Principal (Hero) -->
            <main class="hero-section">
                <div class="hero-content">
                    <h1>Presentamos Zoe Care, un colectivo de profesionales de la salud.</h1>
                    <p class="hero-subtitle">
                        Obtén atención accesible y personalizada de salud, ya sea en persona o desde la comodidad de tu hogar.
                    </p>
                </div>
                <div class="hero-image-placeholder">
                    <!-- Imagen de fondo controlada por CSS -->
                </div>
            </main>
        </div>
    `;
}
