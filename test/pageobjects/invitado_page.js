import Page from './page.js';

class InvitadoPage extends Page {
    // ========== SELECTORES ==========
    
    get btnCrearInvitado() { 
        return $('//android.widget.TextView[@text="Crear invitado"]'); 
    }
    
    get dropdownResidencia() { 
        return $('//android.widget.TextView[contains(@text,"Elige una residencia")]'); 
    }
    
    get opcionGaviota() { 
        return $('//android.widget.TextView[contains(@text, "Gaviota")]'); 
    }
    
    get dropdownTipoInvitado() { 
        return $('//android.widget.TextView[contains(@text,"Elige un tipo de invitado")]'); 
    }
    
    get opcionInvitado() { 
        return $('//android.widget.TextView[normalize-space(@text)="Invitado" or contains(@text,"Invitado")]'); 
    }
    
    get btnContinuarModal() { 
        return $('//android.widget.Button[@text="Continuar"]'); 
    }
    
    get btnContinuar() { 
        return $('//android.widget.Button[@text="Continuar"]'); 
    }
    
    get btn24h() { 
        return $('//android.widget.TextView[@text="24h"]'); 
    }
    
    get campoFechaInicio() { 
        return $('android=new UiSelector().className("android.widget.EditText").textContains("Fecha de inicio")'); 
    }
    
    get campoFechaFin() { 
        return $('android=new UiSelector().className("android.widget.EditText").textContains("Fecha de fin")'); 
    }

    // ========== MÉTODOS ==========
    
    async manejarPopupNotificaciones() {
        console.log('[POPUP] Verificando notificaciones...');
        try {
            await driver.pause(2000);
            const botonAllow = await $('//android.widget.Button[@text="Allow" or @text="Permitir"]');
            await botonAllow.waitForDisplayed({ timeout: 10000 });
            await botonAllow.click();
            console.log('>>> Pop-up de notificaciones cerrado.');
            await driver.pause(1000);
        } catch (error) {
            console.log('>>> No hay pop-up de notificaciones.');
        }
    }

    async buscarYClickearCrearInvitado() {
        console.log('[PASO 2] Buscando "Crear invitado"...');
        
        // Hacer scroll para encontrar el elemento
        try {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("Crear invitado"))');
        } catch (ignore) {}

        await this.btnCrearInvitado.waitForDisplayed({ timeout: 60000 });
        await this.btnCrearInvitado.click();
        console.log('>>> Clic en "Crear invitado".');
        await driver.pause(2000);

