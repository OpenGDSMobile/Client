/*jslint devel: true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.ns('UI');

OGDSM.UI = (function () {
    'use strict';
    var ui,
        OGDSM,
        VWorldKey = null;

    ui = function (obj) {
        this.OGDSM = obj;
    };

    ui.prototype = {
        constructor : OGDSM.UI,
        setVWorldKey : function (keyValue) {
            this.VWorldKey = keyValue;
        },
        getVWorldKey : function () {
            return this.keyValue;
        }
    };
    return ui;
}());

OGDSM.UI.prototype.VWorldWMS = function (divName) {
    'use strict';
    var rootDiv, html, styles, stylesText, i;

    rootDiv = $('#' + divName);
    html =
        'Select Max 5<br><fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
    styles = [
        'LP_PA_CBND_BUBUN,LP_PA_CBND_BONBUN',
        'LT_C_UQ111', 'LT_C_UQ112', 'LT_C_UQ113', 'LT_C_UQ114',
        'LT_C_UQ121', 'LT_C_UQ122', 'LT_C_UQ123', 'LT_C_UQ124', 'LT_C_UQ125',
        'LT_C_UQ126', 'LT_C_UQ127', 'LT_C_UQ128', 'LT_C_UQ129', 'LT_C_UQ130',
        'LT_C_UQ141', 'LT_C_UQ162', 'LT_C_UD801',
        'LT_L_MOCTLINK', 'LT_P_MOCTNODE',
        'LT_C_LHZONE', 'LT_C_LHBLPN',
        'LT_P_MGPRTFA', 'LT_P_MGPRTFB', 'LT_P_MGPRTFC', 'LT_P_MGPRTFD',
        'LT_L_SPRD', 'LT_C_SPBD',
        'LT_C_ADSIDO', 'LT_C_ADSIGG', 'LT_C_ADEMD', 'LT_C_ADRI',
        'LT_C_TDWAREA',
        'LT_C_DAMDAN', 'LT_C_DAMYOD', 'LT_C_DAMYOJ', 'LT_C_DAMYUCH',
        'LT_C_RIRSV', 'LT_P_RIFCT',
        'LT_P_UTISCCTV', 'LT_C_USFSFFB',
        'LT_L_FRSTCLIMB', 'LT_P_CLIMBALL', 'LT_L_TRKROAD', 'LT_P_TRKROAD',
        'LT_C_WKMBBSN', 'LT_C_WKMMBSN', 'LT_C_WKMSBSN', 'LT_C_WKMSTRM',
        'LT_C_ASITSOILDRA', 'LT_C_ASITDEEPSOIL', 'LT_C_ASITSOILDEP', 'LT_C_ASITSURSTON',
        'LT_L_AISROUTEU', 'LT_L_AISPATH', 'LT_C_AISALTC', 'LT_C_AISRFLC', 'LT_C_AISACMC', 'LT_C_AISCTRC',
        'LT_C_AISMOAC', 'LT_C_AISADZC', 'LT_C_AISPRHC', 'LT_C_AISFIRC', 'LT_C_AISRESC', 'LT_C_AISDNGC',
        'LT_C_AISTMAC', 'LT_C_AISCATC', 'LT_P_AISBLDG40F', 'LT_L_AISSEARCHL,LT_P_AISSEARCHP',
        'LT_L_AISVFRPATH,LT_P_AISVFRPATH', 'LT_P_AISVFRPT,LT_P_AISVFRPT_SW,LT_P_AISVFRPT_SN',
        'LT_L_AISCORRID_YS,LT_L_AISCORRID_GJ,LT_P_AISCORRID_YS,LT_P_AISCORRID_GJ', 'LT_P_AISHCSTRIP'];
    stylesText = [
        '지적도',
        '도시지역', '관리지역', '농립지역', '자연환경보전지역',
        '경관지구', '미관지구', '고도지구', '방화지구', '방재지구',
        '보존지구', '시설보호지구', '취락지구', '개발진흥지구', '특정용도제한지구',
        '국토계획구역', '도시자연공원구역', '개발제한구역',
        '교통링크', '교통노드',
        '사업지구경계도', '토지이용계획도',
        '아동안전지킴이집', '노인복지시설', '아동복지시설', '기타보호시설',
        '새주소도로', '새주소건물',
        '광역시도', '시군구', '읍면동', '리',
        '보행우선구역',
        '단지경계', '단지용도지역', '단지시설용지', '단지유치업종',
        '저수지', '수리시설',
        '교통CCTV', '소방서관할구역',
        '등산로', '등산로시설', '둘레길링크', '산책로분기점',
        '대권역', '중권역', '표준권역', '하천망',
        '배수등급', '심토토성', '유효토심', '자갈함량',
        '제한고도', '항공로', '경계구역', '공중급유구역', '공중전투기동훈련장', '관제권',
        '군작전구역', '방공식별구역', '비행금지구역', '비행정보구역', '비행제한구역', '위험구역',
        '접근관제구역', '훈련구역', '건물군(40층이상)', '수색비행장비행구역',
        '시계비행로', '시계비행보고지점',
        '한강회랑', '헬기장'];
    for (i = 0; i < styles.length; i += 1) {
        html += '<input type="checkbox" name="vworldWMS" class="custom" ' +
                ' id="id-' + styles[i] + '" value="' + styles[i] + '" />' +
				'<label for="id-' + styles[i] + '">' + stylesText[i] + '</label>';
        if (i !== 0 && (i + 1) % 2 === 0) {
            html += '</fieldset>' +
                    '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
        }
    }

    html += '</fieldset>' +
            '<a href="#" id=wmsButton data-role="button" ' +
            'onclick=makeData("' + this.VWorldKey + '","vworldWMS")>지도 추가</a>';
            //'>지도 추가</a>';
    rootDiv.html(html);
    rootDiv.trigger("create");
};
