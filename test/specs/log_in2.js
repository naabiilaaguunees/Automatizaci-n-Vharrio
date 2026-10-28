describe('Login en app Android híbrida', () => {
  it('Debe llenar usuario y contraseña y hacer clic en Iniciar sesión', async () => {
    // Campo de usuario (instance 0)
    const campoUsuario = await $('android=new UiSelector().className("android.widget.EditText").instance(0)');
    await campoUsuario.setValue('mmarin@dos-riberas.vharr.io');

    // Campo de contraseña (instance 1)
    const campoPassword = await $('android=new UiSelector().className("android.widget.EditText").instance(1)');
    await campoPassword.setValue('123098');

    // Botón "Iniciar sesión"
    const botonLogin = await $('android=new UiSelector().text("Iniciar sesión")');
    await botonLogin.click();

    //Boton Invitados
    const botonInvitados = await $('android=new UiSelector().text("Invitados")');
    await botonInvitados.waitForDisplayed({ timeout: 30000 });
    await botonInvitados.click();

    //Boton Más
    const botonMas = await $('android=new UiSelector().text("142-512")');
    await botonMas.waitForDisplayed({ timeout: 30000 });
    await botonMas.click();

    //Boton elige residencia
    const eligeResidencia = await $('android=new UiSelector().text("(Elige una residencia)")');
    await eligeResidencia.waitForDisplayed({ timeout: 30000 });
    await eligeResidencia.click();

    // Campo seleccionar residencia (instance 1)
    const seleccionResidencia = await $('android=new UiSelector().text("Gaviota - Cazon #7")');
    await seleccionResidencia.waitForDisplayed({ timeout: 30000 });
    await seleccionResidencia.click();

    //Boton elige tipo de invitado
    const tipoInvitado = await $('android=new UiSelector().text("(Elige un tipo de invitado)")');
    await tipoInvitado.waitForDisplayed({ timeout: 30000 });
    await tipoInvitado.click();

    //Selecciona invitado
    const seleccionTipoInvitado = await $('android=new UiSelector().text("Proveedor")');
    await seleccionTipoInvitado.waitForDisplayed({ timeout: 30000 });
    await seleccionTipoInvitado.click();

    // Botón "continuar"
    const botonContinuar = await $('android=new UiSelector().text("Continuar")');
    await botonContinuar.waitForDisplayed({ timeout: 30000 });
    await botonContinuar.click();

    //Boton elegir provedor (totalplay)
    const proveedorTotalPlay = await $('android=new UiSelector().text("Totalplay")');
    await proveedorTotalPlay.waitForDisplayed({ timeout: 30000 });
    await proveedorTotalPlay.click();

    // Botón "continuar"
    const botonContinuar2 = await $('android=new UiSelector().text("Continuar")');
    await botonContinuar2.waitForDisplayed({ timeout: 30000 });
    await botonContinuar2.click();

    //Boton seleccionar tiempo de estancia
    const tiempoEstancia = await $('android=new UiSelector().text("24h")');
    await tiempoEstancia.waitForDisplayed({ timeout: 30000 });
    await tiempoEstancia.click();

    // Botón "continuar"
    const botonContinuar3 = await $('android=new UiSelector().text("Continuar")');
    await botonContinuar3.waitForDisplayed({ timeout: 30000 });
    await botonContinuar3.click();


    // Espera opcional para ver el resultado
    await driver.pause(3000);
  });
});