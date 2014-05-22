var jobselected;

//onload action, loads jobs
function welcomeScreen(){
	//loads existing jobs
	if (localStorage["timepunch.totaljobs"] != null){
		for(var count = 0; count < parseInt(localStorage["timepunch.totaljobs"]); count ++){
			jobname = localStorage["timepunch.job" + count + ".name"];
			document.getElementById("view").innerHTML += '<button class="jobs" id="' + count + '" onfocus="selectJob(this.id)" onblur="deselect()"> ' + jobname + '</button>';
		}
	}
	//initializes job count
	//first time app is loaded
	else {
		localStorage["timepunch.totaljobs"] = 0;
	}
}


//onfocus action
function selectJob(id){
	document.getElementById("sel").disabled = false;
	document.getElementById("del").disabled = false;
	jobselected = id;
}

//onblur action
function deselect(){
	document.getElementById("sel").disabled = true;
	document.getElementById("del").disabled = true;
}

//"select" button
function beginPunching(){
	document.getElementById("view").innerHTML = "";
	document.getElementById("sel").disabled = true;
	document.getElementById("del").disabled = true;
	if (localStorage["timepunch.job" + jobselected + ".punchedin"] == "true"){
		var totalpunches = parseInt(localStorage["timepunch.job" + jobselected + ".totalpunches"]) - 1;
		var lastpunch = new Date(localStorage["timepunch.job" + jobselected + ".punch" + totalpunches].toString());
		document.getElementById("view").innerHTML += ("Last Punched in on " + lastpunch.toString().substring(0, 16) + " at " + 
				lastpunch.toLocaleTimeString().substring(0, 5) + lastpunch.toLocaleTimeString().substring(8, 11) + "<br />");
		document.getElementById("in").disabled = true;
		document.getElementById("out").disabled = false;
	}
	document.getElementById("intro").style.width = "0px";
	document.getElementById("punch").style.width = "370px";
}

//"delete" button
function deleteJob(){
	localStorage["timepunch.totaljobs"] = parseInt(localStorage["timepunch.totaljobs"]) - 1;
	var totalpunches = localStorage["timepunch.job" + jobselected + ".totalpunches"];
	for (var i = 0; i < totalpunches; i ++){
		delete(localStorage["timepunch.job" + jobselected + ".punch" + i]);
	}
	delete(localStorage["timepunch.job" + jobselected + ".punchedin"]);
	delete(localStorage["timepunch.job" + jobselected + ".name"]);
	delete(localStorage["timepunch.job" + jobselected + ".totalpunches"]);
	document.getElementById("view").removeChild(document.getElementById(jobselected));
}

//"add" button
function addJob(){
	var jobname = prompt("Please give this new job a name.");
	if (jobname != null){
			var totaljobs = localStorage["timepunch.totaljobs"];
			localStorage["timepunch.job" + totaljobs + ".name"] = jobname;
			document.getElementById("view").innerHTML += '<button class="jobs" id="' + totaljobs + '" onclick="selectJob(this.id)">' + jobname + '</button>';
			localStorage["timepunch.job" + totaljobs + ".totalpunches"] = 0;
			localStorage["timepunch.totaljobs"] = parseInt(localStorage["timepunch.totaljobs"]) + 1;
	}
}

//"punch in" button
function punchIn(){
	localStorage["timepunch.job" + jobselected + ".punchedin"] = "true";
	var now = new Date();
	localStorage["timepunch.job" + jobselected + ".punch" + localStorage["timepunch.job" + jobselected + ".totalpunches"]] = now;
	var totalpunches = localStorage["timepunch.job" + jobselected + ".totalpunches"]
	var lastpunch = new Date(localStorage["timepunch.job" + jobselected + ".punch" + totalpunches]);
	document.getElementById("view").innerHTML += ("Punched in on " + lastpunch.toString().substring(0, 16) + " at " + 
			lastpunch.toLocaleTimeString().substring(0, 5) + lastpunch.toLocaleTimeString().substring(8, 11) + "<br />");
	localStorage["timepunch.job" + jobselected + ".totalpunches"] = parseInt(localStorage["timepunch.job" + jobselected + ".totalpunches"]) + 1;
	document.getElementById("in").disabled  = true;
	document.getElementById("out").disabled = false;
}

//"punch out" button
function punchOut(){
	localStorage["timepunch.job" + jobselected + ".punchedin"] = "false";
	var now = new Date();
	localStorage["timepunch.job" + jobselected + ".punch" + localStorage["timepunch.job" + jobselected + ".totalpunches"]] = now;
	var totalpunches = localStorage["timepunch.job" + jobselected + ".totalpunches"]
	var lastpunch = new Date(localStorage["timepunch.job" + jobselected + ".punch" + totalpunches]);
	document.getElementById("view").innerHTML += ("Punched out on " + lastpunch.toString().substring(0, 16) + " at " + 
			lastpunch.toLocaleTimeString().substring(0, 5) + lastpunch.toLocaleTimeString().substring(8, 11) + "<br />");
	localStorage["timepunch.job" + jobselected + ".totalpunches"] = parseInt(localStorage["timepunch.job" + jobselected + ".totalpunches"]) + 1;
	document.getElementById("in").disabled  = false;
	document.getElementById("out").disabled = true;
	var jobname = localStorage["timepunch.job" + jobselected + ".name"].toLowerCase();
	if ((jobname.indexOf("sport") > -1 || jobname.indexOf("ngin") > -1) && now.getDay() === 5) alert("Email Mike your Hours.");
}

