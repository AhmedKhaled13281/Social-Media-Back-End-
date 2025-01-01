const filterReqBody = (body, fields) => {
  let newObj = {};
  for (let field in body) {
    if (fields.includes(field)) {
      newObj[field] = body[field];
    }
  }

  return newObj;
};

module.exports = filterReqBody;
