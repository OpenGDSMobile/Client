/*jslint devel: true, vars : true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('eGovFrameUI');
(function (OGDSM) {
    'use strict';
    /**
     * 전자정부표준프레임워크 UX 컴포넌트 자동 생성 객체
     * @class OGDSM.eGovFrameUI
     * @constructor
     * @param {String} theme - eGovframework 테마 a~g (default c)
     */
    OGDSM.eGovFrameUI = function (theme) {
        theme = (typeof (theme) !== 'undefined') ? theme : null;
        if (theme !== null) {
            this.dataTheme = theme;
        } else {
            this.dataTheme = "c";
        }
    };
    OGDSM.eGovFrameUI.prototype = {
        constructor : OGDSM.eGovFrameUI
    };
    return OGDSM.eGovFrameUI;
}(OGDSM));


/**
 * 버튼 자동 생성
 * @method autoButton
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} linkId - 생성될 버튼 아이디 이름
 * @param {String} buttonTitle - 버튼 이름
 * @param {String} url - 링크 주소
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, corners=true, inline=false, mini=false}<br>
  theme(String) : 테마<br>
  corners(Boolean) : 모서리 둥글게 여부<br>
  inline(Boolean) : 가로 정렬 여부<br>
  mini(Boolean) : 버튼 크기<br>
 * @return {jQuery Object} 제이쿼리 아이디 버튼 객체
 */
OGDSM.eGovFrameUI.prototype.autoButton = function (rootDivId, linkId, buttonTitle, url, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId),
        html = '<a data-role="button" id="' + linkId + '" href="' + url + '" ',
        i = 0,
        name = null;

    var defaults = {
        theme : this.dataTheme,
        corners : true,
        inline : false,
        mini : false
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    html += 'data-theme="' + defaults.theme + '" data-corners="' + defaults.corners + '" data-inline="' + defaults.inline + '" data-mini="' + defaults.mini + '"';
    html += '>' + buttonTitle + '</a>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $("#" + linkId);
};

/**
 * 체크박스 자동 생성
 * @method autoCheckBox
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} chkId - 생성될 체크박스 아이디 이름
 * @param {String | Array} labels - 체크박스 라벨
 * @param {String | Array} values - 체크박스 값
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, horizontal=true, checkName=chkId + 'Name'}<br>
  theme(String) : 테마<br>
  horizontal(Boolean) : 체크박스 수평 여부<br>
  checkName(String) : 체크박스 그룹 이름<br>
 * @return {jQuery Object} 제이쿼리 체크박스 그룹 이름 객체
 */
OGDSM.eGovFrameUI.prototype.autoCheckBox = function (rootDivId, chkId, labels, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId),
        html = '',
        i = 0,
        name = null,
        defaults = {
            checkName : chkId + 'Name',
            theme : this.dataTheme,
            horizontal : false
        };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    html = '';
    if (Array.isArray(labels)) {
        html += '<fieldset data-role="controlgroup" ';
        if (defaults.horizontal) {
            html += 'data-type="horizontal">';
        } else {
            html += '>';
        }
        for (i = 0; i < labels.length; i += 1) {
            html += '<input type="checkbox" name="' + defaults.checkName + '" id="' + chkId + i + '" value="' + values[i] + '" ';
            html += 'data-theme="' + defaults.theme + '" class="custom"/>';
            html += '<label for="' + chkId + i + '">' + labels[i] + '</label>';
        }
        html += '</fieldset>';
    } else {
        html += '<input type="checkbox" name="' + defaults.checkName + '" id="' + chkId + '" value="' + values[i] + '" ';
        html += 'data-theme="' + defaults.theme + '" class="custom"/>';
        html += '<label for="' + chkId + '">' + labels + '</label>';
    }
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('input[name=' + defaults.checkName + ']:checkbox');
};

