/**
 * Admin 路径处理器 - 确保管理路径始终返回 SPA
 * @author MiSub Team
 */

/**
 * 处理 admin 路径请求
 * @param {Object} context - Cloudflare上下文对象
 * @returns {Promise<Response>} HTTP响应
 */
export async function onRequest(context) {
    const { next } = context;

    // 直接返回 SPA 应用
    // 这确保了无论伪装功能是否启用,/admin 路径都能访问管理界面
    return next();
}
