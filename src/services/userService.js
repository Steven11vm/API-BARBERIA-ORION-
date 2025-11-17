require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userRepository = require('../repositories/UserRepository');

const getUserProfile = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    const userObj = user.toJSON();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
};

const updateProfile = async (userId, userData) => {
    const existingUser = await userRepository.getUserById(userId);
    if (!existingUser) {
        throw new Error('Usuario no encontrado');
    }

    if (userData.email) {
        const emailUser = await userRepository.findUserByEmail(userData.email);
        if (emailUser && emailUser.id !== userId) {
            throw new Error('El correo electrónico ya está en uso');
        }
    }

    if (userData.phone) {
        const phoneUser = await userRepository.findUserByPhone(userData.phone);
        if (phoneUser && phoneUser.id !== userId) {
            throw new Error('El número de teléfono ya está en uso');
        }
    }

    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await userRepository.updateUser(userId, userData);
    if (!updatedUser) {
        throw new Error('Error al actualizar el usuario');
    }

    const userObj = updatedUser.toJSON();
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
};

const checkEmailExists = async (email) => {
    const user = await userRepository.findUserByEmail(email);
    return !!user;
};

const checkPhoneExists = async (phone) => {
    const user = await userRepository.findUserByPhone(phone);
    return !!user;
};

const getAllUsers = async () => {
    return await userRepository.getAllUsers();
};

const getUserById = async (id) => {
    return await userRepository.getUserById(id);
};

const createUser = async (data) => {
    return await userRepository.createUser(data);
};

const updateUser = async (id, data) => {
    try {
        return await userRepository.updateUser(id, data);
    } catch (error) {
        console.error('Error en updateUser service:', error);
        throw error;
    }
};

const deleteUser = async (id) => {
    return await userRepository.deleteUser(id);
};

const findUserByEmail = async (email) => {
    return await userRepository.findUserByEmail(email);
};