//"weekly summary" button
function printWeeklySummary(){
	if (localStorage["timepunch.job" + jobselected + ".punchedin"] == "false"){
		document.getElementById("view").innerHTML = "";
		var totalhours = 0;
		var totalminutes = 0;
		var startingpunch = localStorage["timepunch.job" + jobselected + ".totalpunches"] - 2;
		var targetdate = new Date(localStorage["timepunch.job" + jobselected + ".punch" + startingpunch]);
		targetdate = new Date(targetdate.getFullYear(), targetdate.getMonth(), targetdate.getDate() - 6);
		do {
			startingpunch -= 2;
			var testdate = new Date(localStorage["timepunch.job" + jobselected + ".punch" + startingpunch]);
		}while(testdate > targetdate);
		startingpunch += 2;
		for (var count = startingpunch; count < localStorage["timepunch.job" + jobselected + ".totalpunches"]; count += 2){
			var curpunchin = new Date(localStorage["timepunch.job" + jobselected + ".punch" + count]);
			var curpunchout = new Date(localStorage["timepunch.job" + jobselected + ".punch" + (count + 1)]);
			if (count > 1) document.getElementById("view").innerHTML += "<br />";
			document.getElementById("view").innerHTML += curpunchin.toString().substring(0, 16);
			document.getElementById("view").innerHTML += curpunchin.toLocaleTimeString().substring(0, 5) + curpunchin.toLocaleTimeString().substring(8, 11) + " - " +
					curpunchout.toLocaleTimeString().substring(0, 5) + curpunchout.toLocaleTimeString().substring(8, 11);
			totalhours += curpunchout.getHours() - curpunchin.getHours();
			totalminutes += curpunchout.getMinutes() - curpunchin.getMinutes();
		}
		if (totalminutes < 0){
			totalhours += Math.ceil(totalminutes / 60);
			totalminutes = 60 + (totalminutes % 60);
		}
		else {
			totalhours += Math.floor(totalminutes / 60);
			totalminutes = totalminutes % 60;
		}
		document.getElementById("view").innerHTML += "<br /><br /><strong>Total:</strong> " + totalhours + ":" + totalminutes + "<br />";
	}
	else {
		alert("Please punch out before viewing hours.");
	}
}

//"all time" button
function printAllTime(){
	if (localStorage["timepunch.job" + jobselected + ".punchedin"] == "false"){
		document.getElementById("view").innerHTML = "";
		var totalhours = 0;
		var totalminutes = 0;
		for(var count = 0; count < parseInt(localStorage["timepunch.job" + jobselected + ".totalpunches"]); count += 2){
			var curpunchin = new Date(localStorage["timepunch.job" + jobselected + ".punch" + count]);
			var curpunchout = new Date(localStorage["timepunch.job" + jobselected + ".punch" + (count + 1)]);
			if (count > 1){
				var previouspunch = new Date(localStorage["timepunch.job" + jobselected + ".punch" + count - 2]);
				if (curpunchin.getDate() == previouspunch.getDate()){
					document.getElementById("view").innerHTML += " " + curpunchin.toLocaleTimeString().substring(0, 5) + curpunchin.toLocaleTimeString().substring(8, 11) + " - " +
						curpunchout.toLocaleTimeString().substring(0, 5) + curpunchin.toLocaleTimeString().substring(8, 11);
				}
				else {
					document.getElementById("view").innerHTML += " <br />";
					document.getElementById("view").innerHTML += curpunchin.toString().substring(0, 16);
					document.getElementById("view").innerHTML += curpunchin.toLocaleTimeString().substring(0, 5) + curpunchin.toLocaleTimeString().substring(8, 11) + " - " +
						curpunchout.toLocaleTimeString().substring(0, 5) + curpunchin.toLocaleTimeString().substring(8, 11);
				}
			}
			else {
				document.getElementById("view").innerHTML += curpunchin.toString().substring(0, 16);
				document.getElementById("view").innerHTML += curpunchin.toLocaleTimeString().substring(0, 5) + curpunchin.toLocaleTimeString().substring(8, 11) + " - " +
					curpunchout.toLocaleTimeString().substring(0, 5) + curpunchin.toLocaleTimeString().substring(8, 11);
			}
			totalhours += curpunchout.getHours() - curpunchin.getHours();
			totalminutes += curpunchout.getMinutes() - curpunchin.getMinutes();
		}
		totalhours += Math.floor(totalminutes / 60);
		totalminutes = totalminutes % 60;
		document.getElementById("view").innerHTML += "<br /><br /><strong>Total:</strong> " + totalhours + ":" + totalminutes + "<br />";
	}
	else {
		alert("Please punch out before viewing hours.");
	}
}

//"back" button
function back(){
	document.getElementById("view").innerHTML = "";
	document.getElementById("intro").style.width = "370px";
	document.getElementById("punch").style.width = "0px";
	welcomeScreen();
}