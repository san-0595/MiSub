/**
 * 根路径处理器 - 处理伪装页面逻辑
 * @author MiSub Team
 */

import { generateDisguiseResponse } from './modules/disguise-templates.js';
import { StorageFactory } from './storage-adapter.js';

/**
 * 处理根路径请求
 * @param {Object} context - Cloudflare上下文对象
 * @returns {Promise<Response>} HTTP响应
 */
export async function onRequest(context) {
    const { request, env, next } = context;
    const url = new URL(request.url);

    try {
        // 读取伪装配置
        let disguiseConfig = null;
        try {
            const storage = StorageFactory.create(env);
            const configData = await storage.get('misub_settings_v1');
            if (configData) {
                const settings = typeof configData === 'string' ? JSON.parse(configData) : configData;
                disguiseConfig = settings.disguise;
            }
        } catch (e) {
            console.error('[Disguise Config Error]', e);
        }

        // 如果伪装功能启用，返回伪装页面
        if (disguiseConfig?.enabled) {
            console.log('[Disguise] Enabled, returning disguise page');
            return generateDisguiseResponse(disguiseConfig);
        }

        // 否则返回正常的 SPA 应用
        console.log('[Disguise] Disabled, returning normal SPA');
        return next();
    } catch (error) {
        console.error('[Index Handler Error]', error);
        // 出错时返回正常页面
        return next();
    }
}