const requestPasswordReset = async (email) => {
    try {
        // Validar variables de entorno
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('ERROR: Variables de entorno EMAIL_USER o EMAIL_PASS no están configuradas');
            throw new Error('Configuración de correo electrónico no disponible');
        }

        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Generar código de verificación de 8 dígitos numéricos
        const resetToken = Math.floor(10000000 + Math.random() * 90000000).toString();
        const resetTokenExpires = Date.now() + 3600000; // 1 hora

        // Guardar el código sin espacios en la base de datos
        await userRepository.updateResetPasswordToken(user.id, resetToken, resetTokenExpires);
        
        // Formatear el código para mostrar en el correo (XXXX XXXX)
        const formattedToken = resetToken.match(/.{1,4}/g).join(' ');

        // Log de configuración (sin mostrar la contraseña completa)
        console.log(`📧 Configurando correo con usuario: ${process.env.EMAIL_USER}`);
        console.log(`🔑 Contraseña configurada: ${process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-3) : 'NO CONFIGURADA'}`);

        // Configuración del transporte para nodemailer - Intentar múltiples configuraciones
        let transporter;
        
        // Primero intentar con puerto 587 (STARTTLS) - más compatible con firewalls
        try {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // false para STARTTLS
                requireTLS: true,
                auth: {
                    user: process.env.EMAIL_USER.trim(),
                    pass: process.env.EMAIL_PASS.trim(),
                },
                tls: {
                    rejectUnauthorized: false,
                    ciphers: 'SSLv3'
                },
                connectionTimeout: 15000, // 15 segundos
                greetingTimeout: 15000,
                socketTimeout: 25000,
                debug: false,
                logger: false
            });
            console.log('📡 Configuración SMTP: puerto 587 (STARTTLS)');
        } catch (error) {
            console.error('Error al crear transporter:', error);
            throw new Error('Error al configurar el servidor de correo');
        }

        // Verificar la conexión del transporter con timeout (opcional)
        console.log('🔍 Verificando conexión con el servidor de correo (opcional)...');
        const verifyWithTimeout = async () => {
            try {
                const verifyPromise = transporter.verify();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 5000) // 5 segundos
                );
                
                await Promise.race([verifyPromise, timeoutPromise]);
                console.log('✅ Servidor de correo verificado');
                return true;
            } catch (error) {
                console.warn('⚠️ Verificación omitida (continuando de todos modos)');
                return false;
            }
        };
        
        // Ejecutar verificación en paralelo, no bloquear
        const verificationResult = verifyWithTimeout();
        // No esperamos el resultado, continuamos directamente

        // HTML template profesional y elegante para el correo
        const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Restablecer Contraseña - Barbería Orion</title>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table role="presentation" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); overflow: hidden;">
                        <!-- Header con gradiente -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 30px; text-align: center;">
                                <div style="margin-bottom: 20px;">
                                    <img src="https://tu-dominio.com/ruta/a/tu/logo-light.png" 
                                         alt="Barbería Orion" 
                                         style="max-width: 160px; height: auto; display: block; margin: 0 auto;"
                                         width="160"
                                         height="auto">
                                </div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; text-transform: none;">
                                    Restablecer Contraseña
                                </h1>
                            </td>
                        </tr>
                        
                        <!-- Contenido principal -->
                        <tr>
                            <td style="padding: 50px 40px;">
                                <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.8;">
                                    Estimado/a cliente,
                                </p>
                                <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.8;">
                                    Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong style="color: #1a1a2e;">Barbería Orion</strong>. 
                                    Para completar este proceso, utiliza el siguiente código de verificación:
                                </p>
                                
                                <!-- Código de verificación destacado -->
                                <table role="presentation" style="width: 100%; margin: 35px 0;">
                                    <tr>
                                        <td align="center" style="padding: 0;">
                                            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px dashed #cbd5e0; border-radius: 12px; padding: 30px 20px; margin: 20px 0;">
                                                <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                                                    Código de Verificación
                                                </p>
                                                <div style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; color: #1a1a2e; letter-spacing: 4px; word-break: break-all; line-height: 1.4;">
                                                    ${formattedToken}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Información importante -->
                                <div style="background: #fff5f5; border-left: 4px solid #fc8181; padding: 20px; border-radius: 8px; margin: 30px 0;">
                                    <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.7;">
                                        <strong style="display: block; margin-bottom: 8px;">⚠️ Importante:</strong>
                                        Este código es válido únicamente por <strong>60 minutos</strong>. 
                                        Por seguridad, no compartas este código con nadie.
                                    </p>
                                </div>
                                
                                <p style="margin: 30px 0 0 0; color: #718096; font-size: 14px; line-height: 1.7;">
                                    Si no has solicitado restablecer tu contraseña, puedes ignorar este mensaje de forma segura. 
                                    Tu cuenta permanecerá protegida.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Separador decorativo -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <div style="height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent);"></div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px 40px; background: #f7fafc; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; font-weight: 500;">
                                    Barbería Orion
                                </p>
                                <p style="margin: 0 0 15px 0; color: #718096; font-size: 12px; line-height: 1.6;">
                                    Tu estilo, nuestra pasión
                                </p>
                                <p style="margin: 20px 0 0 0; color: #a0aec0; font-size: 11px; line-height: 1.6;">
                                    Este es un correo automático, por favor no respondas a este mensaje.<br>
                                    &copy; ${new Date().getFullYear()} Barbería Orion. Todos los derechos reservados.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

        // Enviar el correo electrónico con timeout
        console.log(`📧 Intentando enviar correo a: ${email}`);
        const mailOptions = {
            from: `Barbería Orion <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Restablecer Contraseña - Barbería Orion',
            html: htmlContent
        };

        // Crear promesa con timeout de 60 segundos para el envío (Gmail puede ser lento)
        const sendPromise = transporter.sendMail(mailOptions);
        const sendTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout: El envío del correo tomó más de 60 segundos. Verifica las credenciales de Gmail.')), 60000)
        );

        console.log('⏳ Esperando respuesta del servidor de correo...');
        const info = await Promise.race([sendPromise, sendTimeoutPromise]);
        console.log('✅ Correo enviado exitosamente!');
        console.log('📬 Message ID:', info.messageId);
        console.log('📬 Respuesta del servidor:', info.response);

        return { 
            message: 'Correo de restablecimiento enviado',
            messageId: info.messageId
        };
    } catch (error) {
        console.error('❌ Error al enviar correo de recuperación:', error);
        
        // Si es un error de autenticación de Gmail, dar un mensaje más específico
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            throw new Error('Error de autenticación. Verifica las credenciales de correo electrónico.');
        }
        
        // Si es un error de conexión
        if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT' || error.code === 'CONN') {
            console.error('❌ Detalles del error de conexión:');
            console.error('   - Código:', error.code);
            console.error('   - Comando:', error.command);
            console.error('   - Mensaje:', error.message);
            throw new Error('No se pudo conectar con el servidor de Gmail. Verifica que las credenciales sean correctas y que el servidor permita conexiones SMTP. Si usas contraseña de aplicación, asegúrate de que esté correctamente configurada.');
        }
        
        // Re-lanzar el error original si no es uno de los anteriores
        throw error;
    }
};

const resetPassword = async (token, newPassword) => {
    // Limpiar el token: quitar espacios y convertir a string
    const cleanToken = token.toString().replace(/\s+/g, '');
    
    console.log(`🔐 Intentando restablecer contraseña con token: ${cleanToken.substring(0, 4)}****`);
    
    const user = await userRepository.findUserByResetToken(cleanToken);
    if (!user) {
        throw new Error('Token inválido o caducado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user.id, hashedPassword);

    console.log('✅ Contraseña restablecida exitosamente');
    return { message: 'Contraseña restablecida con éxito' };
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    requestPasswordReset,
    resetPassword,
    checkEmailExists,
    checkPhoneExists,
    getUserProfile,
    updateProfile,
    findUserByEmail
};

