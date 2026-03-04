const parseLocationForValidation = (req, res, next) => {
  if (typeof req.body.location === "string") {
    try {
      const loc = JSON.parse(req.body.location);
      req.body.location = loc; // ab validator ko object milega
    } catch (e) {
      // agar parse fail hua to validation me hi catch ho jayega
    }
  }
  next();
};
module.exports = parseLocationForValidation;