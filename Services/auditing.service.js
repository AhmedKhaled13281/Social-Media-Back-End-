const AuditModel = require("../Models/audit.model");

exports.logAudit = async (data) => {
    data = {...data , ip : data.ip === '::1' ? '127.0.0.1' : data.ip}
  await AuditModel.create(data);
};
