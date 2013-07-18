/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var currentPage = 0;
var weiboUrl = 'http://weibo.com/';
var siteUrl = 'http://www.ieltseye.com/';
var apiUrl = siteUrl+'ieltsApi/index';
var keyword = '';
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //请求数据
        getIeltsWeibo();
        console.log('Received Event: ' + id);
    }
};

$( document ).on( "pageinit", function( event ) {
                 $( "#refresh" ).bind( "tap", function(){
                                      keyword = '';
                                      currentPage = 0;
                                      $('#searchKeyword').val(keyword);
                                      $('html, body').animate({scrollTop: 0}, 1000);
                                      getIeltsWeibo();
                                      });
                 $( "#prevPage" ).bind( "tap", function(){
                                      $('html, body').animate({scrollTop: 0}, 1000);
                                      prevPage();
                                      });
                 $( "#nextPage" ).bind( "tap", function(){
                                      $('html, body').animate({scrollTop: 0}, 1000);
                                      nextPage();
                                      });
                 $("#ieltseyeSearchForm").submit(function(){
                                     keyword = $('#searchKeyword').val();
                                     currentPage = 0;
                                     if(!keyword){
                                        return false;
                                     }else{
                                      $('html, body').animate({scrollTop: 0}, 1000);
                                         getIeltsWeibo();
                                         return false;
                                     }
                                    });
                 
                 $("#ieltseyeHome").bind("tap", function(){
                                         var ref = window.open(encodeURI(siteUrl), '_blank', 'location=yes');
                                         });
});
s
function getIeltsWeibo(){
    $.mobile.loading( "show", {
                     text: '',
                     textVisible: false,
                     theme: 'd',
                     textonly: false,
                     html: ''
     });
    $.ajax({
           type: "get",
           url: apiUrl+"?page=0"+"&keyword="+keyword,
           dataType: 'json',
           success: function(data){
           console.log(apiUrl+"?page=0"+"&keyword="+keyword);
               if(data.datas != ''){
                   var weibos = formateWeibo(data);
                   $( "#ieltsEyeWeibos" ).html(weibos).closest( "#ieltsEyeWeibos" ).listview( "refresh" ).trigger( "create" );
               }else{
                   resetIeltsEyeWeibo();
               }
           },
           complete:function(){
                $.mobile.loading( "hide" );           
           },
           error:function(){
                resetIeltsEyeWeibo(textStatus+":"+errorThrown, "出现错误了，请稍后再试。");
           }
    });

}

function prevPage(){
    $.mobile.loading( "show", {
                     text: '',
                     textVisible: false,
                     theme: 'd',
                     textonly: false,
                     html: ''
    });
    currentPage = currentPage <= 0 ? 0 :currentPage-1;
    console.log(currentPage);//debug
    $.ajax({
           type: "get",
           url: apiUrl+"?page="+currentPage+"&keyword="+keyword,
           dataType: 'json',
           success: function(data){
               if(data.datas != ''){
                   var weibos = formateWeibo(data);
                   $( "#ieltsEyeWeibos" ).html(weibos).closest( "#ieltsEyeWeibos" ).listview( "refresh" ).trigger( "create" );
               }else{
                   resetIeltsEyeWeibo();
               }
           },
           complete:function(){
               $.mobile.loading( "hide" );
           },
           error:function(){
               resetIeltsEyeWeibo(textStatus+":"+errorThrown, "出现错误了，请稍后再试。");
           }
    });
}

function nextPage(){
    $.mobile.loading( "show", {
                     text: '',
                     textVisible: false,
                     theme: 'd',
                     textonly: false,
                     html: ''
    });
    currentPage = currentPage > 50 ? 50 :currentPage+1;
    console.log(apiUrl+"?page="+currentPage+"&keyword="+keyword);//debug
    $.ajax({
           type: "get",
           url:  apiUrl+"?page="+currentPage+"&keyword="+keyword,
           dataType: 'json',
           success: function(data){
               if(data.datas != ''){
                   var weibos = formateWeibo(data);
                   $( "#ieltsEyeWeibos" ).html(weibos).closest( "#ieltsEyeWeibos" ).listview( "refresh" ).trigger( "create" );
               }else{
                   currentPage = currentPage -1;
                   resetIeltsEyeWeibo();
               }

           },
           complete:function(){
               $.mobile.loading( "hide" );
           },
           error:function(jqXHR, textStatus, errorThrown){
               resetIeltsEyeWeibo(textStatus+":"+errorThrown, "出现错误了，请稍后再试。");
           }
    });
}

function resetIeltsEyeWeibo(title,content){
    title = !title ? '提醒' : title;
    content = !content ? '暂时没有数据。' : content;
    var dataHtml = '<li data-role="list-divider"><a href="">'+title+'</a></li><li>'+content+'</li>';
    $( "#ieltsEyeWeibos" ).html(dataHtml).closest( "#ieltsEyeWeibos" ).listview( "refresh" ).trigger( "create" );
}

function formateWeibo(data){
    if(data.datas != ''){
        var weibos = '';
        $.each(data.datas, function(k, v){
               weibos+='<li data-role="list-divider"><a href="" onclick="goUserHome('+v.uid+')">'+v.screen_name+'</a></li><li>'+v.text+'<p class="muted"><small>'+v.created_at+'</small></p></li>';
               });
        return weibos;
    }
    return '';
}

function goUserHome(uid){
    console.log(uid);
    if(!uid){
        return false;
    }else{
        var ref = window.open(encodeURI(weiboUrl+'/u/'+uid), '_blank', 'location=yes');
    }
    return true;
}
