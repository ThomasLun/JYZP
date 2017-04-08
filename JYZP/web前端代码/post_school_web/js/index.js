/**
 * Created by Stardust on 2016/5/14.
 */


/*
 * pages: �����õ���ҳ����;
 * requestPage: ��ǰ�������ݵ�ҳ��;
 * liTagNumber: li��ǩ����Ŀ;
 * isLogin: �Ƿ��¼;
 *
 * loginPagesUrl: ��õ�¼֮���Ƽ����ݵ���ҳ��;
 * loginDataUrl: ��ȡ��¼���Ƽ����ݵĵ�ַ;
 * loginUrl: ��¼��ַ;
 * registerUrl: ע����ַ;
 * pagesUrl: δ��¼��õ��Ƽ����ݵ���ҳ��;
 * dataUrl: δ��¼��õ��Ƽ�����;
 *
 */

var NOLOGIN = 1;
var READY_LOGIN = 2;
var DATA = 3;
var HIDE = 4;
var DISPLAY = 5;
var PAGES = 6;

var pagesUrl = '/ok/ShowPostsPagesServlet';
var dataUrl = '/ok/ShowPostsServlet';
var loginDataUrl = '/ok/ShowRubicPostsServlet';
var loginPagesUrl = '/ok/ShowPostsByLabelNamePagesServlet';

var pages = 0;
var requestPage = 1;
var xhr = createXHR();
var liTagNumber = 0;
var isFirst = true;
var userId = -1;
var isLogin = NOLOGIN;

var nav_login = document.getElementById('login');
var nav_register = document.getElementById('register');
var loginWindow = document.getElementById('login_window');
var registerWindow = document.getElementById('register_window');
var tourist = document.getElementById('tourist');
var toRegister = document.getElementById('to_register');
var loginButton = document.getElementById('login_button');
var ulTag = document.getElementsByClassName("mes_list")[0];
var listLoading = document.getElementById('loading_img_bg');

/*
 *�������ײ������ҳ��
 */
ulTag.onscroll = function () {
    if (getScrollTop() + getWindowHeight() >= getScrollHeight()) {
        setLoadingImg(DISPLAY);
        request(dataUrl, isLogin, DATA);
    }
};

/*
 *�¼�����
 */
tourist.onclick = function () {
    ulTag.style.display = 'block';
    loginWindow.style.display = 'none';
    listLoading.style.display = 'block';
    request(pagesUrl, NOLOGIN, PAGES);
};

nav_login.onclick = function () {
    listLoading.style.display = 'none';
    ulTag.style.display = 'none';
    loginWindow.style.display = 'block';
};

loginButton.onmouseout = function () {
    loginButton.style.background = '#58d1f5';
};

loginButton.onmouseover = function () {
    loginButton.style.background = '#8bdef7';
};



loginButton.onclick = loginRequest;
toRegister.onclick = registerFun;
nav_register.onclick = registerFun;
window.onload = start;

/*
 *��ʾע���
 */
function registerFun() {
    registerWindow.style.display = 'block';
    loginWindow.style.display = 'none';
}

/*
 *���봰��ʱ����
 */
function start() {
    if (getCookie('userId') != '') {
        ulTag.style.display = 'block';
        loginWindow.style.display = 'none';
        listLoading.style.display = 'block';
        userId = getCookie('userId');
        request(loginPagesUrl, READY_LOGIN, PAGES);
    } else {
        ulTag.style.display = 'none';
        listLoading.style.display = 'none';
        loginWindow.style.display = 'block';
    }
}

/*
 *clone li�ڵ�
 */
function cloneTag(data) {
    setLoadingImg(HIDE);
    var liTag = ulTag.children[0];
    var length;
    if (isFirst) {
        length = data.length - 1;
        isFirst = false;
    } else {
        length = data.length;
    }
    for (var i = 0; i < length; i++) {
        var li = liTag.cloneNode(true);
        ulTag.appendChild(li);
    }
    //console.log(ulTag.childNodes.length);
    setHtmlText(data);
}

