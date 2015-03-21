/*jslint devel: true*/
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('eGovFrameUI');
(function (OGDSM) {
    'use strict';
    /**
    * e-Goverement Framework UX Component Automatic Create.
    * @class OGDSM.eGovFramUI
    * @constructor
    * @param {String} theme - eGovframework theme a~g (default c)
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
 * Auto Create about Button.
 * @method autoButton
 * @param {String} divId - root div id about HTML tag attribute [상위 DIV 아이디]
 * @param {String} linkId - link a id about HTML tag attribute  [생성될 버튼 아이디]
 * @param {String} linkType - link type (in|domain_ex|ex) [버튼 타입]
 * @param {String} url - link url (internal : "#?????", domain_external : "/???/???/...", external : "http://???") [링크 주소]
 * @param {String} buttonTitle - button title [버튼 이름]
 * @param {Array} options (option) - theme (0), corners (1), inline (2), mini (3) setting
                                     (defaults : global value(dataTheme), true | false, true | false, true | false)
                                     Not Change = ''
                                     [ 배열인자 옵션: 테마(0), 코너(1), 인라인(2), 작은 버튼(3) ]
 * @return {jQuery Object} user interface button object [제이쿼리 아이디 객체]
 */
OGDSM.eGovFrameUI.prototype.autoButton = function (rootDivId, linkId, linkType, url, buttonTitle, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var rootDiv = $('#' + rootDivId),
        html = '<a data-role="button" id="' + linkId + '" href=',
        optionName = ['data-theme', 'data-corners', 'data-inline', 'data-mini'],
        optionData = [this.dataTheme, 'true', 'false', 'false'],
        i = 0;

    if (linkType === 'in') {
        html += '"#' + url + '" ';
    } else if (linkType === 'domain_ex' || linkType === 'ex') {
        html += '"' + url + '" ';
    } else {
        console.error('link type write "in|domain_ex|ex"');
        return null;
    }
    html += '>' + buttonTitle + '</a>';
    rootDiv.append(html);
    if (options !== null) {
        for (i = 0; i < options.length; i += 1) {
            if (options[i] !== '') {
                if (i === 0) {
                    if (options[i] < 'a' || options[i] > 'g') {
                        console.error('eGovframework Mobile UX/UI theme string range is "a~g"');
                        return null;
                    }
                } else {
                    if (options[i] !== 'true' && options[i] !== 'false') {
                        console.error('eGovframework Mobile UX/UI string option ' + i + ' is "true" or "false"');
                        return null;
                    }
                }
            }
            $("#" + linkId).attr(optionName[i], options[i]);
        }
    }
    rootDiv.trigger("create");
    return $("#" + linkId);
};



/**
 * User Interface Create about Process (Button).
 * @method processButton
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {jQuery Object} User Interface Button Object (Process)
 */
OGDSM.eGovFrameUI.prototype.processButton = function (divId, theme) {
    'use strict';
    var butTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv,
        html;
    rootDiv = $('#' + divId);
    html = '<a href="#" id="processBtn" data-role="button" data-theme="' + butTheme + '">시각화</a>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#processBtn');
};



/**
 * VWorld WMS API List (CheckBox).
 * @method vworldWMSCheck
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {Array} User Interface selectbox Name, id array ('vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5')
 */
OGDSM.eGovFrameUI.prototype.vworldWMSCheck = function (divId, theme) {
    'use strict';
    var selectTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup">',
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
    for (j = 0; j < selectName.length; j += 1) {
        html += '<select name="' + selectName[j] + '" id="' + selectName[j] + '" data-theme=' + selectTheme + '>';
        html += '<option value="">' + (j + 1) + '번째 레이어 선택 </option>';
        for (i = 0; i < styles.length; i += 1) {
            html += '<option value="' + styles[i] + '">' + stylesText[i] + '</option>';
        }
        html += '</select>';
    }
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    
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
 * User Interface Create about visualization type (Radio Button).
 * @method visTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Name (visualType)
 */
OGDSM.eGovFrameUI.prototype.visTypeRadio = function (divId, theme) {
    'use strict';
    var radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        arr = ['map', 'chart'],
        arrText = ['맵', '차트'],
        i;
    for (i = 0; i < arr.length; i += 1) {
        html += '<input type="radio" name="visualType" class="custom" data-theme=' + radioTheme +
								' id="id-' + arr[i] + '" value="' + arr[i] + '" ';
        html += '>' + '<label for="id-' + arr[i] + '">' + arrText[i] + '</label>';
    }
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'visualType';
};
/**
 * User Interface Create about visualization type (Date Input).
 * @method DateInput
 * @param {String} divId - div id about HTML tag attribute
 * @return {jQuery Object} User Interface Date Input Object (Date YYYY/MM/DD)
 */
OGDSM.eGovFrameUI.prototype.dateInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html = '<label for="dateValue">날짜 : </label>' +
			'<input type="date" id="dateValue"/>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#dateValue');
};
/**
 * User Interface Create about time input (Time Input).
 * @method timeInput
 * @param {String} divId - div id about HTML tag attribute
 * @return {jQuery Object} User Interface Time Input Object (Time)
 */
