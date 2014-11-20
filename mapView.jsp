<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%> 
<!DOCTYPE html>
<html>
<head>    
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
 	
	<!-- 	jQuery -->
	<script type="text/javascript" src="js/egovframework/mbl/cmm/jquery-1.9.1.min.js"></script>
	
	<!-- jQuery Mobile -->
	<script type="text/javascript" src="js/egovframework/mbl/cmm/jquery.mobile-1.3.2.min.js"></script>
	<link rel="stylesheet" href="css/egovframework/mbl/cmm/jquery.mobile-1.3.2.css">
	 
	<!-- eGov Mobile -->
	<script type="text/javascript" src="js/egovframework/mbl/cmm/EgovMobile-1.3.2.js"></script>
	<link rel="stylesheet" href="css/egovframework/mbl/cmm/EgovMobile-1.3.2.css">
	 
	
	<!-- Proj4js -->
	<script type="text/javascript" src="js/proj4js/2.2.2/proj4.js"></script>
	 
	<!-- OpenLayers 3 -->
	<script type="text/javascript" src="js/ol3/ol.js"></script>
	<link type="text/css" rel="stylesheet" href="css/ol3/ol.css">  
	
	<!-- D3.js -->
	<script type="text/javascript" src="js/d3/d3.js"></script> 
	
	<script type="text/javascript" src="js/openGDSMobile/MapConfig.js"></script>
	<script type="text/javascript" src="js/openGDSMobile/MapVectorLayers.js"></script>
	<script type="text/javascript" src="js/openGDSMobile/MapSetting.js"></script>
	<script type="text/javascript" src="js/openGDSMobile/MapGui.js"></script> 
	 
	<script type="text/javascript" src="js/openGDSMobile/openGDSM.js"></script>
	<script type="text/javascript" src="js/openGDSMobile/openGDSMVworld.js"></script>
	<script type="text/javascript" src="js/openGDSMobile/openGDSMSeoulOpenData.js"></script>
	<script type="text/javascript" src="js/openGDSMobile/openGDSMPublicOpenData.js"></script>
	<script type="text/javascript" src="js/openGDSMobile/openGDSMD3.js"></script>
	<script type="text/javascript" src="js/openGDSMobile/openGDSMGeoserver.js"></script>
	 
	
	<title>Map Select</title>
	<style>
		#d3viewonMap{
			z-index:10;
			position:absolute;
			overflow-x:hidden; 
			overflow-y:auto; 
			height:300px;
			background : rgba(255,255,255,0.7);  
		}
		#interpolationMap{
			z-index:10;
			position:absolute;
			overflow-x:hidden; 
			overflow-y:auto; 
			height:300px;
			background : rgba(255,255,255,0.7);  
		}
		.font{
			font-size:70%;
		} 
	</style>
	<script> 
	beforeProcess = {
		popupSize: function(obj,width,height){
			width = (typeof(width) !== 'undefined') ? width : $(window).width()-50;
			height = (typeof(height) !== 'undefined') ? height : "300px"; 
			$(obj).css("width",width/2);
			$(obj).css("height",height);
			$(obj).css("overflow-y","auto");
			$(obj).css("overflow-x","hidden"); 
		},
		popupOpen: function(obj){ 
			$('#serviceName').attr('data-value',$(obj).attr('data-value'));	
		}
	};
	styleChange = function(obj){
		$('#wmsButton').attr('data-layer',$(obj).attr('value')); 
	};
	$(document).ready(function(){
		openGDSM.init();
		openGDSMGeoserver.getLayers();

		$("#d3View").attr('width',$(window).width()-100); 
		$('#d3viewonMap').hide();
		$("#d3viewonMap").attr('width',$(window).width()-50);  
		$('#d3viewonMap').css('top',$(window).height()-300);

		$('#interpolationMap').hide();
		$("#interpolationMap").attr('width',$(window).width()-50);  
		$('#interpolationMap').css('top',$(window).height()-600);
		beforeProcess.popupSize("#dataSelect");
		beforeProcess.popupSize("#vworldList","300px"); 
		
		$('#layersList').css('height',$(window).height());
		$('#layersList').css("overflow-y","auto");
	});
	</script>
	
