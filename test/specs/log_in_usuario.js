const { remote } = require('webdriverio');

class AppiumTestAutomatizado {
    constructor() {
        this.driver = null;
    }

    // --- Configuración Inicial ---
    async setUp() {
        const capabilities = {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': 'emulator-5554',
            'appium:app': '/Users/nabilagunesvela/Downloads/vharrio-2025-08-15-v1.apk',
            'appium:ensureWebviewsHavePages': true,
            'appium:nativeWebScreenshot': true,
            'appium:newCommandTimeout': 3600,
            'appium:connectHardwareKeyboard': true
        };

        this.driver = await remote({
            protocol: 'http',
            hostname: '127.0.0.1',
            port: 4723,
            path: '/',
            capabilities
        });

        // Configurar timeout implícito
        await this.driver.setTimeout({ implicit: 30000 });
    }

    // --- Caso de Prueba: Generar Código QR (100% Automatizado) ---
    async pruebaGenerarCodigoQR() {
        try {
            console.log('=== INICIANDO TEST COMPLETAMENTE AUTOMATIZADO ===');

            // PASO 1: Realizar el login
            await this.realizarLogin('Apruebas@smart-barrio.k8s.techxagon.io', '123098');

            // PASO 1.5: Manejar pop-up de notificaciones si aparece
            await this.manejarPopupNotificaciones();

            // PASO 2: Buscar y hacer clic en "Crear invitado"
            console.log('\n[PASO 2] Buscando "Crear invitado"...');
            await this.buscarYClickearCrearInvitado();

            // PASO 3: Seleccionar dropdowns del modal
            console.log('\n[PASO 3] Llenando modal de creación...');
            await this.seleccionarDireccionResidencia();
            await this.seleccionarTipoInvitado();

            // PASO 3.5: Click en "Continuar" del modal
            await this.clickBotonContinuarModal();

            // PASO 4: Llenar datos personales (Nombre y Apellido)
            console.log('\n[PASO 4] Llenando datos personales...');
            await this.driver.pause(3000);
            await this.llenarCampo('Nombre', 'Luis', 0);
            await this.llenarCampo('Apellido', 'Vela', 1);

            // PASO 4.5: CLICK AUTOMÁTICO EN CONTINUAR (sin intervención manual)
            console.log('\n[PASO 4.5] Haciendo clic automático en "Continuar" de datos personales...');
            await this.clickBotonContinuarDatosPersonales();

            // PASO 5: Llenar fecha y hora límite
            console.log('\n[PASO 5] Esperando pantalla de fecha y hora límite...');
            await this.driver.$('//*[contains(@text, "Fecha y hora límite") or contains(@text, "Fecha") or contains(@text, "hora")]').waitForDisplayed({ timeout: 60000 });
            console.log('>>> Pantalla de fecha y hora detectada.');
            await this.driver.pause(2000);

            // Seleccionar duración de 24 horas
            await this.seleccionarDuracion24h();

            // Configurar fechas y horas
            await this.configurarFechaInicio();
            await this.configurarFechaFin();

            // PASO 6: Click en "Continuar" para generar QR
            console.log('\n[PASO 6] Haciendo clic en "Continuar" final para generar QR...');
            await this.clickBotonContinuarFinal();
            await this.driver.pause(4000);

            // PASO 7: Verificar que el QR se generó
            console.log('\n[PASO 7] Verificando generación del código QR...');
            await this.verificarGeneracionQR();

            console.log('\n=== ✅ TEST COMPLETADO EXITOSAMENTE ===');

        } catch (error) {
            console.error('\n❌ ERROR EN EL TEST:', error.message);
            throw new Error('La prueba falló: ' + error.message);
        }
    }

    // ========== MÉTODOS AUXILIARES ==========

