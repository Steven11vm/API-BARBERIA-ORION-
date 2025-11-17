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

const requestPasswordReset = async (email) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hora

    await userRepository.updateResetPasswordToken(user.id, resetToken, resetTokenExpires);

    // Configuración del transporte para nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

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
                                                <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #1a1a2e; letter-spacing: 8px; word-break: break-all; line-height: 1.4;">
                                                    ${resetToken}
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

    // Enviar el correo electrónico
    await transporter.sendMail({
        to: email,
        from: `Barbería Orion <${process.env.EMAIL_USER}>`,
        subject: '🔐 Restablecer Contraseña - Barbería Orion',
        html: htmlContent
    });

    return { message: 'Correo de restablecimiento enviado' };
};

const resetPassword = async (token, newPassword) => {
    const user = await userRepository.findUserByResetToken(token);
    if (!user) {
        throw new Error('Token inválido o caducado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user.id, hashedPassword);

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
    updateProfile
};