OGDSM.eGovFrameUI.prototype.timeInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html =  '<label for="timeValue">시간 : </label>' +
			'<input type="time" id="timeValue">';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#timeValue');
};
/**
 * User Interface Create about Environment Type (Radio Button).
 * @method envTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} provider - public data provider ('seoul' or 'public') (default : seoul)
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Name (envTypeRadio)
 */
OGDSM.eGovFrameUI.prototype.envTypeRadio = function (divId, prov, theme) {
    'use strict';
    var provider = (typeof (prov) !== 'undefined') ? prov : "seoul",
        radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<label for="envValue">환경정보:</label>' +
            '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        envTypes = ['pm10', 'pm25', 'so2', 'o3', 'no2', 'co'],
        envTypeValues,
        i;
    if (provider === 'seoul') {
        envTypeValues = ['PM10', 'PM25', 'SO2', 'O3', 'NO2', 'CO'];
    } else if (provider === 'public') {
        envTypeValues = ['pm10Value', 'pm25Value', 'so2Value', 'o3Value', 'no2Value', 'coValue'];
    }
    for (i = 0; i < envTypes.length; i += 1) {
        html += '<input type="radio" name="envTypeRadio" class="custom" data-theme=' + radioTheme +
            ' id="id-' + envTypeValues[i] + '" value="' + envTypeValues[i] + '"/>' +
            '<label for="id-' + envTypeValues[i] + '">' +
            '<img src="images/input_bt_' + envTypes[i] + '.png" width=30>' +
            '</label>';
        if (i !== 0 && (i + 1) % 3 === 0) {
            html += '</fieldset>' +
                '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
        }
    }
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'envTypeRadio';
};
/**
 * User Interface Create about Area Type (Radio Button).
 * @method areaTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Attribute Name Value (areaTypeRadio)
 */
OGDSM.eGovFrameUI.prototype.areaTypeRadio = function (divId, theme) {
    'use strict';
    var radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<label for="areaValue">지역:</label>' +
            '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        areaTypes = ['인천', '서울', '경기', '강원', '충남', '세종', '충북', '대전', '경북', '전북', '대구', '울산', '전남', '광주', '경남', '부산', '제주'],
        i;
    for (i = 0; i < areaTypes.length; i += 1) {
        html += '<input type="radio" name="areaTypeRadio" class="custom" data-theme=' + this.dataTheme +
            ' id="id-' + areaTypes[i] + '" value="' + areaTypes[i] + '"/>' +
            '<label for="id-' + areaTypes[i] + '">' + areaTypes[i] + '</label>';
        if (i !== 0 && (i + 1) % 3 === 0) {
            html += '</fieldset>' +
                '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
        }
    }
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'areaTypeRadio';
};
/**
 * User Interface Create about Map List (Select).
 * @method mapListSelect
 * @param {String} divId - div id about HTML tag attribute
 * @param {Array} arr - Select Box Option List
 * @return {String} Select Box Id Value
 */
OGDSM.eGovFrameUI.prototype.mapListSelect = function (divId, arr) {
    'use strict';
    var html, i,
        rootDiv = $('#' + divId);
    console.log(arr);
    html =
        '<select name="geoServerSelectBox" id="geoServerSelectBox" data-theme=' + this.dataTheme + '>' +
        '<option value=""></option>';
    for (i = 0; i < arr.length; i += 1) {
        html += '<option value="' + arr[i] + '">' +
            arr[i] + '</option>';
    }
    html += '</select>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'geoServerSelectBox';
};





/**
 * User Interface Create about SelectBox
 * @method selectBox
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} name - selectbox name about HTML tag attribute
 * @param {String} id - selectbox id about HTML tag attribute
 * @param {Array} data - selectbox option data
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {jQuery Object} div id Object
 */
OGDSM.eGovFrameUI.prototype.selectBox = function (divId, name, id, data, theme) {
    'use strict';
    var selectTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup">',
        OGDSM = this.OGDSM,
        styles,
        stylesText,
        i,
        j,
        btnObj;

    html += '<select name="' + name + '" id="' + id + '" data-theme=' + selectTheme + '>';
    html += '<option value="">  </option>';
    for (i = 0; i < data.length; i += 1) {
        html += '<option value="' + data[i] + '">' + data[i] + '</option>';
    }
    html += '</select>';
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $("#" + id);
};

