var comp_url = '../cgi-dir/comp.cgi';
var host_url = '../cgi-dir/populate_data.cgi';
function loadPage() {
    var myRequest = new XMLHttpRequest();
    myRequest.onload = function(e) {

        var jsonResponse = myRequest.response+'';
        var split_response = jsonResponse.split(',');
        var select = document.getElementById("comp_dropdown");
        for (var i = 0; i < split_response.length; i++) {
            var opt =  split_response[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            if (opt == "mx960_light_lane0") {
                el.selected = "selected";
            }
            select.appendChild(el);
        }
	sort(select);
    }
    webservice_call(myRequest, comp_url);

    var myRequest2 = new XMLHttpRequest();
    myRequest2.onload = function(e) {

        //console.log("Req 2:");
        //console.log(myRequest2.response);

        var host_drop = document.getElementById("host_dropdown");

        var hostObj= myRequest2.response.hosts;
        var el = document.createElement("option");
        for (var x in hostObj) {
            // console.log(hostObj[x]);
            var opt = hostObj[x];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            if (opt == "bbsw.ictc.testlab.grnoc.iu.edu") {
                el.selected = "selected";
            }
            host_drop.appendChild(el);

        }
	sort(host_drop);
    }
    webservice_call(myRequest2, host_url+'?method=get_initial_data&from=comp');
}
function sort(dropdown){
        var select = $(dropdown);
        select.html(select.find('option').sort(function(x, y) {
                return $(x).text() > $(y).text() ? 1 : -1;
                     }));
        select[0].selectedIndex = 0;
}

function webservice_call(request_object, url) {
    //console.log(url);
    request_object.responseType = 'json';
    request_object.open('GET', url, true);
    request_object.send();
}

function getData() {
    var param_str = comp_url +"?";
    var composite = document.getElementById('comp_dropdown');
    var host = document.getElementById('host_dropdown');

    if (composite.selectedIndex == 0) {
        alert ("Please select the composite");
        return false;
    } else if (host.selectedIndex == 0){
        alert ("Please select the host");
        return false;
    } else {
        param_str += "method=" + composite.options[composite.selectedIndex].text + "&host=" + host.options[host.selectedIndex].text;
    }

    loading();
    //console.log(param_str);
    var myRequest = new XMLHttpRequest();
    myRequest.responseType = 'json';
    myRequest.open('GET', param_str, true);
    myRequest.onload = function() {

        var jsonObjStr= JSON.stringify(myRequest.response);
        //console.log(myRequest.response);
        var result = myRequest.response.results;
        var d = document;
        var collapsible = d.getElementById("accordion");
        collapsible.innerHTML = "";
	if (Object.keys(result).length < 1){
		div_warn = d.createElement('div');
		div_warn.innerHTML = "No data to display at the moment.";
		collapsible.appendChild(div_warn);
	}

        for (var x in result) {

            // console.log(x);
            // console.log(myRequest.response.results[x]);
            for (var y in result[x]) {
                //  console.log(y);
                //  console.log(result[x][y]);
                var div1 = d.createElement('div');
                div1.setAttribute("class", "panel panel-default");

                var div2 = d.createElement('div');
                div2.setAttribute("class", "panel-heading");

                var title = d.createElement('h4');
                title.setAttribute("class", "panel-title");
		title.setAttribute("style", "word-wrap: break-word");

                var aTag = d.createElement('a')
                //aTag.setAttribute("class","collapsed");
                //aTag.setAttribute("data-toggle", "collapse");
                aTag.setAttribute("data-parent", "#accordion");
	
		var regex = /[.,\s]/g;
		var temp = y.replace(regex, '');

                aTag.setAttribute("href", "#"+temp);
                aTag.innerHTML = y;

                title.appendChild(aTag);
                div2.appendChild(title);
                div1.appendChild(div2);

                var div3 = d.createElement('div');
                div3.id = temp;
                div3.setAttribute("class", "show");

                var div4 = d.createElement('div');
                div4.setAttribute("class", "well-lg");
                var temp_str = "";
                for (var key in result[x][y]) {
                    // if (p.hasOwnProperty(key)) {
                    // console.log(key + " -> " + result[x][y][key]);
                    temp_str += key + " = " + (key=="time"?convert(result[x][y][key]):result[x][y][key])+ "<br>";

                    //  }
                }
                // div4.innerHTML = JSON.stringify(result[x][y]);
                div4.innerHTML = temp_str;

                div3.appendChild(div4);
                div1.appendChild(div3);

                collapsible.appendChild(div1);
            }
        }
    
    stop_loading();
    }
    myRequest.send();
}
function loading(){
        load = document.getElementById("loading");
        load.style.visibility = "visible";
}
function stop_loading(){
        load.style.visibility = "hidden";
}
