// Obtaining Data object from string
function dateFromString(dateString) {
	var date;
	// Some hardcoding for handling Toggl strings for today and yesterday
	if (dateString == "Today") {
		date = new Date();
	} else if (dateString == "Yesterday") {
		date = new Date();
		// Yesterday = today - 24 hours :)
		date.setTime(date.getTime() - 24*60*60*1000);
	} else if (dateString.split(",").length != 1){
		date = new Date(dateString.split(",")[1]);
	} else {
		date = new Date(dateString);
	}
	return date;
}

// Obtaining Data object with correct time from string with time. Handles both
//	24h (HH:MM) and 12h (HH:MM [AM/PM]) format
function timeFromString(timeString) {
	var time;
	var ampmAdjust = false;
	var pmAdjust = false;
	var hours;
	var minutes;
	
	// Some string parsing hardcoding
	if (timeString.includes("AM")) {
		timeString = timeString.slice(0, timeString.search("AM")-1);
		ampmAdjust = true;
	} else if (timeString.includes("PM")) {
		timeString = timeString.slice(0, timeString.search("PM")-1);
		ampmAdjust = true;
		pmAdjust = true;
	}
	timeString.trim();
	
	// Get hours and minutes
	timeParts = timeString.split(":");
	hours = timeParts[0];
	minutes = timeParts[1];
	
	// Converting strange AM/PM hours numbers to 24h format
	if (ampmAdjust) {
		hours = hours % 12;
	}
	if (pmAdjust) {
		hours = hours + 12;
	}
	
	// Year, month and date are not used, its just arbitrary numbers
	return new Date(2000,01,01,hours,minutes, 0, 0);
}

// Function for getting Data object from <span> with two time stamps: begin and 
//	end of working interval
function getEntryTime(timeSpan, query) {
	var dateNode;
	// Hardcoding for obtaining span with date for current time 
	dateNode = timeSpan.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("date-container")[0].getElementsByClassName("title");
	
	// Obtaining Date object from string
	var date = dateFromString(dateNode[0].innerHTML);
	
	// Splitting start time from end time
	times = timeSpan.innerHTML.split("–");
	for (j=0; j < times.length; j++) {
		times[j] = times[j].trim();
	}
	
	// Setting index according to query
	var timeId;
	if (query == "Start") {
		timeId = 0;
	} else if (query == "End") {
		timeId = 1;
	}
	
	// Obtaining Date object with time from string
	time = timeFromString(times[timeId]);
	
	// Forming final date
	var result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), 0, 0);
	return result;
}

// Main function, which iterates over all spans with time of working intervals and
//	checks consistency for all of them (marking inconsisten ones with red color)
function checkConsistency() {
	entryTimes = document.getElementsByClassName('entry-time');
	for (i=0; i < entryTimes.length-1; i++)
	{
		var endTime = getEntryTime(entryTimes[i+1], "End");
		
		var startTime = getEntryTime(entryTimes[i], "Start");
		
		// First reset color to default (in case of corrected time)
		entryTimes[i].style.color = "#888888"
		entryTimes[i+1].style.color = "#888888"
		
		// Then mark overlapped time spans with red color
		if (endTime > startTime) {
			entryTimes[i].style.color = "#FF0000"
			entryTimes[i+1].style.color = "#FF0000"
			console.log("WAT");
			console.log(endTime);
			console.log(startTime);
		}
	}
	
	// Setting timeout to the next check
	setTimeout(function(){ checkConsistency() }, 1000);
}

// After finishing loading page body, check consistency will run every second
document.body.onload = function() {
	setTimeout(function(){ checkConsistency() }, 1000);
}