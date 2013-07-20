/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.ieltseye.IELTSEye;

import android.os.Bundle;
import org.apache.cordova.*;
//google admob start
import android.widget.LinearLayout;
import com.google.ads.*;
//google admob end 
//umeng analytics
import com.umeng.analytics.MobclickAgent;

public class IELTSEye extends DroidGap
{
//	google admob start
	private static final String MY_AD_UNIT_ID = "a151ea7ab4280fd";
	private AdView adView;
//	google admob end 
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")
//        google admob start
        adView = new AdView(this, AdSize.BANNER, MY_AD_UNIT_ID);
        LinearLayout layout = super.root;
        layout.addView(adView);
        adView.loadAd(new AdRequest());
//    	google admob end 

    }
    
    //umeng start
    public void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }
    
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }
    //umeng end
}

