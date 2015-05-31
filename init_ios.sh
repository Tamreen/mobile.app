#!/bin/bash

# Export some variables.
export ANDROID_HOME=/Users/hossamzee/android-sdk-macosx
export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Remove all platforms and plugins.
rm -Rf platforms/*
rm -Rf plugins/*

# Add platforms.
cordova platform add ios android

# Plugins removing.
cordova plugins rm com.ionic.keyboard
cordova plugins rm com.phonegap.plugins.PushPlugin
cordova plugins rm org.apache.cordova.Media
cordova plugins rm org.apache.cordova.console
cordova plugins rm org.apache.cordova.contacts
cordova plugins rm org.apache.cordova.device
cordova plugins rm uk.co.whiteoctober.cordova.appversion

# Plugins adding.
cordova plugins add https://github.com/phonegap-build/PushPlugin.git
cordova plugins add https://github.com/driftyco/ionic-plugins-keyboard.git
cordova plugins add com.ionic.keyboard
cordova plugins add org.apache.cordova.contacts
cordova plugins add org.apache.cordova.Media
cordova plugins add org.apache.cordova.device
cordova plugins add https://github.com/whiteoctober/cordova-plugin-app-version.git
cordova plugins add org.apache.cordova.console

cordova build ios