'use strict';

const sequelize = require('./database');
const { QueryTypes } = require('sequelize');
const PrivilegePermissionRole = require('../models/privilegePermissionRole');

async function seedPrivilegePermissionRoles() {
    try {
        // Leer todos los registros existentes desde la tabla correcta
        const existing = await sequelize.query(
            'SELECT permissionRoleId, privilegeId FROM privilegesPermissionRole',
            { type: QueryTypes.SELECT }
        );

        // Convertir a un set para verificar rápido si ya existen
        const existingSet = new Set(
            existing.map(
                (e) => `${e.permissionRoleId}-${e.privilegeId}`
            )
        );

        // Definir los privilegios para cada permissionRole
        const privilegesByPermissionRole = {
            1: [1, 2, 3, 4, 5, 6],
            2: [7, 8, 9, 10, 11, 12],
            3: [13, 14, 15, 16, 17],
            4: [18, 19, 20, 21, 22, 23],
            5: [24, 25, 26, 27, 28, 29],
            6: [30, 31, 32, 33, 34],
            7: [35, 36, 37, 38, 39, 40],
            8: [41, 42],
            9: [43, 44, 45, 46, 47, 48],
            10: [49, 50, 51, 52],
            11: [53, 54, 55, 56, 57, 58],
            12: [59, 60, 61, 62, 63]
        };

        // Crear array para los que falten
        const privilegePermissionRolesToSeed = [];

        for (const [permissionRoleId, privilegeIds] of Object.entries(privilegesByPermissionRole)) {
            for (const privilegeId of privilegeIds) {
                const key = `${permissionRoleId}-${privilegeId}`;
                if (!existingSet.has(key)) {
                    privilegePermissionRolesToSeed.push({
                        permissionRoleId: parseInt(permissionRoleId),
                        privilegeId: privilegeId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
            }
        }

        if (privilegePermissionRolesToSeed.length > 0) {
            await PrivilegePermissionRole.bulkCreate(privilegePermissionRolesToSeed);
            console.log(`✅ Se insertaron ${privilegePermissionRolesToSeed.length} PrivilegePermissionRoles nuevos.`);
        } else {
            console.log('⚡ No había nada nuevo por insertar. Todo está actualizado.');
        }

        // Verificar total
        const createdCount = await PrivilegePermissionRole.count();
        console.log(`📊 Total de PrivilegePermissionRoles ahora: ${createdCount}`);

    } catch (error) {
        console.error('❌ Error al sembrar PrivilegePermissionRoles:', error);
    }
}

module.exports = seedPrivilegePermissionRoles;
