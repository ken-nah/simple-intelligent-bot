exports.getLogin = (req, res) => {
  return res.render("auth/login", {
    pageTitle: "Login to your account"
  });
};
