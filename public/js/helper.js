'use strict'
function similarityScore(a,b){
	a = a.toLowerCase();
	b = b.toLowerCase();
	var score = 0;
	var i = 0;
	var j = 0;
	var inc = 1;
	while(i<a.length && j<b.length){
		if(a[i] == b[j]){
			score += inc;
			inc = inc * 3;
			j++;
		}else{
			if(inc > 1) inc--;			
		}
		i++;
	}
	return score;
}

var movieSortFunction = function(a,b){
	return a.name.localeCompare(b.name);
}

function processString(a){
	a = a.toLowerCase();
	return a.replace(/[ `~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}
function SortBasedOnSearchQuery(searchString){
	return function(a,b){
		a = a.name;
		b = b.name;
		a = processString(a);
		b = processString(b);
		var scoreA = similarityScore(a,searchString);
		var scoreB = similarityScore(b,searchString);

		if(scoreA < scoreB){
			return 1;
		}else if(scoreA > scoreB){
			return -1
		}else
			return 0;	
	}
}

function LCS(a, b) {
    var m = a.length, n = b.length,
        C = [], i, j;
    for (i = 0; i <= m; i++) C.push([0]);
    for (j = 0; j < n; j++) C[0].push(0);
    for (i = 0; i < m; i++)
        for (j = 0; j < n; j++)
            C[i+1][j+1] = a[i] === b[j] ? C[i][j]+1 : Math.max(C[i+1][j], C[i][j+1]);
    return (function bt(i, j) {
        if (i*j === 0) { return ""; }
        if (a[i-1] === b[j-1]) { return bt(i-1, j-1) + a[i-1]; }
        return (C[i][j-1] > C[i-1][j]) ? bt(i, j-1) : bt(i-1, j);
    }(m, n));
}


var test = function(){
	var a = processString("Avengers.Age.of.Ultron.2015.720p.BluRay.x264.YIFY.mp4");
	var b = processString("Rick and Morty S02E01.webm");

	console.log(similarityScore(a,'S02'));
	console.log(similarityScore(b,'S02'));
}


var extTypes = {
    ".mp4": "video/mp4",
    ".flv"   : "video/x-flv",
    '.webm' : 'video/webm',
    '.mkv' : 'video/webm'
}


function getExt(path) {
    var i = path.lastIndexOf('.');
    return (i < 0) ? '' : path.substr(i);
}

function getContentType (ext) {
    return extTypes[ext.toLowerCase()] || 'application/octet-stream';
}
// class TrieItem{
// 	constructor(str,serial){
// 		this.str = str;
// 		this.serial = serial;
// 		this.items = str.split(/[ `~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi);
// 	}
// 	toString(){
// 		console.log(this.str);
// 		for(var i=0;i<this.items.length;i++){
// 			console.log(this.items[i]);
// 		}
// 	}	
// }

// class Trie{
// 	constructor(){
// 		this.items = [];
// 		this.count = 0;
// 	}
// 	add(str){
// 		str = str.toLowerCase();
// 		this.items.push(new TrieItem(str,count));
// 		count++;
// 	}
// }



// test();



// var a = new TrieItem("ankur.rana");
// a.toString();