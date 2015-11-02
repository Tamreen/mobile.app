#!/bin/bash

# Export some variables.
# export ANDROID_HOME=/Users/hossamzee/android-sdk-macosx
# export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Remove all platforms and plugins.
rm -Rf platforms/*
rm -Rf plugins/*

# Add platforms.
cordova platform add ios android

# Plugins removing.
cordova plugins rm com.ionic.keyboard
cordova plugins rm com.phonegap.plugins.PushPlugin
cordova plugins rm cordova-plugin-file
cordova plugins rm cordova-plugin-media
cordova plugins rm cordova-plugin-console
cordova plugins rm cordova-plugin-contacts
cordova plugins rm cordova-plugin-device
cordova plugins rm uk.co.whiteoctober.cordova.appversion
cordova plugins rm cordova-plugin-whitelist

# Plugins adding.
cordova plugins add com.ionic.keyboard
cordova plugins add https://github.com/phonegap-build/PushPlugin.git
cordova plugins add cordova-plugin-file
cordova plugins add cordova-plugin-media
cordova plugins add cordova-plugin-console
cordova plugins add cordova-plugin-contacts
cordova plugins add cordova-plugin-device
cordova plugins add https://github.com/whiteoctober/cordova-plugin-app-version.git # This plugin is not required.
cordova plugins add cordova-plugin-whitelist

# error No Content-Security-Policy meta tag found. Please add one when using the cordova-plugin-whitelist plugin.

# Build iOS.
cordova build ios
cordova build android