// 云函数：getUserSig — 服务端生成 IM UserSig
// 注意：此文件上传云端后 SecretKey 不会暴露给前端
const cloud = require('wx-server-sdk');
cloud.init();

// 配置（云端环境变量更安全，这里写死仅测试用）
const SDKAppID = 1600144712;
const SECRET_KEY = 'b72d01bad21bcb63986d7d6ba37c1e29f0e1e56245e07d483b3a3389b79657ed';

const crypto = require('crypto');

function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/\+/g, '*').replace(/\//g, '-').replace(/=/g, '_');
}

exports.main = async (event) => {
  const userID = event.userID || ('user_' + Date.now());
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const hdrB64 = base64url(header);
  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({
    'TLS.ver': '2.0',
    'TLS.identifier': userID,
    'TLS.sdkappid': SDKAppID,
    'TLS.expire': now + 86400 * 7,
    'TLS.time': now
  });
  const pldB64 = base64url(payload);
  const sig = crypto.createHmac('sha256', SECRET_KEY).update(hdrB64 + '.' + pldB64).digest('base64');
  const sigB64 = sig.replace(/\+/g, '*').replace(/\//g, '-').replace(/=/g, '_');
  return { userID, userSig: hdrB64 + '.' + pldB64 + '.' + sigB64 };
};