    async realizarLogin(usuario, contrasena) {
        console.log('[LOGIN] Iniciando sesión...');
        try {
            const campoUsuario = await this.driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
            await campoUsuario.waitForDisplayed({ timeout: 30000 });

            const campoContrasena = await this.driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)');
            const botonLogin = await this.driver.$('//android.widget.TextView[@text="Iniciar sesión"]');

            await campoUsuario.setValue(usuario);
            await campoContrasena.setValue(contrasena);
            await botonLogin.click();
            
            console.log('>>> Login completado.');
            await this.driver.pause(3000);
        } catch (error) {
            console.error('Error en login:', error.message);
        }
    }

    async manejarPopupNotificaciones() {
        console.log('[POPUP] Verificando notificaciones...');
        try {
            await this.driver.pause(2000);
            const botonAllow = await this.driver.$('//android.widget.Button[@text="Allow" or @text="Permitir" or contains(@text, "Allow")]');
            await botonAllow.waitForDisplayed({ timeout: 10000 });
            await botonAllow.click();
            console.log('>>> Pop-up de notificaciones cerrado.');
            await this.driver.pause(1000);
        } catch (error) {
            console.log('>>> No hay pop-up de notificaciones.');
        }
    }

    async buscarYClickearCrearInvitado() {
        // Hacer scroll para encontrar el elemento
        try {
            await this.driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("Crear invitado"))');
        } catch (ignore) {}

        let crearInvitado = null;

        // Múltiples estrategias de búsqueda
        try {
            crearInvitado = await this.driver.$('//android.widget.TextView[@text="Crear invitado"]');
            await crearInvitado.waitForDisplayed({ timeout: 60000 });
        } catch (e1) {
            try {
                crearInvitado = await this.driver.$('//*[contains(@text, "Crear") and contains(@text, "invitado")]');
                await crearInvitado.waitForDisplayed({ timeout: 60000 });
            } catch (e2) {
                crearInvitado = await this.driver.$('android=new UiSelector().textContains("Crear invitado").clickable(true)');
                await crearInvitado.waitForDisplayed({ timeout: 60000 });
            }
        }

        await crearInvitado.click();
        console.log('>>> Clic en "Crear invitado".');
        await this.driver.pause(2000);

        // Manejar posible popup de error
        if (await this.clickIfAppearsAceptar(5)) {
            console.log('>>> Popup cerrado, reintentando...');
            const crearInvitado2 = await this.driver.$('//android.widget.TextView[@text="Crear invitado"]');
            await crearInvitado2.waitForDisplayed({ timeout: 30000 });
            await crearInvitado2.click();
            await this.driver.pause(2000);
        }
    }

    async seleccionarDireccionResidencia() {
        console.log('>>> Seleccionando dirección de residencia...');
        try {
            const triggerDireccion = await this.driver.$('//android.widget.TextView[contains(@text,"Elige una residencia")]');
            await triggerDireccion.waitForDisplayed({ timeout: 60000 });
            await triggerDireccion.click();
            await this.driver.pause(1000);

            const opcionDireccion = await this.driver.$('//android.widget.TextView[contains(@text, "Gaviota") or contains(@text,"GAVIOTA")]');
            await opcionDireccion.waitForDisplayed({ timeout: 60000 });
            await opcionDireccion.click();
            console.log('>>> Dirección "Gaviota" seleccionada.');
            await this.driver.pause(1000);
        } catch (error) {
            console.log('Error seleccionando dirección:', error.message);
        }
    }

    async seleccionarTipoInvitado() {
        console.log('>>> Seleccionando tipo de invitado...');
        try {
            const triggerTipo = await this.driver.$('//android.widget.TextView[contains(@text,"Elige un tipo de invitado")]');
            await triggerTipo.waitForDisplayed({ timeout: 60000 });
            await triggerTipo.click();
            await this.driver.pause(1000);

            const opcionInvitado = await this.driver.$('//android.widget.TextView[normalize-space(@text)="Invitado" or contains(@text,"Invitado")]');
            await opcionInvitado.waitForDisplayed({ timeout: 60000 });
            await opcionInvitado.click();
            console.log('>>> Tipo "Invitado" seleccionado.');
            await this.driver.pause(1000);
        } catch (error) {
            console.log('Error seleccionando tipo:', error.message);
        }
    }

    async clickBotonContinuarModal() {
        try {
            const continuarModal = await this.driver.$('//android.widget.Button[@text="Continuar"]');
            await continuarModal.waitForDisplayed({ timeout: 30000 });
            await continuarModal.click();
            console.log('>>> "Continuar" del modal presionado.');
            await this.driver.pause(1000);
        } catch (error) {
            console.log('No se encontró botón Continuar del modal (puede no ser necesario).');
        }
    }

    async llenarCampo(tipoCampo, valor, instance) {
        console.log(`>>> Llenando campo ${tipoCampo}...`);
        let campo = null;

        try {
            // Estrategia 1: Por hint/placeholder
            campo = await this.driver.$(`android=new UiSelector().className("android.widget.EditText").textContains("${tipoCampo}")`);
            await campo.waitForDisplayed({ timeout: 30000 });
        } catch (e1) {
            // Estrategia 2: Por instancia
            campo = await this.driver.$(`android=new UiSelector().className("android.widget.EditText").instance(${instance})`);
            await campo.waitForDisplayed({ timeout: 30000 });
        }

        if (campo) {
            await campo.clearValue();
            await campo.setValue(valor);
            console.log(`>>> ${tipoCampo} '${valor}' ingresado.`);
            await this.driver.back(); // Ocultar teclado
            await this.driver.pause(1000);
        }
    }

    async clickBotonContinuarDatosPersonales() {
        // AQUÍ ES DONDE AUTOMATIZAMOS EL CLIC QUE ANTES ERA MANUAL
        await this.driver.pause(2000);

        let botonContinuar = null;

        try {
            // Estrategia 1: Scroll hasta encontrar el botón
            await this.driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Continuar"))');

            botonContinuar = await this.driver.$('//android.widget.Button[@text="Continuar"]');
            await botonContinuar.waitForDisplayed({ timeout: 30000 });
        } catch (e1) {
            try {
                // Estrategia 2: Por UIAutomator
                botonContinuar = await this.driver.$('android=new UiSelector().text("Continuar").clickable(true)');
                await botonContinuar.waitForDisplayed({ timeout: 30000 });
            } catch (e2) {
                // Estrategia 3: Cualquier botón clickeable
                botonContinuar = await this.driver.$('android=new UiSelector().className("android.widget.Button").clickable(true)');
                await botonContinuar.waitForDisplayed({ timeout: 30000 });
            }
        }

        if (botonContinuar) {
            await botonContinuar.click();
            console.log('>>> ✅ Clic automático en "Continuar" de datos personales realizado.');
            await this.driver.pause(2000);
        } else {
            throw new Error('No se pudo encontrar el botón Continuar de datos personales');
        }
    }

    async seleccionarDuracion24h() {
        try {
            const boton24h = await this.driver.$('//android.widget.TextView[@text="24h"]');
            await boton24h.waitForDisplayed({ timeout: 60000 });
            await boton24h.click();
            console.log('>>> Duración "24h" seleccionada.');
            await this.driver.pause(1000);
        } catch (error) {
            console.log('No se pudo seleccionar 24h:', error.message);
        }
    }

    async configurarFechaInicio() {
        try {
            console.log('>>> Configurando fecha de inicio...');
            const campoFechaInicio = await this.driver.$('android=new UiSelector().className("android.widget.EditText").textContains("Fecha de inicio")');
            await campoFechaInicio.waitForDisplayed({ timeout: 60000 });

            await campoFechaInicio.click();
            await this.driver.pause(2000);

            await this.manejarCalendario(23, 10, 2025);
            await this.manejarReloj(12, 0, true);

            console.log('>>> Fecha de inicio configurada.');
        } catch (error) {
            console.log('Error configurando fecha inicio:', error.message);
        }
    }

    async configurarFechaFin() {
        try {
            console.log('>>> Configurando fecha de fin...');
            const campoFechaFin = await this.driver.$('android=new UiSelector().className("android.widget.EditText").textContains("Fecha de fin")');
            await campoFechaFin.waitForDisplayed({ timeout: 60000 });

            await campoFechaFin.click();
            await this.driver.pause(2000);

            await this.manejarCalendario(24, 10, 2025);
            await this.manejarReloj(21, 30, false);

            console.log('>>> Fecha de fin configurada.');
        } catch (error) {
            console.log('Error configurando fecha fin:', error.message);
        }
    }

    async clickBotonContinuarFinal() {
        const botonContinuar = await this.driver.$('//android.widget.Button[@text="Continuar"]');
        await botonContinuar.waitForDisplayed({ timeout: 60000 });
        await botonContinuar.click();
        console.log('>>> Clic en "Continuar" final realizado.');
    }

    async verificarGeneracionQR() {
        let indicadorExito = null;

        try {
            indicadorExito = await this.driver.$('//*[contains(@text, "generado") or contains(@text, "éxito") or contains(@text, "QR") or contains(@text, "código")]');
            await indicadorExito.waitForDisplayed({ timeout: 30000 });
        } catch (e1) {
            try {
                indicadorExito = await this.driver.$('android=new UiSelector().className("android.widget.ImageView").descriptionContains("QR")');
                await indicadorExito.waitForDisplayed({ timeout: 30000 });
            } catch (e2) {
                indicadorExito = await this.driver.$('//*[contains(@text, "Visita") or contains(@text, "Invitado") or contains(@text, "Completado")]');
                await indicadorExito.waitForDisplayed({ timeout: 30000 });
            }
        }

        const isDisplayed = await indicadorExito.isDisplayed();
        if (!isDisplayed) {
            throw new Error('No se verificó la generación del QR.');
        }
        console.log('>>> 🎉 CÓDIGO QR GENERADO EXITOSAMENTE');
    }

    async clickIfAppearsAceptar(timeoutSeconds) {
        try {
            const aceptar = await this.driver.$('//*[@text="Aceptar" or @text="ACEPTAR" or @text="OK" or @text="Ok" or @text="Cerrar"]');
            await aceptar.waitForDisplayed({ timeout: timeoutSeconds * 1000 });
            await aceptar.click();
            console.log('>>> Popup cerrado automáticamente.');
            await this.driver.pause(500);
            return true;
        } catch (ignore) {
            return false;
        }
    }

    async manejarCalendario(dia, mes, ano) {
        console.log(`>>> Seleccionando fecha: ${dia}/${mes}/${ano}`);
        await this.driver.pause(1000);

        try {
            const diaElemento = await this.driver.$(`//android.widget.TextView[@text="${dia}"]`);
            await diaElemento.waitForDisplayed({ timeout: 30000 });
            await diaElemento.click();
            console.log(`>>> Día ${dia} seleccionado.`);
        } catch (error) {
            console.log('Usando fecha por defecto del calendario.');
        }

        await this.driver.pause(500);

        try {
            const botonAceptar = await this.driver.$('//android.widget.Button[@text="Aceptar" or @text="OK"]');
            await botonAceptar.waitForDisplayed({ timeout: 30000 });
            await botonAceptar.click();
            console.log('>>> Calendario confirmado.');
        } catch (error) {
            console.log('No se encontró botón de calendario.');
        }

        await this.driver.pause(1000);
    }

    async manejarReloj(hora, minutos, esPM) {
        console.log(`>>> Configurando hora: ${hora}:${minutos.toString().padStart(2, '0')}`);
        await this.driver.pause(1000);

        try {
            let horaDisplay = hora;
            if (hora === 0) horaDisplay = 12;
            else if (hora > 12) horaDisplay = hora - 12;

            const horaElemento = await this.driver.$(`//android.widget.TextView[@text="${horaDisplay}"]`);
            await horaElemento.waitForDisplayed({ timeout: 30000 });
            await horaElemento.click();
            console.log(`>>> Hora ${horaDisplay} seleccionada.`);
            await this.driver.pause(500);
        } catch (error) {
            console.log('Usando hora por defecto.');
        }

        try {
            const minutosElemento = await this.driver.$(`//android.widget.TextView[@text="${minutos.toString().padStart(2, '0')}"]`);
            await minutosElemento.waitForDisplayed({ timeout: 30000 });
            await minutosElemento.click();
            console.log('>>> Minutos configurados.');
            await this.driver.pause(500);
        } catch (error) {
            console.log('Usando minutos por defecto.');
        }

        try {
            const amPmTexto = esPM ? 'PM' : 'AM';
            const amPmElemento = await this.driver.$(`//android.widget.TextView[@text="${amPmTexto}"]`);
            await amPmElemento.waitForDisplayed({ timeout: 30000 });
            await amPmElemento.click();
            console.log(`>>> ${amPmTexto} seleccionado.`);
            await this.driver.pause(500);
        } catch (error) {
            console.log('Formato 24h detectado.');
        }

        try {
            const botonAceptar = await this.driver.$('//android.widget.Button[@text="Aceptar" or @text="OK"]');
            await botonAceptar.waitForDisplayed({ timeout: 30000 });
            await botonAceptar.click();
            console.log('>>> Reloj confirmado.');
        } catch (error) {
            console.log('No se encontró botón del reloj.');
        }

        await this.driver.pause(1000);
    }

    async tearDown() {
        if (this.driver) {
            await this.driver.deleteSession();
        }
    }
}

// Función principal para ejecutar el test
async function runTest() {
    const test = new AppiumTestAutomatizado();
    try {
        await test.setUp();
        await test.pruebaGenerarCodigoQR();
    } catch (error) {
        console.error('Error ejecutando el test:', error);
    } finally {
        await test.tearDown();
    }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    runTest();
}

module.exports = AppiumTestAutomatizado;