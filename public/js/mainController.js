'use strict'
app.controller('mainController',['$scope','$http',function($scope,$http){
	var that = this;

	$scope.appName = 'Vevlo';
	$scope.title = 'Vevlo';
	$scope.movies = [];
	that.movies = [];
	that.filteredMovies = [];
	$scope.searchQuery = undefined;
	$scope.currentMovie = "";




	class Movie{
		constructor(id,name){
			this.name = name;
			this.id = id;
		}
		getName(){
			return this.name;
		}
		getId(){
			return this.id;
		}
		run(){
			var video = document.getElementById('mainPlayer');
			video.src = "video/" + this.id;
			$scope.currentMovie = this.name;
			video.play();
		}
	}

	function init(){
		getMovies($http,function(movies){
			angular.forEach(movies,function(mov,index){
				var k = new Movie(mov.id,mov.name);
				that.movies.push(k);
			})
			reset();
			var k = parseInt((Math.random()*1000000)%that.movies.length);
			that.movies[k].run();
		})
		


	}
	function reset(){
		that.movies.sort(movieSortFunction);
		$scope.movies = that.movies;
	}

	$scope.search = function(){
		var search = $scope.searchQuery;
		search = processString(search);

		that.filteredMovies = [];
		angular.forEach(that.movies,function(value,index){
			 if( LCS(search,processString(value.name)).length == search.length ){
			 	that.filteredMovies.push(value);
			 }
		})

		if(search.length >= 2) that.filteredMovies.sort(SortBasedOnSearchQuery(search));
		$scope.movies = that.filteredMovies;
	}


	init();
}])	

var getMovies = function($http,cb){
	$http.get('videos',{}).then(function(data){
		cb(data.data)
	},function(err){
		console.log(err);
	})
}


	// $scope.change = function(data){
	// 	videoNumber = data
	// 	$scope.movies.selectedMovie = "video/" + videoNumber;
	// 	changeSource($scope.movies.selectedMovie);
	// 	$scope.currentMovie = $scope.movies.allMovies[videoNumber].name;
	// }

