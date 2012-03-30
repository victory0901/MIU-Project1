
//MIU Project 1
//James Floyd II 
//March 30, 2012

//Wait for DOM to be ready
window.addEventListener("DOMContentLoaded", function(){

	//getElementById Function
	function $(x){
		var theElement = document.getElementById(x);
		return theElement;
	}
	//Create select field element and populate with options
	function makeCats(){
		var formTag = document.getElementsByTagName("form"), //formTag is an array of all forms
			selectLi= $("select"),
			makeSelect = document.createElement("select");
			makeSelect.setAttribute("id", "groups");
		for(var i=0, j=contactGroups.length; i<j; i++){
			var makeOption = document.createElement("option");
			var optText = contactGroups[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}	
		selectLi.appendChild(makeSelect);
	}
	
	//Find the value of selected radio button
	function getSelectedRadio(){
		var radios = document.forms[0].local;
		for(var i=0; i<radios.length; i++){
			if (radios[i].checked){
				purchaseValue = radios[i].value;
			}
		}
	}
	
	function toggleControls(n){
		switch(n){
			case "on":
				$("contactForm").style.display = "none";
				$("clear").style.display = "inline";
				$("displayLink").style.display = "none";
				$("addNew").style.display = "inline";
				break;
			case "off":
				$("contactForm").style.display = "block";
				$("clear").style.display = "inline";
				$("displayLink").style.display = "inline";
				$("addNew").style.display = "none";
				$("items").style.display = "none";
				break;
			default:
				return false;
		}
	}
	
	function storeData(key){
	//If there is no key, this means this is a brand new item and we need a new key.
	if(!key){
		var id  		= Math.floor(Math.random()*10000001);
	}else {
		//Set the id to the existing key we're editing so that it will save over the data.
		//The key is the same key that's been passed along from the editSubmit envent handler
		//To the validate function, and then passed here, into the storeData function.
		id = key;
	}
	getSelectedRadio();
	var item		= {};
		item.group		= ["Group:", $("groups").value];
		item.fname		= ["First Name:", $("fname").value];
		item.lname		= ["Last Name:", $("lname").value];
		item.gift		= ["Gift:", $("gift").value];
		item.quantity	= ["Quantity:", $("quantity").value];
		item.purchase	= ["Where to Buy:", purchaseValue]; 
		item.buydate	= ["Buy Date:", $("buydate").value];
		item.notes		= ["Notes:", $("notes").value];
		//Save data into Local Storage: Use Stringify to convert our object
		localStorage.setItem(id, JSON.stringify(item));
		alert("Contact Saved!");
		
	}
	
	function getData(){
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There is no data in local storage, so default data was added.");
			autoFillData();
		}
		//Write Data from Local Storage to the browser.
		var makeDiv = document.createElement("div");
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement("ul");
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$("items").style.display = "block";
		for(var i=0, len=localStorage.length; i<len; i++){
			var makeLi = document.createElement("li");
			var linksLi = document.createElement("li");
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert a string from local storage value back to an object by using JSON.parse
			var obj = JSON.parse(value);
			var makeSubList = document.createElement("ul");
			makeLi.appendChild(makeSubList);
			getImage(obj.group[1], makeSubList);
			for(var n in obj){
				var makeSubLi = document.createElement("li");
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi);  //Create our edit and delete buttons/links for each item in Local Storage
		}
	}
	
	//Get Image for the right category
	function getImage (catName, makeSubList){
		var imageLi = document.createElement("li");
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement("img");
		var setSrc= newImg.setAttribute("src", "images/"+ catName + ".png");
		imageLi.appendChild(newImg);
	}
	
	//Auto Populate Local Storage
	function autoFillData() {
		//The actual JSON JOBKJECT data required for this to work is coming from our json.js file, which is laoaded from our HTML page.
		//Store the JSON OBJECT in local storage.
		for(var n in json) {
			var id = Math.floor(Math.random()*10000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}
	
	//Make Item Links
	//Creat the edit and delete links for each stored item when displayed
	function makeItemLinks(key, linksLi){
		//add edit single item link
		var editLink = document.createElement("a");
		 editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Gift ";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText; 
		linksLi.appendChild(editLink);
		
		//add delete single item link
		var deleteLink = document.createElement("a");
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Gift";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	}
	
	function editItem(){
		//Grab the data from our item from Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		
		//Show the form
		toggleControls("off");
		
		//Populate the form fields with current localStorage values.
		$("groups").value = item.group[1];
		$("fname").value = item.fname[1];
		$("lname").value = item.lname[1];
		$("gift").value = item.gift[1];
		$("quantity").value = item.quantity[1];
		var radios = document.forms[0].local;
		for(var i=0; i<radios.length; i++){
			if(radios[i].value == "online" && item.purchase[1] == "online"){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "store" && item.purchase[1] == "store"){
				radios[i].setAttribute("checked", "checked");
			}
		}
		$("buydate").value = item.buydate[1];
		$("notes").value = item.notes[1];
		
		//Remove the initial listener from the input 'save contact' button.
		save.removeEventListener("click", storeData);
		//Change Submit button Value to say edit button
		$("submit").value = "Edit Contact";
		var editSubmit = $("submit");
		//Save the key value established in this function as aproperty of the editSubmit event
		//so we can use that value when we save the date we edited
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	}
	
	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this gift?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Gift was deleted!");
			window.location.reload();
		}else{
			alert("Gift was not deleted.")
		}
	}
	
	function clearLocal(){
		if(localStorage.length === 0){
			alert("There is no data to clear.")
		}else{
			localStorage.clear();
			alert("All gifts are deleted!");
			window.location.reload();
			return false;
		}
	}
	
	function validate(e){
		//Define the elements we want to check
		var getGroup = $("groups");
		var getFname = $("fname");
		var getLname = $("lname");
		var getGift = $("gift");
		
		//Reset Error Messages
		errMsg.innerHTML = "";
		getGroup.style.border = "1px solid black";
		getFname.style.border = "1px solid black";
		getLname.style.border = "1px solid black";
		getGift.style.border = "1px solid black";
		
		//Get error messages
		var messageAry = [];
		//Group validation
		if(getGroup.value === "--Choose A Group--"){
			var groupError = "Please choose a group.";
			getGroup.style.border = "1px solid red";
			messageAry.push(groupError);
		}
		
		//First Name Validation
		if(getFname.value === ""){
			var fNameError = "Please enter a first name.";
			getFname.style.border = "1px solid red";
			messageAry.push(fNameError);
		}
		
		//Last Name Validation
		if(getLname.value === ""){
			var lNameError = "Please enter a last name.";
			getLname.style.border = "1px solid red";
			messageAry.push(lNameError);
		}
		
		//Gift Validation
		if(getGift.value === ""){
			var giftError = "Please a gift.";
			getGift.style.border = "1px solid red";
			messageAry.push(giftError);
		}
		
		//If there were errors display them on the screen
		if(messageAry.length >= 1){
			for(var i=0, j=messageAry.length; i < j; i++){
				var txt = document.createElement("li");
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			e.preventDefault();
			return false;
		}else {
			//If all is ok save data! Send the key value (which came from the editData function)
			//Remember this key value was passed through the editSubmit event listener as a property.
			storeData(this.key);
		}
	}
	
	 //Variable Defaults
	var contactGroups = ["--Choose A Group--", "Family", "Non-Family"],
		purchaseVaule,
		errMsg = $("errors");
	;
	makeCats();

	//Set Link & Submit Click Events
	var displayLink =  $("displayLink");
	displayLink.addEventListener("click", getData);
	var clearLink = $("clear");
	clearLink.addEventListener("click", clearLocal); 
	var save = $("submit");
	save.addEventListener("click", validate);
});
