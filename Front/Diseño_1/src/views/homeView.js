// src/views/homeView.js

export function HomeView() {
    if (!document.getElementById('home-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'home-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = 'views/zoe-landing/style.css';
        document.head.appendChild(styleLink);
    }

    return `
        <header class="main-header">
            <div class="container header-container">
                <a href="#/" class="logo">
                    <svg class="logo-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.22c-2.18-.76-3.41-2.13-3.41-4.04 0-2.31 1.76-4.18 4.41-4.18 2.65 0 4.41 1.87 4.41 4.18 0 1.91-1.23 3.28-3.41 4.04M12 9v6" />
                    </svg>
                    <span class="logo-text">Zoe Care</span>
                </a>
                
                <nav class="main-nav" aria-label="Navegación principal">
                    <ul>
                        <li><a href="#acerca-de">Acerca de</a></li>
                        <li><a href="#equipo">Equipo</a></li>
                        <li><a href="#contacto">Contáctanos</a></li>
                    </ul>
                </nav>

                <div class="header-actions">
                    <a href="#/login" class="btn btn-primary">INGRESAR</a>
                </div>
            </div>
        </header>

        <main>
            <section class="hero" id="inicio">
                <div class="container hero-container">
                    <div class="hero-content">
                        <h1>Zoe Care</h1>
                        <p class="hero-lead">
                            Conectamos cuidadores y pacientes para una gestión de información más segura, organizada y humana.
                        </p>
                        <div class="hero-buttons">
                            <a href="#contacto" class="btn btn-accent">Comenzar ahora</a>
                            <a href="#acerca-de" class="btn btn-outline">Conocer más</a>
                        </div>
                    </div>
                    <div class="hero-image">
                        <img src="views/zoe-landing/images/zoe-hero.jpg" alt="Doctora sonriendo mientras sostiene la mano de su paciente en un espacio cálido y con plantas">
                    </div>
                </div>
            </section>

            <section class="about" id="acerca-de" aria-labelledby="about-title">
                <div class="container about-container">
                    <div class="about-content">
                        <span class="section-tag">ACERCA DE</span>
                        <h2 id="about-title">Acerca de Zoe Care</h2>
                        <p>
                            Zoe Care es una plataforma digital que facilita la interacción entre pacientes y cuidadores, centralizando la información médica y permitiendo un seguimiento continuo y eficiente.
                        </p>
                        <p>
                            Nuestro objetivo es reducir la carga administrativa, mejorar la comunicación y brindar tranquilidad a quienes más lo necesitan.
                        </p>
                        <div class="about-quote">
                            <span class="quote-icon">🌱</span>
                            <blockquote class="quote-text">
                                Cuidado que conecta, tecnología que acompaña.
                            </blockquote>
                        </div>
                    </div>
                    <div class="about-image">
                        <img src="views/zoe-landing/images/acerca-de-zoe.jpg" alt="Primer plano de dos personas sosteniéndose las manos como símbolo de apoyo y cuidado">
                    </div>
                </div>
            </section>

            <section class="features" aria-label="Características de la plataforma">
                <div class="container grid-3-cols">
                    <article class="card-feature">
                        <div class="feature-icon" aria-hidden="true">🔒</div>
                        <h3>Información segura</h3>
                        <p>Centraliza y protege los datos médicos para que siempre estén disponibles cuando los necesites.</p>
                    </article>

                    <article class="card-feature">
                        <div class="feature-icon" aria-hidden="true">💬</div>
                        <h3>Comunicación eficiente</h3>
                        <p>Facilita la comunicación entre pacientes, cuidadores y profesionales de la salud en tiempo real.</p>
                    </article>

                    <article class="card-feature">
                        <div class="feature-icon" aria-hidden="true">📈</div>
                        <h3>Seguimiento continuo</h3>
                        <p>Monitorea la evolución del paciente con registros actualizados y alertas personalizadas.</p>
                    </article>
                </div>
            </section>

            <section class="how-it-works" aria-labelledby="how-title">
                <div class="container text-center">
                    <span class="section-tag">¿CÓMO FUNCIONA?</span>
                    <h2 id="how-title">Un proceso simple, un cuidado mejor</h2>
                    
                    <div class="steps-timeline">
                        <div class="step-item">
                            <div class="step-icon">👤</div>
                            <h3>1. Paciente</h3>
                            <p>El paciente registra su información médica de forma fácil y segura.</p>
                        </div>
                        <div class="step-item">
                            <div class="step-icon">👥</div>
                            <h3>2. Cuidador</h3>
                            <p>El cuidador accede y gestiona el cuidado diario del paciente.</p>
                        </div>
                        <div class="step-item">
                            <div class="step-icon">🩺</div>
                            <h3>3. Profesional / Médico</h3>
                            <p>El profesional revisa la información clínica y actualiza recomendaciones.</p>
                        </div>
                        <div class="step-item">
                            <div class="step-icon">📄</div>
                            <h3>4. Información centralizada</h3>
                            <p>Toda la información está organizada y disponible en un solo lugar.</p>
                        </div>
                        <div class="step-item">
                            <div class="step-icon">🔔</div>
                            <h3>5. Seguimiento</h3>
                            <p>Recibe recordatorios y alertas para un seguimiento oportuno.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="team" id="equipo" aria-labelledby="team-title">
                <div class="container text-center">
                    <span class="section-tag">NUESTRO EQUIPO</span>
                    <h2 id="team-title">Las personas detrás de Zoe Care</h2>
                    
                    <div class="grid-4-cols">
                        <article class="team-card">
                            <div class="team-avatar">
                                <img src="views/zoe-landing/images/juan-b.webp" alt="Juan Bolivar">
                            </div>
                            <h3>Juan Bolivar</h3>
                            <p class="role">Frontend Developer</p>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn de Juan Bolivar">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </article>

                        <article class="team-card">
                            <div class="team-avatar">
                                <img src="views/zoe-landing/images/ale-.webp" alt="Alejandra Jiménez, Frontend Developer">
                            </div>
                            <h3>Alejandra Jimenez</h3>
                            <p class="role">Frontend Developer</p>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn de Alejandra Jiménez">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </article>

                        <article class="team-card">
                            <div class="team-avatar">
                                <img src="views/zoe-landing/images/sebastian-zoe.webp" alt="Sebastián Ortiz, Scrum Master">
                            </div>
                            <h3>Sebastian Ortiz</h3>
                            <p class="role">Scrum Master</p>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn de Sebastián Ortiz">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </article>

                        <article class="team-card">
                            <div class="team-avatar">
                                <img src="views/zoe-landing/images/isaac-zoe.webp" alt="Juan Pablo Gómez, Database Specialist">
                            </div>
                            <h3>Isaac Valdes</h3>
                            <p class="role">Backend Developer</p>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn de Maryuris Movilla">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </article>

                        <article class="team-card">
                            <div class="team-avatar">
                                <img src="views/zoe-landing/images/maru-.jpg" alt="Maryuris Movilla, Frontend Developer">
                            </div>
                            <h3>Maryuris Movilla</h3>
                            <p class="role">Frontend Developer</p>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn de Isaac Valdes">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </article>

                        <article class="team-card">
                            <div class="team-avatar">
                                <img src="views/zoe-landing/images/luis-m.jpg" alt="Juan Pablo Gómez, Database Specialist">
                            </div>
                            <h3>Luis Medrano</h3>
                            <p class="role">Backend Developer</p>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn de Luis Medrano">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </article>
                    </div>
                </div>
            </section>

            <section class="contact" id="contacto" aria-labelledby="contact-title">
                <div class="container contact-container">
                    <div class="contact-info">
                        <span class="section-tag">CONTÁCTO</span>
                        <h2 id="contact-title">¿Tienes preguntas? Estamos aquí para ayudarte.</h2>
                        <div class="contact-list">
                            <li>
                                <div class="icon">📍</div>
                                <div>
                                    <strong>Ubicación</strong>
                                    <address>Calle Principal 123, Ciudad</address>
                                </div>
                            </li>
                            <li>
                                <div class="icon">✉️</div>
                                <div>
                                    <strong>Email</strong>
                                    <a href="mailto:contacto@zoecare.com">contacto@zoecare.com</a>
                                </div>
                            </li>
                            <li>
                                <div class="icon">📞</div>
                                <div>
                                    <strong>Teléfono</strong>
                                    <a href="tel:+123456789">+1 234 567 89</a>
                                </div>
                            </li>
                        </div>
                    </div>

                    <div class="contact-form-container">
                        <form class="contact-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="sr-only" for="contact-name">Nombre</label>
                                    <input type="text" id="contact-name" placeholder="Nombre completo">
                                </div>
                                <div class="form-group">
                                    <label class="sr-only" for="contact-email">Correo</label>
                                    <input type="email" id="contact-email" placeholder="Correo electrónico">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="contact-message">Mensaje</label>
                                <textarea id="contact-message" rows="5" placeholder="Cuéntanos cómo podemos ayudarte"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Enviar mensaje</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>

        <footer class="main-footer">
            <div class="container footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <svg class="logo-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.22c-2.18-.76-3.41-2.13-3.41-4.04 0-2.31 1.76-4.18 4.41-4.18 2.65 0 4.41 1.87 4.41 4.18 0 1.91-1.23 3.28-3.41 4.04M12 9v6" />
                        </svg>
                        <span class="logo-text">Zoe Care</span>
                    </div>
                    <p>Conectamos el cuidado con la tecnología para mejorar vidas.</p>
                </div>

                <nav class="footer-nav" aria-label="Navegación del pie de página">
                    <h4>Navegación</h4>
                    <ul>
                        <li><a href="#acerca-de">Acerca de</a></li>
                        <li><a href="#equipo">Equipo</a></li>
                        <li><a href="#contacto">Contáctanos</a></li>
                    </ul>
                </nav>

                <div class="footer-legal">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="#">Términos</a></li>
                        <li><a href="#">Privacidad</a></li>
                    </ul>
                </div>

                <div class="footer-socials">
                    <h4>Síguenos</h4>
                    <div class="social-icons">
                        <a href="#" aria-label="Facebook">FB</a>
                        <a href="#" aria-label="Instagram">IG</a>
                        <a href="#" aria-label="LinkedIn">IN</a>
                    </div>
                </div>
            </div>
            <div class="container footer-bottom">
                <p>&copy; 2026 Zoe Care. Todos los derechos reservados. <span>❤️</span></p>
            </div>
        </footer>
    `;
}