        // Manejar posible popup de error
        if (await this.clickIfAppearsAceptar(5)) {
            console.log('>>> Popup cerrado, reintentando...');
            await this.btnCrearInvitado.waitForDisplayed({ timeout: 30000 });
            await this.btnCrearInvitado.click();
            await driver.pause(2000);
        }
    }

    async seleccionarDireccionResidencia() {
        console.log('>>> Seleccionando dirección de residencia...');
        await this.dropdownResidencia.waitForDisplayed({ timeout: 60000 });
        await this.dropdownResidencia.click();
        await driver.pause(1000);

        await this.opcionGaviota.waitForDisplayed({ timeout: 60000 });
        await this.opcionGaviota.click();
        console.log('>>> Dirección "Gaviota" seleccionada.');
        await driver.pause(1000);
    }

    async seleccionarTipoInvitado() {
        console.log('>>> Seleccionando tipo de invitado...');
        await this.dropdownTipoInvitado.waitForDisplayed({ timeout: 60000 });
        await this.dropdownTipoInvitado.click();
        await driver.pause(1000);

        await this.opcionInvitado.waitForDisplayed({ timeout: 60000 });
        await this.opcionInvitado.click();
        console.log('>>> Tipo "Invitado" seleccionado.');
        await driver.pause(1000);
    }

    async clickBotonContinuarModal() {
        try {
            await this.btnContinuarModal.waitForDisplayed({ timeout: 30000 });
            await this.btnContinuarModal.click();
            console.log('>>> "Continuar" del modal presionado.');
            await driver.pause(1000);
        } catch (error) {
            console.log('No se encontró botón Continuar del modal.');
        }
    }

    async llenarCampo(tipoCampo, valor, instance) {
        console.log(`>>> Llenando campo ${tipoCampo}...`);
        let campo = null;

        try {
            campo = await $(`android=new UiSelector().className("android.widget.EditText").textContains("${tipoCampo}")`);
            await campo.waitForDisplayed({ timeout: 30000 });
        } catch (e1) {
            campo = await $(`android=new UiSelector().className("android.widget.EditText").instance(${instance})`);
            await campo.waitForDisplayed({ timeout: 30000 });
        }

        await campo.clearValue();
        await campo.setValue(valor);
        console.log(`>>> ${tipoCampo} '${valor}' ingresado.`);
        await driver.back(); // Ocultar teclado
        await driver.pause(1000);
    }

    async clickBotonContinuarDatosPersonales() {
        console.log('[PASO 4.5] Haciendo clic en "Continuar" de datos personales...');
        await driver.pause(2000);

        try {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Continuar"))');
        } catch (ignore) {}

        await this.btnContinuar.waitForDisplayed({ timeout: 30000 });
        await this.btnContinuar.click();
        console.log('>>> ✅ Clic automático en "Continuar" realizado.');
        await driver.pause(2000);
    }

    async seleccionarDuracion24h() {
        console.log('>>> Seleccionando duración 24h...');
        await this.btn24h.waitForDisplayed({ timeout: 60000 });
        await this.btn24h.click();
        console.log('>>> Duración "24h" seleccionada.');
        await driver.pause(1000);
    }

    async configurarFechaInicio() {
        console.log('>>> Configurando fecha de inicio...');
        await this.campoFechaInicio.waitForDisplayed({ timeout: 60000 });
        await this.campoFechaInicio.click();
        await driver.pause(2000);

        await this.manejarCalendario(23, 10, 2025);
        await this.manejarReloj(12, 0, true);
        console.log('>>> Fecha de inicio configurada.');
    }

    async configurarFechaFin() {
        console.log('>>> Configurando fecha de fin...');
        await this.campoFechaFin.waitForDisplayed({ timeout: 60000 });
        await this.campoFechaFin.click();
        await driver.pause(2000);

        await this.manejarCalendario(24, 10, 2025);
        await this.manejarReloj(21, 30, false);
        console.log('>>> Fecha de fin configurada.');
    }

    async clickBotonContinuarFinal() {
        console.log('[PASO 6] Haciendo clic en "Continuar" final...');
        await this.btnContinuar.waitForDisplayed({ timeout: 60000 });
        await this.btnContinuar.click();
        console.log('>>> Clic en "Continuar" final realizado.');
        await driver.pause(4000);
    }

    async verificarGeneracionQR() {
        console.log('[PASO 7] Verificando generación del código QR...');
        let indicadorExito = null;

        try {
            indicadorExito = await $('//*[contains(@text, "generado") or contains(@text, "éxito") or contains(@text, "QR") or contains(@text, "código")]');
            await indicadorExito.waitForDisplayed({ timeout: 30000 });
        } catch (e1) {
            try {
                indicadorExito = await $('android=new UiSelector().className("android.widget.ImageView").descriptionContains("QR")');
                await indicadorExito.waitForDisplayed({ timeout: 30000 });
            } catch (e2) {
                indicadorExito = await $('//*[contains(@text, "Visita") or contains(@text, "Invitado") or contains(@text, "Completado")]');
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
            const aceptar = await $('//*[@text="Aceptar" or @text="ACEPTAR" or @text="OK" or @text="Cerrar"]');
            await aceptar.waitForDisplayed({ timeout: timeoutSeconds * 1000 });
            await aceptar.click();
            console.log('>>> Popup cerrado automáticamente.');
            await driver.pause(500);
            return true;
        } catch (ignore) {
            return false;
        }
    }

    async manejarCalendario(dia, mes, ano) {
        console.log(`>>> Seleccionando fecha: ${dia}/${mes}/${ano}`);
        await driver.pause(1000);

        try {
            const diaElemento = await $(`//android.widget.TextView[@text="${dia}"]`);
            await diaElemento.waitForDisplayed({ timeout: 30000 });
            await diaElemento.click();
            console.log(`>>> Día ${dia} seleccionado.`);
        } catch (error) {
            console.log('Usando fecha por defecto del calendario.');
        }

        await driver.pause(500);

        try {
            const botonAceptar = await $('//android.widget.Button[@text="Aceptar" or @text="OK"]');
            await botonAceptar.waitForDisplayed({ timeout: 30000 });
            await botonAceptar.click();
            console.log('>>> Calendario confirmado.');
        } catch (error) {
            console.log('No se encontró botón de calendario.');
        }

        await driver.pause(1000);
    }

    async manejarReloj(hora, minutos, esPM) {
        console.log(`>>> Configurando hora: ${hora}:${minutos.toString().padStart(2, '0')}`);
        await driver.pause(1000);

        try {
            let horaDisplay = hora;
            if (hora === 0) horaDisplay = 12;
            else if (hora > 12) horaDisplay = hora - 12;

            const horaElemento = await $(`//android.widget.TextView[@text="${horaDisplay}"]`);
            await horaElemento.waitForDisplayed({ timeout: 30000 });
            await horaElemento.click();
            console.log(`>>> Hora ${horaDisplay} seleccionada.`);
            await driver.pause(500);
        } catch (error) {
            console.log('Usando hora por defecto.');
        }

        try {
            const minutosElemento = await $(`//android.widget.TextView[@text="${minutos.toString().padStart(2, '0')}"]`);
            await minutosElemento.waitForDisplayed({ timeout: 30000 });
            await minutosElemento.click();
            console.log('>>> Minutos configurados.');
            await driver.pause(500);
        } catch (error) {
            console.log('Usando minutos por defecto.');
        }

        try {
            const amPmTexto = esPM ? 'PM' : 'AM';
            const amPmElemento = await $(`//android.widget.TextView[@text="${amPmTexto}"]`);
            await amPmElemento.waitForDisplayed({ timeout: 30000 });
            await amPmElemento.click();
            console.log(`>>> ${amPmTexto} seleccionado.`);
            await driver.pause(500);
        } catch (error) {
            console.log('Formato 24h detectado.');
        }

        try {
            const botonAceptar = await $('//android.widget.Button[@text="Aceptar" or @text="OK"]');
            await botonAceptar.waitForDisplayed({ timeout: 30000 });
            await botonAceptar.click();
            console.log('>>> Reloj confirmado.');
        } catch (error) {
            console.log('No se encontró botón del reloj.');
        }

        await driver.pause(1000);
    }

    // ========== MÉTODO PRINCIPAL ==========
    
    async crearInvitadoQR(nombre, apellido) {
        console.log('=== INICIANDO CREACIÓN DE INVITADO QR ===');

        // Manejar notificaciones
        await this.manejarPopupNotificaciones();

        // Buscar y clickear "Crear invitado"
        await this.buscarYClickearCrearInvitado();

        // Seleccionar opciones del modal
        console.log('\n[PASO 3] Llenando modal de creación...');
        await this.seleccionarDireccionResidencia();
        await this.seleccionarTipoInvitado();
        await this.clickBotonContinuarModal();

        // Llenar datos personales
        console.log('\n[PASO 4] Llenando datos personales...');
        await driver.pause(3000);
        await this.llenarCampo('Nombre', nombre, 0);
        await this.llenarCampo('Apellido', apellido, 1);
        await this.clickBotonContinuarDatosPersonales();

        // Configurar fecha y hora
        console.log('\n[PASO 5] Configurando fecha y hora...');
        await $('//*[contains(@text, "Fecha y hora límite") or contains(@text, "Fecha") or contains(@text, "hora")]').waitForDisplayed({ timeout: 60000 });
        console.log('>>> Pantalla de fecha y hora detectada.');
        await driver.pause(2000);

        await this.seleccionarDuracion24h();
        await this.configurarFechaInicio();
        await this.configurarFechaFin();

        // Generar QR
        await this.clickBotonContinuarFinal();

        // Verificar
        await this.verificarGeneracionQR();

        console.log('\n=== ✅ INVITADO QR CREADO EXITOSAMENTE ===');
    }
}

export default new InvitadoPage();