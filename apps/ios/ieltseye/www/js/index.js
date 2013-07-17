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
var apiUrl = 'http://test.ieltseye.com/ieltsApi/index/page/';
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
                                      getIeltsWeibo();
                                      $.mobile.silentScroll(0);
                                      });
                 $( "#prevPage" ).bind( "tap", function(){
                                      prevPage();
                                      $.mobile.silentScroll(0);
                                      });
                 $( "#nextPage" ).bind( "tap", function(){
                                      nextPage();
                                      $.mobile.silentScroll(0);
                                      });
});
s
function getIeltsWeibo(){
    $.ajax({
           type: "get",
           url: apiUrl+"0",
           dataType: 'json',
           success: function(data){
               if(data.datas != ''){
                   var weibos = '';
                   $.each(data.datas, function(k, v){
                          weibos+='<li data-role="list-divider"><a href="">'+v.screen_name+'</a></li><li>'+v.text+'</li>';
                          });
                   $( "#ieltsEyeWeibos" ).html(weibos).closest( "#ieltsEyeWeibos" ).listview( "refresh" ).trigger( "create" );
               }else{
                   resetIeltsEyeWeibo();
               }
           },
           error:function(){
                resetIeltsEyeWeibo(textStatus+":"+errorThrown, "出现错误了，请稍后再试。");
           }
    });
}

function prevPage(){
    currentPage = currentPage <= 0 ? 0 :currentPage-1;
    console.log(currentPage);//debug
    $.ajax({
           type: "get",
           url: apiUrl+currentPage,
           dataType: 'json',
           success: function(data){
               if(data.datas != ''){
                   var weibos = '';
                   $.each(data.datas, function(k, v){
                          weibos+='<li data-role="list-divider"><a href="">'+v.screen_name+'</a></li><li>'+v.text+'</li>';
                          });
                   $( "#ieltsEyeWeibos" ).html(weibos).closest( "#ieltsEyeWeibos" ).listview( "refresh" ).trigger( "create" );
               }else{
                   resetIeltsEyeWeibo();
               }
           },
           error:function(){
               resetIeltsEyeWeibo(textStatus+":"+errorThrown, "出现错误了，请稍后再试。");
           }
    });
}

function nextPage(){
    currentPage = currentPage > 50 ? 50 :currentPage+1;
    console.log(currentPage);//debug
    $.ajax({
           type: "get",
           url: apiUrl+currentPage,
           dataType: 'json',
           success: function(data){
               if(data.datas != ''){
                   var weibos = '';
                   $.each(data.datas, function(k, v){
                          weibos+='<li data-role="list-divider"><a href="">'+v.screen_name+'</a></li><li>'+v.text+'</li>';
                          });
                   $( "#ieltsEyeWeibos" ).html(weibos).closest( "#ieltsEyeWeibos" ).listview( "refresh" ).trigger( "create" );
               }else{
                   resetIeltsEyeWeibo();
               }

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