/**
 * 라디오 박스 자동 생성
 * @method autoRadioBox
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} radioId - 생성될 라디오박스 아이디 이름
 * @param {String | Array} labels - 라디오박스 라벨
 * @param {String | Array} values - 라디오박스 값
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, horizontal=true, radioName=radioId + 'Name'}<br>
  theme(String) : 테마<br>
  horizontal(Boolean) : 라디오박스 수평 여부<br>
  radioName(String) : 라디오박스 그룹 이름<br>
 * @return {jQuery Object} 제이쿼리 그룹 이름 객체
 */
OGDSM.eGovFrameUI.prototype.autoRadioBox = function (rootDivId, radioId, labels, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId),
        html = '<fieldset data-role="controlgroup" style="margin:0px; align:center;"',
        optionName = ['data-type', 'data-theme'],
        optionData = ['', this.dataTheme],
        i = 0,
        name = 0;

    var defaults = {
        radioName : radioId + 'Name',
        horizontal : false,
        theme : this.dataTheme
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}

    if (defaults.horizontal) {
        html += 'data-theme="' + defaults.theme + '" data-type="horizontal">';
    } else {
        html += 'data-theme="' + defaults.theme + '">';
    }

    for (i = 0; i < labels.length; i += 1) {
        html += '<input type="radio"name="' + defaults.radioName + '" id="' + radioId + i + '" value="' + values[i] + '" ';
        html += 'data-theme="' + defaults.theme + '" class="custom" ';
        if (i === 0) {
            html += 'checked="checked" />';
        } else {
            html += '/>';
        }
        html += '<label for="' + radioId + i + '">' + labels[i] + '</label>';
    }
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('input[name=' + defaults.radioName + ']:radio');

};

/**
 * 셀렉트 자동 생성
 * @method autoSelect
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} selectId - 생성될 선택 아이디 이름
 * @param {String | Array} text - 선택 라벨 텍스트
 * @param {String | Array} values - 선택 값
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{firstName='', theme=this.dataTheme, corners=true, inline=false, selected:0}<br>
  firstName(String) : 첫번째 값<br>
  theme(String) : 테마<br>
  corners(Boolean) : 테두리 둥글게 여부<br>
  inline(Boolean) : 가로 정렬 여부<br>
  selected(Boolean) : 처음 선택된 인덱스 값<br>
 * @return {jQuery Object} 제이쿼리 그룹 이름 객체
 */
OGDSM.eGovFrameUI.prototype.autoSelect = function (rootDivId, selectId, selectName, text, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId), html = null, i = 0, name = null;
    var defaults = {
        firstName : '',
        theme : this.dataTheme,
        corners : true,
        inline : false,
        selected : 0
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    html = '<select name="' + selectName + '" id="' + selectId + '" ' +
           'data-theme="' + defaults.theme + '" data-corners="' + defaults.corners + '" data-inline="' + defaults.inline + '">';
    html += '<option value=""> ' + defaults.firstName + '</option>';

    for (i = 0; i < text.length; i += 1) {
        html += '<option value="' + values[i] + '">' + text[i] + '</option>';
    }
    html += '</select>';
    html += '</fieldset>';
    rootDiv.append(html);
    $('#' + selectId).val(defaults.selected);
    rootDiv.trigger('create');
    return $('#' + selectId);
};

/**
 * 스위치 자동 생성
 * @method autoSwitch
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} switchId - 생성될 스위치 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, track_theme=this.dataTheme, switchName=switchId+'Name'}<br>
  theme(String) : 테마<br>
  track-theme(String) : 버튼 테마<br>
  switchName(String) : 스위치 그룹 이름<br>
 * @return {jQuery Object} 제이쿼리 아이디 객체
 */
OGDSM.eGovFrameUI.prototype.autoSwitch = function (rootDivId, switchId, switchName, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId), name,
        html = '',
        optionName = ['data-theme', 'data-track-theme'],
        optionData = [this.dataTheme, this.dataTheme],
        i = 0;

    var defaults = {
        theme : this.dataTheme,
        track_theme : this.dataTheme,
        switchName : switchId + 'Name'
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    html = '<select name="' + defaults.switchName + '" id="' + switchId + '" data-theme="' + defaults.theme +
           '" data-track-theme="' + defaults.track_theme + '" data-role="slider" data-inline="true">';
    html += '<option value="off">Off</option>';
    html += '<option value="on">On</option>';
    html += '</select>';
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('#' + switchId);
};

