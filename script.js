$(function() {
	/*
	var c=document.getElementById("canvas");
	var ctx=c.getContext("2d");
	ctx.canvas.width  = window.innerWidth-16;
	ctx.canvas.height = window.innerHeight-16;

	var bgImg=document.getElementById("corkboard");
	var bgPat=ctx.createPattern(bgImg,"repeat");
	ctx.rect(0,0,window.innerWidth-16,window.innerHeight-16);
	ctx.fillStyle=bgPat;
	ctx.fill();
	*/
	var lastId = 0;
	var notes;
	var lastHeight = 0;
	if(localStorage.getItem("notes") == null)
		notes = new Array();
	else {
		notes = JSON.parse(localStorage.getItem("notes"));
		notes.forEach(function(currNote, ind,arr) {		
			lastId++;
			if(currNote.z > lastHeight)
				lastHeight = currNote.z;
			noteHtml = "<textarea data-id = "+currNote.id+" class='note' style = 'width:"+currNote.width+"px;height:"+currNote.height+"px; position:absolute; top:"+currNote.y+"px;left:"+currNote.x+"px;z-index:"+currNote.z+"'>"+currNote.content+"</textarea>";
			console.log(currNote.content);
			$("div#canvas").append(noteHtml);
		});
		
	}
	var isDraggingNote = 0;
	
	var dragTarget;
	var dragOffsetX = 0;
	var dragOffsetY = 0;
	var Note = function(x,y,h,w,content,z){		
		this.id = ++lastId;
		this.x = x;
		this.y = y;
		this.height = h;
		this.width = w;
		this.content = content;
		this.z = z;
	}
	
	$("div#canvas").on("click",".note", function(event) {
		//console.log("?");
		
		event.stopImmediatePropagation();		
	});
	$("div#canvas").on("mousedown",".note", function(event) {
		//console.log("?");
		var tHeight = $(this).height();
		var tTop = $(this).css("top").slice(0,-2);
		$(this).css("z-index",++lastHeight);
		if(event.clientY < tHeight+(tTop-16)) {
			isDraggingNote = 1;
			dragTarget = this;
		}
		
		event.stopImmediatePropagation();		
	});
	$("div#canvas").on("mousemove", function(event) {
		//console.log("?");
		if(isDraggingNote == 1) {
			isDraggingNote = 2;
			dragOffsetX = event.offsetX;
			dragOffsetY = event.offsetY;
		}
		if(isDraggingNote == 2) {
			var tId = $(dragTarget).attr("data-id");
			var targNote = notes.findIndex(function(elem) {
				return elem.id == tId;
			});
			
			
			
			var x = event.clientX-dragOffsetX;
			//var x = event.clientX-100;
			//var y = event.clientY-16;
			var y = event.clientY-dragOffsetY;
			console.log("1",event.clientX,dragOffsetX),
			console.log("1",event.clientY,dragOffsetY),
			console.log("3",x,y)
			$(dragTarget).css("top",y);
			$(dragTarget).css("left",x);
			
			notes[targNote].x = x;
			notes[targNote].y = y;		
			localStorage.setItem("notes",JSON.stringify(notes));			
		}
		event.stopImmediatePropagation();		
	});
	$("div#canvas").on("mouseup",".note", function(event) {
		//console.log("?");
		isDraggingNote = 0;
		var tId = $(dragTarget).attr("data-id");
		var targNote = notes.findIndex(function(elem) {
			return elem.id == tId;
		});
		notes[targNote].width = $(dragTarget).width();
		notes[targNote].height = $(dragTarget).height();
		notes[targNote].z = $(dragTarget).css("z-index");
		localStorage.setItem("notes",JSON.stringify(notes));
		event.stopImmediatePropagation();		
	});
	$("div#canvas").on('change keyup paste',".note", function(event) {
		console.log("!!!")
		var tId = $(this).attr("data-id");
		var targNote = notes.findIndex(function(elem) {
			return elem.id == tId;
		});
		notes[targNote].content = $(this).val();
		localStorage.setItem("notes",JSON.stringify(notes));
	});
	
	$("div#canvas").on("click", function(event){
		console.log("!");
		var w = 200;
		var h = 300;
		var x = event.clientX - (w/2);
		var y = event.clientY - 15;
		var newNote = new Note(x,y,h,w,"",++lastHeight);
		//console.log(newNote);
		
		noteHtml = "<textarea data-id = "+newNote.id+" class='note' style = 'width:"+newNote.width+"px;height:"+newNote.height+"px; position:absolute; top:"+newNote.y+"px;left:"+newNote.x+"px;z-index="+newNote.z+"'></textarea>";
		
		notes.push(newNote);
		localStorage.setItem("notes",JSON.stringify(notes));
		$("div#canvas").append(noteHtml);
		
		
		
	})
	
})
