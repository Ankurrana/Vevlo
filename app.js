var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path')
var config = require('./config.js');
var files = [];
var vidId;	 

function readRangeHeader(range, totalLength) {
    if (range == null || range.length == 0)
        return null;
    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    var start = parseInt(array[1]);
    var end = parseInt(array[2]);
    var result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength - 1) : end
    };
    
    if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }

    return result;
}
app.param('video', function(req, res, next, video) {
  req.video = video;
  next();
});

app.use('/video/:video',function(req,res){	
	var videoId = req.video;
	var videoPath = path.resolve(files[videoId]);
	var stat;
	stat = fs.statSync(videoPath);

	var rangeRequest = readRangeHeader(req.headers['range'], stat.size);

	 if (rangeRequest == null) {
	 	console.log('Browser din\'t request any range');
		res.setHeader('Content-Length',stat.size);
		res.setHeader('Accept-Ranges','bytes');
        var VFile = fs.createReadStream(videoPath,{'start':start,'end':end});
        VFile.pipe(res);
        return null;
    }

    var start = rangeRequest.Start ;
    var end = rangeRequest.End;
	console.log('Range Request ' + JSON.stringify(rangeRequest));
	

	if (start >= stat.size || end >= stat.size) {
        res.setHeader('Content-Range','bytes */' + stat.size);
        res.status(416).send(null);
        return null;
    }


	res.setHeader('Content-Type','video/webm')
	res.setHeader('Content-Range','bytes '+ start + '-' + end + '/' + stat.size );
	res.setHeader('Accept-Ranges','bytes');
	res.setHeader('Content-Length',end-start+1);
	res.setHeader('Cache-Control','no-cache')
 	var VFile = fs.createReadStream(videoPath,{'start':start,'end':end});
	res.status(206)
	VFile.pipe(res);
});


app.use('/download/:video',function(req,res){
    var videoId = req.video;
    var videoPath = path.resolve(files[videoId]);
    var VFile = fs.createReadStream(videoPath);
    // res.setHeader('Content-Type','video/webm');
    // console.log('A Download Request is recieved!');
    res.download(videoPath,files[videoId].split('/').slice(-1)[0]);
})

var getFiles = function(_path, files){
    var acceptedExtensions = config.mimes;
    fs.readdirSync(_path).forEach(function(file){
        var subpath = _path + '/' + file;
        if(fs.lstatSync(subpath).isDirectory()){
            getFiles(subpath, files);
        } else {
        	var extention = path.extname(file);
        	if( acceptedExtensions.indexOf(extention) >= 0 ){
        		files.push(_path + '/' + file )
        	}
        }
    });
}

var setup = function(){	
	var directoriesToCheck = config.directories;
	for(var i=0;i<directoriesToCheck.length;i++){
		getFiles(directoriesToCheck[i],files);
	}
}





app.get('/videos',function(req,res){
	var result = [];
	for(var i=0;i<files.length;i++){
		var Movie = {
			'name' : files[i].split('/').slice(-1)[0],
			'id' : i
		}
		result.push(Movie); 
	}
	res.send(result);
})

app.get('/',function(req,res){
	var  vidId = req.query.num;
	var indexFile = path.resolve(__dirname,'public/index.html');
	res.sendFile(indexFile);
})
app.use('/public',express.static(__dirname + "/public"));


app.listen('3001',function(req,res){
	setup();
	console.log('Started Listening to port 3001');
})
