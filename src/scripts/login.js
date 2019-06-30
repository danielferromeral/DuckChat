var solid = require('./solid.js');

  async function login() {
		let session = await solid.getSession();
		if (session == null)
			solid.loginNoPopup($('#desiredIDP').val());
	}

	async function loginS() {
		let session = await solid.getSession();
		if (session == null)
			solid.loginNoPopup('https://solid.community');
	}

  async function logout() {
		solid.logout();
	}


module.exports = {
    login: login,
		loginS: loginS,
    logout: logout
  }