</head>
<body>  
<div data-role="page" id="mapview">
<!-- d3And Map div -->
		<div id="interpolationMap">
		<a href="#" data-role="button" 
		     data-theme="a" data-icon="delete" 
		     data-iconpos="notext" class="ui-btn-right" onclick="$('#interpolationMap').hide()"> Close</a><br>
		<img id="interpolationMapImage" src=""/>
		</div>  
		<div id="d3viewonMap">
		  <a href="#" data-role="button" 
		     data-theme="a" data-icon="delete" 
		     data-iconpos="notext" class="ui-btn-right" onclick="$('#d3viewonMap').hide()"> Close</a>		
		  <div id="range">
              			<table style="margin:0 auto">
              				<tr>
              					<td style="background:#4c4cff; margin:0; padding:0">　</td>
              					<td style="background:#9999ff; margin:0; padding:0">　</td>
              					<td><span class="font">Good</span></td>
              					<td style="background:#4CFF4C; margin:0; padding:0">　</td>
              					<td style="background:#99FF99; margin:0; padding:0">　</td>
              					<td><span class="font">Normal</span></td>
              					<td style="background:#FFFF00; margin:0; padding:0">　</td>
              					<td style="background:#FFFF99; margin:0; padding:0">　</td>
              					<td><span class="font">Sensitive</span></td>
              					<td style="background:#FF9900; margin:0; padding:0">　</td>
              					<td><span class="font">Bad</span></td>
              					<td style="background:#FF0000; margin:0; padding:0">　</td>
              					<td><span class="font">Very Bad</span></td> 
              				</tr>
              			</table> 
            </div>
            <div id="d3viewonMap_sub"> </div>      
		</div>
<!-- Vworld WMS -->
		<div data-role="popup" 
		id="vworldList"  
		data-overlay-theme="a" 
		style="padding: 15px">
		</div> 