/*
 * ���͵���������
 * isLogin:�Ƿ��¼;
 * condition:�ж�����ҳ����������;
 */
function getData(isLogin, condition) {
    var data;
    if (isLogin === NOLOGIN) {
        if (condition === DATA) {
            data = "Page={\"count\":" + requestPage++ + "}";
        } else if (condition === PAGES) {
            data = null;
        }
    } else if (isLogin === READY_LOGIN) {
        if (condition === DATA) {
            data = "User={\"userId\":" + userId + ",\"page\":" + requestPage++ + "}";
        } else if (condition === PAGES) {
            data = "User={\"userId\":" + userId + "}";
        }
    }
    return data;
}

/*
 *�ӷ�������ȡ����
 * requestuRL:�����ַ;
 * isLogin:�Ƿ��¼;
 * condition:�ж�����ҳ��,����,��¼��ע�ᣬ�����ʾ�;
 */
function request(requestUrl, isLogin, condition) {
    xhr.open('post', requestUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var sendData = getData(isLogin, condition)
    xhr.send(sendData);
    console.log(sendData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (isLogin === NOLOGIN) {
                    if (condition === PAGES) {
                        pages = JSON.parse(xhr.responseText).pages;
                        request(dataUrl, isLogin, DATA);
                    } else if (condition === DATA) {
                        if (requestPage <= pages) {
                            listLoading.style.display = 'none';
                            cloneTag(JSON.parse(xhr.responseText));
                        }
                    }
                } else if (isLogin === READY_LOGIN) {
                    if (condition === PAGES) {
                        pages = JSON.parse(xhr.responseText).pages;
                        request(loginDataUrl, isLogin, DATA);
                    } else if (condition === DATA) {
                        if (requestPage <= pages) {
                            listLoading.style.display = 'none';
                            cloneTag(JSON.parse(xhr.responseText));
                        }
                    }
                }
            } else {
                //alert('request fail: ' + xhr.status);
            }
        }
    };
}


/*
 *���ü���ͼƬ��ʾ������
 */
function setLoadingImg(display) {
    var load = document.getElementById('loading_img');
    if (display === HIDE) {
        load.style.display = 'none';
    } else if (display === DISPLAY) {
        load.style.display = 'block';
    }
}

/*
 *����XMLTHttpRequest����
 * ����ie
 */
function createXHR() {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ('Microsoft.XMLHTTP');
    }
    return xhr;
}

/*
 *����ҳ��������
 * data:���������;
 */

function setHtmlText(data) {
    for (var i = 0; liTagNumber < ulTag.children.length; liTagNumber++, i++) {
        var job = ulTag.children[liTagNumber].children[0].children[0];
        var company = ulTag.children[liTagNumber].children[0].children[1];
        var ad = ulTag.children[liTagNumber].children[0].children[2];
        if (!!data[i].positionName == false) {
            data[i].positionName = '';
        }
        job.children[0].innerHTML = data[i].positionName + '[' + data[i].city + ']';
        job.children[1].innerHTML = data[i].salary;
        job.children[2].innerHTML = data[i].workYear + '/' + data[i].education;
        company.children[0].innerHTML = data[i].companyName;
        company.children[1].innerHTML = data[i].industryField + '/' + data[i].financeStage;
        ad.innerHTML = data[i].positionAdvantage;
    }
}

/*
 *��ȡ�������߶�
 */
function getScrollTop() {
    var scrollTop = ulTag.scrollTop;
    return scrollTop;
}

/*
 *��ȡ�ɼ����ڸ߶�
 */
function getWindowHeight() {
    var windowHeight = ulTag.offsetHeight;
    return windowHeight;
}
/*
 *��ȡ����Ԫ��ҳ��ĸ߶�
 */
function getScrollHeight() {
    var scrollHeight = ulTag.scrollHeight;
    return scrollHeight;
}