/**
 * 시간 태그 생성
 * @method timeInput
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @return {jQuery Object} 제이쿼리 아이디 이름 객체
 */
OGDSM.eGovFrameUI.prototype.timeInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html = '<input type="time" id="timeValue">';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#timeValue');
};

/**
 * 날짜 태그 생성
 * @method DateInput
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @return {jQuery Object} 제이쿼리 아이디 이름 객체 (Date YYYY/MM/DD)
 */
OGDSM.eGovFrameUI.prototype.dateInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html = '<input type="date" id="dateValue">';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#dateValue');
};

/**************Custom UI Create *******************/
/**
 * 배경 맵 선택 사용자 인터페이스 자동 생성: 라디오 박스
 * @method baseMapRadioBox
 * @param {OGDSM Object} OGDSMObj - OpenGDS모바일 시각화 객체
 * @param {String}       rootDiv - 최상위 DIV 아이디 이름
 * @param {Array}        options - 제공할 지도 타입
 */
OGDSM.eGovFrameUI.prototype.baseMapRadioBox = function (OGDSMObj, rootDiv, options) {
//var mapRadioNameObj = uiTest.autoRadioBox('mapSelect','mapType', 'radioMap', ['OSM','VWorld'], ['OSM','VWorld'], ['h']);
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var mapRadioNameObj,
        supportMap;

    if (options !== null) {
        supportMap = options.split(' ');
    }
    mapRadioNameObj = this.autoRadioBox(rootDiv, 'mapType', supportMap, supportMap, ['h']);

    mapRadioNameObj.change(function () {
        OGDSMObj.changeBaseMap($(this).val());
    });
};
/**
 * 배경 맵 선택 사용자 인터페이스 자동 생성: 셀렉트 박스
 * @method baseMapSelect
 * @param {OGDSM Object} OGDSMObj - OpenGDS모바일 시각화 객체
 * @param {String}       rootDiv - 최상위 DIV 아이디 이름
 * @param {Array}        options - 제공할 지도 타입
 */
OGDSM.eGovFrameUI.prototype.baseMapSelect = function (OGDSMObj, rootDiv, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var mapRadioNameObj,
        supportMap;

    if (options !== null) {
        supportMap = options.split(' ');
    }
    mapRadioNameObj = this.autoSelect(rootDiv, 'mapType', 'selectMapType', supportMap, supportMap, {
        firstName : '맵 선택',
        selected : supportMap[0],
        inline : true
    });
    OGDSMObj.changeBaseMap(supportMap[0]);
    mapRadioNameObj.change(function () {
        OGDSMObj.changeBaseMap($(this).val());
    });
};

/**
 * 브이월드 WMS API 리스트 요청 인터페이스
 * @method vworldWMSList
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} theme - 테마 default : this.dataTheme
 * @return {Array} 선택 박스 아이디 이름 배열 ('vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5')
 */
