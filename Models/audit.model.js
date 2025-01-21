const { Schema, model } = require("mongoose");

const AuditSchema = new Schema({
  action: {
    type: String,
  },
  data: {
    type: Object || Array,
  },
  status: {
    type: String,
  },
  error: {
    type: String,
  },
  by: {
    type: String,
  },
  date: {
    type: String,
  },
  ip: {
    type: String,
  },
});

AuditSchema.pre("save", function (next) {
  if (!this.date) {
    this.date = new Date(Date.now()).toLocaleString("en-GB");
  }

  next();
});

const AuditModel = model("Auditing", AuditSchema);

module.exports = AuditModel;
