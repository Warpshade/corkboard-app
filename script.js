$(function() {
	
	//TODO: Mouseup while resizing element doesn't save resize if mouse no longer
	// on the note. Might be best to rethink current structure to remove this as
	// an issue.
	
	//TODO: Needs import/export control
	
	var borderThick = 8;
	
	var lastId = 0;
	var notes;
	var lastHeight = 0;
	if(localStorage.getItem("notes") == null)
		notes = new Array();
	else {
		notes = JSON.parse(localStorage.getItem("notes"));
		console.log(notes);
		notes.forEach(function(currNote, ind,arr) {		
			if(currNote.id > lastId) {
				lastId = currNote.id;
			}
			if(currNote.z > lastHeight)
				lastHeight = currNote.z;
			noteHtml = $("<div class = 'note-container' data-id = "+currNote.id+" style = 'position:absolute; top:"+currNote.y+"px;left:"+currNote.x+"px;z-index:"+currNote.z+"' ><textarea class='note-body' style='width:"+currNote.width+"px;height:"+currNote.height+"px;'>"+currNote.content+"</textarea></div>");
			$(noteHtml).append("<img src = 'pin.png' data-id = "+currNote.id+"  class = \"control-pin\"/>");
			if(currNote.pinned) {
				$(noteHtml).append("<img src = 'pin-right.png' data-id = "+currNote.id+"  class = \"lock-pin\"/>");
			}
			else {
				$(noteHtml).append("<img src = 'pin-right-hole.png' data-id = "+currNote.id+"  class = \"lock-pin-gone\"/>");
			}
			
			console.log(currNote.content);
			$("div#canvas").append(noteHtml);
		});
		
	}
	var isDraggingNote = 0;
	
	var dragTarget;
	var dragOffsetX = 0;
	var dragOffsetY = 0;
	var Note = function(x,y,h,w,content,z,pinned){		
		this.id = ++lastId;
		this.x = x;
		this.y = y;
		this.height = h;
		this.width = w;
		this.content = content;
		this.z = z;
		this.pinned = pinned;
	}
	
	var SaveData = function() {
		localStorage.setItem("notes",JSON.stringify(notes));
	}
	
	var DeleteItem = function(dataId) {

		var targNote = notes.findIndex(function(elem) {
			return elem.id == dataId;
		});
		var target = $(".note-container").filter(function(elem) {			
			return $(this).attr("data-id") == dataId;
		});
		if(notes[targNote].pinned == false) {
			notes.splice(targNote,1);
			$(target).remove();	
		}
		
		
		
		SaveData();
	}
	$("div#canvas").on("mouseover",function(event) {
		/*
		console.log("{");
		console.log("ScreenX",event.screenX,"ScreenY",event.screenY);
		console.log("ClientX",event.clientX,"clientY",event.clientY);
		console.log("PageX",event.pageX,"pageY",event.pageY);
		console.log("OffsetX",event.offsetX,"OffsetY",event.offsetY);
		console.log("ScrollLeft+ClientX",event.clientX+$("#canvas").scrollLeft(),"ScrollTop+ClientY",event.clientY+$("#canvas").scrollTop());
		console.log("}");
		*/
		
	});
	$("div#canvas").on("click",".control-pin",function(event) {
		DeleteItem($(this).attr("data-id"));
		event.stopImmediatePropagation();
	});
	
	$("div#canvas").on("mousedown",".control-pin",function(event) {
		
		event.stopImmediatePropagation();
	});
	
	
	$("div#canvas").on("click","img.lock-pin-gone",function(event) {
		$(this).removeClass("lock-pin-gone").addClass("lock-pin");
		$(this).attr("src","pin-right.png");
		var tId = $(this).attr("data-id");
		var targNote = notes.findIndex(function(elem) {
			return elem.id == tId;
		});
		notes[targNote].pinned = true;
		SaveData();
		event.stopImmediatePropagation();
	});
	
	$("div#canvas").on("click","img.lock-pin",function(event) {
		$(this).removeClass("lock-pin").addClass("lock-pin-gone");
		$(this).attr("src","pin-right-hole.png");
		var tId = $(this).attr("data-id");
		var targNote = notes.findIndex(function(elem) {
			return elem.id == tId;
		});
		notes[targNote].pinned = false;
		SaveData();
		event.stopImmediatePropagation();
	});
	
	$("div#canvas").on("click",".note-container", function(event) {
		//console.log("?");
		console.log("click-note-container");
		event.stopImmediatePropagation();		
	});
	
	$("div#canvas").on("mousedown",".note-body", function(event) {
		console.log("mousedown-note-body");
		event.stopImmediatePropagation();		
	});
	
	$("div#canvas").on("mouseup",".note-body", function(event) {
		console.log("MouseUp, note-body");
		//event.stopImmediatePropagation();		
	});
	
	$("div#canvas").on("mousedown",".note-container", function(event) {
		//console.log("mousedown-note-container");
		var tHeight = $(this).height();
		var tTop = $(this).css("top").slice(0,-2);
		var tId = $(this).attr("data-id");
		var targNote = notes.findIndex(function(elem) {
			return elem.id == tId;
		});
		console.log(notes[targNote]);
		$(this).css("z-index",++lastHeight);
		if(event.clientY < tHeight+(tTop-20) && (notes[targNote].pinned == false)) {
			isDraggingNote = 1;
			dragTarget = this;
		}
		
		event.stopImmediatePropagation();		
	});
	$("div#canvas").on("mousemove", function(event) {
		//console.log("?");
		if(isDraggingNote == 1) {
			isDraggingNote = 2;
			dragOffsetX = event.offsetX+borderThick;
			dragOffsetY = event.offsetY+borderThick;
		}
		if(isDraggingNote == 2) {
			var tId = $(dragTarget).attr("data-id");
			var targNote = notes.findIndex(function(elem) {
				return elem.id == tId;
			});
			
			
			
			var x = event.clientX-dragOffsetX + $("#canvas").scrollLeft();
			//var x = event.clientX-100;
			//var y = event.clientY-16;
			var y = event.clientY-dragOffsetY + $("#canvas").scrollTop();
			//console.log("1",event.clientX,dragOffsetX),
			//console.log("1",event.clientY,dragOffsetY),
			//console.log("3",x,y)
			$(dragTarget).css("top",y);
			$(dragTarget).css("left",x);
			
			notes[targNote].x = x;
			notes[targNote].y = y;		
			localStorage.setItem("notes",JSON.stringify(notes));			
		}
		event.stopImmediatePropagation();		
	});
	$("div#canvas").on("mouseup",".note-container", function(event) {
		console.log("Mouse-up, note container?");
		if(isDraggingNote != 0) {
			isDraggingNote = 0;
		}
		var tId = $(this).attr("data-id");
		var targNote = notes.findIndex(function(elem) {
			return elem.id == tId;
		});
		console.log("Note Container");
		notes[targNote].width = $(this).width()-40;
		notes[targNote].height = $(this).height();
		notes[targNote].z = $(this).css("z-index");
		localStorage.setItem("notes",JSON.stringify(notes));
		
		
		event.stopImmediatePropagation();		
	});
	$("div#canvas").on('change keyup paste',".note-container", function(event) {
		//console.log("!!!")
		var tId = $(this).attr("data-id");
		var targNote = notes.findIndex(function(elem) {
			return elem.id == tId;
		});
		notes[targNote].content = $(this).children(".note-body").val();
		localStorage.setItem("notes",JSON.stringify(notes));
	});
	
	$("div#canvas").on("click", function(event){
		console.log("!");
		var w = 200;
		var h = 300;
		var x = event.clientX - (w/2);
		var y = event.clientY - 15;
		var newNote = new Note(x,y,h,w,"",++lastHeight,false);
		//console.log(newNote);
		
		noteHtml = $("<div data-id = "+newNote.id+" class = 'note-container' style = 'position:absolute; top:"+newNote.y+"px;left:"+newNote.x+"px;z-index="+newNote.z+"'><textarea class='note-body' style='width:"+newNote.width+"px;height:"+newNote.height+"px;'></textarea></div>");
		$(noteHtml).append("<img src = 'pin.png' data-id = "+newNote.id+"  class = \"control-pin\"/>");
		notes.push(newNote);
		localStorage.setItem("notes",JSON.stringify(notes));
		$("div#canvas").append(noteHtml);
		
		
		
	})
	
})
