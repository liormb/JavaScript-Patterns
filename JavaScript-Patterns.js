
// ------------------------------
//    Object Literal (Module)
// ------------------------------

var myModule = {
	myConfig: {
		language: "en",
		chaching: true
	},
	sayHello: function(){
		console.log("Hello");
	},
	checkChaching: function(){
		console.log("Chaching is: " + ( this.myConfig.chaching ? "Enabled" : "Disabled" ));
	},
	updateConfig: function(newConfig){
		if (typeof newConfig === 'object'){
			this.myConfig = newConfig;
			console.log("Configuration has been updated");
		}
	}
};

myModule.sayHello();
myModule.checkChaching();
myModule.updateConfig({
	language: "fr",
	chaching: false
});
myModule.checkChaching();


// ------------------------------
//    The Constructor Pattern
// ------------------------------

function Car(model, year, miles){
	this.model = model;
	this.year  = year;
	this.miles = miles;
}
Car.prototype.toString = function(){
	return this.model + " has done " + this.miles + " miles";
};

var civic  = new Car("Honda Civic", 2014, 15000);
var mondeo = new Car("Ford Mondeo", 2012, 42000);

console.log( civic.toString()  );
console.log( mondeo.toString() );


// ------------------------------
//       The Module Pattern
// ------------------------------

// Good for seperating between Private & Public parameters and methods

var bank = (function(){
	// private
	var password;
	var balance = 0;
	var logged = false;

	var checkPassword = function(pass){
		return (password === pass);
	};

	var checkLogin = function(){
		if (!logged) console.log("Please login first");
		return logged; 
	};

	// public
	return {
		setPassword: function(pass){
			password = pass;
			return this;
		},
		login: function(pass){
			if (!password){
				console.log("Please set a password first");
				return this;
			}

			if (checkPassword(pass)){
				logged = true;
				console.log("You're now logged-in");
			} else {
				console.log("Check your password and try again");
			}
			return this;
		},
		logout: function(){
			logged = false;
			console.log("You're logged out");
			return this;
		},
		deposit: function(amount){
			if (checkLogin()){
				balance += amount;
				console.log("Your deposit of $" + amount + " was accepted");
			}
			return this;
		},
		redraw: function(amount){
			if (checkLogin()){
				if (balance - amount >= 0){
					balance -= amount;
				} else {
					console.log("Your balance doesn't allow you to redraw $" + amount);
				}
			}
			return this;
		},
		currentBalance: function(){
			if (checkLogin()){
				console.log("Current balance: " + balance);
			}
			return this;
		}
	};
})();

bank.setPassword("1234").
	login("1234").
	currentBalance().
	deposit(100).
	redraw(60).
	currentBalance().
	logout();


// Another implementation of a Module Pattern
// jQuery Plugin / Extention 
var myModulePlugin = (function(jQ){

	function privateMethod(){
		jQ(".container").html("Test");
	}

	return {
		publicMethod: function(){
			privateMethod();
		}
	};
})(jQuery);


// ------------------------------
//    Revealing Module Pattern
// ------------------------------