OGDSM.eGovFrameUI.prototype.vworldWMSList = function (divId, theme) {
    'use strict';
    var selectTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup" id="vworldWMS">',
        OGDSM = this.OGDSM,
        selectName = ['vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5'],
        selectState = [0, 0, 0, 0, 0],
        styles,
        stylesText,
        i,
        j,
        btnObj;
    
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

    rootDiv.append(html);
    for (j = 0; j < selectName.length; j += 1) {
        this.autoSelect("vworldWMS", selectName[j], selectName[j], stylesText, styles, {
            firstName : (j + 1) + '번째 레이어 선택'
        });
    }
    
    $("#" + selectName[0]).change(function () {
        selectState[0] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[1]).change(function () {
        selectState[1] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[2]).change(function () {
        selectState[2] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[3]).change(function () {
        selectState[3] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[4]).change(function () {
        selectState[4] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    return selectName;
};

/**
 * 서울 열린 데이터 광장 환경정보 요청 인터페이스
 * @method seoulEnvironment
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, path='./images/'}
  theme(String) : 테마
  path(String) : 이미지 위치
 * @return {String} 생성된 객체 배열 [visualType, date, time, environmentType]
 */
OGDSM.eGovFrameUI.prototype.seoulEnvironment = function (divId, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var name;
    var defaults = {
        theme : this.dataTheme,
        path : './images/openGDSMobile/'
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    var environmentImages = [
        '<img src="' + defaults.path + 'input_bt_pm10.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_pm25.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_so2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_o3.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_no2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_co.png" width=30>'
    ],
        environmentValues = ['PM10', 'PM25', 'SO2', 'O3', 'NO2', 'CO'];
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['맵', '차트'], ['map', 'chart'], {horizontal : true}),
        date = this.dateInput(divId),
        time = this.timeInput(divId),
        environmentType,
        i;
    for (i = 0; i < environmentValues.length; i += 3) {
        environmentType = this.autoRadioBox(divId, 'areenvTypeaType',
                                      [environmentImages[i], environmentImages[i + 1], environmentImages[i + 2]],
                                      [environmentValues[i], environmentValues[i + 1], environmentValues[i + 2]],
                                      {horizontal : true});
    }
    return [visualType, date, time, environmentType];
};


/**
 * 데이터 포털 환경정보 요청 인터페이스
 * @method dataProtalEnvironment
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, path='./images/'}
  theme(String) : 테마
  path(String) : 이미지 위치
 * @return {String} 생성된 객체 배열 [visualType, areaType, environmentType]
 */
OGDSM.eGovFrameUI.prototype.dataProtalEnvironment = function (divId, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var name, i;
    var defaults = {
        theme : this.dataTheme,
        path : './images/openGDSMobile/'
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    var environmentImages = [
        '<img src="' + defaults.path + 'input_bt_pm10.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_pm25.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_so2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_o3.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_no2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_co.png" width=30>'
    ],
        environmentValues = ['pm10Value', 'pm25Value', 'so2value', 'o3Value', 'no2Value', 'coValue'],
        areaTypes = ['인천', '서울', '경기', '강원', '충남', '세종', '충북', '대전', '경북', '전북', '대구', '울산', '전남', '광주', '경남', '부산', '제주'],
        areaValues = ['incheon', 'seoul', 'gyeonggi', 'gangwon', 'chungnam', 'sejong', 'chungbuk', 'daejeon', 'gyeongbuk', 'jeonbuk', 'daegu', 'ulsan', 'jeonnam', 'gwangju', 'gyeongnam', 'busan', 'jeju'];
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['맵', '차트'], ['map', 'chart'], {horizontal : true}),
        areaRadio,
        environmentType;

    for (i = 0; i < areaTypes.length - 2; i += 3) {
        areaRadio = this.autoRadioBox(divId, 'areaType',
                                      [areaTypes[i], areaTypes[i + 1], areaTypes[i + 2]],
                                      [areaValues[i], areaValues[i + 1], areaValues[i + 2]],
                                      {horizontal : true});
    }
    areaRadio = this.autoRadioBox(divId, 'areaType',
                                  [areaTypes[areaTypes.length - 2], areaTypes[areaTypes.length - 1]],
                                  [areaValues[areaValues.length - 2], areaValues[areaValues.length - 1]],
                                  {horizontal : true});
    for (i = 0; i < environmentValues.length; i += 3) {
        environmentType = this.autoRadioBox(divId, 'areenvTypeaType',
                                      [environmentImages[i], environmentImages[i + 1], environmentImages[i + 2]],
                                      [environmentValues[i], environmentValues[i + 1], environmentValues[i + 2]],
                                      {horizontal : true});
    }
    return [visualType, areaRadio, environmentType];
};
