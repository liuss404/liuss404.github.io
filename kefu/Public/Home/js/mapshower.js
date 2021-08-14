/* map functions, map instance */
(function($) {
	/* public instance */
	var MapShower = {

	};

	/* private attrs */
	var map;
	var marker0 = '';
	var markers = [];

	function addViewspotMarker(viewspot){  // 创建图标对象
		var type = viewspot.type;
		var img = markers[type % 6]; //0~5
		var point = new BMap.Point(parseFloat(viewspot.lng), parseFloat(viewspot.lat));

		var myIcon = new BMap.Icon(img, new BMap.Size(19.5, 26.5), {    
			offset: new BMap.Size(19.5, 10),
			imageSize: new BMap.Size(19.5, 26.5)
			//imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移    
		});
		// 创建标注对象并添加到地图   
		var marker = new BMap.Marker(point, {icon: myIcon});    
		map.addOverlay(marker);
		marker.setAnimation(BMAP_ANIMATION_DROP)
		marker.addEventListener("click", function() {
			openSpotInfo(point, viewspot);
		});
	}


	function openStationInfo(info) {
		var opts = {    
		 width : 150,     // 信息窗口宽度    
		 height: 30,     // 信息窗口高度    
		 //title : "福冈"  // 信息窗口标题   
		};
		var infoWindow = new BMap.InfoWindow("<div class='info-window'><div>车站：" + info.title + "</div></div>", opts);  // 创建信息窗口对象    
		map.openInfoWindow(infoWindow, new BMap.Point(info.lng, info.lat));      // 打开信息窗口
	}

	function getSpotWindowWidth() {
		var mapWidth = $('#map-container').width();
		return mapWidth * 0.8;
	}

	function openSpotInfo(point, viewspot) {
		var opts = {    
		 width : getSpotWindowWidth(),     // 信息窗口宽度
		 height: 250,     // 信息窗口高度
		};
		var arr = [viewspot.photo1url, viewspot.photo2url, viewspot.photo3url, viewspot.photo4url];
		var infoImgs = "";
		$.each(arr, function(i, v) {
			if (v) {
				infoImgs += "<a class='spot-group-1' href='" + v + "'><img src='" + v + "' /></a>";
			}
		});
		// var infoImgs = "<img src='__IMG__/map/p1.png'/><img src='__IMG__/map/p1.png'/><img src='__IMG__/map/p1.png'/>";

		// viewspot url validation
		var url = viewspot.url.toLowerCase();
		if (url) {
			if (!(url.match(/^http:/) || url.match(/^https:/))) {
				viewspot.url = 'http://' + url;
			}
		}

		var infoWindow = new BMap.InfoWindow("<div class='info-window'>"
			+"<div class='info-window-text'>"
				+ "<div class='info-window-text-para'>"
					+ "<span class='info-window-text-title'>名称：</span>"
					+ "<span class='info-window-text-content'>" + viewspot.title + "</span>"
				+ "</div>"
				// + "<div class='info-window-text-para'>"
				// 	+ "<span class='info-window-text-title'>邮编：</span>"
				// 	+ "<span class='info-window-text-content'>" + viewspot.zipcode + "</span>"
				// + "</div>"
				+ "<div class='info-window-text-para'>"
					+ "<span class='info-window-text-title'>地址：</span>"
					+ "<span class='info-window-text-content'>" + viewspot.address + "</span>"
				+ "</div>"
				+ "<div class='info-window-text-para'>"
					+ "<span class='info-window-text-title'>营业时间/固定休息日：</span>"
					+ "<span class='info-window-text-content'>" + viewspot.officehours + "</span>"
				+ "</div>"
				+ "<div class='info-window-text-para'>"
					+ "<span class='info-window-text-title'>电话：</span>"
					+ "<span class='info-window-text-content'>" + viewspot.tel + "</span>"
				+ "</div>"
				+ "<div class='info-window-text-para'>"
					+ "<span class='info-window-text-title'>网站：</span>"
					+ "<span class='info-window-text-content'>"
						 + "<a href='" + viewspot.url + "'>" + viewspot.url + "</a>"
					+ "</span>"
				+ "</div>"
				+ "<div class='info-window-text-para'>"
					+ "<span class='info-window-text-title'>交通指南：</span>"
					+ "<span class='info-window-text-content'>" + viewspot.access + "</span>"
				+ "</div>"
				+ "<div class='info-window-text-para'>"
					+ "<span class='info-window-text-title'>简介：</span>"
					+ "<span class='info-window-text-content'>" + viewspot.desc + "</span>"
				+ "</div>"
			+ "</div>"
			+ "<div class='info-window-img'>"
				+ infoImgs
			+ "</div>"
			+ "</div>", opts);  // 创建信息窗口对象    
		infoWindow.addEventListener('open', function(e) {
			// $('#map-container .info-window div.info-window-img a').colorbox({open: true});
			$('#map-container .info-window div.info-window-img a').click(function() {
				$('#map-container .info-window div.info-window-img a').colorbox({open: true, rel: 'spot-group-1', scalePhotos: true, maxWidth: '100%'});
				return false;
			});
		});
		map.openInfoWindow(infoWindow, point);      // 打开信息窗口
	}

	function initMap(centerPoint, railway1, stations, viewspots) {
		map = new BMap.Map("map-container");          // 创建地图实例  
		var point = new BMap.Point(centerPoint.lng, centerPoint.lat);  // 创建点坐标
		var scale = (centerPoint.scale > 0) ? centerPoint.scale : 11;
		

		// map.centerAndZoom(point, scale);                 // 初始化地图，设置中心点坐标和地图级别  
		// 有后三项输入时按照所有点决定
		var pointArray = [];


		var opts = {type: BMAP_NAVIGATION_CONTROL_LARGE};
		map.addControl(new BMap.NavigationControl(opts));

		// var marker = new BMap.Marker(point);        // 创建标注    
		// map.addOverlay(marker);                     // 将标注添加到地图中

		// html5定位控件
		map.addControl(new BMap.GeolocationControl({
			anchor: BMAP_ANCHOR_BOTTOM_LEFT
		}));

		// 景点
		for (var i in viewspots) {
			addViewspotMarker(viewspots[i]);

			var pt = new BMap.Point(parseFloat(viewspots[i].lng), parseFloat(viewspots[i].lat));
			pointArray.push(pt);
		}
		/*
		// 随机向地图添加10个标注
		var bounds = map.getBounds();
		var low = bounds.getSouthWest();
		var high  = bounds.getNorthEast();
		var lngSpan = high.lng - low.lng;
		var latSpan = high.lat - low.lat;
		for (var i = 0; i < 10; i ++) {    
			var point = new BMap.Point(low.lng + lngSpan * (Math.random() * 0.5 + 0.15),    
			                        low.lat + latSpan * (Math.random() * 0.5 + 0.15));    
			addMarker(point, i);
		}
		*/



		// ?? circle
		/*
		var circle = new BMap.Circle(new BMap.Point(130.404, 33.45),
										200,
										{fillColor:"blue", strokeColor:"blue", strokeWeight:20, strokeStyle:"solid",strokeOpacity:0.5, fillOpacity: 1.0}
						);
		map.addOverlay(circle);
		*/


		// add railway
		var points = [];

		// parse coordArray
		if (railway1 && railway1.coords) {
			railway1.coordArray = [];
			var arr = railway1.coords.split("\n");
			for (var ind in arr) {
				var pair = arr[ind].split(',');
				if (pair.length == 2)
					railway1.coordArray.push(pair);
			}
		}
		for (var i in railway1.coordArray) {
			var pair = railway1.coordArray[i];
			points.push(new BMap.Point(parseFloat(pair[0]), parseFloat(pair[1])));
		}
		var polyline = new BMap.Polyline(
			points,
			{strokeColor:"#ff4949", strokeWeight:5, strokeOpacity:0.8}    
		);    
		map.addOverlay(polyline);


		// add station (cities)
		for (var i in stations) {
			var info = stations[i];

			var myIcon = new BMap.Icon(marker0, new BMap.Size(20, 20), {    
				offset: new BMap.Size(17.5, 17.5),
				imageSize: new BMap.Size(20, 20)
			});

			var station = new BMap.Marker(new BMap.Point(info.lng, info.lat), {icon: myIcon});        // 创建标注    

			map.addOverlay(station);

			station.setAnimation(BMAP_ANIMATION_DROP);

			(function(info) {
				station.addEventListener("click", function() {
					openStationInfo(info);
				});
			})(info);


			var pt = new BMap.Point(info.lng, info.lat);
			pointArray.push(pt);

		}


		if (pointArray.length > 0) {
			map.setViewport(pointArray, {zoomFactor: 0});
		} else {
			map.centerAndZoom(point, scale);                 // 初始化地图，设置中心点坐标和地图级别  
		}
	}

	/* public methods */

	// instance attr init
	MapShower.init = function(options) {
		// var markerFiles = ['marker1.gif', 'marker2.gif', 'marker3.gif',
		// 					'marker4.gif', 'marker5.gif', 'marker6.gif'];
		var markerFiles = ['markerl1.gif', 'markerl2.gif', 'markerl3.gif',
							'markerl4.gif', 'markerl5.gif', 'markerl6.gif'];
		var markerPath = options.markerPath || '/Public/Home/images/map/';
		marker0 = markerPath + 'marker0.gif';
		markers = $.map(markerFiles, function(v, i){
			return markerPath + v;
		});
	}

	// load map, with needed data, can be called twice to reload different data
	MapShower.load = function(centerPoint, railway1, stations, viewspots) {
		initMap(centerPoint, railway1, stations, viewspots);
	}

	window.MapShower = MapShower;

})(window.jQuery);