#!/bin/bash

# Export some variables.
# export ANDROID_HOME=/Users/hossamzee/android-sdk-macosx
# export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Remove all platforms and plugins.
rm -Rf platforms/*
rm -Rf plugins/*

# Add platforms.
cordova platform add ios android

# Plugins adding.
cordova plugin add com.ionic.keyboard
cordova plugin add phonegap-plugin-push
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-media
cordova plugin add cordova-plugin-console
cordova plugin add cordova-plugin-contacts
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-network-information
cordova plugin add cordova-plugin-geolocation
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-whitelist

# error No Content-Security-Policy meta tag found. Please add one when using the cordova-plugin-whitelist plugin.
ionic resources

# Build iOS.
cordova build ios
cordova build android