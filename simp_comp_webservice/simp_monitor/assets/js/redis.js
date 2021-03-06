var url		= "../cgi-dir/populate_data.cgi";
var url_redis	= "../cgi-dir/get_poller_data.cgi";
var key1	= "";
var key0	= "";
function pageLoad(){
	var host_dropdown	= document.getElementById("host-dropdown");
	var xhttp   = new XMLHttpRequest();

	xhttp.onload		=function(){
	//console.log(xhttp.response);
	host_dropdown.innerHTML = null;
	
	var el		= document.createElement("option");
	el.textContent 	= "Please select a Host";
	el.value	= 0;
	el.setAttribute("style", "display:initial");
	host_dropdown.appendChild(el);
	var hostObj= xhttp.response.hosts;
	for (var x in hostObj){

		var host_name	= hostObj[x];
		var ele		= document.createElement("option");
		ele.textContent	= host_name;
		//val		+= 1;
		host_dropdown.appendChild(ele);
		}

	sort (host_dropdown);
	}
	webservice_call(xhttp, url+'?method=get_initial_data&from=comp');

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
function get_host_value(){

    document.getElementById("test").innerHTML=document.getElementById("host-dropdown").value;
}
function getGroup(){

    var host_drop	= document.getElementById("host-dropdown");
    var group_drop	= document.getElementById("group-dropdown");
    var xhttp	= new XMLHttpRequest();
    xhttp.onload	=function(){
        //console.log(xhttp.response);
        group_drop.innerHTML	= "";

        var el	= document.createElement("option");
        el.textContent	= "Please select a group";
        el.value	= 0;
        group_drop.append(el);

        var  groupObj	= xhttp.response.groups;
        for (var x in groupObj){
            var group_name	= groupObj[x];
            var ele	= document.createElement("option");
            ele.textContent	= group_name;
            ele.value	= group_name;
            group_drop.append(ele);
        }
    }
    webservice_call(xhttp, url_redis+"?method=get_groups&ip="+host_drop.textContent);
}
function get_timestamps(){
	var table_container	= document.getElementById("table-container");
	var host_drop		= document.getElementById("host-dropdown");
	var xhttp		= new XMLHttpRequest();
	var heading		= document.createElement("label");
	var collapsible		= document.getElementById("accordion");

	if (host_drop.value == 0){
			window.alert("Please select a host");
		}
	collapsible.innerHTML	= "";
	heading.style.marginTop 	= "20px";
	heading.style.marginBottom	= "10px";
	heading.setAttribute("class","control-label");
	heading.textContent     = "Please select a  Timestamp";

	table_container.innerHTML	= "";
	table_container.appendChild(heading);
	
	xhttp.onload	= function(){
		var timestampObj = xhttp.response.groups;
		key0		= xhttp.response.key0;
		var timestamps	= xhttp.response.timestamps
		//console.log(xhttp.response);


		var table	= document.createElement("table");
		table.marginLeft= "0px";
		table.setAttribute("class","table table-hover");
			
		var row		= table.insertRow(0);
		var col1	= row.insertCell(0);
		col1.innerHTML	= "Host Name";
		col1.style.fontWeight = "bold";
		col1.setAttribute("align","center");
		var col2	= row.insertCell(1);
		col2.innerHTML	= "Group";	
		col2.style.fontWeight = "bold";	
		col2.setAttribute("align","center");
		var col3	= row.insertCell(2);
		col3.innerHTML	= "Worker ID";
		col3.style.fontWeight = "bold";
		col3.setAttribute("align","center");
		var col4        = row.insertCell(3);
		col4.innerHTML  = "Timestamp";
		col4.style.fontWeight = "bold";
		col4.setAttribute("align","center");

		table_container.appendChild(table);
		for ( x in timestamps){
			var ip 		= timestamps[x]['ip'];
			var group	= timestamps[x]['group'];
			var worker_id	= timestamps[x]['wid'];
			var timestamp	= timestamps[x]['timestamp'];
			row         = table.insertRow(1);
			row.className	= "pointer";
			row.setAttribute('onclick',"(function() {get_data('"+ip+"','"+group+"','"+worker_id+"','"+timestamp+"');})()");
			var col1        = row.insertCell(0);
			col1.innerHTML  = ip;
			col1.setAttribute("align","center");
			var col2        = row.insertCell(1);
			col2.setAttribute("align","center");
			col2.innerHTML  = group;
			var col3        = row.insertCell(2);
			col3.setAttribute("align","center");
			col3.innerHTML  = worker_id;
			var col4        = row.insertCell(3);
			col4.setAttribute("align","center");
			col4.innerHTML  = convert(timestamp);
		}
	sortTable(table);
	}	
	webservice_call(xhttp, url_redis+"?method=get_timestamp_hostname&ip="+host_drop.options[host_drop.selectedIndex].text);
}
function sortTable(table) {
  var rows, switching, i, x, y, shouldSwitch;
  switching = true;

  while (switching) {

    switching = false;
    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;
      x 	= rows[i].getElementsByTagName("TD")[3].innerHTML;
      x_len	= x.length;
      y 	= rows[i + 1].getElementsByTagName("TD")[3].innerHTML;
      y_len	= y.length;
      x 	= x.toString().substr(x_len - 10 , 12);
      y		= y.toString().substr(y_len - 10 , 12);


      if (x <  y) {

        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function get_data(ip,group,worker_id,timestamp){
	//console.log(ip);
	//console.log(group);
	//console.log(worker_id);
	//console.log(timestamp);	

	loading();
	var xhttp	= new XMLHttpRequest();
	xhttp.onload	= function(){
		//console.log(xhttp.response);
		var data	= xhttp.response.oid;
		var collapsible	= document.getElementById("accordion");
		collapsible.innerHTML	= "";

		var count 	= 0;
		for (var x in data){

			var d	 = document;
			var div1 = d.createElement('div');
			div1.setAttribute("class", "panel panel-default");


			var div2 = d.createElement('div');
			div2.setAttribute("class", "panel-heading");

			var title = d.createElement('h4');
			title.setAttribute("class", "panel-title");

			var aTag = d.createElement('a');
			//aTag.setAttribute("data-toggle","collapse");
			aTag.setAttribute("data-parent", "#accordion");
			aTag.innerHTML = x;

			title.appendChild(aTag);
			div2.appendChild(title);
			div1.appendChild(div2);

			var div3 = d.createElement('div');
			div3.id = count;
			div3.setAttribute("class", "show");

			var div4 = d.createElement('div');
			div4.setAttribute("class", "well-lg");
			div4.innerHTML = data[x];

			div3.appendChild(div4);
			div1.appendChild(div3);

			collapsible.appendChild(div1);
			count = count + 1; 

		}
		stop_loading();
	}
	webservice_call(xhttp,url_redis+"?method=get_data&ip="+ip+"&group_name="+group+"&worker_id="+worker_id+"&timestamp="+timestamp);		
}
function loading(){
	load = document.getElementById("loading");
        load.style.visibility = "visible";
}
function stop_loading(){
	load.style.visibility = "hidden";	
}