<!-- Public Data PopUp --> 
		<div id="setting" 
		data-role="popup"  
		data-overlay-theme="a" 
		style="width:300px">		
		</div> 
	<!-- Data Table 아직... --> 
		<div data-role="panel" data-display="overlay" data-position="right" id="publicDataView">
			<table id="dataTable">
			</table>	
		</div>
	<!-- Public Data Select -->
		<div data-role="popup" id="dataSelect" data-overlay-theme="a">
		  <div id="range">
              			<table style="margin:0 auto">
              				<tr>
              					<td style="background:#4c4cff; margin:0; padding:0">　</td>
              					<td style="background:#9999ff; margin:0; padding:0">　</td>
              					<td><span class="font">Good</span></td>
              					<td style="background:#4CFF4C; margin:0; padding:0">　</td>
              					<td style="background:#99FF99; margin:0; padding:0">　</td>
              					<td><span class="font">Normal</span></td>
              					<td style="background:#FFFF00; margin:0; padding:0">　</td>
              					<td style="background:#FFFF99; margin:0; padding:0">　</td>
              					<td><span class="font">Sensitive</span></td>
              					<td style="background:#FF9900; margin:0; padding:0">　</td>
              					<td><span class="font">Bad</span></td>
              					<td style="background:#FF0000; margin:0; padding:0">　</td>
              					<td><span class="font">Very Bad</span></td> 
              				</tr>
              			</table> 
            </div>
			<div id="d3View"> </div>		
		</div> 
		

		
	<!-- Public Data PopUp --> 
		<div data-role="popup" id="select">
			<ul data-role="listview">
				<li><a href="#mapList">지도 목록</a></li>
				<li><a href="#layerList">공간정보데이터 목록</a></li>
				<li><a href="#opendataList">공공오픈데이터 목록</a></li>
			</ul>
		</div>	 
	<!-- List Panel -->
		<div data-role="panel" data-display="overlay" id="mapList" style="padding:0;">
				<ul data-role="listview">
					<li data-theme="g" data-icon="delete" style="height: 2.8em;">
					  <a href="#" data-rel="close" style="color:rgb(255, 255, 255);">Close menu</a>
					</li>
					<li data-theme="z" data-role="list-divider">배경 지도</li>
					<li><a href="#"  onclick="openGDSM.baseMap('map','osm')">OpenStreetMap</a></li>
					<li><a href="#"  onclick="openGDSM.baseMap('map','vworld')">VWorld</a></li>
					<li data-theme="z" data-role="list-divider">VWorld 데이터 API</li> 
					<li><a href="#vworldList"  data-rel="popup" data-position-to="window" 
					     onclick="openGDSM.wmsMapUI.vworld('vworldList','E9CACC10-B443-30E1-9E2E-9E18F49049CA')" >VWorld</a></li>
					<!-- <li><a href="#vworldList"  data-rel="popup" data-position-to="window" >V-World</a></li>-->
				</ul>
		</div>  
	<!-- List Panel --> 
                <div data-role="panel" data-display="overlay" id="layerList" style="padding:0;">
                                <ul data-role="listview" id="layersList">
                                        <li data-theme="g" data-icon="delete" style="height: 2.8em;"><a href="#" data-rel="close" style="color:rgb(255, 255, 255);">Close menu</a></li>
                                        <li data-theme="z" data-role="list-divider">기본 제공 데이터</li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('City_gu')">전국(구 단위)</a></li>
                                                <!-- <li><a href="#" onclick="openGDSM.wfsMap.geoserver('City_dong')">전국(동 단위)</a></li> -->
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Seoul_gu')">서울특별시(구 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Seoul_dong')">서울특별시(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Incheon_dong')">인천광역시(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Sejong_dong')">세종시(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Daejeon_dong')">대전광역시(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Daegu_dong')">대구광역시(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Ulsan_dong')">울산광역시(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Gwangju_dong')">광주광역시(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Busan_dong')">부산광역시(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Chungcheongbuk_dong')">충청북도(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Chungcheongnam_dong')">충청남도(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Gangwon_dong')">강원도(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Gyeonggi_dong')">경기도(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Gyeongsangbuk_dong')">경상북도(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Gyeongsangnam_dong')">경상남도(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Jeju_dong')">제주도(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Jellanam_dong')">전라남도(동 단위)</a></li>
                                                <li><a href="#" onclick="openGDSM.wfsMap.geoserver('Jeollabuk_dong')">전라북도(동 단위)</a></li>
                                                
                                <!--<li data-theme="z" data-role="list-divider">사용자 업로드 데이터</li>
                                        <li><a href="#" data-key="workspaceName" data-value="user" data-name="createWorkspace" onclick="openGDSM.geoServerProcess(this)">test</a></li> -->  
                                </ul>
                </div>  	
	<!-- List Panel -->
		<div data-role="panel" data-display="overlay" id="opendataList" style="padding:0;">
				<ul data-role="listview">
					<li data-theme="g" data-icon="delete" style="height: 2.8em;"><a href="#" data-rel="close" style="color:rgb(255, 255, 255);">Close menu</a></li>
					<li data-theme="z" data-role="list-divider">서울공공오픈데이터</li>
					<li><a href="#setting" data-rel="popup" data-position-to="window" onclick="openGDSM.seoulPublic.areaEnv('setting','6473565a72696e7438326262524174')">실시간 서울 대기환경</a></li>
					<li><a href="#setting" data-rel="popup" data-position-to="window" onclick="openGDSM.seoulPublic.roadEnv('setting','4b56506967696e7437317348694371')">
					도로변 측정소별 실시간 대기환경</a></li>
					<li data-theme="z" data-role="list-divider">공공데이터포털</li>
					<li><a href="#setting" data-rel="popup" data-position-to="window" 
						onclick="openGDSM.PublicDataPortal.areaEnv('setting','kCxEhXiTf1qmDBlQFOOmw+emcPSxQXn5V5/x8EthoHdbSojIdQvwX+HtWFyuJaIco0nUJtu12e/9acb7HeRRRA==')">실시간 대기환경(에어코리아)</a></li>
				</ul>
		</div>  
	<!-- 
	kCxEhXiTf1qmDBlQFOOmw%2BemcPSxQXn5V5%2Fx8EthoHdbSojIdQvwX%2BHtWFyuJaIco0nUJtu12e%2F9acb7HeRRRA%3D%3D
	http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?sidoName=%EB%B6%80%EC%82%B0&pageNo=1&numOfRows=100&ServiceKey=kCxEhXiTf1qmDBlQFOOmw%2BemcPSxQXn5V5%2Fx8EthoHdbSojIdQvwX%2BHtWFyuJaIco0nUJtu12e%2F9acb7HeRRRA%3D%3D
	http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getMsrstnList?addr=%EB%B6%80%EC%82%B0&pageNo=1&numOfRows=100&ServiceKey=kCxEhXiTf1qmDBlQFOOmw%2BemcPSxQXn5V5%2Fx8EthoHdbSojIdQvwX%2BHtWFyuJaIco0nUJtu12e%2F9acb7HeRRRA%3D%3D
	 -->
	<div data-role="header" class="ui-body-g center" data-position="inline" > 
 	 	<a href="#select" data-role="button" data-rel="popup"  data-transition="slidedown" data-theme="g">메뉴</a> 
		<h4>지도 시각화</h4>
		<!-- <a href="logout.do" data-role="button" data-theme="g" >로그아웃</a> -->
		<!-- <a href="#publicDataView" data-role="button" data-theme="g" >공공오픈데이터</a> -->
	</div>	
	
	<!-- Map Div -->
	<div data-role="content" style="padding:0; margin:0;">
		<div id="map" style="padding:0; margin:0;">
		</div>		
	</div>
	<div data-role="footer" class="ui-body-g center" data-position="inline"  data-tap-toggle="false" >
		<h4></h4>
	</div>
</div>
</body>
</html>
