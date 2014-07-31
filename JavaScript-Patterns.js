
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

// Usage:

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

// Usage:

var civic  = new Car("Honda Civic", 2014, 15000);
var mondeo = new Car("Ford Mondeo", 2012, 42000);

console.log( civic.toString()  );
console.log( mondeo.toString() );


// ------------------------------
//       The Module Pattern
// ------------------------------

// Good for seperating between Private & Public properties and methods

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

// Usage:

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

// More clear to understand and write but also more fragile to override than the Module Pattern

var myModule = (function(){

	var inventory = [];

	function private_function(){
		// I'm not available
	}

	function public_addItem(item){
		inventory.push(item);
		console.log("New item was added");
	}
	function public_itemCount(){
		return inventory.length;
	}
	function public_deleteItem(itemName){
		for (var key in inventory){
			var item = inventory[key];
			if (item.name.toLowerCase() === itemName.toLowerCase()){
				inventory.splice(key, 1);
				console.log(itemName + " was removed from the inventory");
			}
		}
	}

	return {
		add: public_addItem,
		delete: public_deleteItem,
		count: public_itemCount
	};
})();

// Usage:

myModule.add({name: "Lior", age: 30});
myModule.add({name: "John", age: 20});
myModule.count();
myModule.delete("Lior");
myModule.count();


// ------------------------------
//     The Singleton Pattern
// ------------------------------

// Use when only one object is needed to manage others accross the application
// Try to avoid this pattern | can be more difficult to test

var mySingleton = (function(){
	var instance;

	function init(){
		var type = "Car";
		var wheels = 4;
		var drive = true;

		function setDrive(status){
			drive = status;
		}

		var minPrice = 20000;
		var maxPrice = 60000;
		var price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;

		function information(){
			console.log("I'm a " + type + " with " + wheels + " wheels and I" + ((!drive) ? " can't" : "") + " drive");
		}

		return {
			drive: function(status){
				setDrive(status);
			},
			getPrice: function(){
				return price;
			},
			info: function(){
				information();
			}
		};
	}

	return {
		getInstance: function(){
			if (!instance){
				instance = init();
			}
			return instance;
		}
	};
})();

// Usage:

var single1 = mySingleton.getInstance();
var single2 = mySingleton.getInstance();

// single1.getPrice() === single2.getPrice(); => true

single1.info(); // I'm a Car with 4 wheels and I drive
single2.info(); // I'm a Car with 4 wheels and I drive 

single1.drive(false);
single1.info(); // I'm a Car with 4 wheels and I can't drive
single2.info(); // I'm a Car with 4 wheels and I can't drive 


// ------------------------------
//      The Observer Pattern
// ------------------------------

// The Observer
function Observer(){
	this.update = function(){
		console.log("I had been notified and I'll act accordinaly");
		// add code here to change when this event happen
	}
}

// The Observer List
function ObserverList(){
	this.observerList = [];
}
ObserverList.prototype = {
	add: function(obj){
		return this.observerList.push(obj);
	},
	count: function(){
		return this.observerList.length;
	},
	get: function(index){
		if (index > -1 && index < this.count()){
			return this.observerList[index];
		}
	},
	indexOf: function(obj, startIndex){
		for (var i = startIndex || 0; i < this.count(); i++){
			if (this.observerList[i] === obj){
				return i;
			}
		}
		return -1;
	},
	removeAt: function(index){
		this.observerList.splice(index, 1);
	}
};

// The Subject
function Subject(){
	this.observers = new ObserverList();
}
Subject.prototype = {
	add: function(observer){
		this.observers.add(observer);
	},
	remove: function(observer){
		this.observers.removeAt( this.observers.indexOf(observer) );
	},
	notify: function(context){
		for (var i=0; i < this.observers.count(); i++){
			this.observers.get(i).update(context);
		}
	}
};























