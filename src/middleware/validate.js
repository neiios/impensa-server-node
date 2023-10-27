function validEmail(userEmail) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    userEmail
  );
}

export function validateRegistrationData(req, res, next) {
  const { email, name, password } = req.body;

  if (![email, name, password].every(Boolean)) {
    return res.status(400).json("Missing Credentials");
  }
  if (!validEmail(email)) {
    return res.status(400).json("Invalid Email");
  }

  next();
}

export function validateLoginData(req, res, next) {
  const { email, password } = req.body;

  if (![email, password].every(Boolean)) {
    return res.status(400).json("Missing Credentials");
  }
  if (!validEmail(email)) {
    return res.status(400).json("Invalid Email");
  }

  next();
}
