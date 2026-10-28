import InvitadoPage from '../pageobjects/invitado_page.js';
import LoginPage from '../pageobjects/login.page.js';

describe('Generar Código QR', () => {
    it('debe generar un código QR exitosamente', async () => {
        // Usar el login que ya tienes
        await LoginPage.login('Apruebas@smart-barrio.k8s.techxagon.io', '123098');
        
        // Crear invitado
        await InvitadoPage.crearInvitadoQR('Luis', 'Vela');
    });
});